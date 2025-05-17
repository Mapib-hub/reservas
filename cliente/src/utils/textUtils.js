/**
 * Trunca un texto a una longitud máxima y añade puntos suspensivos si se corta.
 * @param {string} text - El texto a truncar.
 * @param {number} maxLength - La longitud máxima deseada para el texto.
 * @returns {string} - El texto truncado o el original si no excede la longitud.
 */
export const truncateText = (text, maxLength = 200) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};