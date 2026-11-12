import api from './api';
import { ArticuloDTO } from '../types';

export const articulosService = {
  buscarActivosPorNombre: async (nombre: string): Promise<ArticuloDTO[]> => {
    if (!nombre || !nombre.trim()) {
      throw new Error('El parámetro de búsqueda no puede estar vacío.');
    }
    const response = await api.get<ArticuloDTO[]>('/articulos/mostrarActivosFiltro', {
      params: { nombre: nombre.trim() },
    });
    return response.data;
  },
};
