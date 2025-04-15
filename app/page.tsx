"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Erreur :", error);
      setResult({ toxicity: 0, summary: "Impossible d’analyser pour le moment." });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-pink-600">Toxic or Not 💔</h1>
      <p className="text-center text-gray-600 mb-6">Décris ton crush ou ta relation… l’IA te dira s’il est sain ou toxique.</p>
      <Textarea
        rows={6}
        placeholder="Ex : Il m’écrit que la nuit, il répond jamais quand je propose un date, mais il me dit qu’il m’adore…"
        className="mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700">
        {loading ? <><Loader2 className="animate-spin mr-2" /> Analyse en cours...</> : "Analyser"}
      </Button>

      {result && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <p className="text-lg font-semibold mb-2">📊 Toxicité : <span className="text-red-500 font-bold">{result.toxicity}/100</span></p>
            <p className="text-gray-800 whitespace-pre-line">{result.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
