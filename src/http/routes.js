import Router from 'express';
import chat from '../gemini/chat.js';

const routes = Router();

routes.post('/', chat);

export default routes;