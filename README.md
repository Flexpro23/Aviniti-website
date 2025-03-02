# Aviniti Website

A modern web application for AI-powered app development cost estimation and project management.

## Features

- AI-powered project cost estimation
- Interactive project requirement gathering
- Automated report generation
- Real-time PDF generation and storage
- Modern, responsive UI
- Firebase integration for data persistence

## Prerequisites

- Node.js 18+ and npm
- Firebase account with Firestore and Storage enabled
- Google Cloud Platform account for AI services
- Gemini API access

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aviniti-website.git
cd aviniti-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your actual credentials:
- Firebase configuration
- Firebase Admin SDK credentials
- Gemini API key
- Google Cloud credentials

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

The following environment variables are required:

### Firebase Configuration
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Firebase Admin Configuration
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_TOKEN_URI`

### AI Services
- `GEMINI_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS`

## Development

The project uses:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Firebase (Firestore + Storage)
- Google AI services

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your hosting platform of choice. For Vercel:
```bash
vercel deploy
```

Make sure to configure your environment variables in your hosting platform's dashboard.

## Security

- Never commit `.env` files or any files containing sensitive credentials
- Keep your API keys and service account credentials secure
- Follow Firebase security best practices for production deployments

## License

[Your chosen license]

## AI Estimation Feature

The application includes an AI estimation feature that analyzes app descriptions and generates detailed estimates for development time and costs.

### Gemini AI Integration

The app uses Google's Generative AI SDK with the Gemini 1.5 model for analyzing app descriptions and generating estimates.

#### API Key Configuration

For security and flexibility, the Gemini API key can be configured in two ways:

1. **Environment Variables (Recommended):**
   Create a `.env.local` file in the root directory and add:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
   ```

2. **Fallback Hardcoded Key:**
   If no environment variable is found, the application will use a fallback API key.

#### Available Models

You can specify which Gemini model to use by setting the `NEXT_PUBLIC_GEMINI_MODEL` environment variable. Options include:

- `gemini-1.5-flash` (default, faster response)
- `gemini-1.5-pro` (more accurate but slower)

### Development Mode Features

When running in development mode, the app includes:

- API status indicator showing if the Gemini API is accessible
- Mock data notifications when fallback data is being used
- Detailed console logs for debugging API interactions

### Error Handling

The app includes robust error handling for API interactions:

- Graceful fallback to mock data when the API fails
- Detailed error logging in the console
- User-friendly notifications in development mode

## Running Locally

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Troubleshooting

If you encounter issues with the Gemini AI integration:

1. Check your API key configuration
2. Ensure your API key has access to the specified model
3. Check browser console logs for detailed error messages
4. Verify that you're using a supported model name 