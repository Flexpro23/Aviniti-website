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