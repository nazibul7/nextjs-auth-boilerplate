"use server"

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "./db";
import { v4 as uuid } from "uuid";

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuid();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour expiry

    // Remove any existing tokens for this email
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
      await db.verificationToken.deleteMany({
        where: { id: existingToken.id }
      })
    }

    // Create and return the new token
    const savedToken = await db.verificationToken.create({
      data: { email, token, expires },
    });

    return savedToken;
  } catch (error) {
    console.error("Error generating verification token:", error);
    return null;
  }
};
