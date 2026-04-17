// 🔥 ADDED: Import your existing careers database
import { careers } from '../data/careers'; 

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
// Note: You have 2.5-flash here. If you hit the 429 Quota error again, 
// remember to change this back to 2.0-flash!
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

// 🔥 Define the exact JSON structure we demand from the API
const careerSchema = {
  type: "ARRAY",
  description: "A list of exactly 6 career recommendations.",
  items: {
    type: "OBJECT",
    properties: {
      name: { type: "STRING" },
      category: { type: "STRING" },
      reason: { type: "STRING", description: "Why this career suits the student's aptitude scores" },
      matchScore: { type: "INTEGER" },
      salaryRange: { type: "STRING" },
      topSkills: { 
        type: "ARRAY", 
        items: { type: "STRING" } 
      },
      topColleges: { 
        type: "ARRAY", 
        items: { type: "STRING" } 
      },
      icon: { type: "STRING", description: "A single unicode emoji" }
    },
    required: ["name", "category", "reason", "matchScore", "salaryRange", "topSkills", "topColleges", "icon"]
  }
};

// 🔥 ADDED: Extract just the names into a comma-separated string
const validCareerNames = careers.map(c => c.name).join(", ");

export async function getAICareerRecommendations(aptitudeResult) {
  const { overall, sectionScores } = aptitudeResult;

  // 🔥 ADDED: The CRITICAL RULE and validCareerNames are injected at the end of the prompt
  const prompt = `Generate exactly 6 career recommendations for an Indian student based on these aptitude scores:
Overall: ${overall}
Logical: ${sectionScores['Logical Reasoning'] ?? 0}
Math: ${sectionScores['Mathematics'] ?? 0}
Science: ${sectionScores['Science'] ?? 0}
Coding: ${sectionScores['Coding'] ?? 0}
Communication: ${sectionScores['Communication'] ?? 0}

CRITICAL RULE:
You MUST ONLY select career "name"s from this exact list. Do not invent new careers, combine names, or alter the spelling. Choose the 6 best matches from here:
${validCareerNames}`;

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 8000, // Maximum headroom so it never cuts off
        responseMimeType: "application/json",
        responseSchema: careerSchema, // Pass the schema directly to the API
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini FULL ERROR:", err);
    throw new Error("Gemini API request failed");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty response from Gemini");

  try {
    // Because we used responseSchema, the text is GUARANTEED to be 
    // a clean, perfectly formatted JSON string. No `.replace()` hacks needed!
    return JSON.parse(text);
  } catch (err) {
    console.error("RAW TEXT FAILED TO PARSE:", text);
    throw new Error("Invalid JSON from Gemini");
  }
}