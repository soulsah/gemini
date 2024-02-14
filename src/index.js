// app.js

import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

const app = express();

app.use(bodyParser.json());
dotenv.config();

const port = process.env.PORT || 9999
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let chatHistory = [];

app.get('/chat', (req, res) => {
  res.json(chatHistory);
});

app.post('/chat', async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const userMessage = req.body.message;
  const result = await model.generateContentStream(userMessage, {
    context: {
      chatHistory
    }
  });

  chatHistory.push({ type: 'user', message: userMessage });
  const aiMessage = await result.response;
  chatHistory.push({ type: 'ai', message: aiMessage });

  res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});