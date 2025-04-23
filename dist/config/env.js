"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carga las variables de entorno desde el archivo .env
exports.config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || '', // Agrega la API Key de OpenAI
    GENERIC_API_KEY: process.env.GENERIC_API_KEY || '', // Agrega la API Key de Gemini
};
