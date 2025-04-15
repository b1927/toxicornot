import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { description } = await req.json();

  const prompt = `
Tu es une analyste experte en relations hommes-femmes. Une femme vient de te décrire une rencontre ou une relation avec un homme.

Tu dois :
- Identifier les signes de toxicité, de manipulation, d’instabilité ou au contraire de sincérité
- Donner un résumé clair de la situation
- Donner un score de toxicité masculine entre 0 et 100
- Ajouter un conseil franc et utile, comme une amie qui veut son bien

Voici sa description :
"${description}"

Réponds uniquement au format JSON :
{
  "toxicity": [nombre entre 0 et 100],
  "summary": "Résumé + conseil"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content || "{}";
    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ toxicity: 0, summary: "Erreur pendant l’analyse." }, { status: 500 });
  }
}
