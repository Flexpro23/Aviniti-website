# Aviniti Website

A modern web application for Aviniti, featuring AI-powered app development estimates.

## Features

- AI-powered app development cost estimation
- Multi-language support (English and Arabic)
- Firebase integration for authentication and storage
- PDF report generation and storage
- Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **AI**: Google Gemini API
- **PDF Generation**: jsPDF, html2canvas

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/aviniti-website.git
   cd aviniti-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   
   # For Admin Features (Server-side only)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage services
3. Set up Firebase Storage rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Admin has full access to all files
       match /{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.token.role == 'admin';
       }
       
       // Users can only access their own reports
       match /reports/{userId}/{fileName} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
4. Deploy the storage rules:
   ```bash
   firebase deploy --only storage
   ```

## Deployment

1. Build the application for production:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

For deploying to Vercel or other platforms, ensure all environment variables are set in the platform's configuration dashboard.

## Security

### Environment Variables
- Never commit `.env` files or any files containing sensitive credentials
- Keep your API keys and service account credentials secure
- Use environment variables for all sensitive information
- The `.gitignore` file is configured to exclude sensitive files

### Firebase Security
- **Firestore Rules**: Configured to strictly validate user data integrity.
  - `users` collection: Allows creation/update only if `emailAddress` matches the document ID.
  - Default deny for all other collections.
- **Storage Rules**: Configured to allow specific file types.
  - `reports` path: Allows PDF uploads only (`application/pdf`).
  - Public read access is enabled for generated reports to be shareable.
- **API Keys**: Restrict API keys in Google Cloud Console to specific domains (e.g., your production domain).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
