const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');  // Make sure to install node-fetch

// Initialize express app
const app = express();
const corsOptions = {
  origin: 'https://delightful-grass-0d007f200.6.azurestaticapps.net', // Specify the exact domain
  methods: ['GET', 'POST'], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
};

// Use CORS with the specified options
app.use(cors(corsOptions));
// Middleware setup
app.use(bodyParser.json());  // To parse JSON request bodies

// HuggingFace API setup
const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2'; // Or another model, like GPT-3 or GPT-Neo
const HF_API_KEY = 'your-huggingface-api-key';  // Replace with your HuggingFace API key

// POST endpoint to generate the story
app.post('/generate-story', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    // Prepare the payload to send to HuggingFace API
    const payload = {
      inputs: prompt,  // Use the prompt from the frontend
    };

    // Make a POST request to HuggingFace API
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    // The result from HuggingFace API
    const generatedStory = data[0]?.generated_text || 'No story generated.';

    // Respond with the generated story
    res.status(200).json({ story: generatedStory });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

