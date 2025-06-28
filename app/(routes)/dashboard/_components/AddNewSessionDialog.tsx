'use client';
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { DialogClose } from '@radix-ui/react-dialog'
import { ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios';
import { doctorAgent } from './DoctorAgentCard';
import SuggestedDoctorCard from './SuggestedDoctorCard';

const AddNewSessionDialog = () => {
    const [note, setNote] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [suggestedDoctor, setSuggestedDoctor] = useState<doctorAgent[]>()
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>()

    const OnClickNext = async () => {
        setLoading(true)
        const result = await axios.post('/api/suggest-doctors', {
            notes: note
        })
        console.log(result.data);
        setSuggestedDoctor(result.data)
        setLoading(false)
    }

    const onStartConsultation = async () => {
        setLoading(true)
        const result = await axios.post('/api/session-chat', {
            notes: note,
            selectedDoctor: selectedDoctor
        })
        console.log(result.data)
        if (result?.data.sessionId) {
            console.log(result.data.sessionId)
        }
        setLoading(false)
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='mt-3'>+ Start a Consultation</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Basic Details</DialogTitle>
                        <DialogDescription asChild>
                            {!suggestedDoctor ? <div>
                                <h2>Add Symptons or any other details.</h2>
                                <Textarea placeholder='Add Details here...' className='h-[200px] mt-1' onChange={(e) => setNote(e.target.value)} />
                            </div> :
                                <div>
                                    <h2>Select the doctor</h2>
                                    <div className='grid grid-cols-3 gap-5'>
                                        {suggestedDoctor.map((doctor, index) => (
                                            //@ts-ignore
                                            <SuggestedDoctorCard doctorAgent={doctor} key={index} setSelectedDoctor={() => setSelectedDoctor(doctor)} selectedDoctor={selectedDoctor} />
                                        ))}
                                    </div>
                                </div>
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'outline'}>Cancel</Button>
                        </DialogClose>
                        {!suggestedDoctor ? <Button disabled={!note || loading} onClick={() => OnClickNext()}>
                            Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
                        </Button> :
                            <Button disabled={loading || !selectedDoctor} onClick={() => onStartConsultation()}>Start Consultation {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}</Button>
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewSessionDialog
