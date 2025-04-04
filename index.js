// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Use node-fetch v2 if using Node < 18

const app = express();

// Replace this with your actual Hugging Face API token (do not use env here)
const HF_API_TOKEN = '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';

// Allow your frontend URL here
const corsOptions = {
  origin: 'https://delightful-grass-0d007f200.6.azurestaticapps.net', // <- your deployed frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post('/generate-story', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();

    const fullText = data[0]?.generated_text || 'Story could not be generated.';
    const generatedStory = fullText.replace(prompt, '').trim();

    res.status(200).json({ story: generatedStory });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
