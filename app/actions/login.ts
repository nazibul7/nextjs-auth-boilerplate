"use server"

import { LoginFormDataType, LoginSchema } from "../schemas"

export const login = async (data: LoginFormDataType) => {
    const validateFields=LoginSchema.safeParse(data)
    if(!validateFields.success){
        return {error:"Invalid fields!"}
    }
    return { success: "Login successful! Redirecting..." };
}