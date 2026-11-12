/**
 * Formateo de valores monetarios con exactamente dos decimales
 */
export const formatCurrency = (val: number | string | null | undefined): string => {
  if (val === null || val === undefined || isNaN(Number(val))) {
    return 'Q 0.00';
  }
  const num = Number(val);
  return 'Q ' + num.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formateo de fechas
 */
export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    return d.toLocaleString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Fecha actual formateada para reportes
 */
export const getNowFormatted = (): string => {
  const d = new Date();
  return d.toLocaleString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
