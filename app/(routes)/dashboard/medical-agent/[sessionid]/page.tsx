'use client';
import { useParams } from 'next/navigation'
import React from 'react'

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams()
  const GetSessionDetails = () => {

  }

  return (
    <div>
      {sessionId}
    </div>
  )
}

export default MedicalVoiceAgent
