[Live Demo](https://defect-vision.netlify.app/)

# 🚀 Next.js Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🧰 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.tsx. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Geist, a new font family for Vercel.

## 🗄️ Database Setup (MongoDB)
This application requires a MongoDB database for storing data.

1. Create a MongoDB Database
- You can use MongoDB Atlas or host your own MongoDB instance.
- Create a new database.
- Copy the connection string (URI) provided by MongoDB.

2. Configure Environment Variables
Create a .env.local file in the root of your project and add the following:
```
MONGODB_URI="your-mongodb-connection-uri-here"
SESSION_SECRET="your-randomly-generated-session-secret"
```
Replace "your-mongodb-connection-uri-here" with your actual MongoDB URI.
Replace "your-randomly-generated-session-secret" with a secure random string (you can generate one using tools like 1Password or openssl rand -hex 32).
