import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoti } from '../../context/NoticiaContex.jsx';
import Swal from 'sweetalert2'; // 1. Importar SweetAlert2

const NoticiaFormPage = () => {
  const navigate = useNavigate();
 const { createNoti, getNoti, updateNoti } = useNoti(); 
 const params = useParams(); // Para obtener el :id de la URL

 const [imagePreview, setImagePreview] = useState(null); // Para la URL de previsualización
 
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenActualUrl, setImagenActualUrl] = useState(null); 
  const [imagen, setImagen] = useState(null); 
  const [errors, setErrors] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file); // Guardamos el archivo para enviarlo
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // reader.result es la dataURL para la previsualización
      };
      reader.readAsDataURL(file);
    } else {
      setImagen(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar los datos del formulario
    // y llamar a createNoti o updateNoti
    console.log("Formulario enviado");
    // navigate('/admin/noticias'); // Para redirigir después de crear/editar
    setErrors([]); // Limpiar errores previos

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) {
      formData.append('image', imagen); // 'image' debe coincidir con el nombre esperado en el backend
    }

    try {
      if (params.id) {
        // Estamos editando
        await updateNoti(params.id, formData);
        // 2. Añadir SweetAlert para actualización
        Swal.fire({
          title: '¡Actualizada!',
          text: 'Noticia actualizada con éxito.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Estamos creando
        await createNoti(formData);
        // 3. Añadir SweetAlert para creación
        Swal.fire({
          title: '¡Creada!',
          text: 'Noticia creada con éxito.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
      setTimeout(() => navigate('/admin/noticias'), 2000); // 4. Navegar después de la alerta
    } catch (error) {
      console.error("Error al guardar noticia:", error);
      if (error.response && error.response.data) {
        // Si el backend envía un array de mensajes (como en validateSchema)
        if (Array.isArray(error.response.data)) {
          setErrors(error.response.data);
        } else if (error.response.data.message) {
          // Si el backend envía un objeto con una propiedad 'message' (como en handleMulterError)
          setErrors([error.response.data.message]);
          Swal.fire('Error', error.response.data.message, 'error'); // 5. Mostrar error con SweetAlert
        } else {
          // Si el backend envía algo inesperado
          setErrors(['Ocurrió un error desconocido al guardar la noticia.']);
          Swal.fire('Error', 'Ocurrió un error desconocido al guardar la noticia.', 'error'); // 5. Mostrar error con SweetAlert
        }
      } else {
        // Si no hay respuesta del backend (ej. error de red)
        setErrors(['Ocurrió un error al conectar con el servidor.']);
        Swal.fire('Error', 'Ocurrió un error al conectar con el servidor.', 'error'); // 5. Mostrar error con SweetAlert
      }
    }
  };
useEffect(() => {
    const cargarNoticiaParaEditar = async () => {
      if (params.id) {
        try {
          const noticia = await getNoti(params.id); // Asumimos que getNoticia devuelve la noticia
          if (noticia) {
            setTitulo(noticia.titulo);
            setDescripcion(noticia.descripcion);
            if (noticia.image) {
              // Construimos la URL completa de la imagen actual
              setImagenActualUrl(`${import.meta.env.VITE_BACKEND_URL}/uploads/noticias/${noticia.image}`);
            }
          }
        } catch (error) {
          console.error("Error al cargar noticia para editar:", error);
          setErrors(["No se pudo cargar la noticia para editar."]);
          // Podrías redirigir o mostrar un mensaje más prominente
        }
      }
    };
    cargarNoticiaParaEditar();
  }, [params.id, getNoti]); // Dependencias del useEffect

  return (
    <div className="admin-form-container">
      <h2>{params.id ? 'Editar Noticia' : 'Crear Nueva Noticia'}</h2>
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )} 
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input type="text" id="titulo" name="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripcion:</label>
          <textarea id="descripcion" name="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="5" required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Imagen:</label>
           <input type="file" id="imagen" name="imagen" accept="image/*" onChange={handleImageChange} />
        </div>
        {/* Mostrar imagen actual si estamos editando y no hay previsualización de nueva imagen */}
        {params.id && imagenActualUrl && !imagePreview && (
          <div className="image-preview-container">
            <p>Imagen actual:</p>
            <img src={imagenActualUrl} alt="Imagen actual" className="image-preview" />
          </div>
        )}
        {imagePreview && (
          <div className="image-preview-container">
            <p>Vista previa de la nueva imagen:</p>
            <img src={imagePreview} alt="Vista previa" className="image-preview" />
          </div>
        )}
       <div className="form-buttons-container">
        <button type="submit" className="form-button">Guardar Noticia</button>
          <button type="button" onClick={() => navigate('/admin/noticias')} className="form-button form-button-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default NoticiaFormPage;