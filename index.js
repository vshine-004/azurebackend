const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Middleware setup
app.use(cors());  // Allows all origins (you can modify this if needed)
app.use(bodyParser.json());  // To parse JSON request bodies

// POST endpoint to generate the story
app.post('/generate-story', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    // For now, we simulate the generation of a story
    // Replace this logic with actual API call to HuggingFace or any other service
    const generatedStory = `Once upon a time, in a faraway land, there was a hero who loved to ${prompt}. The end!`;

    // Respond with the generated story
    res.status(200).json({ story: generatedStory });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});