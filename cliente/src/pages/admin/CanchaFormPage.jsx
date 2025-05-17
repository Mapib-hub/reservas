import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCanchas } from '../../context/CanchasContext.jsx';

const CanchaFormPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { createCancha, getCancha, updateCancha } = useCanchas();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null); // Para el archivo de imagen
  const [imagenActualUrl, setImagenActualUrl] = useState(''); // Para mostrar la imagen existente al editar
  const [previewUrl, setPreviewUrl] = useState(''); // Para la vista previa de la nueva imagen seleccionada

  const [errors, setErrors] = useState([]);

  // Lógica para cargar datos si estamos editando (la implementaremos después)
  useEffect(() => {
    const cargarCancha = async () => {
      if (params.id) {
        try {
          const cancha = await getCancha(params.id);
          if (cancha) {
            setNombre(cancha.nombre);
            setDescripcion(cancha.descripcion || '');
            if (cancha.imagen) {
              const imageUrl = cancha.imagen.startsWith('http') ? cancha.imagen : `${import.meta.env.VITE_BACKEND_URL}/uploads/canchas/${cancha.imagen}`;
              setImagenActualUrl(imageUrl);
            } else {
              setImagenActualUrl('');
              setPreviewUrl(''); // Asegurarse de limpiar la vista previa si no hay imagen actual
            }
          } else {
            setErrors(["No se pudo cargar la cancha para editar."]);
          }
        } catch (error) {
          console.error("Error al cargar cancha para editar:", error);
          setErrors(["No se pudo cargar la cancha para editar."]);
        }
      }
      // Limpiar la vista previa si no estamos editando (creando nuevo)
      if (!params.id) {
        setPreviewUrl('');
        setImagenActualUrl('');
      }
    };
    cargarCancha();
    // Limpiar el object URL cuando el componente se desmonte o cambie la imagen
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [params.id, getCancha]); // No añadir previewUrl aquí para evitar bucles


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    if (imagen) { // Si se seleccionó un nuevo archivo de imagen
      formData.append('imagen', imagen);
    }
    // No es necesario enviar imagenActualUrl al backend,
    // el backend decidirá si mantener la imagen antigua o usar la nueva.

    try {
      if (params.id) {
        // updateCancha debe estar preparado para recibir FormData
        await updateCancha(params.id, formData);
      } else {
        // createCancha debe estar preparado para recibir FormData
        await createCancha(formData);
      }
      navigate('/admin/canchas');
    } catch (error) {
      console.error("Error al guardar cancha:", error);
      setErrors(error.response?.data?.message ? [error.response.data.message] : ['Ocurrió un error al guardar la cancha.']);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImagen(e.target.files[0]);
      // Crear URL de vista previa para la nueva imagen
      if (previewUrl) { // Revocar la URL anterior si existe
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
    // Si el usuario cancela la selección de archivo, e.target.files será vacío
  };

  return (
    <div className="admin-form-container">
      <h2>{params.id ? 'Editar Cancha' : 'Crear Nueva Cancha'}</h2>
      {/* Aquí iría el display de errores si los hubiera */}
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre de la Cancha:</label>
          <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
         <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="imagenFile">Imagen de la Cancha:</label>
          <input type="file" id="imagenFile" onChange={handleImageChange} accept="image/*" />
          {/* Mostrar vista previa de la nueva imagen seleccionada */}
          {previewUrl && (
            <div className="image-preview-container" style={{ marginTop: '10px' }}>
              <p>Vista previa de la nueva imagen:</p>
              <img src={previewUrl} alt="Vista previa de la nueva cancha" className="image-preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
          {/* Mostrar imagen actual solo si estamos editando, hay una URL y NO hay una nueva vista previa */}
          {params.id && imagenActualUrl && !previewUrl && (
            <div className="image-preview-container" style={{ marginTop: '10px' }}>
              <p>Imagen actual guardada:</p>
              <img src={imagenActualUrl} alt="Imagen actual de la cancha" className="image-preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
        </div>
        <div className="form-buttons-container">
          <button type="submit" className="form-button">Guardar Cancha</button>
          <button type="button" onClick={() => navigate('/admin/canchas')} className="form-button form-button-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CanchaFormPage;