// app.js

import express from 'express';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors'

const app = express();

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 9999
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let chatHistory = [];

app.get('/chat', (req, res) => {
  res.json(chatHistory);
});

app.post('/chat', async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  model.startChat()
  const userMessage = req.body.message;
  const result = await model.generateContentStream(userMessage, {
    context: {
      chatHistory
    }
  });

  chatHistory.push({ type: 'user', message: userMessage });
  const aiMessage = await result.response;
  chatHistory.push({ type: 'ai', message: aiMessage.text() });

  console.log(chatHistory)

  res.json({ success: true, message: aiMessage.text() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});