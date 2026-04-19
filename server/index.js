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

app.post("/ai", async (req, res) => {
  const { provider, question, type } = req.body;

  if (!apiKey) {
    res.status(500).json({
      error: "Gemini API key is missing. Add GOOGLE_API_KEY, GEMINI_API_KEY, or API_KEY in server/.env",
    });
    return;
  }

  try {
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

Provider (only use if needed):
Name: ${provider?.name}
Cost: ${provider?.adjustedCost}
Wait time: ${provider?.waitTimeDays}
Score: ${provider?.finalScore}

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
