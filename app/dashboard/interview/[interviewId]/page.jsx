'use client'

import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null)
  const [webCamEnabled, setWebCamEnabled] = useState(false)

  useEffect(() => {
    console.log(params.interviewId)
    GetInterviewDetails()
  }, [params.interviewId])

  /**
   * Get Interview details by MockID/Interview ID
   */
  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId))

    if (result.length > 0) {
      setInterviewData(result[0]) // ✅ Use the first item in the result
    }
  }

  return (
    <div className='my-10  '>
      <h2 className='text-3xl'>Let&apos;s Get Started</h2>
      <div className='grid grid-cols-1  md:grid-cols-2 gap-10 '>
      
{/* ✅ Safe rendering of interview details */}
      {interviewData ? (
        <div className='flex flex-col my-5 gap-5 font-medium'>
            <div className='flex flex-col p-5 rounded-lg border gap-5'>
          <h2 className='text-lg'>
            <strong>Job Role / Job Position: </strong>
            {interviewData.jobPosition}
          </h2>
          <h2 className='text-lg'>
            <strong>Job Description / Tech Stack: </strong>
            {interviewData.jobDesc}
          </h2>
          <h2 className='text-lg'>
            <strong>Job Experience: </strong>
            {interviewData.jobExperience}
          </h2>
         </div>
         <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Information</strong></h2>
            <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
         </div>
        </div>
      ) : (
        <div className='mt-5'>Loading interview details...</div>
      )}
       <div>
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{
              height: 300,
              width: 300,
            }}
          />
        ) : (
          <>
            <WebcamIcon className='h-96 w-full p-20 bg-secondary rounded-lg border' />
            <Button varient="ghost" className="w-full font-light" onClick={() => setWebCamEnabled(true)}>
              Enable Web Cam and Microphone
            </Button>
          </>
        )}
      </div>
    </div>
    <div className='flex justify-end items-end text-blue-500'>
      <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
    <Button >Start Interview</Button>
    </Link>
    </div>
      </div>


  )
}

export default Interview
