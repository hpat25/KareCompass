require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const apiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY;

// These keywords let the chat handle "I need a pediatrician"-style questions.
const specialtyKeywords = {
  pediatrics: ["pediatrics", "pediatric", "kids", "children", "child"],
  dental: ["dental", "dentist", "teeth", "tooth", "oral"],
  mental_health: ["mental health", "psychiatry", "psychiatric", "therapy", "therapist", "counseling", "counselling", "behavioral health"],
  womens_health: ["women", "women's health", "womens health", "ob/gyn", "obgyn", "gynecology", "pregnancy", "prenatal"],
  sexual_health: ["sexual health", "sti", "std", "hiv", "testing"],
  primary_care: ["primary care", "family medicine", "family doctor", "general doctor", "general practice"],
  vision: ["vision", "eye", "optometry"],
  immunizations: ["immunization", "vaccine", "vaccination", "shots"],
};

function matchesSpecialty(provider, question) {
  const text = [
    provider.name,
    provider.type,
    ...(Array.isArray(provider.services) ? provider.services : [provider.services]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return Object.values(specialtyKeywords).some((keywords) => {
    const askedForKeyword = keywords.some((keyword) => question.includes(keyword));
    const providerHasKeyword = keywords.some((keyword) => text.includes(keyword));
    return askedForKeyword && providerHasKeyword;
  });
}

function buildSpecialtyContext(providers, question) {
  if (!Array.isArray(providers) || !providers.length) {
    return "";
  }

  const lowered = question.toLowerCase();
  const specialtyMatches = providers
    .filter((provider) => matchesSpecialty(provider, lowered))
    .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
    .slice(0, 5);

  if (!specialtyMatches.length) {
    return "";
  }

  // Keep the provider context short so the response stays readable.
  const summary = specialtyMatches
    .map((provider) => {
      return `- ${provider.name} | estimated cost: $${provider.adjustedCost?.toFixed?.(2) ?? provider.adjustedCost}`;
    })
    .join("\n");

  return `Relevant providers for this question:\n${summary}`;
}

app.post("/ai", async (req, res) => {
  const { provider, providers, question, type, user } = req.body;

  if (!apiKey) {
    res.status(500).json({
      error: "Gemini API key is missing. Add GOOGLE_API_KEY, GEMINI_API_KEY, or API_KEY in server/.env",
    });
    return;
  }

  try {
    // The prompt keeps definition questions and provider questions in one endpoint.
    const prompt = `
You are KareCompass AI.

Question: "${question}"
Type: ${type}

INSTRUCTIONS:
- If type is "definition":
  -> Give a simple, correct definition in 1-2 sentences.
  -> You may define general words, not just healthcare words.
  -> If there are multiple meanings, give the most common one first.
  -> If money values are being outputted, include $ in front.
  -> Example: "A claim is a request sent to an insurance company for payment."

- If type is "provider":
  -> Use provider data to answer.
  -> If the user is asking for a type of doctor or service, give a short, clean recommendation list.
  -> For recommendation lists, only include provider name and estimated cost.
  -> Format recommendation lists as one provider per line.
  -> Do not include raw notes like county, type, score, or services unless the user explicitly asks.

Provider (only use if needed):
Name: ${provider?.name}
Cost: ${provider?.adjustedCost}
Wait time: ${provider?.waitTimeDays}
Score: ${provider?.finalScore}
Insurance: ${user?.insurance || "No insurance selected"}

${buildSpecialtyContext(providers, question)}

Answer clearly and directly.
`;

    const response = await fetch(
      "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Gemini API error" });
    }

    let text = "";

    if (Array.isArray(data)) {
      data.forEach((chunk) => {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (parts) {
          text += parts.map((part) => part.text || "").join("");
        }
      });
    }

    text = text.trim() || "No response from AI.";

    res.json({ text });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
