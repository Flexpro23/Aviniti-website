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
    speechClient = new SpeechClient();
  } else {
    speechClient = new SpeechClient({ credentials });
  }
} catch (error) {
  console.error('Error initializing Speech client:', error);
  speechClient = new SpeechClient();
}

export async function POST(request: Request) {
  try {
    // Validate credentials first
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json(
        { 
          error: 'API configuration error',
          details: 'Google Cloud credentials are not configured. Please check your environment variables.'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('Received audio file:', {
      type: audioFile.type,
      size: audioFile.size,
    });

    // Convert blob to buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Configure the request with more flexible audio settings
    const audio = {
      content: buffer.toString('base64'),
    };
    
    const config = {
      encoding: 'WEBM_OPUS' as const, // Changed to match web audio format
      sampleRateHertz: 48000, // Standard web audio sample rate
      languageCode: 'en-US',
      model: 'default',
      enableAutomaticPunctuation: true,
      useEnhanced: true, // Enable enhanced model
      audioChannelCount: 1, // Mono audio
      enableWordTimeOffsets: false,
    };

    const recognizeRequest = {
      audio: audio,
      config: config,
    };

    try {
      console.log('Sending transcription request with config:', {
        encoding: config.encoding,
        sampleRate: config.sampleRateHertz,
        languageCode: config.languageCode,
      });

      // Perform the transcription
      const [response] = await speechClient.recognize(recognizeRequest);
      
      console.log('Received response:', {
        hasResults: !!response.results,
        resultCount: response.results?.length || 0,
      });

      const transcription = response.results
        ?.map(result => result.alternatives?.[0]?.transcript)
        .join('\n');

      if (!transcription) {
        console.error('No transcription generated from valid response:', response);
        return NextResponse.json(
          { 
            error: 'Failed to transcribe audio: No transcription generated',
            details: 'The audio was processed but no text could be extracted',
            timestamp: new Date().toISOString()
          },
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

      // Log additional error details if available
      if (transcribeError instanceof Error && 'details' in transcribeError) {
        console.error('Error details:', (transcribeError as any).details);
      }

      return NextResponse.json(
        { 
          error: 'Failed to process audio',
          details: errorMessage,
          audioInfo: {
            type: audioFile.type,
            size: audioFile.size,
          },
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