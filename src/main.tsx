import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WorkSpace from "./workspace/index.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { UserDetailContext } from "../context/UserDetailContext";
import Outline from "./workspace/project/outline/index.tsx";
import Editor from "./workspace/project/editor/index.tsx";
import WorkspaceErrorPage from "./workspace/ErrorPage.tsx";
import Pricing from "./components/custom/Pricing.tsx";
import { About } from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/about", element: <About /> },
  { path: "/pricing", element: <Pricing /> },
  {
    path: "/workspace",
    element: <WorkSpace />,
    errorElement: <WorkspaceErrorPage />,
    children: [
      { path: "project/:projectId/outline", element: <Outline /> },
      { path: "project/:projectId/editor", element: <Editor /> },
    ],
  },
  {
    path: "*",
    element: <WorkspaceErrorPage />, // ✅ catch-all for any invalid route
  },
]);

// Environment variables validation
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

// Validate required environment variables
const validateEnvironment = () => {
  const errors: string[] = [];

  if (!PUBLISHABLE_KEY) {
    errors.push('VITE_CLERK_PUBLISHABLE_KEY is required');
  } else if (PUBLISHABLE_KEY.includes('your_clerk_publishable_key_here') || PUBLISHABLE_KEY.includes('pk_test_your_actual')) {
    errors.push('VITE_CLERK_PUBLISHABLE_KEY contains placeholder value');
  } else if (!PUBLISHABLE_KEY.startsWith('pk_test_') && !PUBLISHABLE_KEY.startsWith('pk_live_')) {
    errors.push('VITE_CLERK_PUBLISHABLE_KEY must start with pk_test_ or pk_live_');
  }

  if (!FIREBASE_API_KEY) {
    errors.push('VITE_FIREBASE_API_KEY is required');
  } else if (FIREBASE_API_KEY.includes('your_firebase_api_key_here')) {
    errors.push('VITE_FIREBASE_API_KEY contains placeholder value');
  }

  if (errors.length > 0) {
    const errorMessage = `Environment Configuration Error:\n${errors.join('\n')}\n\nTo fix:\n1. Copy .env.example to .env.local\n2. Replace placeholder values with actual keys\n3. Restart development server`;
    throw new Error(errorMessage);
  }
};

validateEnvironment();


export function Root() {
  const [userDetail, setUserDetail] = useState();
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <RouterProvider router={router} />
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            theme="dark"
          />
        </UserDetailContext.Provider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
