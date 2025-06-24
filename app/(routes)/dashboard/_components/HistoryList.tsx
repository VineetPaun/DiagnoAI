'use client';
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'

const HistoryList = () => {
    const [historyList, setHistoryList] = useState([])

    return (
        <div className='mt-10'>
            {historyList.length == 0 ?
                <div className='flex items-center flex-col justify-center p-7 border-2 border-dashed rounded-2xl'>
                    <Image src={'/medical-assistance.png'} alt='Medical Assistance' width={150} height={150} />
                    <h2 className='font-bold text-xl'>No Recent Consultations</h2>
                    <p>It looks like you havn't consulted with any doctors yet.</p>
                    <Button className='mt-3'>+ Start a Consultation</Button>
                </div> :
                <div>List</div>
            }
        </div>
    )
}

export default HistoryList
