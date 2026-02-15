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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Validate required environment variables
if (!PUBLISHABLE_KEY) {
  throw new Error("❌ VITE_CLERK_PUBLISHABLE_KEY is required. Please set it in your .env file");
}

if (PUBLISHABLE_KEY.includes('your_') || PUBLISHABLE_KEY.includes('YOUR_')) {
  throw new Error("❌ Please replace the placeholder Clerk publishable key with your actual key from Clerk Dashboard");
}

function Root() {
  const [userDetail, setUserDetail] = useState();
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <RouterProvider router={router} />
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
