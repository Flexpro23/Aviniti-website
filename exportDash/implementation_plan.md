# Dashboard Implementation Plan

This document outlines the steps to create a new, separate dashboard application for managing users who have used the "Get AI Estimate" feature and accessing their generated PDF reports from the main Aviniti website's Firebase backend.

## 1. Project Setup & Technology Choices

*   **Create Project:** Initialize a new project directory for the dashboard application, separate from the existing website codebase.
*   **Chosen Stack:**
    *   **Framework:** **Next.js (React/TypeScript)** - Leverages the existing tech stack familiarity. Next.js API routes will serve as the backend.
    *   **Styling:** **Tailwind CSS** (assuming consistency with the main app, can be adjusted).
    *   **Authentication:** **Firebase Authentication** (Email/Password or preferred provider).
    *   **Database/Storage:** The *existing* Firebase project (Firestore for data/URLs, Storage for PDFs).
*   **Version Control:** Initialize a Git repository.

## 2. Backend Development (Next.js API Routes)

*   **Firebase Admin SDK Setup:**
    *   Integrate the Firebase Admin SDK into the Next.js API routes (`src/app/api/dashboard/...`).
    *   Use the Service Account Key from the existing Firebase project (`exportDash/firebase_credentials.json`) to initialize the SDK. Store these credentials securely using **environment variables** (`.env.local`). **Do not commit the key or `.env.local` to Git.**
*   **Authentication:**
    *   Implement **Firebase Authentication** for dashboard administrators using a chosen method (e.g., Email/Password). Create a mechanism to designate specific Firebase users as admins (e.g., Firestore custom claims).
    *   Protect all dashboard API endpoints (e.g., using middleware or route handlers) to verify admin status (check Firebase Auth token and custom claims).
*   **API Endpoints (within `/src/app/api/dashboard/`):**
    *   `GET /api/dashboard/users`:
        *   Fetch documents from the `users` collection in the existing Firestore database.
        *   Filter users where the `status` field is `'report_generated'`.
        *   Return relevant user data: `userId`, `personalDetails` (name, email, company, etc.), `createdAt`, `reportURL`.
        *   Implement pagination.
    *   `GET /api/dashboard/users/search?query=<term>` (Optional):
        *   Add search functionality (e.g., search by email or name). Query Firestore accordingly.
    *   `GET /api/dashboard/users/filter?startDate=<date>&endDate=<date>` (Optional):
        *   Add filtering by date range based on the `createdAt` field.
*   **Error Handling:**
    *   Implement robust error handling in all API routes. Return meaningful status codes and error messages (e.g., 401 Unauthorized, 404 Not Found, 500 Internal Server Error). Avoid exposing sensitive error details to the client.

## 3. Frontend Development (Next.js Pages/Components)

*   **UI Component Library:** Consider using a component library like **Shadcn/UI** or **Material UI** integrated with Tailwind CSS for faster UI development and consistency.
*   **Login Page:** Create a login form (`src/app/dashboard/login/page.tsx`) that uses the **Firebase Client SDK** to authenticate the admin user via Firebase Authentication.
*   **Dashboard View (`src/app/dashboard/page.tsx` - Protected Route):**
    *   Implement route protection to ensure only authenticated admins can access `/dashboard`.
    *   Fetch data securely from the dashboard's backend API endpoints (`/api/dashboard/...`).
    *   Display the users in a table (e.g., using `react-table` or a component library's table). Show Name, Email, Company, Date Generated.
    *   Include a "View Report" link/button for each user, linking to the `reportURL`. Ensure this link opens in a new tab (`target="_blank"`).
*   **Search/Filter UI (Optional):** Implement UI elements to interact with the backend search/filter endpoints.
*   **State Management:** Use React state management (e.g., `useState`, `useContext`, or Zustand/Jotai for more complex state) for login status, user data, loading states, etc.
*   **UI/UX:**
    *   Ensure a clean, intuitive user interface.
    *   Provide clear loading indicators during data fetching.
    *   Implement responsive design for usability on different screen sizes.
*   **Error Handling:**
    *   Display user-friendly error messages if API calls fail or data cannot be loaded.

## 4. Security Considerations

*   **Service Account Key:** Securely manage the Firebase Service Account Key using environment variables.
*   **Firestore Security Rules:** Review existing rules. While the dashboard backend uses the Admin SDK, ensure rules don't allow unintended access. Consider adding rules specific to admin roles if necessary, although backend API protection is the primary defense.
*   **Firebase Authentication:** Securely manage admin user creation and role assignment (e.g., via custom claims set by a trusted process).
*   **Input Validation:** Sanitize and validate any input received by the API routes.

## 5. Deployment

*   **Choose Hosting:** **Vercel** is a natural choice given the use of Next.js, handling both frontend and API route deployment seamlessly. Alternatives include Netlify, Google Cloud Run, AWS Amplify.
*   **Environment Variables:** Configure environment variables on the hosting platform (e.g., Vercel Environment Variables) for Firebase credentials.
*   **Build Process:** Utilize Next.js build commands (`next build`).
*   **Domain/Subdomain:** Configure DNS for a subdomain (e.g., `dashboard.aviniti.com`).
*   **Scalability/Performance:** Vercel's serverless nature generally scales well automatically. Monitor usage and consider Firestore indexing for performance if querying large datasets becomes slow.

## 6. Logging & Monitoring

*   **Backend Logging:** Integrate a logging service (e.g., Vercel's built-in logging, Sentry, Logtail) for API routes to capture requests, errors, and key events.
*   **Frontend Error Tracking:** Use a service like Sentry or LogRocket to capture frontend errors experienced by admins.
*   **Monitoring:** Set up basic uptime monitoring (e.g., UptimeRobot, Better Uptime) for the dashboard URL. Monitor Firebase usage quotas (Firestore reads/writes, Storage bandwidth).

## 7. Testing

*   **Unit Tests (Jest/React Testing Library):** Test individual components and utility functions.
*   **Integration Tests:** Test interactions between frontend components and API routes. Mock Firebase interactions where appropriate.
*   **End-to-End Tests (Cypress/Playwright):** Simulate admin login and core dashboard interactions.
*   **Manual Testing:** Thoroughly test all features. 