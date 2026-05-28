import { useState } from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import "../styles/auth.css";

export default function Register() {

  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      setErrorMessage("");

      await axios.post(
        "http://localhost:5000/auth/register",

        {
          username,
          email,
          password,
        }
      );

      setSuccess(true);

    } catch (error) {

      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= SUCCESS STATE =================

if (success) {
  return (
    <div className="auth-page">

      <div className="auth-card verification-card">

        <div className="verification-badge">
          ✓
        </div>

        <h1 className="auth-title">
          Verify Your Email
        </h1>

        <p className="verification-text">
          Your SecureVault account
          has been created successfully.
        </p>

        <div className="verification-email">
          {email}
        </div>

        <p className="verification-helper">
          We sent a verification link
          to your email address.
          <br />
          Please verify your account
          before logging in.
        </p>

        <p className="verification-small">
          If you don't see the email,
          check your spam or promotions
          folder.
        </p>

        <div className="verification-actions">

          <button
            className="auth-button"

            onClick={() =>
              navigate("/login")
            }
          >
            Go to Login
          </button>

        </div>

      </div>

    </div>
  );
}

  // ================= REGISTER FORM =================

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1 className="auth-title">
          Create Account
        </h1>

        <p className="auth-subtitle">
          Your peaceful and secure
          note space begins here.
        </p>

        <form
          className="auth-form"

          onSubmit={
            handleRegister
          }
        >

          <input
            className="auth-input"

            type="text"

            placeholder="Username"

            value={username}

            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

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

          {errorMessage && (
            <div
              className="auth-error"
            >
              {errorMessage}
            </div>
          )}

          <button
            className="auth-button"

            type="submit"

            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>

        </form>

        <div className="auth-footer">

          Already have an account?{" "}

          <Link
            to="/login"

            className="auth-link"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}