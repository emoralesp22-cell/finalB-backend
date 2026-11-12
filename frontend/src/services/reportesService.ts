import api from './api';
import {
  ArticuloCategoriaDTO,
  FacturaClienteDTO,
  FacturaDetalleReporteDTO,
} from '../types';

export const reportesService = {
  obtenerArticulosCategoria: async (): Promise<ArticuloCategoriaDTO[]> => {
    const response = await api.get<ArticuloCategoriaDTO[]>('/articulos/reporteArticuloCategoria');
    return response.data;
  },

  obtenerFacturasCliente: async (): Promise<FacturaClienteDTO[]> => {
    const response = await api.get<FacturaClienteDTO[]>('/clientes/reporteClienteFactura');
    return response.data;
  },

  obtenerFacturasDetalle: async (): Promise<FacturaDetalleReporteDTO[]> => {
    const response = await api.get<FacturaDetalleReporteDTO[]>('/facturas/reporteFacturaDetalle');
    return response.data;
  },
};
