import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import PrivateRoutes from "./protected-routes/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import PublicRoute from "./protected-routes/PublicRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Lazy imports
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const Settings = lazy(() => import("./components/settings/Settings"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      element: <PublicRoute />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
      ],
    },

    {
      element: <PrivateRoutes />,
      children: [
        {
          path: "/dashboard",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "/settings",
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <Settings />
            </Suspense>
          ),
        },
      ],
    },
  ]);
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
