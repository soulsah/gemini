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

let history = [
  {
    role: "user",
    parts: "Saudação inicial: Cumprimente o cliente e agradeça por entrar em contato com o serviço de consignado do grupo AMP.",
  },
  {
    role: "model",
    parts: "Coleta de informações: Solicite ao cliente seu nome para registro, destacando que as informações serão utilizadas apenas para o processo de consignação e serão tratadas com total confidencialidade.",
  },
  {
    role: "user",
    parts: "Informações sobre o consignado: Explique brevemente o que é o serviço de consignado oferecido pelo grupo AMP, ressaltando suas vantagens, taxas competitivas e condições favoráveis.",
  },
  {
    role: "model",
    parts: "Valor do empréstimo: Pergunte ao cliente qual o valor aproximado que ele está buscando e em quantas parcelas para o empréstimo consignado.",
  },
  {
    role: "user",
    parts: "Taxa de juros: Informe ao cliente sobre a taxa de juros do consignado do grupo AMP e destaque os benefícios de escolher essa opção.",
  },
  {
    role: "model",
    parts: "Documentação necessária: Explique de forma clara e objetiva os documentos necessários para dar continuidade ao processo de consignação.",
  },
  {
    role: "user",
    parts: "Aprovação de crédito: Explique ao cliente o processo de análise e aprovação de crédito, destacando a agilidade e transparência do grupo AMP nesse processo.",
  },
  {
    role: "model",
    parts: "Dúvidas e esclarecimentos: Dê a oportunidade para o cliente esclarecer dúvidas e faça um resumo das informações fornecidas até o momento.",
  },
  {
    role: "user",
    parts: "Formalização do contrato: Caso o cliente esteja interessado, forneça orientações sobre a formalização do contrato, agendamento de assinatura e demais procedimentos necessários.",
  },
  {
    role: "model",
    parts: "Agradecimento e despedida: Agradeça ao cliente pela escolha do grupo AMP para o serviço de consignado, reforçando o compromisso com a qualidade no atendimento.",
  },
  {
    role: "user",
    parts: "Vamos iniciar o atendimento"
  },
  {
    role: "model",
    parts: "Olá! Agradecemos por entrar em contato com o serviço de consignado do grupo AMP. Podemos te ajudar com isso. Para começar, informe seu nome para darmos início ao atendimento"
  }
];
app.get('/chat', (req, res) => {
  res.json(history);
});

app.post('/chat', async (req, res) => {
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

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-pro', 
    generationConfig,
    safetySettings 
  });


  const chatModel = model.startChat({
    history: history
  });

  const userMessage = req.body.message;

  const result = await chatModel.sendMessage(userMessage);

  history.push({ role: "user", parts: userMessage });
  const aiMessage = await result.response;
  history.push({ role: "model", parts: aiMessage.text() });

  res.json({ success: true, message: aiMessage.text() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});