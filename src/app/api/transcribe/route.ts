import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { SpeechClient } from '@google-cloud/speech';

// Initialize Google Cloud clients with error handling
let speechClient: SpeechClient;
try {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS 
    ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : null;

  if (!credentials) {
    console.warn('Google Cloud credentials not found. Speech-to-text functionality will be limited.');
  }

  speechClient = new SpeechClient({
    credentials: credentials || undefined,
  });
} catch (error) {
  console.error('Error initializing Speech client:', error);
  speechClient = new SpeechClient();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Configure the request
    const audio = {
      content: buffer.toString('base64'),
    };
    
    const config = {
      encoding: 'LINEAR16' as const,
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      model: 'default',
      enableAutomaticPunctuation: true,
    };

    const recognizeRequest = {
      audio: audio,
      config: config,
    };

    try {
      // Perform the transcription
      const [response] = await speechClient.recognize(recognizeRequest);
      const transcription = response.results
        ?.map(result => result.alternatives?.[0]?.transcript)
        .join('\n');

      if (!transcription) {
        return NextResponse.json(
          { error: 'Failed to transcribe audio: No transcription generated' },
          { status: 500 }
        );
      }

      return NextResponse.json({ text: transcription });
    } catch (transcribeError) {
      console.error('Transcription error:', transcribeError);
      
      // Provide more detailed error message
      const errorMessage = transcribeError instanceof Error 
        ? transcribeError.message 
        : 'Unknown transcription error';

      return NextResponse.json(
        { 
          error: 'Failed to process audio',
          details: errorMessage,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 