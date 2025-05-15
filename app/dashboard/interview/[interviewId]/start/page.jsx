'use client'
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection.'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function StartInterview({params}) {
    const [interviewData, setInterviewData] = useState(null)
    const [mockIntervewQuestion, setMockInterviewQuestion] = useState(null)
    const [activeQuesionIndex, setActiveQuesionIndex] = useState(0)
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

          const jsonMockResp=JSON.parse(result[0].jsonMockResp)
          setMockInterviewQuestion(jsonMockResp);
          console.log(jsonMockResp)
          setInterviewData(result[0]);
    
        if (result.length > 0) {
          setInterviewData(result[0]) // ✅ Use the first item in the result
        }
      }
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

            {/*Questions*/}
            <QuestionsSection mockInterviewQuestion={mockIntervewQuestion}
            activeQuesionIndex={activeQuesionIndex} />

            {/*Video/Audio Recording */}
            <RecordAnswerSection
            mockInterviewQuestion={mockIntervewQuestion}
            activeQuesionIndex={activeQuesionIndex}
            interviewData={interviewData}
            />

        </div>
        <div className='flex justify-end gap-6'>
          {activeQuesionIndex>0&& 
          <Button onClick={()=>setActiveQuesionIndex(activeQuesionIndex-1)}>Previous Question</Button>}
          {activeQuesionIndex!=mockIntervewQuestion?.length-1&& 
          <Button onClick={()=>setActiveQuesionIndex(activeQuesionIndex+1)}>next Question</Button>}
          {activeQuesionIndex==mockIntervewQuestion?.length-1&& 
          <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
          <Button>End Interview</Button>
           </Link>}
        </div>
    </div>
  )
}

export default StartInterview