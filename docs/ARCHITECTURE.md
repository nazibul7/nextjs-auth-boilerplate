# 🏗️ Architecture Overview

## 🔥 Tech Stack

| **Layer**         | **Technology**                           |
|-------------------|-------------------------------------------|
| **Framework**     | Next.js 14 (App Router + Server Actions) |
| **Authentication**| Auth.js (NextAuth v5)                     |
| **ORM**           | Prisma                                    |
| **Database**      | PostgreSQL                                |
| **Validation**    | Zod                                       |
| **UI Components** | shadcn/ui + Tailwind CSS                  |
| **Emails**        | Resend                                    |
| **Language**      | TypeScript                                |
| **Hosting**       | Vercel                                    |

## ⚙️ How it all works together
- Next.js App Router serves pages and components.
- Auth.js manages login, sessions, and callbacks.
- Prisma handles database CRUD and migrations.
- Resend sends transactional emails for verification & reset.
- Middleware guards protected pages based on auth & roles.

## 🔄 Deployment
- Deployed to Vercel (but works with any Node host).
- Env variables manage DB URL, Resend API key, Auth secrets.

## Authentication

For a detailed overview of our authentication system design and rationale, see [AUTH-ARCHITECTURE.md](./doc/AUTH-ARCHITECTURE.md).
