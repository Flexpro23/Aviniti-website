
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this is not cached

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';
  
  const status = {
    env: {
      GEMINI_API_KEY_CONFIGURED: !!apiKey,
      GEMINI_API_KEY_LENGTH: apiKey ? apiKey.length : 0,
      NEXT_PUBLIC_GEMINI_MODEL: modelName,
      NODE_ENV: process.env.NODE_ENV,
    },
    connection: {
      status: 'pending',
      message: '',
      latency: 0
    }
  };

  if (!apiKey) {
    status.connection.status = 'error';
    status.connection.message = 'GEMINI_API_KEY is missing in environment variables';
    return NextResponse.json(status, { status: 500 });
  }

  try {
    const start = Date.now();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // Simple prompt to test connectivity
    const result = await model.generateContent("Hello, respond with 'OK'.");
    const response = await result.response;
    const text = response.text();
    
    status.connection.latency = Date.now() - start;
    status.connection.status = 'success';
    status.connection.message = `Successfully connected to ${modelName}. Response: ${text.trim()}`;
    
    return NextResponse.json(status);
    
  } catch (error: any) {
    console.error('AI Debug Error:', error);
    status.connection.status = 'error';
    status.connection.message = error.message || 'Unknown error';
    
    // Add detailed error info if available
    if (error.status) (status.connection as any).errorCode = error.status;
    if (error.statusText) (status.connection as any).errorText = error.statusText;
    if (error.errorDetails) (status.connection as any).details = error.errorDetails;

    return NextResponse.json(status, { status: 500 });
  }
}
