import mongoose from "mongoose";

export const conectDB = async () =>{
    try {
        await mongoose.connect("mongodb://localhost/reservas");
        console.log(">>> Base de datos conectada");
    } catch (error) {
        console.log(error);
    }
};