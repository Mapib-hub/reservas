// En file:///usr/src/app/src/db.js
import mongoose from "mongoose";

export const conectDB = async () => {
    try {
        const uriToConnect = process.env.MONGODB_URI; // O como la estés obteniendo
        console.log("Intentando conectar a MongoDB con URI:", uriToConnect); // <--- AÑADE ESTO
        await mongoose.connect(uriToConnect);
        console.log(">>> DB Conectada");
    } catch (error) {
        console.error("Error al conectar a la DB:", error);
        // Es importante relanzar el error o manejarlo para que el proceso falle si no puede conectar
        throw error; 
    }
};
