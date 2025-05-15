import { LightbulbIcon, Volume } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuesionIndex }) {
  const textToSpeach = (text)=>{
    if('speechSynthesis' in window){
      const speech=new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert('sorry, your browser does not support text to speech')
    }
  }
  return mockInterviewQuestion&&(
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
          <h2
            key={index}
            className={`p-2 rounded-full text-xs mmd:text-sm text-center cursor-pointer
              ${activeQuesionIndex === index ? 'bg-blue-800 text-white' : 'bg-secondary text-black'}
            `}
          >
            Question#{index + 1}
          </h2>
        ))}
      </div>
      <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuesionIndex]?.question}</h2>
      <Volume onClick={()=>textToSpeach(mockInterviewQuestion[activeQuesionIndex]?.question)}/>
      <div className='border rounded-lg p-5 bg-blue-100'>
        <h2 className='flex gap-2 items-center text-primary mt-7'>
          <LightbulbIcon/>
          <strong>Node:</strong>
        </h2>
        <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
