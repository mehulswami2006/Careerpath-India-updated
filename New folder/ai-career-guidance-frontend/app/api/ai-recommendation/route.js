import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function POST(req) {

  const { answers } = await req.json();

  const completion = await client.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      {
        role: "user",
        content: `Suggest careers for a student with interests: ${answers}`
      }
    ]
  });

  return Response.json({
    result: completion.choices[0].message.content
  });
}
