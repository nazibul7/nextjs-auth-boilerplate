"use server"

import { RegisterSchema, RegisterFormDataType } from "../schemas"
import bcryp from "bcrypt"
import { db } from "@/lib/db"

export const register = async (data: RegisterFormDataType) => {
    const validateFields = RegisterSchema.safeParse(data)
    if (!validateFields.success) {
        return { error: "Invalid fields!" };
    }

    const { name, email, password } = validateFields.data
    const hashPassword = await bcryp.hash(password, 10);
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "Email already in use!" }
    }
    await db.user.create({
        data: {
            name,
            email,
            password: hashPassword
        }
    })

    // Send verification email
    
    return { success: "Register successful! Redirecting..." };
}