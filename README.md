# SecureVault

SecureVault is a full-stack encrypted notes application built using React, Node.js, Express, MongoDB, and AES-256-GCM encryption.

The application allows users to securely register, verify their email, log in, and manage personal encrypted notes in a calm, minimal interface inspired by ocean and beach aesthetics.

---

# Features

## Authentication

* User registration with bcrypt password hashing
* Email verification flow
* Secure JWT authentication
* JWT stored in httpOnly cookies
* Protected routes
* Persistent login sessions
* Logout functionality

## Notes System

* Create secure notes
* View decrypted notes
* Edit existing notes
* Delete notes with confirmation modal
* Notes sorted by latest first
* User-specific note isolation

## Security

* AES-256-GCM encryption
* Unique IV generated for every encrypted field
* Auth tag validation
* Encryption key stored in environment variables
* Password hashing using bcrypt
* Protected backend routes

## UX Features

* Calm beach/ocean inspired UI
* Loading states
* Empty dashboard state
* Verification success flow
* Responsive card layout
* Smooth edit experience
* Confirmation modal before deletion

---

# Tech Stack

## Frontend

* React
* React Router DOM
* Axios
* React Query
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

## Security & Encryption

* AES-256-GCM
* crypto module
* httpOnly cookies

---

# Folder Structure

```bash
SecureVault/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.jsx
│
├── config/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
└── package.json
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=

MONGO_URI=

JWT_SECRET=

ENCRYPTION_KEY=

EMAIL_USER=

EMAIL_PASS=
```

---

# Backend Setup

```bash
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Encryption Write-Up

## 1. Why AES-256-GCM?

AES-256-GCM was chosen because it provides both encryption and authentication together. Unlike older modes such as CBC, GCM protects not only confidentiality but also integrity.

CBC mode can encrypt data, but it does not verify whether encrypted data has been modified. An attacker could tamper with ciphertext without immediate detection unless a separate authentication mechanism is added.

GCM mode solves this by generating an authentication tag during encryption. When decrypting, the auth tag is verified automatically. If the ciphertext or IV is modified, decryption fails.

For a notes application, integrity matters because users should never receive silently modified or corrupted notes. AES-256-GCM provides authenticated encryption, which is more suitable for modern secure applications.

---

## 2. How is the IV handled?

A unique IV (Initialization Vector) is generated using secure random bytes for every encryption operation.

The IV is stored alongside the encrypted content in the database because it is required during decryption. The IV itself is not secret, but it must be unique.

If the same IV is reused with AES-GCM under the same key, serious cryptographic weaknesses can occur. Attackers may derive relationships between plaintexts and potentially compromise security.

Generating a new IV for every note prevents IV reuse attacks and ensures ciphertext uniqueness even when plaintext content is identical.

---

## 3. What does the auth tag protect?

The authentication tag protects the integrity and authenticity of encrypted data.

During decryption, AES-GCM verifies that:

* ciphertext was not modified
* IV was not altered
* encrypted data was produced using the correct encryption key

If the auth tag is missing or tampered with, decryption fails.

This protects against attacks where an attacker modifies encrypted content in storage or transit. Without authentication tags, corrupted or maliciously modified ciphertext might still decrypt into incorrect plaintext.

---

## 4. Known Security Limitation

One important limitation in the current implementation is that encryption happens on the server after plaintext content is sent from the frontend.

This means the backend can still access plaintext notes before encryption occurs. Although notes are encrypted at rest in the database, this is not true end-to-end encryption.

Given more time, I would implement client-side encryption using the Web Crypto API so notes are encrypted in the browser before transmission. The server would only receive ciphertext and would never see plaintext note content.

I would also improve key management by deriving encryption keys from user credentials instead of using a single server-side encryption key.

---

# AI Usage Log

AI tools were used extensively during development, primarily as an iterative engineering assistant rather than a one-shot code generator.

## ChatGPT

Used for:

* debugging backend and frontend integration
* refining authentication flow
* improving encryption architecture understanding
* UI/UX iteration
* React state management troubleshooting
* route protection logic
* improving maintainability and reducing cascading bugs

The project was developed incrementally with continuous validation and manual decision-making at each step instead of generating the entire application in a single prompt.

Examples of decisions made during development:

* switching from abrupt redirects to dedicated verification UX
* improving stability by separating CSS files instead of inline styling
* implementing confirmation modals
* improving loading and empty states
* restructuring auth persistence flow
* refining dashboard interactions step-by-step to avoid breaking existing functionality

AI-generated suggestions were frequently modified, refined, debugged, or restructured during implementation.

---

# Future Improvements

* True client-side encryption using Web Crypto API
* Optimistic UI updates
* Search and filtering
* Pin important notes
* Dark mode
* Better mobile responsiveness
* Rate limiting for authentication endpoints
* Note categories and tags
* Password reset flow
* Deployment to cloud infrastructure

---

# Assignment Notes

This project was built for the Full Stack Developer Take-Home Assignment focused on:

* authentication
* encryption
* protected APIs
* frontend UX
* secure storage
* architectural clarity

The implementation prioritised correctness, stability, and maintainability over excessive feature complexity.
