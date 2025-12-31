import WebSocket, { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import speech from '@google-cloud/speech';

// Load environment variables
dotenv.config();

// WebSocket server configuration
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT as number });

interface TranscriptionSession {
  isActive: boolean;
  recognizeStream: NodeJS.WritableStream | null;
}

console.log(`Transcription service started on port ${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    safeSend(ws, JSON.stringify({
      type: 'error',
      message: 'Google credentials not configured on server',
    }));
  }

  const client = new speech.SpeechClient();

  const session: TranscriptionSession = {
    isActive: false,
    recognizeStream: null,
  };

  const startRecognitionStream = () => {
    if (session.recognizeStream) return;

    const request = {
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
        useEnhanced: true,
        audioChannelCount: 1,
      },
      interimResults: true,
      singleUtterance: false,
    } as any;

    // @ts-ignore: stream type from client library expects StreamingRecognizeRequest
    session.recognizeStream = client
      .streamingRecognize(request)
      .on('error', (err: any) => {
        console.error('Recognition stream error:', err);
        safeSend(ws, JSON.stringify({ type: 'error', message: 'Recognition error', details: String(err) }));
        stopRecognitionStream();
      })
      .on('data', (data: any) => {
        const results = data.results || [];
        if (!results.length) return;
        const result = results[0];
        const text = result.alternatives?.[0]?.transcript || '';
        const isFinal = !!result.isFinal;
        if (text) {
          safeSend(ws, JSON.stringify({ type: 'transcription', text, isFinal, timestamp: Date.now() }));
        }
      });
  };

  const stopRecognitionStream = () => {
    if (session.recognizeStream) {
      try {
        // @ts-ignore: end exists on Duplex stream
        session.recognizeStream.end();
      } catch {}
      session.recognizeStream = null;
    }
  };

  ws.on('message', (message: WebSocket.Data) => {
    try {
      // If message is binary, treat as raw audio
      const buffers: Buffer[] = [];
      if (Buffer.isBuffer(message)) {
        buffers.push(message);
      } else if (message instanceof ArrayBuffer) {
        buffers.push(Buffer.from(new Uint8Array(message)));
      } else if (Array.isArray(message)) {
        for (const part of message as Buffer[]) {
          buffers.push(Buffer.isBuffer(part) ? part : Buffer.from(part));
        }
      }

      if (buffers.length) {
        const chunk = Buffer.concat(buffers);
        if (!session.isActive) {
          session.isActive = true;
          startRecognitionStream();
          safeSend(ws, JSON.stringify({ type: 'status', message: 'Transcription started' }));
        }
        if (!session.recognizeStream) startRecognitionStream();
        if (session.recognizeStream) {
          // Write chunk to recognition stream as StreamingRecognizeRequest
          // @ts-ignore: expects {audioContent: Buffer}
          session.recognizeStream.write({ audioContent: chunk });
        }
        return;
      }

      // Handle JSON control messages
      const text = message.toString();
      try {
        const data = JSON.parse(text);
        if (data.type === 'start') {
          session.isActive = true;
          startRecognitionStream();
          safeSend(ws, JSON.stringify({ type: 'status', message: 'Transcription ready' }));
        } else if (data.type === 'stop') {
          session.isActive = false;
          stopRecognitionStream();
          safeSend(ws, JSON.stringify({ type: 'status', message: 'Transcription stopped' }));
        }
      } catch {
        // If not JSON, ignore or log
        console.log('Received non-JSON text message');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      safeSend(ws, JSON.stringify({ type: 'error', message: 'Error processing message', error: String(error) }));
    }
  });

  ws.on('close', async () => {
    console.log('Client disconnected');
    session.isActive = false;
    stopRecognitionStream();
    try { await client.close(); } catch {}
  });

  ws.on('error', async (error: Error) => {
    console.error('WebSocket error:', error);
    session.isActive = false;
    stopRecognitionStream();
    try { await client.close(); } catch {}
  });

  // Send welcome message
  safeSend(ws, JSON.stringify({ type: 'connected', message: 'Connected to transcription service' }));
});

function safeSend(ws: WebSocket, data: string) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(data);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down transcription service...');
  wss.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down transcription service...');
  wss.close(() => {
    process.exit(0);
  });
});