
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import openai from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openAI = new openai("hsajhsj");

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openAI.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${prompt}`,
      temperature: 0, // Higher values mean the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });



    // res.status(200).send({
    //   bot: response.data.choices[0].text
    // });

    if (response && response.choices && response.choices.length > 0 && response.choices[0].text) {
      // Extract the response text from the choices array
      const botResponse = response.choices[0].text;
          // const points = botResponse.split('\n');
      // Send the bot response back to the client
      res.status(200).send({ bot: botResponse });
  } else {
      // If the response is invalid or empty, send an error response
      res.status(500).send({ error: "Invalid or empty response from OpenAI API" });
  }

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`AI server started on http://localhost:${PORT}`));

