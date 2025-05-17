import React from "react";

// Recibe como prop el array de bloques horarios
const HorariosGlobales = ({ bloques }) => {
  // Días de la semana
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Agrupar bloques por día de la semana
  const bloquesPorDia = bloques.reduce((acc, bloque) => {
    const dia = bloque.dia_semana;
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(bloque);
    return acc;
  }, {});

  return (
    <div>
      <h2>Horarios Globales de Canchas</h2>
      {Object.keys(bloquesPorDia)
        .sort((a, b) => a - b) // Ordenar días
        .map((dia) => (
          <div key={dia} style={{ marginBottom: "2rem" }}>
            <h3>{diasSemana[dia]}</h3>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cancha Asignada</th>
                </tr>
              </thead>
              <tbody>
                {bloquesPorDia[dia]
                  .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                  .map((bloque) => (
                    <tr key={bloque._id}>
                      <td>{bloque.hora_inicio} - {bloque.hora_fin}</td>
                      <td>
                        {bloque.cancha_id && bloque.cancha_id.nombre
                          ? bloque.cancha_id.nombre
                          : "❌ No asignada"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default HorariosGlobales;
