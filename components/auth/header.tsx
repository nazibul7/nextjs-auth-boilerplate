import React from 'react'

interface HeaderProps{
    title:string
}

export default function ({title}:HeaderProps) {
  return (
    <div className='w-full flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-3xl font-semibold'>🔐Auth</h1>
        <p className='text-sm text-muted-foreground'>{title}</p>
    </div>
  )
}
