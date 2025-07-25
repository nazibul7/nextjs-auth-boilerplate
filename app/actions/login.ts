"use server"

import { default_login_redirect } from "@/routes"
import { LoginFormDataType, LoginSchema } from "../schemas"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { getUserByEmail } from "@/data/user"

export const login = async (data: LoginFormDataType) => {
    const validateFields = LoginSchema.safeParse(data)
    if (!validateFields.success) {
        return { error: "Invalid fields!" }
    }
    const { email, password } = validateFields.data;

    /**
     * When using Credentials Provider with next-auth (or authjs), 
     * that logic (checking if email exists and password matches) 
     * must happen inside the authorize() function, which you define 
     * inside the credentials provider during setup.
     */
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user?.emailVerified) {
            throw new Error("Please verify your email before logging in");
        }
        await signIn("credentials", {
            email,
            password,
            redirectTo: default_login_redirect
        })
        return { success: "Signin successfull!" };
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return { error: "Invalid credentials!" }
            }
            if (error.type == "CallbackRouteError") {
                return { error: error.cause?.err?.message || "Authentication failed" }
            }
            return { error: "Something went wrong!" }
        }
        if (error instanceof Error) {
            return { error: error.message || "Something went wrong!" }
        }
        throw error
    }
}