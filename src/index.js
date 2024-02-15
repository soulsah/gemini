// app.js

import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 9999;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let chatHistory = [];

app.get('/chat', (req, res) => {
  res.json(chatHistory);
});

app.post('/chat', async (req, res) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  console.log(chatHistory)
  model.startChat({
    generationConfig,
    safetySettings,
    history: chatHistory
  });

  const userMessage = req.body.message;

  const result = await model.generateContentStream(userMessage);

  chatHistory.push({ role: "user", parts: userMessage });
  const aiMessage = await result.response;
  chatHistory.push({ role: "model", parts: aiMessage.text() });

  res.json({ success: true, message: aiMessage.text() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});