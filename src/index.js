import express from 'express';
import dotenv from 'dotenv'
import routes from './http/routes.js'

const port = process.env.PORT || 9999;

const app = express();
dotenv.config();

app.use(express.json());
app.use(routes)


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})