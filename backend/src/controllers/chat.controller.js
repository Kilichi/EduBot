// Lógica de los endpoints de la api del chat

import * as contextBuilder from '../services/contextBuilder.service.js';
import Acuerdo from '../models/acuerdo.model.js';
import { buildStructure } from '../services/structBuilder.service.js';

// 1. CHAT DE CONSULTA (Responder preguntas basadas en la DB)
export const consultar = async (req, res) => {
    try {
        const { prompt } = req.body; // La pregunta del usuario
        if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

        const respuesta = await contextBuilder.queryAcuerdos(prompt);
        res.json({ respuesta });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. CHAT DE REGISTRO - FASE 1: PREVIEW (Convertir texto a JSON)
export const previewRegistro = async (req, res) => {
    try {
        const { text } = req.body;
        const propuestaAcuerdo = await buildStructure(text); 
        res.json(propuestaAcuerdo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. CHAT DE REGISTRO - FASE 2: CONFIRM (Guardar en MongoDB)
export const confirmRegistro = async (req, res) => {
    try {
        console.log("Datos recibidos para guardar:", req.body); // <-- Pon este log
        
        const nuevoAcuerdo = new Acuerdo(req.body);
        const guardado = await nuevoAcuerdo.save();
        
        console.log("Resultado en BD:", guardado); // <-- Si esto sale, se guardó
        
        res.status(201).json({ 
            message: "Acuerdo registrado con éxito", 
            data: guardado 
        });
    } catch (error) {
        console.error("ERROR AL GUARDAR:", error.message);
        res.status(400).json({ error: error.message });
    }
};