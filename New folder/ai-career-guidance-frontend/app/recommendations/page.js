"use client";

import { useEffect, useState } from "react";

export default function RecommendationPage() {

  const [careers, setCareers] = useState([]);

  useEffect(() => {

    const scores = JSON.parse(localStorage.getItem("aptitudeScores"));

    if (!scores) return;

    if (scores.tech + scores.logical > 20) {
      setCareers([
        "Software Engineer",
        "AI Engineer",
        "Cybersecurity Specialist"
      ]);
    }
    else if (scores.creative > 15) {
      setCareers([
        "Graphic Designer",
        "UX Designer",
        "Architect"
      ]);
    }
    else if (scores.social > 15) {
      setCareers([
        "Teacher",
        "Psychologist",
        "HR Manager"
      ]);
    }
    else {
      setCareers([
        "Business Analyst",
        "Entrepreneur",
        "Marketing Specialist"
      ]);
    }

  }, []);

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Recommended Careers
      </h1>

      {careers.map((career, index) => (
        <div key={index} className="bg-white p-5 rounded-lg shadow-md mb-4 border border-gray-200">

          {career}
        </div>
      ))}

    </div>
  );
}
