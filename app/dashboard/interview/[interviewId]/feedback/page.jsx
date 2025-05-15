'use client'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);

    // Calculate average rating
    if (result.length > 0) {
      const total = result.reduce((sum, item) => sum + (item.rating || 0), 0);
      const avg = (total / result.length).toFixed(1);
      setAverageRating(avg);
    }
  };

  return (
    <div className='p-10'>
      {feedbackList?.length === 0 ? (
        <h2 className='font-bold text-xl text-gray-500'>
          No Interview Feedback Recorded Found
        </h2>
      ) : (
        <>
          <h2 className='text-3xl font-bold text-green-600'>Congratulations!</h2>
          <h2 className='font-bold text-2xl'>Here Is Your Interview Feedback</h2>
          <h2 className='text-blue-600 text-lg my-3'>
            Your overall interview rating:{' '}
            <strong>{averageRating} / 10</strong>
          </h2>

          <h2 className='text-sm text-grey'>
            Find below interview questions with correct answer, your answer and feedback for improvement
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between items-center gap-7 w-full'>
                {item.question}
                <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-red-500 p-2 border rounded-lg'>
                    <strong>Rating:</strong> {item.rating ?? 'N/A'} / 10
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-red-200 text-sm text-red-900'>
                    <strong>Your Answer: </strong>{item.userAns}
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-green-200 text-sm text-green-900'>
                    <strong>Correct Answer: </strong>{item.correctAns}
                  </h2>
                  <h2 className='p-2 border rounded-lg bg-blue-200 text-sm text-blue-900'>
                    <strong>Feedback: </strong>{item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}
      <Button className='mt-5' onClick={() => router.replace('/dashboard')}>
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
