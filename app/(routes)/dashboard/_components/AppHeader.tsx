import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const menuOptions = [
    {
        id: 1,
        name: 'Home',
        path: '/home'
    },
    {
        id: 2,
        name: 'History',
        path: '/history'
    },
    {
        id: 3,
        name: 'Prising',
        path: '/prising'
    },
    {
        id: 4,
        name: 'Profile',
        path: '/profile'
    }
]

const AppHeader = () => {
    return (
        <div className='flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40'>
            <div className='flex items-center gap-3'>  
                <Image src={'/logo.svg'} alt='logo' width={25} height={25}></Image>
                <h1 className=''>DiagnoAI</h1>
            </div>
            <div className='hidden md:flex gap-12 items-center'>
                {menuOptions.map((option, index) => (
                    <div key={index}>
                        <h2 className='hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
                    </div>
                ))}
            </div>
            <UserButton />
        </div>
    )
}

export default AppHeader