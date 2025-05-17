import React, { useState } from 'react';

const ContactoPage = () => {
  // Datos simulados
  const datosContacto = {
    direccion: "Av. Siempre Viva 742, Springfield",
    telefono: "+56 9 1234 5678",
    email: "contacto@canchasdeportivas.com",
    horario: "Lunes a Viernes: 09:00 - 18:00 hrs."
  };

  // Coordenadas genéricas para el mapa (puedes cambiarlas por las de tu ciudad o una ubicación de ejemplo)
  // Por ejemplo, Plaza de Armas, Santiago, Chile
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.2839999999997!2d-70.6505!3d-33.442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a9a4f9a5c9%3A0x69a1f19c2a89e6a!2sPlaza%20de%20Armas%2C%20Santiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1678886400000!5m2!1ses-419!2scl";

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora, solo mostramos los datos en la consola
    console.log("Datos del formulario:", formData);
    alert("Mensaje enviado (simulación). Revisa la consola.");
    // Aquí podrías limpiar el formulario si quisieras
    // setFormData({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <>
      
      <div className="contacto-page-container">
        <h1>Contáctanos</h1>

        <div className="contacto-layout">
          <div className="info-contacto-wrapper">
            <div className="info-contacto">
              <h2>Información de Contacto</h2>
              <p><strong>Dirección:</strong> {datosContacto.direccion}</p>
              <p><strong>Teléfono:</strong> {datosContacto.telefono}</p>
              <p><strong>Email:</strong> <a href={`mailto:${datosContacto.email}`}>{datosContacto.email}</a></p>
              <p><strong>Horario de Atención:</strong> {datosContacto.horario}</p>
            </div>
          </div>

          <div className="mapa-wrapper">
            <div className="mapa-container">
              <h2>Nuestra Ubicación</h2>
              <iframe
                src={mapEmbedUrl}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del Recinto"
              ></iframe>
            </div>
          </div>

          <div className="formulario-wrapper">
            <div className="formulario-inner-content"> {/* Cambiado de formulario-contacto para evitar conflicto de estilos si se usa globalmente */}
              <h2>Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="nombre">Nombre:</label>
                  <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="mensaje">Mensaje:</label>
                  <textarea id="mensaje" name="mensaje" value={formData.mensaje} onChange={handleChange} rows="5" required></textarea>
                </div>
                <button type="submit" className="login-button" style={{ width: 'auto', padding: '10px 20px' }}>Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactoPage;