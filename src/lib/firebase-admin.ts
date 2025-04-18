import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

// Initialize Firebase Admin
const apps = getApps();

// Properly typed admin services
let adminDb: Firestore | undefined = undefined;
let adminStorage: Storage | undefined = undefined;

if (!apps.length) {
  try {
    // Use hardcoded values instead of environment variables
    const serviceAccount = {
      projectId: "aviniti-website",
      clientEmail: "firebase-adminsdk-fbsvc@aviniti-website.iam.gserviceaccount.com",
      // Note: In production, you should use environment variables for sensitive data
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9WB8D9lJwLaLy\nYWLHMzH5dN3l360Iyy3Nx90shta4tt9gEM+5cNwxmLigJkzYilTqA2SZ99eN3wW1\n3O5QDHkw9wvG6NjIV94uVofAwGsSvPg5KJaBv02YGV+1R2iOkOs9KJRoTcVHiNtD\nqGmjhtbsQK8y5JspbQJ3+XwrT4RCs73coHOiL+p0qOruv8X3tEuImZz3iMa1XzM/\nR9Oygmo9to9e0PwtiZO4OpMJkhLHu7G0apiiBpam1kZEvL2b6/O9psC+zVXx8MvX\nVp4jNnbiNsrcWTQClsucUzAu4fvSWDIN96PkHsgsgYNloR2vjUlM6Hq7Q9mxgiFQ\nShPNa8LrAgMBAAECggEAJSjsPVzUZQuv1R3jwvB7OFgFTJ4PWZB2ltJIx/pWnb3W\nLQZfnidWL62nXlbl8gGEFMFBty368e75Me4AH1mzVzbE6u67zOXhxvpYfi3FVdIc\nbStYDnK7CcTBEdTH4mLyp/gU2DubIiTr02V0BhHqkEdJmxVelky8lUszYVSjwmsp\nvS81sfZGkzqz4VKSsp0UH+Qp8Zzu/ttr+nF3W2t4xw87y+9PvVQCIRruYBh7Jkck\nlyTNF14Z8brapGFNib3x84h4bLGGCTIJz9OT3ZyHJ9tWwErN+Us5JozP+vrG7seG\nSGzV+7mUncWNAjkLsTITidt2kylw0fz1NXMVzim54QKBgQDix8c5EkcXvH63K8km\ngTFU2aYRf7qeNbAWhhp9uy0tWzwR/BLEs6JLLT+PXCJ3BHtYIW9fbsxqFWjTiFgN\nA3jtqMdl2ZdVpmsamqooMro0VTc/icRtBgRtLGKyzJTAk9HtF/y/3YkCSwpG6rXo\nhynrvHiQK9WtXt/oTm1ayLbaSQKBgQDVvYhSs6gqYnlvq78rzKildRsTnO2Nz+1Q\nb4FLCpVIngKIoL2WFcscVbKJK5uSEw8XVEwRMMZ34vn//K7aLFfhoOff6GWEM6Lu\nOWvwe2eVs0hrSP8Y1AYy7rndH9kx+l2QtwXKLgC6Y6v3GcnFdDm2akguGcKQkZLA\n8NGhoHETkwKBgQDU6U1QdqmKTm0FWbVzUg3XpLO2cB3sFWmp6+OJMac7kxF1rRyN\n0jzHqcanuI+e//Uxi8p9ZY/C9TDCkJpiNWVec3wpUj0zq5eYlaa1MNMC+RJys8xX\nszOKsAZF6a6qkt2fZErmc34DSiJu7EM2+VdRPFRQvubQ62b6Ok+O0SxjCQKBgH9A\niisCvzoMytPLYtPG0xk+8VHp+hyWEGn1GPr+YAaN3GBPos/6RaSm+NZl2gdLxY5U\nJ72MVn0F62WWoNtPzzqLu8E48UeWHojKMxNHxVIBHTqSiR3VDaPBMXMPBRaWQqJn\n9NB8Nv7BXJ6PAevG2J1cBYE84POFV+P6/DPH+8p1AoGAfK2hRDcUp4VUZFrngIkQ\nFRl/xmJc5PEtYS5QNh5AMV24i6rryNein5PN1OWYeH4sP3BMSVlU7vNRx/ka8Up1\nb0bS5h/PC9ECxompfiRoVW0+ntatw/a6OOHuSzyFcR1FcvywX8iGLecXQ5jUZO8p\ng7aZQBFNpgXEny7SH+TQfa8=\n-----END PRIVATE KEY-----\n",
    };

    console.log('Initializing Firebase Admin SDK...');
    const app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "aviniti-website.firebasestorage.app"
    });

    console.log('Firebase Admin initialized successfully with storage bucket: aviniti-website.firebasestorage.app');
    
    // Initialize services
    console.log('Getting Firestore admin instance...');
    adminDb = getFirestore(app);
    console.log('Firestore admin initialized successfully');
    
    console.log('Getting Storage admin instance...');
    adminStorage = getStorage(app);
    console.log('Storage admin initialized successfully');
    
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    // Don't throw here to prevent app from crashing completely
    console.error('CRITICAL ERROR: Firebase Admin initialization failed');
  }
}

// Non-null assertions since we only export after initialization
export { adminDb, adminStorage }; 