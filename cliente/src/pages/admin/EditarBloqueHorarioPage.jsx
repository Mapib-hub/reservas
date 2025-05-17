import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBloqueHorarios } from '../../context/BloqueHorariosContext.jsx';
import { useCanchas } from '../../context/CanchasContext.jsx';
import BloqueHorarioForm from './BloqueHorarioForm.jsx';

const EditarBloqueHorarioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bloqueHorarios, updateBloqueHorario } = useBloqueHorarios();
  const { canchas } = useCanchas();

  // Busca el bloque por ID
  const bloque = bloqueHorarios.find(bh => bh._id === id);

  if (!bloque) return <p>Cargando datos del bloque...</p>;

  const handleSubmit = (data) => {
    updateBloqueHorario(id, data);
    navigate('/admin/horarios');
  };
console.log(canchas);
  return (
    <div>
      <h2>Editar Bloque de Horario</h2>
      <BloqueHorarioForm
        initialData={bloque}
        canchas={canchas}
        onSubmit={handleSubmit}
        isEdit={true}
      />
    </div>
  );
};

export default EditarBloqueHorarioPage;