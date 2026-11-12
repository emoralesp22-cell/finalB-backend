/**
 * Generador de logotipo vectorial/canvas profesional para Ferretería FinalB.
 * Retorna un Data URL (PNG) apto para su inclusión en jsPDF y componentes HTML.
 */
let cachedLogoDataUrl: string | null = null;

export const getFerreteriaLogoDataUrl = (): string => {
  if (cachedLogoDataUrl) {
    return cachedLogoDataUrl;
  }

  // Si estamos en entorno de navegador, generamos un canvas nítido en alta resolución
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    const width = 240;
    const height = 70;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Fondo transparente / degradado suave
      ctx.clearRect(0, 0, width, height);

      // Ícono: Cuadrado redondeado con color industrial ferretero
      const iconSize = 54;
      const x = 8;
      const y = 8;
      const radius = 12;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + iconSize - radius, y);
      ctx.quadraticCurveTo(x + iconSize, y, x + iconSize, y + radius);
      ctx.lineTo(x + iconSize, y + iconSize - radius);
      ctx.quadraticCurveTo(x + iconSize, y + iconSize, x + iconSize - radius, y + iconSize);
      ctx.lineTo(x + radius, y + iconSize);
      ctx.quadraticCurveTo(x, y + iconSize, x, y + iconSize - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      // Gradiente azul marino a naranja industrial
      const grad = ctx.createLinearGradient(x, y, x + iconSize, y + iconSize);
      grad.addColorStop(0, '#1E3A8A'); // Navy Blue
      grad.addColorStop(1, '#D97706'); // Amber/Orange
      ctx.fillStyle = grad;
      ctx.fill();

      // Símbolo de herramienta (Martillo / Llave)
      ctx.strokeStyle = '#FFFFFF';
      ctx.fillStyle = '#FFFFFF';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Llave / Martillo estilizado dentro del badge
      // Cabeza de martillo
      ctx.beginPath();
      ctx.fillRect(x + 18, y + 14, 20, 8);
      // Mango
      ctx.beginPath();
      ctx.moveTo(x + 28, y + 22);
      ctx.lineTo(x + 28, y + 44);
      ctx.stroke();

      // Destello/tuerca inferior
      ctx.beginPath();
      ctx.arc(x + 28, y + 42, 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();

      // Texto Principal: FERRETERÍA
      ctx.fillStyle = '#0F172A'; // Slate 900
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('FINAL B', 72, 34);

      // Texto Secundario: SISTEMA DE REPORTES / FERRETERÍA
      ctx.fillStyle = '#D97706'; // Amber 600
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('FERRETERÍA & SUMINISTROS', 74, 50);

      cachedLogoDataUrl = canvas.toDataURL('image/png');
      return cachedLogoDataUrl;
    }
  }

  return '';
};
