import axios from 'axios';

/**
 * Servicio de comunicación con el LLM
 * Interfaz lógica: generate(prompt) -> string 
 */

export const generate = async (prompt) => {
    try {
        // 1. Asegúrate de que la URL termine en /api/generate
        const URL = 'http://localhost:11434/api/generate';
        
        // 2. Asegúrate de que sea axios.POST
        const response = await axios.post(URL, {
            model: 'gemma3', // O el modelo que tengas (ej. 'llama3.1')
            prompt: prompt,
            stream: false
        });

        return response.data.response;

    } catch (error) {
        // Si aquí te sale 405, es que la URL está mal escrita
        console.error("Error detallado:", error.response?.status, error.message);
        throw new Error("Error de comunicación con el motor de IA");
    }
};