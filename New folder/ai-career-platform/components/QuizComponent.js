"use client";

import { useState } from "react";

export default function QuizComponent({questions}){

  const [score,setScore]=useState(0);

  const answer=(correct)=>{
    if(correct) setScore(score+1);
  };

  return(
    <div>

      {questions.map((q,i)=>(
        <div key={i}>

          <h3>{q.question}</h3>

          {q.options.map((opt,j)=>(
            <button
              key={j}
              onClick={()=>answer(opt.correct)}
              className="border p-2 m-2"
            >
              {opt.text}
            </button>
          ))}

        </div>
      ))}

      <h3>Score: {score}</h3>

    </div>
  );
}