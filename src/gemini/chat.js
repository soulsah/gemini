import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'

dotenv.config();

const gemini = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  let chat = req.body.prompt;

  async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(chat);
    const response = await result.response;
    const text = response.text();
    res.status(200).send(text);
  }
  await run();
};

export default gemini;
