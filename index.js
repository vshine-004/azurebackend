const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const HUGGING_FACE_API_TOKEN = "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"; // Add your Hugging Face API token

// Endpoint to generate story using Hugging Face
app.post("/generate-story", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HUGGING_FACE_API_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: `Write a fun, detailed, and simple children's story (about 300-400 words) in easy English. Do not include this prompt in the story. Story topic: ${prompt}`,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.8,
          top_p: 0.9,
          do_sample: true,
        }
      }),
    });

    const data = await response.json();
    const story = data[0]?.generated_text || "No story generated.";

    res.status(200).json({ story });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
