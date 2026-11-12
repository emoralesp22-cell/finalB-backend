import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ArticuloDTO,
  ArticuloCategoriaDTO,
  FacturaClienteDTO,
  FacturaDetalleReporteDTO,
} from '../types';
import { formatCurrency, formatDate, getNowFormatted } from './formatters';
import { getFerreteriaLogoDataUrl } from './logo';

/**
 * Agrega el encabezado institucional estándar para todos los reportes PDF
 */
const addReportHeader = (
  doc: jsPDF,
  title: string,
  extraSubtitle?: string
) => {
  // Dimensiones A4 horizontal: 297 x 210 mm
  const logo = getFerreteriaLogoDataUrl();
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', 14, 10, 56, 16);
    } catch {
      // Si falla la carga de imagen, continúa con el membrete en texto
    }
  }

  // Título del reporte
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(title, 14, 32);

  // Fecha y metadatos
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  let metaText = `Fecha de emisión: ${getNowFormatted()}`;
  if (extraSubtitle) {
    metaText += `  |  ${extraSubtitle}`;
  }
  doc.text(metaText, 14, 37);

  // Línea decorativa ferretera (ámbar/dorado)
  doc.setDrawColor(217, 119, 6); // Amber 600
  doc.setLineWidth(0.8);
  doc.line(14, 40, 283, 40);
};

/**
 * Agrega la numeración visible "Página X de Y" y pie de página en todas las hojas
 */
const addReportFooters = (doc: jsPDF) => {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Línea separadora inferior
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.3);
    doc.line(14, 198, 283, 198);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('Ferretería FinalB · Sistema de Control y Reportes Gerenciales', 14, 203);
    doc.text(`Página ${i} de ${totalPages}`, 283, 203, { align: 'right' });
  }
};

/**
 * REPORTE 1: Exportar Artículos Activos Filtrados a PDF
 */
export const exportArticulosFiltroPdf = (
  articulos: ArticuloDTO[],
  filtroNombre: string
) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  addReportHeader(
    doc,
    'Reporte de Artículos Activos (Búsqueda por Nombre)',
    `Filtro aplicado: "${filtroNombre}" (${articulos.length} artículos encontrados)`
  );

  const head = [['ID', 'Nombre del Artículo', 'Marca', 'Categoría', 'Precio Unitario', 'Stock', 'Estado']];
  const body = articulos.map((a) => [
    a.idArticulo,
    a.nombre,
    a.marca || '-',
    a.categoriaNombre || 'Sin categoría',
    formatCurrency(a.precio),
    a.stock,
    a.estado ? 'Activo' : 'Inactivo',
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 44,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138], // Navy 900
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9.5,
      halign: 'left',
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right' },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 24 },
    },
  });

  addReportFooters(doc);
  doc.save('Reporte_Articulos_Filtrados.pdf');
};

/**
 * REPORTE 2: Exportar Artículos con Categoría a PDF
 */
export const exportArticulosCategoriaPdf = (articulos: ArticuloCategoriaDTO[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  addReportHeader(
    doc,
    'Catálogo General de Artículos por Categoría',
    `Total de registros: ${articulos.length}`
  );

  const head = [['#', 'Nombre del Artículo', 'Marca', 'Categoría', 'Precio Unitario', 'Stock en Inventario']];
  const body = articulos.map((a, idx) => [
    idx + 1,
    a.nombreArticulo,
    a.marca || '-',
    a.nombreCategoria,
    formatCurrency(a.precio),
    a.stock,
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 44,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9.5,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      4: { halign: 'right' },
      5: { halign: 'center', cellWidth: 35 },
    },
  });

  addReportFooters(doc);
  doc.save('Reporte_Articulos_Categoria.pdf');
};

/**
 * REPORTE 3: Exportar Facturas por Cliente a PDF
 */
export const exportFacturasClientePdf = (facturas: FacturaClienteDTO[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  addReportHeader(
    doc,
    'Reporte de Facturas Activas por Cliente',
    `Total de facturas emitidas: ${facturas.length}`
  );

  const head = [['#', 'Cliente (Nombre y Apellido)', 'NIT', 'Fecha de Factura', 'Total Facturado']];
  const body = facturas.map((f, idx) => [
    idx + 1,
    `${f.nombreCliente} ${f.apellidoCliente}`.trim(),
    f.nit,
    formatDate(f.fechaFactura),
    formatCurrency(f.total),
  ]);

  const totalSum = facturas.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const foot = [['', 'TOTAL GENERAL FACTURADO', '', '', formatCurrency(totalSum)]];

  autoTable(doc, {
    head,
    body,
    foot,
    startY: 44,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9.5,
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.8,
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      2: { halign: 'center', cellWidth: 35 },
      3: { halign: 'center', cellWidth: 45 },
      4: { halign: 'right' },
    },
  });

  addReportFooters(doc);
  doc.save('Reporte_Facturas_Cliente.pdf');
};

/**
 * REPORTE 4: Exportar Detalle General de Facturas a PDF
 * Requisito: Total general en el pie de la tabla con jspdf-autotable y numeración Página X de Y
 */
export const exportFacturasDetallePdf = (detalles: FacturaDetalleReporteDTO[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  addReportHeader(
    doc,
    'Reporte Detallado de Facturación (Renglones de Ventas)',
    `Total de renglones procesados: ${detalles.length}`
  );

  const head = [[
    'Fecha Factura',
    'Nombre del Cliente',
    'Apellido del Cliente',
    'Artículo Vendido',
    'Cantidad',
    'Precio Unitario',
    'Subtotal',
  ]];

  const body = detalles.map((d) => [
    formatDate(d.fechaFactura),
    d.nombreCliente,
    d.apellidoCliente,
    d.nombreArticulo,
    d.cantidad,
    formatCurrency(d.precioUnitario),
    formatCurrency(d.subtotal),
  ]);

  // Cálculo del total general
  const totalGeneral = detalles.reduce(
    (acc, item) => acc + (Number(item.subtotal) || 0),
    0
  );

  const foot = [[
    'TOTAL GENERAL',
    '',
    '',
    '',
    '',
    '',
    formatCurrency(totalGeneral),
  ]];

  autoTable(doc, {
    head,
    body,
    foot,
    startY: 44,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138], // Azul Marino
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9.5,
    },
    footStyles: {
      fillColor: [254, 243, 199], // Ámbar suave
      textColor: [120, 53, 15], // Ámbar oscuro
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.3,
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 38, halign: 'center' },
      4: { halign: 'center', cellWidth: 22 },
      5: { halign: 'right', cellWidth: 32 },
      6: { halign: 'right', cellWidth: 35 },
    },
  });

  addReportFooters(doc);
  doc.save('Reporte_Detalle_Facturas.pdf');
};
