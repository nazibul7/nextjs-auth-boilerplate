import React from 'react'
import { signIn } from "next-auth/react"
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'
import { default_login_redirect } from '@/routes'

export default function Social() {
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            redirectTo: default_login_redirect
        })
    }
    return (
        //     <div className='flex items-center w-full gap-x-2'>
        //         <Button 
        //             variant={"outline"}
        //             size={'lg'}
        //             className='w-full'
        //             onClick={()=>{}}
        //         >
        //             <FcGoogle className='h-12 w-20' />
        //         </Button>
        //         <Button 
        //             variant={"outline"}
        //             size={'lg'}
        //             className='w-full'
        //             onClick={()=>{}}
        //         >
        //             <FaGithub className='h-5 w-5' />
        //         </Button>
        //     </div>



        <div className="flex items-center w-full gap-x-2">
            <Button
                variant="outline"
                size="lg"
                className="w-full flex justify-center items-center"
                onClick={() => { onClick("google") }}
            >
                <FcGoogle style={{ width: '28px', height: '28px' }} />
            </Button>
            <Button
                variant="outline"
                size="lg"
                className="w-full flex justify-center items-center"
                onClick={() => { onClick("github") }}
            >
                <FaGithub style={{ width: '28px', height: '28px' }} />
            </Button>
        </div>

    )
}
