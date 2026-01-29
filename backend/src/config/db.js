// Conexion moongoose a la base de datos
import moongoose from 'mongoose';
import { MONGODB_URI } from './env.js';

export const connectDB = async () => {
    try {
        await moongoose.connect(MONGODB_URI);
        console.log('Conexion a la base de datos exitosa');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

export const insertSampleData = async (model, sampleData) => {
    try {
        await model.insertMany(sampleData);
        console.log('Datos de muestra insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos de muestra:', error);
    }
};

export const getAllAcuerdos = async (model) => {
    try {
        return await model.find({});
    } catch (error) {
        console.error('Error al obtener los acuerdos:', error);
        return [];
    }
};