import { lazy, Suspense, ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATH } from "./utils/pagePath";
import PublicRoute from "./authRoutes/PublicRoute";
import PrivateRoute from "./authRoutes/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { CircularProgress } from "@mui/material";

// Lazy Layouts
const PreLogin = lazy(() => import("./layouts/PreLogin/PreLogin"));
const AppLayout = lazy(() => import("./layouts/AppLayout/AppLayout"));

// Pages
const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/OtherPages/Dashboard"));
const MyTeam = lazy(() => import("./pages/OtherPages/MyTeam"));
const MyTask = lazy(() => import("./pages/MyTask/MyTask"));
const Billing = lazy(() => import("./pages/OtherPages/Billing"));
const Settings = lazy(() => import("./pages/OtherPages/Setting"));

// ------------------ Suspense HOC ------------------
const withSuspense = (Component: ReactNode) => (
  <Suspense
    fallback={
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size="3rem" />
      </div>
    }
  >
    <ErrorBoundary>{Component}</ErrorBoundary>
  </Suspense>
);

// ------------------ Routes ------------------
export const router = createBrowserRouter([
  {
    path: PATH.DEFAULT,
    element: <Navigate to={PATH.LOGIN} />,
  },
  {
    element: withSuspense(<PublicRoute component={<PreLogin />} />),
    children: [
      {
        path: PATH.LOGIN,
        element: withSuspense(<Login />),
      },
    ],
  },
  {
    element: withSuspense(<PrivateRoute component={<AppLayout />} />),
    children: [
      {
        path: PATH.DASHBOARD,
        element: withSuspense(<Dashboard />),
      },
      {
        path: PATH.MYTEAM,
        element: withSuspense(<MyTeam />),
      },
      {
        path: PATH.MYTASK,
        element: withSuspense(<MyTask />),
      },
      {
        path: PATH.BILLING,
        element: withSuspense(<Billing />),
      },
      {
        path: PATH.SETTINGS,
        element: withSuspense(<Settings />),
      },
    ],
  },
]);
