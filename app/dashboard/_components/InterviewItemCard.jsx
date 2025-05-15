import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {

    const router=useRouter();
    const onStart=()=>{
       router.push('/dashboard/interview/'+interview?.mockId)
    }
    const onFeedbackPress=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+"/feedback")
    }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-blue-600'>{interview?.jobPosition}</h2>
        <h2 className=' text-sm text-gray-600'>{interview?.jobExperience} Years of experience</h2>
        <h2 className='text-xs text-gray-600'>Cretaed at:{interview.createdAt}</h2>
      <div className='flex justify-between mt-2 gap-5'>
        <Button size="sm"  varient="outline" className= "text-green-700 bg-white border rounded-lg" 
        onClick={onFeedbackPress}>
             Feedback</Button>
        <Button  size="sm" className="bg-blue-600"
        onClick={onStart}>
             Start</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard