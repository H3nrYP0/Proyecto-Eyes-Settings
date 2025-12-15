/**
 * Utilidades para formateo de moneda en Pesos Colombianos (COP)
 * 
 * - formatCOP: Para mostrar valores completos con símbolo (ej: $1.234.567)
 * - formatToPesos: Para inputs en tiempo real (ej: "1.234.567")
 * - parseFromPesos: Para limpiar el valor y obtener solo dígitos (ej: "1234567")
 */

/**
 * Formatea un número como moneda en pesos colombianos (COP)
 * @param {number|string} amount - Valor a formatear
 * @returns {string} Ej: "$1.234.567" o "$1.234.567,50"
 */
export const formatCOP = (amount) => {
  if (amount == null || amount === '') return '$0';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(num);
};

/**
 * Formatea un valor con separadores de miles (solo para visualización en inputs)
 * @param {string} value - Valor en string (puede contener puntos o letras)
 * @returns {string} Ej: "1.234.567"
 */
export const formatToPesos = (value) => {
  const digits = value.toString().replace(/\D/g, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Elimina separadores de miles y devuelve solo dígitos
 * @param {string} formattedValue - Valor formateado (ej: "1.234.567")
 * @returns {string} Ej: "1234567"
 */
export const parseFromPesos = (formattedValue) => {
  return formattedValue.toString().replace(/\./g, '');
};