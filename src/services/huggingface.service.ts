import { config } from '../config/env';
import { HfInference } from '@huggingface/inference';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { log } from 'console';

const hf = new HfInference(config.HUGGINGFACE_API_KEY);  // Usamos la API Key de Hugging Face

export class HuggingFaceService {  // Renombramos la clase a HuggingFaceService
  static async analyzeEmotion(text: string): Promise<string> {
    console.log('Hugging Face API Key:', config.HUGGINGFACE_API_KEY);

    try {
      // Usamos el modelo para análisis de sentimientos, puedes usar otro modelo según el caso
      const response = await hf.textClassification({
        model: 'tabularisai/multilingual-sentiment-analysis', // Modelo para análisis de sentimiento
        inputs: text, // El texto a analizar
      });

      // El modelo devolverá una etiqueta, que puede ser 'POSITIVE' o 'NEGATIVE'
      interface TextGenerationResponse {
        label: string;
      }
      const emotion = (response[0] as TextGenerationResponse)?.label;  // Accedemos a la etiqueta de la respuesta
      if (!emotion) {
        throw new Error('No emotion detected');
      }

      return emotion;  // Regresamos la emoción detectada (positivo o negativo)
    } catch (error) {
      console.error('Error al llamar a la API de Hugging Face:', error);
      throw new Error('HUGGINGFACE_ERROR');  // Cambiamos el nombre del error a HUGGINGFACE_ERROR
    }
  }
}
