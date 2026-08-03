<div align="center">

# Academic Vault

**Secure Assignment Submission System**

Encrypted file submission, lecturer review, grading, and role-based access control — built for academic integrity.

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Encryption](https://img.shields.io/badge/Encryption-AES--256%20%2B%20RSA-critical)](#-security-model)
[![Status](https://img.shields.io/badge/status-in%20development-yellow)](#-under-development)

</div>

---

## Overview

**Academic Vault** is a secure assignment submission platform where student files are encrypted end-to-end before storage and only decrypted when a lecturer reviews them. It combines strong file protection with a straightforward grading and feedback workflow.

---

## Features

- 📤 Student file submission
- 👩‍🏫 Lecturer review dashboard
- 🔒 AES-256 + RSA encryption flow
- 🗄️ Secure file storage
- 🔓 Decryption before review
- 📄 PDF preview support for decrypted files
- 📝 Grading and feedback system
- 🛡️ Role-based access control (student, lecturer)

---

## ech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **File Upload** | Multer |
| **Encryption** | Node Crypto (AES-256 + RSA) |
| **Styling** | Tailwind CSS |

---

## 📁 Project Structure

```
academic-vault/
├── app/            # Next.js routes
├── components/     # UI components
├── contexts/       # Global state
├── lib/api/        # API layer
└── backend/        # Express server
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the backend server

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

### 3. Run the frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔑 Environment Variables

**Frontend — `.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend — `.env`**

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
PORT=5000
```

---

## File Upload System

- Files are encrypted before storage
- Only decrypted on lecturer request
- No external storage services currently required *(see [Under Development](#-under-development))*

---

## Security Model

1. RSA encrypts the AES key
2. AES encrypts the file content
3. Lecturer's private key decrypts the AES key
4. The file only becomes readable after the decryption step
5. Download and preview stay locked until decrypted

---

## API Overview

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Log in an existing user |
| `POST` | `/auth/register` | Register a new user |

---

## Under Development

- **Cloud file storage migration** — replacing local `/uploads` storage with a cloud storage provider ahead of deployment, so files aren't tied to a single server's filesystem

---

## Running Notes

- Ensure the backend is running before the frontend
- Ensure the `/uploads` folder exists locally during development
- Do not delete encrypted files manually
- Decryption is idempotent (runs once per file)

---

##  Deployment

Coming soon.

---

<div align="center">

Built for secure, verifiable academic submissions 

</div>
