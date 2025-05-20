/**
 * Formatea una cadena de fecha o un objeto Date a un formato legible.
 * @param {string | Date} dateString - La fecha a formatear.
 * @param {boolean} includeTime - Si es true, incluye la hora en el formato.
 * @returns {string} La fecha formateada, o una cadena vacía si la entrada no es válida.
 */
export const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    // Verificar si la fecha es válida después de la conversión
    if (isNaN(date.getTime())) {
        console.warn(`Fecha inválida proporcionada a formatDate: ${dateString}`);
        return 'Fecha inválida'; // O podrías devolver la cadena original o ''
    }

    const year = date.getFullYear(); // Usar año local
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Usar mes local
    const day = String(date.getDate()).padStart(2, '0'); // Usar día local

    let formattedDate = `${day}/${month}/${year}`; // Formato DD/MM/YYYY

    if (includeTime) {
        const hours = String(date.getHours()).padStart(2, '0'); // Usar horas locales
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Usar minutos locales
        formattedDate += ` ${hours}:${minutes}`; // Añade HH:MM (en hora local)
    }
    return formattedDate;
};