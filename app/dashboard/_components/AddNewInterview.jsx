"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { fetchGeminiResponse, response } from '@/utils/GeminiAPI'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import moment from 'moment';
import { useRouter } from 'next/navigation'


function AddNewInterview() {
  const [openDailog,setOpenDailog]=useState(false)
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading,setLoading]=useState(false);
  const [output, setOutput] = useState([]);
  const {user}=useUser();
  const router=useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const prompt = `Job Position: ${jobPosition}, Description: ${jobDesc}, Years of Experience: ${jobExperience}. 
    Based on this, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format. 
    Only return pure JSON array like: [{"question": "...", "answer": "..."}, ...]`;

    try {
      const outputText = await fetchGeminiResponse(prompt);
      console.log("Raw Output:", outputText);
      setLoading(false);

      const jsonMatch = outputText.match(/\[.*\]/s);
      const cleanJson = jsonMatch ? jsonMatch[0] : outputText;

      const parsedOutput = JSON.parse(cleanJson);
      setOutput(parsedOutput);// ✅ now this won't throw an error
      
      if(cleanJson){
      const resp=await db.insert(MockInterview)
      .values({
           mockId:uuidv4(),
           jsonMockResp:cleanJson,
           jobPosition:jobPosition,
           jobDesc:jobDesc,
           jobExperience:jobExperience,
           createBy:user?.primaryEmailAddress?.emailAddress,
           createdAT:moment().format('DD-MM-YYYY')

      }).returning({mockId:MockInterview.mockId})
      console.log("Inserted ID:",resp)
      if(resp)
      {
        setOpenDailog(fasle);
        router.push('/dasboard/interview/'+resp[0]?.mockId)
      }
    }
    else{
      console.log("Error!!!");
    }
    } catch (err) {
      console.error("Error parsing output:", err);
      setLoading(false);
      setOutput([]); // or show an error message
    }
  };


  return (
    <div>
        <div className='p-10 border rounded-lg bg-seondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDailog(true)}
        >
            <h2 className='text-lg text-center'>+Add New</h2>
        </div>
        <Dialog open={openDailog}>
  
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className=' text-2xl'>Tell key responsibilities define your role the most?</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
        <h2>Add Details about your job position/role, Job description and years of exeprience</h2>
        <div className='mt-7 my-3'>
          <label >Job Role/Job Position</label>
          <Input placeholder="Ex.Full Stack Developer" required
          onChange={(event)=> setJobPosition(event.target.value)} />
        </div>
        <div className='my-3'>
          <label >Job Description/Tech Stack</label>
          <Textarea placeholder="Ex.React, NodeJS, MySql, etc" required
           onChange={(event)=> setJobDesc(event.target.value)}/>
        </div>
        <div className=' my-3'>
          <label >Years of experience</label>
          <Input placeholder="Ex.5" type="number" max="50" required
           onChange={(event)=> setJobExperience(event.target.value)}/>
        </div>
        </div>
        <div className='flex gap-5 justify-end'>
          <Button type="button" varient="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
          <Button type="submit" disable={loading}>
             {loading?
             <>
             <LoaderCircle className='animate-spin'/>'Generating From AI'
             </>:'Start Interview'}
          </Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview