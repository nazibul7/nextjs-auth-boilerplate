"use client"

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { RegisterFormDataType, RegisterSchema } from '@/app/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import CardWrapper from '@/components/auth/card-wrapper';
import { register } from '@/app/actions/register';
import ResendVerificationButton from '../resend-verification-button';

export function RegisterForm() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition()
    const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

    const form = useForm<RegisterFormDataType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ''
        }
    })

    const onSubmit = async (values: RegisterFormDataType) => {
        setError("");
        setSuccess("")
        startTransition(async () => {
            const data = await register(values);
            if (data.error) {
                setError(data.error);
            }
            if (data.success) {
                setSuccess(data.success);
                setRegisteredEmail(values.email);
                form.reset();
            }
        })
    };

    return (

        <CardWrapper
            headerLabel={!success?'Create an account':'Registration successful!' }
            backButtonLabel={!success? 'Already have an account?':'Go to login'}
            backButtonHref='/auth/login'
            showSocial={!success?true:false}
        >
            {success && registeredEmail ? (
                <div className="space-y-4 text-center">
                    <FormSuccess message={success} />
                    <span className="text-sm text-muted-foreground inline-block text-center w-full">
                        Didn’t get the mail?{' '}<ResendVerificationButton email={registeredEmail} onError={(msg) => setError(msg)} onSuccess={msg => setSuccess(msg)} />
                    </span>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField control={form.control} name='name' render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-lg'>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Jhon Doe' {...field} type='text' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                        </FormField>
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
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button disabled={isPending} type='submit' className='w-full'>
                            {isPending ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </form>
                </Form >
            )}
        </CardWrapper>
    )
}
