import axios from 'axios';
import { OLLAMA_BASE_URL, OLLAMA_MODEL } from '../config/env.js';

/**
 * Servicio de comunicación con el LLM local (Ollama)
 * Interfaz lógica: generate(prompt) -> string
 */

export const generate = async (prompt) => {
    try {
        const url = `${OLLAMA_BASE_URL}/api/chat`;
        const response = await axios.post(url, {
            model: OLLAMA_MODEL,
            messages: [
                { role: 'system', content: 'Eres un asistente escolar experto y te llamas Manuel.' },
                { role: 'user', content: prompt }
            ],
            stream: false
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 120000
        });

        return response.data.message?.content ?? '';
    } catch (error) {
        console.error('Error al conectar con Ollama:', error.response?.data ?? error.message);
        throw new Error('Error al conectar con el cerebro de la IA. Asegúrate de que Ollama esté en ejecución y el modelo esté disponible.');
    }
};
