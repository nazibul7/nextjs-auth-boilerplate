"use server"

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "./db";
import { v4 as uuid } from "uuid";
import { TokenType } from "@prisma/client";


const TOKEN_EXPIRY: Record<TokenType, number> = {
  "EMAIL_VERIFICATION": 60 * 60 * 1000,
  "PASSWORD_RESET": 5 * 60 * 1000
};

export const generateVerificationToken = async (email: string, type: TokenType) => {
  try {
    const token = uuid();
    const expires = new Date(Date.now() + TOKEN_EXPIRY[type]);

    // Remove any existing tokens for this email
    const existingToken = await getVerificationTokenByEmail(email, type);
    if (existingToken) {
      await db.verificationToken.deleteMany({
        where: { id: existingToken.id }
      })
    }

    // Create and return the new token
    const savedToken = await db.verificationToken.create({
      data: { email, token, expires, type },
    });

    return savedToken;
  } catch (error) {
    console.error("Error generating verification token:", error);
    return null;
  }
};
