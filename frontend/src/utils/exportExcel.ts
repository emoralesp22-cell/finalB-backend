import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  ArticuloDTO,
  ArticuloCategoriaDTO,
  FacturaClienteDTO,
  FacturaDetalleReporteDTO,
} from '../types';
import { formatDate, getNowFormatted } from './formatters';

// Estilo de borde estándar
const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'CBD5E1' } },
  left: { style: 'thin', color: { argb: 'CBD5E1' } },
  bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
  right: { style: 'thin', color: { argb: 'CBD5E1' } },
};

/**
 * Aplica el encabezado de página y el diseño corporativo de Ferretería FinalB
 */
const setupWorksheetHeader = (
  worksheet: ExcelJS.Worksheet,
  title: string,
  totalCols: number
) => {
  // Fila 1: Título de la empresa
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = 'FERRETERÍA FINAL B - SISTEMA DE REPORTES';
  titleRow.getCell(1).font = { name: 'Arial', size: 14, bold: true, color: { argb: '1E3A8A' } };
  titleRow.height = 24;
  worksheet.mergeCells(1, 1, 1, totalCols);

  // Fila 2: Nombre del reporte específico
  const subTitleRow = worksheet.getRow(2);
  subTitleRow.getCell(1).value = title;
  subTitleRow.getCell(1).font = { name: 'Arial', size: 12, bold: true, color: { argb: '0F172A' } };
  subTitleRow.height = 20;
  worksheet.mergeCells(2, 1, 2, totalCols);

  // Fila 3: Fecha de emisión
  const dateRow = worksheet.getRow(3);
  dateRow.getCell(1).value = `Fecha de emisión: ${getNowFormatted()}`;
  dateRow.getCell(1).font = { name: 'Arial', size: 9, italic: true, color: { argb: '64748B' } };
  dateRow.height = 16;
  worksheet.mergeCells(3, 1, 3, totalCols);

  // Fila 4: Espacio en blanco
  worksheet.getRow(4).height = 10;
};

/**
 * Da formato profesional a los encabezados de tabla (Fila 5)
 */
const formatHeaderRow = (headerRow: ExcelJS.Row) => {
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' }, // Azul Marino Ferretería
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: '0F172A' } },
      left: { style: 'thin', color: { argb: '0F172A' } },
      bottom: { style: 'medium', color: { argb: 'D97706' } }, // Subrayado ámbar
      right: { style: 'thin', color: { argb: '0F172A' } },
    };
  });
};

/**
 * Autoajusta el ancho de las columnas
 */
const adjustColumnWidths = (worksheet: ExcelJS.Worksheet) => {
  worksheet.columns.forEach((col) => {
    let maxLength = 12;
    col.eachCell?.({ includeEmpty: false }, (cell, rowNumber) => {
      if (rowNumber > 4) {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      }
    });
    col.width = Math.min(maxLength + 4, 40);
  });
};

/**
 * Guarda el archivo Excel en el navegador
 */
const saveWorkbook = async (workbook: ExcelJS.Workbook, filename: string) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, filename);
};

/**
 * REPORTE 1: Exportar Artículos Filtrados a Excel
 */
export const exportArticulosFiltroExcel = async (
  articulos: ArticuloDTO[],
  filtroNombre: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Artículos Filtrados');

  setupWorksheetHeader(
    worksheet,
    `Búsqueda de Artículos Activos (Filtro: "${filtroNombre}")`,
    7
  );

  // Encabezados en Fila 5
  const headerRow = worksheet.getRow(5);
  headerRow.values = [
    'ID',
    'Nombre del Artículo',
    'Marca',
    'Categoría',
    'Precio Unitario',
    'Stock',
    'Estado',
  ];
  formatHeaderRow(headerRow);

  // Filas de datos
  articulos.forEach((a, index) => {
    const row = worksheet.addRow([
      a.idArticulo,
      a.nombre,
      a.marca || '-',
      a.categoriaNombre || 'Sin categoría',
      Number(a.precio) || 0,
      a.stock,
      a.estado ? 'Activo' : 'Inactivo',
    ]);

    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.border = thinBorder;
      cell.font = { name: 'Arial', size: 9.5 };
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F8FAFC' },
        };
      }
      if (colNumber === 1 || colNumber === 6 || colNumber === 7) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (colNumber === 5) {
        cell.numFmt = '"Q"#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  adjustColumnWidths(worksheet);
  await saveWorkbook(workbook, 'Reporte_Articulos_Filtrados.xlsx');
};

/**
 * REPORTE 2: Exportar Artículos con Categoría a Excel
 */
export const exportArticulosCategoriaExcel = async (articulos: ArticuloCategoriaDTO[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Catálogo por Categoría');

  setupWorksheetHeader(worksheet, 'Catálogo General de Artículos por Categoría', 6);

  const headerRow = worksheet.getRow(5);
  headerRow.values = [
    '#',
    'Nombre del Artículo',
    'Marca',
    'Categoría',
    'Precio Unitario',
    'Stock en Inventario',
  ];
  formatHeaderRow(headerRow);

  articulos.forEach((a, index) => {
    const row = worksheet.addRow([
      index + 1,
      a.nombreArticulo,
      a.marca || '-',
      a.nombreCategoria,
      Number(a.precio) || 0,
      a.stock,
    ]);

    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.border = thinBorder;
      cell.font = { name: 'Arial', size: 9.5 };
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F8FAFC' },
        };
      }
      if (colNumber === 1 || colNumber === 6) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (colNumber === 5) {
        cell.numFmt = '"Q"#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  adjustColumnWidths(worksheet);
  await saveWorkbook(workbook, 'Reporte_Articulos_Categoria.xlsx');
};

/**
 * REPORTE 3: Exportar Facturas por Cliente a Excel
 */
export const exportFacturasClienteExcel = async (facturas: FacturaClienteDTO[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Facturas por Cliente');

  setupWorksheetHeader(worksheet, 'Reporte de Facturación Activa por Cliente', 5);

  const headerRow = worksheet.getRow(5);
  headerRow.values = [
    '#',
    'Cliente (Nombre y Apellido)',
    'NIT',
    'Fecha de Factura',
    'Total Facturado',
  ];
  formatHeaderRow(headerRow);

  const startRow = 6;
  facturas.forEach((f, index) => {
    const row = worksheet.addRow([
      index + 1,
      `${f.nombreCliente} ${f.apellidoCliente}`.trim(),
      f.nit,
      formatDate(f.fechaFactura),
      Number(f.total) || 0,
    ]);

    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.border = thinBorder;
      cell.font = { name: 'Arial', size: 9.5 };
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F8FAFC' },
        };
      }
      if (colNumber === 1 || colNumber === 3 || colNumber === 4) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (colNumber === 5) {
        cell.numFmt = '"Q"#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  const endRow = startRow + facturas.length - 1;
  if (facturas.length > 0) {
    const totalRow = worksheet.addRow([
      '',
      'TOTAL GENERAL FACTURADO',
      '',
      '',
      { formula: `SUM(E${startRow}:E${endRow})` },
    ]);
    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '0F172A' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FEF3C7' }, // Ámbar suave
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'D97706' } },
        bottom: { style: 'double', color: { argb: 'D97706' } },
      };
      if (colNumber === 5) {
        cell.numFmt = '"Q"#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }
    });
  }

  adjustColumnWidths(worksheet);
  await saveWorkbook(workbook, 'Reporte_Facturas_Cliente.xlsx');
};

/**
 * REPORTE 4: Exportar Detalle General de Facturas a Excel
 * Requisitos:
 * - Fórmula SUM de ExcelJS calculando el total general
 * - Formato monetario con dos decimales
 */
export const exportFacturasDetalleExcel = async (detalles: FacturaDetalleReporteDTO[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Detalle de Facturación');

  setupWorksheetHeader(worksheet, 'Reporte Detallado de Renglones de Facturas', 7);

  const headerRow = worksheet.getRow(5);
  headerRow.values = [
    'Fecha Factura',
    'Nombre del Cliente',
    'Apellido del Cliente',
    'Artículo Vendido',
    'Cantidad',
    'Precio Unitario',
    'Subtotal',
  ];
  formatHeaderRow(headerRow);

  const startRow = 6;
  detalles.forEach((d, index) => {
    const row = worksheet.addRow([
      formatDate(d.fechaFactura),
      d.nombreCliente,
      d.apellidoCliente,
      d.nombreArticulo,
      Number(d.cantidad) || 0,
      Number(d.precioUnitario) || 0,
      Number(d.subtotal) || 0,
    ]);

    row.height = 20;
    row.eachCell((cell, colNumber) => {
      cell.border = thinBorder;
      cell.font = { name: 'Arial', size: 9.5 };
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F8FAFC' },
        };
      }
      if (colNumber === 1 || colNumber === 5) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (colNumber === 6 || colNumber === 7) {
        cell.numFmt = '"Q"#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });
  });

  const endRow = startRow + detalles.length - 1;
  if (detalles.length > 0) {
    // Fila de Total general con fórmula SUM obligatoria
    const totalRow = worksheet.addRow([
      'TOTAL GENERAL',
      '',
      '',
      '',
      '',
      '',
      { formula: `SUM(G${startRow}:G${endRow})` },
    ]);

    totalRow.height = 24;
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '0F172A' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FEF3C7' }, // Resalte ámbar suave
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'D97706' } },
        bottom: { style: 'double', color: { argb: 'D97706' } },
        left: { style: 'thin', color: { argb: 'CBD5E1' } },
        right: { style: 'thin', color: { argb: 'CBD5E1' } },
      };
      if (colNumber === 7) {
        cell.numFmt = '"Q"#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }
    });
  }

  adjustColumnWidths(worksheet);
  await saveWorkbook(workbook, 'Reporte_Detalle_Facturas.xlsx');
};
