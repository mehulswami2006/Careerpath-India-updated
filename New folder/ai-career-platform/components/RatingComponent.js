"use client";

import { useState } from "react";

export default function RatingComponent(){

  const [rating,setRating]=useState(0);

  return(
    <div className="flex space-x-2">

      {[1,2,3,4,5].map(star=>(
        <button
          key={star}
          onClick={()=>setRating(star)}
          className={star<=rating ? "text-yellow-400":"text-gray-400"}
        >
          ★
        </button>
      ))}

    </div>
  );
}