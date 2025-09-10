"use client"

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { ResetPasswordSchema, ResetPasswordDataType } from '@/app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import CardWrapper from '@/components/auth/card-wrapper';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/app/actions/reset-password';

export function ResetPasswordForm({ token }: { token: string }) {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<ResetPasswordDataType>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (values: ResetPasswordDataType) => {
        setError("");
        setSuccess("")
        startTransition(async () => {
            const data = await resetPassword(values.password, values.confirmPassword, token);
            if (data?.error) {
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
            headerLabel='Reset Password'
            backButtonHref='/auth/login'
            backButtonLabel="Back to login?"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField control={form.control} name='password' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg'>Password</FormLabel>
                            <FormControl>
                                <Input placeholder='************' {...field} type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                    </FormField>
                    <FormField control={form.control} name='confirmPassword' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg'>Confirm password</FormLabel>
                            <FormControl>
                                <Input placeholder='************' {...field} type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                    </FormField>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} type='submit' className='w-full'>
                        {isPending ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            </Form >
        </CardWrapper>
    )
}
