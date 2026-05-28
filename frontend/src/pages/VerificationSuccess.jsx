import { useNavigate } from "react-router-dom";

import "../styles/auth.css";

export default function VerificationSuccess() {

  const navigate =
    useNavigate();

  return (
    <div className="auth-page">

      <div className="auth-card verification-card">

        <div className="verification-badge">
          ✓
        </div>

        <h1 className="auth-title">
          Email Verified
        </h1>

        <p className="verification-text">
          Your SecureVault account
          has been verified successfully.
        </p>

        <p className="verification-helper">
          You can now securely access
          your encrypted notes and
          continue using SecureVault.
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