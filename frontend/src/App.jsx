import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import VerificationSuccess from "./pages/VerificationSuccess";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"

          element={<Login />}
        />



        {/* ================= REGISTER ================= */}

        <Route
          path="/register"

          element={<Register />}
        />



        {/* ================= EMAIL VERIFIED ================= */}

        <Route
          path="/verified-success"

          element={
            <VerificationSuccess />
          }
        />



        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"

          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        />



        {/* ================= DEFAULT ================= */}

        <Route
          path="*"

          element={
            <Navigate
              to="/dashboard"
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;