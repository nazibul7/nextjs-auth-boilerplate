import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
})

export type LoginFormDataType = z.infer<typeof LoginSchema>



export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required"
    })
})

export type RegisterFormDataType = z.infer<typeof RegisterSchema>


export const ForgotPasswordSchema = z.object({
    email: z.string().email({ message: "Enter a valid email" })
})

export type ForgotPasswordDataType = z.infer<typeof ForgotPasswordSchema>


