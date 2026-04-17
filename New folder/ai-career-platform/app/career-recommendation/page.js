"use client";

import { api } from "../../services/api";
import { useEffect,useState } from "react";

export default function CareerRecommendation(){

  const [careers,setCareers]=useState([]);

  useEffect(()=>{

    api("/api/career/recommend","POST")
      .then(setCareers);

  },[]);

  return(
    <div className="p-6">

      <h1 className="text-2xl mb-6">
        AI Career Recommendations
      </h1>

      {careers.map((c,i)=>(
        <div key={i} className="border p-4 mb-3">
          {c.title}
        </div>
      ))}

    </div>
  );
}