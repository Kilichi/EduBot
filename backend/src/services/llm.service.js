import axios from 'axios';

/**
 * Servicio de comunicación con el LLM
 * Interfaz lógica: generate(prompt) -> string 
 */

export const generate = async (prompt) => {
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Eres un asistente escolar experto. y te llamas manuel" },
                { role: "user", content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        // Log para ver EXACTAMENTE qué dice la API sobre el error 400
        console.error("Detalle del error 400:", error.response?.data);
        throw new Error("Error al conectar con el cerebro de la IA");
    }
};