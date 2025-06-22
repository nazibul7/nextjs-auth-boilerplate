import NextAuh from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import authConfig from "./auth.config"

export const { auth, handlers } = NextAuh({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})