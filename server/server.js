import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';  // Keep the import as is

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Use your API key from the environment variable
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({  // Updated method to call for chat completion
      model: "gpt-3.5-turbo",  // Ensure you're using the correct model
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.choices[0].message.content.trim()  // Adjusted to get the correct content
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message || 'Something went wrong' });  // Improved error handling
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`AI server started on http://localhost:${PORT}`));
