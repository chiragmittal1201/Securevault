import { useState } from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await axios.post(
          "http://localhost:5000/auth/register",

          {
            username,
            email,
            password,
          }
        );

      alert(
        response.data.message
      );

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1>
        Register
      </h1>

      <form
        onSubmit={
          handleRegister
        }
      >

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Register"}
        </button>

      </form>

      <br />

      <p>
        Already have an
        account?{" "}

        <Link to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}
