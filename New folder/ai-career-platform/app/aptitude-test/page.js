"use client";

import QuizComponent from "../../components/QuizComponent";

export default function AptitudeTest(){

  const questions=[
    {
      question:"What is 2+2?",
      options:[
        {text:"3",correct:false},
        {text:"4",correct:true},
        {text:"5",correct:false}
      ]
    }
  ];

  return(
    <div className="p-6">

      <h1 className="text-2xl mb-4">
        Aptitude Test
      </h1>

      <QuizComponent questions={questions}/>

    </div>
  );
}