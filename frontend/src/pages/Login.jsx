import { useState } from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";

export default function Login() {

  const navigate =
    useNavigate();

  const { setUser } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await axios.post(
          "http://localhost:5000/auth/login",

          {
            email,
            password,
          },

          {
            withCredentials: true,
          }
        );

      // Store user
      setUser(
        response.data.user
      );

      // Redirect
      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1 className="auth-title">
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Secure your thoughts in a
          calm and private space.
        </p>

        <form
          className="auth-form"

          onSubmit={handleLogin}
        >

          <input
            className="auth-input"

            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            className="auth-input"

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            className="auth-button"

            type="submit"

            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{" "}

          <Link
            to="/register"

            className="auth-link"
          >
            Register
          </Link>
        </div>

      </div>

    </div>
  );
}