import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

interface BackButtonProps {
    label: string
    href: string
}

export default function BackButton({ label, href }: BackButtonProps) {
    return (
        <Button className='w-full' variant={"link"} >
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}
