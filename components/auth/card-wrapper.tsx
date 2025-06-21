import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Header from './header';
import BackButton from './back-button';
import Social from './social';

interface CardProps {
    children: React.ReactNode
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean
}

export default function CardWrapper({headerLabel,children,backButtonLabel,backButtonHref,showSocial}:CardProps) {

    return (
        <Card className='w-[400px] shadow-md'>
            <CardHeader>
                <Header title={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
}
