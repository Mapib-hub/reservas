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

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const day = String(date.getUTCDate()).padStart(2, '0');

    let formattedDate = `${day}/${month}/${year}`; // Formato DD/MM/YYYY

    if (includeTime) {
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        formattedDate += ` ${hours}:${minutes}`; // Añade HH:MM (en UTC)
    }
    return formattedDate;
};