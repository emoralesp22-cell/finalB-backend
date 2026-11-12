export interface ArticuloDTO {
  idArticulo: number;
  nombre: string;
  marca: string;
  precio: number;
  stock: number;
  estado: boolean;
  categoriaNombre: string;
}

export interface ArticuloCategoriaDTO {
  nombreArticulo: string;
  marca: string;
  nombreCategoria: string;
  precio: number;
  stock: number;
}

export interface FacturaClienteDTO {
  nombreCliente: string;
  apellidoCliente: string;
  nit: string;
  fechaFactura: string;
  total: number;
}

export interface FacturaDetalleReporteDTO {
  fechaFactura: string;
  nombreCliente: string;
  apellidoCliente: string;
  nombreArticulo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export type ReportType = 
  | 'articulos-filtro'
  | 'articulos-categoria'
  | 'facturas-cliente'
  | 'facturas-detalle';

export interface ReportMeta {
  id: ReportType;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}
