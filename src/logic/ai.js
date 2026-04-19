export async function getAIExplanation(provider, providers, user, question, type) {
  const res = await fetch("http://localhost:5001/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider,
      providers,
      user,
      question,
      type
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "KareCompass AI request failed");
  }

  return data.text;
}
