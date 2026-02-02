import { generate } from './llm.service.js';

/**
 * Servicio para estructurar texto libre en un objeto de Acuerdo escolar.
 * Responsabilidad: Crear el prompt de sistema y parsear la respuesta a JSON.
 */

export const buildStructure = async (rawText) => {
    const prompt = `
        Te llamas manuel,
        Eres un asistente experto en gestión documental escolar. 
        Tu tarea es extraer un acuerdo de una reunión a partir del siguiente texto:
        "${rawText}"

        Debes devolver EXCLUSIVAMENTE un objeto JSON con esta estructura exacta:
        {
            "fecha": "DD/MM/AAAA",
            "titulo": "Título breve del acuerdo",
            "descripcion": "Explicación detallada de lo acordado",
            "etiquetas": ["etiqueta1", "etiqueta2"],
            "origen": "Tipo de reunión (ej: Claustro, CCP, Departamento)"
        }

        REGLAS CRÍTICAS:
        1. Responde ÚNICAMENTE con el objeto JSON.
        2. No incluyas explicaciones, ni introducciones, ni bloques de código markdown.
        3. Si no conoces la fecha, usa la fecha actual.
        4. Las etiquetas deben ser palabras clave relevantes.
        5. Si te preguntan como te llamas dirás tu nombre
    `;

    try {
        const response = await generate(prompt);
        
        const jsonStart = response.indexOf('{');
        const jsonEnd = response.lastIndexOf('}') + 1;
        const jsonString = response.substring(jsonStart, jsonEnd);

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error al estructurar el acuerdo:", error);
        throw new Error("La IA no pudo formatear el texto. Revisa el formato de entrada.");
    }
};