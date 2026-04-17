"use client";
import { useState } from "react";

export default function RatingComponent({ onSubmit, label = "Rate your experience" }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating) return;
    onSubmit && onSubmit({ rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-gray-800">Thanks for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex gap-1">
        {[1,2,3,4,5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(s)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <svg
              className={`w-8 h-8 transition-colors ${s <= (hover || rating) ? "text-amber-400" : "text-gray-200"}`}
              fill="currentColor" viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 self-center text-sm text-gray-500">
          {rating > 0 ? ["","Poor","Fair","Good","Very Good","Excellent"][rating] : "Select rating"}
        </span>
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback (optional)…"
        className="input-field resize-none h-20 text-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={!rating}
        className="btn-primary w-full"
      >
        Submit Rating
      </button>
    </div>
  );
}
