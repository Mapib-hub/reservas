/**
 * Formatea una cadena de fecha o un objeto Date a un formato legible.
 * @param {string | Date} dateString - La fecha a formatear.
 * @param {boolean} includeTime - Si es true, incluye la hora en el formato.
 * @returns {string} La fecha formateada, o una cadena vacía si la entrada no es válida.
 */
export const formatDate = (fechaString) => {
  if (!fechaString) return '';

    // Esperamos una cadena en formato "YYYY-MM-DD".
  // Dividimos la cadena para obtener año, mes y día.
  const parts = fechaString.split('-');

  // Verificamos que tengamos las tres partes esperadas.
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Meses en el objeto Date de JavaScript son 0-indexados (0=Enero, 11=Diciembre)
    const day = parseInt(parts[2], 10);

    // Creamos un objeto Date utilizando los componentes de fecha como si fueran UTC.
    // Date.UTC() devuelve el número de milisegundos desde la época Unix para una fecha UTC.
    // Luego, new Date() con este valor crea un objeto Date que representa ese momento exacto en UTC.
    const date = new Date(Date.UTC(year, month, day));

    // Usamos getUTCDate(), getUTCMonth(), y getUTCFullYear() para extraer los componentes
    // de la fecha directamente de sus valores UTC, evitando cualquier conversión a la zona horaria local.
    const utcDay = String(date.getUTCDate()).padStart(2, '0');
    const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0'); // Sumamos 1 porque getUTCMonth() también es 0-indexado.
    const utcYear = date.getUTCFullYear();

    return `${utcDay}/${utcMonth}/${utcYear}`;
  }

  // Si la cadena de fecha no está en el formato esperado "YYYY-MM-DD",
  // la devolvemos tal cual o podrías manejar el error de otra forma.
  console.warn(`formatDate recibió un formato de fecha inesperado: ${fechaString}`);
  return fechaString;
};