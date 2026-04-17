"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  { text: "I enjoy solving complex puzzles.", category: "logical" },
  { text: "I like coding or understanding software.", category: "logical" },
  { text: "Mathematics is one of my favorite subjects.", category: "logical" },

  { text: "I enjoy analyzing data or patterns.", category: "analytical" },
  { text: "I like researching how things work.", category: "analytical" },
  { text: "I enjoy science experiments.", category: "analytical" },

  { text: "I enjoy drawing or designing things.", category: "creative" },
  { text: "I like thinking of new ideas.", category: "creative" },
  { text: "I enjoy creating digital content.", category: "creative" },

  { text: "I enjoy helping people.", category: "social" },
  { text: "I enjoy teaching concepts.", category: "social" },
  { text: "I enjoy teamwork.", category: "social" },

  { text: "I am curious about AI and technology.", category: "tech" },
  { text: "I enjoy building or fixing things.", category: "tech" },
  { text: "I like learning new software tools.", category: "tech" }
];

export default function QuizPage() {

  const router = useRouter();
  const [answers, setAnswers] = useState({});

  const handleChange = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value
    });
  };

  const submitTest = () => {

    const scores = {
      logical: 0,
      analytical: 0,
      creative: 0,
      social: 0,
      tech: 0
    };

    questions.forEach((q, index) => {
      const score = Number(answers[index] || 0);
      scores[q.category] += score;
    });

    localStorage.setItem("aptitudeScores", JSON.stringify(scores));

    router.push("/recommendations");
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Aptitude & Interest Test
      </h1>

      {questions.map((q, index) => (
        <div key={index} className="bg-white p-4 rounded shadow mb-4">

          <p className="mb-3">{q.text}</p>

          <select
            className="border p-2 rounded"
            onChange={(e) => handleChange(index, e.target.value)}
          >
            <option value="">Select</option>
            <option value="1">1 - Strongly Disagree</option>
            <option value="2">2</option>
            <option value="3">3 - Neutral</option>
            <option value="4">4</option>
            <option value="5">5 - Strongly Agree</option>
          </select>

        </div>
      ))}

      <button
        onClick={submitTest}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Get Career Recommendations
      </button>

    </div>
  );
}
