'use client';

import Webcam from 'react-webcam';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchGeminiResponse } from '@/utils/GeminiAPI';
import { useUser } from '@clerk/nextjs';
import { UserAnswer } from '@/utils/schema';
import { db } from '@/utils/db';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuesionIndex,interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading,setLoding]=useState(false);
  const {user}=useUser();
  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer((prev) => prev + result?.transcript);
    });
  }, [results]);

  useEffect(()=>{
     if(!isRecording&&userAnswer.length>10)
     {
      UpdateUserAnswer();
     }
  },[userAnswer])

  const StartStopRecording = async () => {
  if (isRecording) {
    
    stopSpeechToText();

    // Wait for answer to be updated (adjust delay if needed)
    setTimeout(async () => {
      if (!userAnswer || userAnswer.length < 10) {
        setLoding(false);
        toast('Error while saving your answer, please record again');
        return;
      }

      
    }, 1000);
  } else {
    startSpeechToText();
  }
};
  const UpdateUserAnswer=async()=>{
    console.log(userAnswer);
    setLoding(true)
    const feedbackPrompt = `
Question: ${mockInterviewQuestion[activeQuesionIndex]?.question}
User Answer: ${userAnswer}

Please provide a rating (1 to 5) and detailed feedback as an area of improvement.
Return ONLY a JSON object with fields "rating" (integer) and "feedback" (string).
Example:
{
  "rating": 1,
  "feedback": "This answer is not realistic and lacks credibility. ..."
}
`;

      const outputText = await fetchGeminiResponse(feedbackPrompt);
      console.log("Raw feedback output:", outputText);

      // Clean markdown backticks if present
      const cleanJson = outputText.replace(/```json|```/g, '').trim();

      try {
        const feedback = JSON.parse(cleanJson);
        console.log("Parsed feedback:", feedback);

        // Now you can show this feedback.rating and feedback.feedback in your UI
        // Example:
        toast(`Rating: ${feedback.rating}\nFeedback: ${feedback.feedback}`);

        const resp=await db.insert(UserAnswer)
        .values({
            mockIdRef:interviewData?.mockId,
            question:mockInterviewQuestion[activeQuesionIndex]?.question,
            correctAns:mockInterviewQuestion[activeQuesionIndex]?.answer,
            userAns:userAnswer,
            feedback:feedback?.feedback,
            rating:feedback?.rating,
            userEmail:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-YYYY')
      })
      if(resp)
      {
        toast("Answer saved successfully");
        setUserAnswer('');
        setResults([]);
      }
      
      setLoding(false);

      } catch (err) {
        console.error("Failed to parse feedback JSON:", err);
        toast('Failed to get valid feedback, please try again.');
      }
  }



  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt="Webcam placeholder image" />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
          }}
        />
      </div>

      <Button 
      disabled={loading}
      variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2'>
            <StopCircle /> Stop Recording
          </h2>

        ) : (
          <h2 className='flex gap-2 items-center'><Mic /> Record Answer</h2>
        )}
      </Button>

      <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
