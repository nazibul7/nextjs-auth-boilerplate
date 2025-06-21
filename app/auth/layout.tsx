import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='h-full flex flex-col justify-center items-center text-white bg-gradient-to-r from-blue-950 via-purple-950 to-pink-950'>
            {children}
        </div>
    )
}
