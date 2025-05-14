import dotenv from 'dotenv';

dotenv.config();  // Carga las variables de entorno desde el archivo .env

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '', // Agrega la API Key de OpenAI
  GENERIC_API_KEY: process.env.GENERIC_API_KEY || '', // Agrega la API Key de Gemini
};
