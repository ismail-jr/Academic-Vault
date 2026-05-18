# Academic Vault

Secure assignment submission system with encryption, lecturer review, grading, and file protection.

---

## Features

- Student file submission
- Lecturer review dashboard
- AES-256 + RSA encryption flow
- Secure file storage (local uploads)
- Decryption before review
- PDF preview support for decrypted files
- Grading and feedback system
- Role-based access control (student, lecturer)

---

## Tech Stack

- Next.js (App Router)
- Node.js
- Express
- MongoDB
- Multer (file upload)
- Crypto (AES + RSA encryption)
- Tailwind CSS

---

## Project Structure

- `/app` Next.js routes
- `/components` UI components
- `/contexts` global state
- `/lib/api` API layer
- `/backend` Express server

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

---

### 2. Run backend server

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 3. Run frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## Environment Variables

Create `.env.local` in frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Create `.env` in backend:

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
PORT=5000
```

---

## File Upload System

- Files stored locally in `/uploads`
- Encrypted before storage
- Only decrypted on lecturer request
- No external storage services required

---

## Security Model

- RSA encrypts AES key
- AES encrypts file content
- Lecturer private key decrypts AES key
- File only becomes readable after decryption step
- Download and preview locked until decrypted

---

## API Overview

### Auth

- POST `/auth/login`
- POST `/auth/register`

---

## Running Notes

- Ensure backend runs before frontend
- Ensure `/uploads` folder exists
- Do not delete encrypted files manually
- Decryption is idempotent (runs once per file)

---

## Deployment

- coming soon

---
