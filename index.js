const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Required for Node < 18

const app = express();

// ==== Replace this with your actual Hugging Face API token ====
const HF_API_TOKEN = 'hf_XXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // << your token here

// CORS configuration for your frontend domain
const corsOptions = {
  origin: 'https://delightful-grass-0d007f200.6.azurestaticapps.net',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// POST endpoint to generate story
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
      body: JSON.stringify({
        inputs: `Write a fun children's story (300-400 words) about: ${prompt}`,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Hugging Face API Error:", errorDetails);
      return res.status(500).json({ error: 'Error from Hugging Face API' });
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text || 'Story could not be generated.';

    res.status(200).json({ story: generatedText });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

