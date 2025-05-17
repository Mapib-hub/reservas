import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    image:{
        type: String,
        default: "perfil.jpg",
    },  
    role: { // <-- Nuevo campo para el rol
        type: String,
        enum: ['user', 'admin'], // Valores permitidos
        default: 'user', // Por defecto, un nuevo usuario es 'user'
        required: true
    }  
}, {
    timestamps:true
})

export default mongoose.model('User', userSchema)