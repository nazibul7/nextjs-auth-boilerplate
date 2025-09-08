"use client"

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { ForgotPasswordDataType, ForgotPasswordSchema } from '@/app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { requestForgotPassword } from '@/app/actions/forgot-password';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import CardWrapper from '@/components/auth/card-wrapper';
import { useRouter } from 'next/navigation';
import ResendVerificationButton from '../resend-verification-button';
import { TokenType } from '@prisma/client';

export function ForgotPasswordForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition()
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
    const router = useRouter()

    const form = useForm<ForgotPasswordDataType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = async (values: ForgotPasswordDataType) => {
        setError("");
        setSuccess("")
        startTransition(async () => {
            const data = await requestForgotPassword(values.email);
            if (data?.error) {
                setRegisteredEmail(values.email);
                setError(data.error);
            }
            if (data?.success) {
                setSuccess(data.success);
                form.reset();
            }
        })
    };

    return (
        <CardWrapper
            headerLabel='Forgot Password'
            backButtonHref='/auth/login'
            backButtonLabel="Back to login?"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField control={form.control} name='email' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg'>Email</FormLabel>
                            <FormControl>
                                <Input placeholder='john.doe@example.com' {...field} type='email' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                    </FormField>
                    {error == "Your account is not verified yet. Please check your email to verify your account." && (
                        <div className="space-y-4 text-center">
                            <span className="text-sm text-muted-foreground inline-flex items-center gap-x-6 my-[-5px] justify-center ga text-center w-full">
                                Didn’t get the mail?{' '}<ResendVerificationButton email={registeredEmail as string} onError={(msg) => setError(msg)} onSuccess={msg => setSuccess(msg)} type={TokenType.PASSWORD_RESET} />
                            </span>
                        </div>
                    )}
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} type='submit' className='w-full'>
                        {isPending ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                Sending...
                            </>
                        ) : (
                            "Send reset link"
                        )}
                    </Button>
                </form>
            </Form >
        </CardWrapper>
    )
}
