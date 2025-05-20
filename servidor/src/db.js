// En file:///usr/src/app/src/db.js
import mongoose from "mongoose";

export const conectDB = async () => {
    try {
        const uriToConnect = process.env.MONGODB_URI || "mongodb://localhost/reservas_fallback"; // Usar variable de entorno o un fallback
        await mongoose.connect(uriToConnect);
        console.log(">>> Base de datos conectada a:", uriToConnect);
    } catch (error) {
        console.error("Error al conectar a la DB:", error);
        // Es importante relanzar el error o manejarlo para que el proceso falle si no puede conectar
        throw error; 
    }
};
