// Aqui el modelo construiremos contexto necesario para las respuestas
import Acuerdo from '../models/acuerdo.model.js';
import { generate } from './llm.service.js';

/**
 * Servicio para consultar acuerdos usando lenguaje natural.
 * Responsabilidad: Buscar en DB, construir el contexto y pedir respuesta al LLM.
 */
export const queryAcuerdos = async (userQuery) => {
    try {
        // 1. .lean() transforma los documentos pesados de Mongoose en objetos JS simples
        // 2. .select() trae solo lo necesario para ahorrar memoria
        const acuerdos = await Acuerdo.find().select('fecha titulo descripcion origen').lean();

        if (!acuerdos || acuerdos.length === 0) {
            return "No hay acuerdos en la base de datos.";
        }

        // Construimos el contexto de forma segura
        const contextoAcuerdos = acuerdos.map(a => 
            `ACUERDO: Fecha: ${a.fecha} | Título: ${a.titulo} | Descripción: ${a.descripcion} | Origen: ${a.origen}`
        ).join('\n---\n');

        const prompt = `
            Eres un asistente escolar. Responde a la pregunta basándote SOLO en estos acuerdos:
            ${contextoAcuerdos}
            
            PREGUNTA: "${userQuery}"
        `;
        
        return await generate(prompt);

    } catch (error) {
        console.error("Error en contextBuilder:", error.message);
        throw new Error("Error procesando la base de datos.");
    }
};