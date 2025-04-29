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

## Security

### Environment Variables
- Never commit `.env` files or any files containing sensitive credentials
- Keep your API keys and service account credentials secure
- Use environment variables for all sensitive information
- The `.gitignore` file is configured to exclude sensitive files

### Firebase Security
- Firebase Storage rules are configured to restrict access based on user roles
- Admin users have full access to all files
- Regular users can only access their own reports
- Authentication is required for all operations

### API Keys
- Keep your Gemini API key secure
- Never expose API keys in client-side code
- Use environment variables for all API keys
- Rotate API keys regularly

## Deployment

The application can be deployed to Vercel:

```bash
npm run build
# or
yarn build
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any inquiries, please contact:
- Email: Aliodat@aviniti.app
- Phone: +962 790 685 302
- Website: www.aviniti.app 