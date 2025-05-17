import mongoose from "mongoose"

const noticiaSchema = new mongoose.Schema({
    titulo:{
        type: String,
        require: true
        
    },
    descripcion:{
        type: String,
        require: true
    },
    image:{
        type: String,
        default: "noticia.jpg"
    }    
}, {
    timestamps:true
})

export default mongoose.model('Noticia', noticiaSchema)