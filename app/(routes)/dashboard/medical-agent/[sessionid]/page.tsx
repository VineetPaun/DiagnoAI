'use client';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';

type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: doctorAgent,
  createdOn: string
}

const MedicalVoiceAgent = () => {
  const params = useParams()
  const sessionId = Array.isArray(params.sessionid) ? params.sessionid[0] : params.sessionid
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>()
  const [callStarted, setCallStarted] = useState(false)
  const [vapiInstance, setVapiInstance] = useState<any>()


  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi)
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);
    vapi.on('call-start', () => {
      console.log('Call started')
      setCallStarted(true)
    });
    vapi.on('call-end', () => {
      console.log('Call ended')
      setCallStarted(false)
    });
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });
  }

  const endCall = () => {
    if(!vapiInstance) return
    vapiInstance.stop()
    vapiInstance.off('call-start')
    vapiInstance.off('call-end')
    vapiInstance.off('meaasge')
    setCallStarted(false)
    vapiInstance(null)
  };

  console.log('Current sessionId:', sessionId, 'Type:', typeof sessionId);

  useEffect(() => {
    sessionId && GetSessionDetails()
  }, [sessionId])

  const GetSessionDetails = async () => {
    try {
      console.log('Making API call with sessionId:', sessionId);
      const result = await axios.get('/api/session-chat?sessionId=' + sessionId)
      console.log('API Response:', result.data);
      setSessionDetail(result.data)
    } catch (error) {
      console.error('Error fetching session details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
    }
  }

  return (
    <div className='p-5 border rounded-3xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-600'}`} />{callStarted ? 'Connected' : 'Not Connected'}</h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>
      {sessionDetail ? (
        <div className='flex items-center flex-col mt-10'>
          <Image className='h-[100px] w-[100px] object-cover rounded-full' src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist} width={120} height={120} />
          <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
          <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>
          <div className='mt-32'>
            <h2 className='text-gray-400'>Assistant Msg</h2>
            <h2 className='text-lg'>User Msg</h2>
            {!callStarted ?
              <Button className='mt-20' onClick={StartCall}>
                <PhoneCall />Start Call
              </Button> :
              <Button className='mt-20' onClick={endCall} variant={'destructive'}>
                <PhoneOff />Disconnect
              </Button>
            }
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center mt-20'>
          <p>Loading session details...</p>
        </div>
      )}
    </div>
  )
}

export default MedicalVoiceAgent