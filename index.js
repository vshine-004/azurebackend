const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const corsOptions = {
  origin: 'https://delightful-grass-0d007f200.6.azurestaticapps.net',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const HF_API_KEY = 'your-huggingface-api-key'; // Replace this

app.post('/generate-story', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2';

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("HuggingFace API error:", data);
      return res.status(500).json({ error: data.error || 'HuggingFace API error' });
    }

    const story = data[0]?.generated_text || "No story generated.";
    res.status(200).json({ story });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
