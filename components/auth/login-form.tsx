"use client"

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { LoginFormDataType, LoginSchema } from '@/app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/app/actions/login';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '@/components/ui/input';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import CardWrapper from '@/components/auth/card-wrapper';
import { useSearchParams } from 'next/navigation';

export function LoginForm() {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") == "OAuthAccountNotLinked" ?
        "Eamil is already in use with different provider!" : ""
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition()
    const form = useForm<LoginFormDataType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: LoginFormDataType) => {
        setError("");
        setSuccess("")
        startTransition(async () => {
            const data = await login(values);
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
            headerLabel='Welcome back'
            backButtonHref='/auth/register'
            backButtonLabel="Don't have an account?"
            showSocial
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
                    <FormField control={form.control} name='password' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-lg'>Password</FormLabel>
                            <FormControl>
                                <Input placeholder='******' {...field} type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                    </FormField>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} type='submit' className='w-full'>
                        {isPending ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                Signing in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>
            </Form >
        </CardWrapper>
    )
}
