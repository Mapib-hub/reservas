import React, { useEffect } from 'react';
import { useCanchas } from '../../context/CanchasContext.jsx'; 

const TarifasPage = () => {
     const { canchas, loading, error, getCanchas } = useCanchas();
      useEffect(() => {
             // Asegurarnos de que las canchas se cargan si aún no lo han hecho
             // o si queremos recargarlas cada vez que se visita la página.
             // Si el CanchasContext ya carga las canchas al inicio, esto podría ser redundante
             // o servir para una recarga explícita. Por ahora, lo dejamos para asegurar la carga.
             getCanchas();
         }, []);
          if (loading) {
        return <div className="canchas-page-loading">Cargando canchas...</div>;
    }

    if (error) {
        return <div className="canchas-page-error">Error al cargar las canchas: {error}</div>;
    }
  return (
     <div className="canchas-page-container">
      <h1>Tarifas</h1>
       
      <div className="canchas-list">
        {canchas.map((cancha) => (  
        <div key={cancha._id} className="cancha-card">
            <h2 className='tit_card_front'>{cancha.nombre}</h2>
          <div className="cancha-card-content">
            <h3>Tarifa 15.000.-</h3>
            <p><strong>Descripción:</strong><br />
             Lunes a Jueves 
             de 18:00 a 23:00 hrs.</p>
          </div>
          <div className="cancha-card-content">
            <h3>Tarifa 20.000.-</h3>
            <p><strong>Descripción:</strong><br />
            Viernes de 18:00 a 23:00hrs.</p>
          </div>
          <div className="cancha-card-content">
            <h3>Tarifa 25.000.-</h3>
            <p><strong>Descripción:</strong><br />
            Sabado y Domingo
            de 09:00 a 22:00 hrs.</p>
          </div>
        </div>
       ))}
       
      
      </div>
      
     
    </div>
  );
}
export default TarifasPage;