import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Layers,
  Users,
  Receipt,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle,
  Database,
  Filter,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { SearchDialog } from '../components/SearchDialog';
import { articulosService } from '../services/articulosService';
import { reportesService } from '../services/reportesService';
import {
  ArticuloDTO,
  ArticuloCategoriaDTO,
  FacturaClienteDTO,
  FacturaDetalleReporteDTO,
  ReportType,
} from '../types';
import {
  formatCurrency,
  formatDate,
} from '../utils/formatters';
import {
  exportArticulosFiltroPdf,
  exportArticulosCategoriaPdf,
  exportFacturasClientePdf,
  exportFacturasDetallePdf,
} from '../utils/exportPdf';
import {
  exportArticulosFiltroExcel,
  exportArticulosCategoriaExcel,
  exportFacturasClienteExcel,
  exportFacturasDetalleExcel,
} from '../utils/exportExcel';

export const Reportes: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('articulos-filtro');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // Estados de datos
  const [articulosFiltro, setArticulosFiltro] = useState<ArticuloDTO[]>([]);
  const [filtroNombre, setFiltroNombre] = useState<string>('martillo');
  const [articulosCategoria, setArticulosCategoria] = useState<ArticuloCategoriaDTO[]>([]);
  const [facturasCliente, setFacturasCliente] = useState<FacturaClienteDTO[]>([]);
  const [facturasDetalle, setFacturasDetalle] = useState<FacturaDetalleReporteDTO[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState<boolean>(false);

  // Verificación de conexión con el backend
  const checkConnection = useCallback(async () => {
    setConnectionStatus('checking');
    try {
      // Intentamos una llamada de verificación rápida
      await reportesService.obtenerArticulosCategoria();
      setConnectionStatus('connected');
    } catch {
      setConnectionStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Carga de datos según el reporte activo
  const loadReportData = useCallback(async (report: ReportType, searchParam?: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (report === 'articulos-filtro') {
        const query = searchParam !== undefined ? searchParam : filtroNombre;
        if (!query.trim()) {
          setErrorMsg('El parámetro de búsqueda no puede estar vacío.');
          setLoading(false);
          return;
        }
        const data = await articulosService.buscarActivosPorNombre(query);
        setArticulosFiltro(data);
        setFiltroNombre(query);
      } else if (report === 'articulos-categoria') {
        const data = await reportesService.obtenerArticulosCategoria();
        setArticulosCategoria(data);
      } else if (report === 'facturas-cliente') {
        const data = await reportesService.obtenerFacturasCliente();
        setFacturasCliente(data);
      } else if (report === 'facturas-detalle') {
        const data = await reportesService.obtenerFacturasDetalle();
        setFacturasDetalle(data);
      }
      setConnectionStatus('connected');
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { data?: { mensaje?: string } } };
      const backendMessage = error.response?.data?.mensaje || error.message || 'No fue posible conectar con el backend.';
      setErrorMsg(backendMessage);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  }, [filtroNombre]);

  useEffect(() => {
    loadReportData(activeReport);
  }, [activeReport, loadReportData]);

  // Ejecutar búsqueda desde el diálogo
  const handlePerformSearch = (nombre: string) => {
    setIsSearchDialogOpen(false);
    loadReportData('articulos-filtro', nombre);
  };

  // Cálculo del total general para el reporte 4
  const totalGeneralFacturasDetalle = facturasDetalle.reduce(
    (acc, item) => acc + (Number(item.subtotal) || 0),
    0
  );

  return (
    <div className="app-container">
      <Sidebar
        activeReport={activeReport}
        onSelectReport={(rep) => setActiveReport(rep)}
      />

      <div className="main-content">
        <Header
          connectionStatus={connectionStatus}
          onCheckConnection={checkConnection}
          apiUrl={apiUrl}
        />

        <main className="content-body">
          {/* Banner de estado si el backend está desconectado */}
          {connectionStatus === 'disconnected' && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
              }}
            >
              <AlertCircle size={22} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: '#991B1B', fontWeight: 700, fontSize: '0.95rem' }}>
                  Backend Spring Boot no disponible en {apiUrl}
                </h4>
                <p style={{ color: '#B91C1C', fontSize: '0.85rem', marginTop: '3px' }}>
                  Asegúrate de que la aplicación Spring Boot esté en ejecución en el puerto 8080 (comando: <code>.\mvnw.cmd spring-boot:run</code>).
                  La exportación y la interfaz están completamente operativas una vez que el servidor responda.
                </p>
              </div>
            </div>
          )}

          {/* Tarjetas resumen de los 4 reportes de la Serie IV */}
          <div className="cards-grid">
            <div
              className={`report-card ${activeReport === 'articulos-filtro' ? 'selected' : ''}`}
              onClick={() => setActiveReport('articulos-filtro')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#1E3A8A' }}>
                    <Search size={20} />
                  </div>
                  <span className="badge badge-info">Filtro por Nombre</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  1. Artículos por Nombre
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Búsqueda con coincidencia parcial de artículos activos vía <code>/articulos/mostrarActivosFiltro</code>.
                </p>
              </div>
              <div style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: 600, color: '#1E3A8A' }}>
                {articulosFiltro.length} resultados filtrados &rarr;
              </div>
            </div>

            <div
              className={`report-card ${activeReport === 'articulos-categoria' ? 'selected' : ''}`}
              onClick={() => setActiveReport('articulos-categoria')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
                    <Layers size={20} />
                  </div>
                  <span className="badge badge-warning">Catálogo</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  2. Artículos con Categoría
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Relación JOIN con Categoria, ordenado por categoría y nombre vía <code>/articulos/reporteArticuloCategoria</code>.
                </p>
              </div>
              <div style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: 600, color: '#D97706' }}>
                {articulosCategoria.length} artículos catalogados &rarr;
              </div>
            </div>

            <div
              className={`report-card ${activeReport === 'facturas-cliente' ? 'selected' : ''}`}
              onClick={() => setActiveReport('facturas-cliente')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#ECFDF5', color: '#059669' }}>
                    <Users size={20} />
                  </div>
                  <span className="badge badge-success">Ventas Clientes</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  3. Facturas por Cliente
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  JOIN con Cliente, nombre completo unificado y fecha ordenada vía <code>/clientes/reporteClienteFactura</code>.
                </p>
              </div>
              <div style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>
                {facturasCliente.length} facturas activas &rarr;
              </div>
            </div>

            <div
              className={`report-card ${activeReport === 'facturas-detalle' ? 'selected' : ''}`}
              onClick={() => setActiveReport('facturas-detalle')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#F3E8FF', color: '#7E22CE' }}>
                    <Receipt size={20} />
                  </div>
                  <span className="badge badge-info">3 JOINs · 7 Campos</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  4. Detalle de Facturas
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Renglones de ventas con 3 JOINs y cálculo de Total General vía <code>/facturas/reporteFacturaDetalle</code>.
                </p>
              </div>
              <div style={{ marginTop: '16px', fontSize: '0.85rem', fontWeight: 600, color: '#7E22CE' }}>
                {facturasDetalle.length} renglones procesados &rarr;
              </div>
            </div>
          </div>

          {/* Contenedor Principal del Reporte Activo */}
          <div className="table-container">
            <div className="table-header-bar">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>
                    {activeReport === 'articulos-filtro' && 'Reporte 1: Búsqueda de Artículos por Nombre'}
                    {activeReport === 'articulos-categoria' && 'Reporte 2: Catálogo de Artículos con Categoría'}
                    {activeReport === 'facturas-cliente' && 'Reporte 3: Facturación Activa por Cliente'}
                    {activeReport === 'facturas-detalle' && 'Reporte 4: Detalle Integral de Facturas (Renglones de Venta)'}
                  </h2>
                  {activeReport === 'articulos-filtro' && (
                    <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
                      Filtro: "{filtroNombre}"
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
                  {activeReport === 'articulos-filtro' && `Endpoint: /articulos/mostrarActivosFiltro?nombre=${encodeURIComponent(filtroNombre)}`}
                  {activeReport === 'articulos-categoria' && 'Endpoint: /articulos/reporteArticuloCategoria'}
                  {activeReport === 'facturas-cliente' && 'Endpoint: /clientes/reporteClienteFactura'}
                  {activeReport === 'facturas-detalle' && 'Endpoint: /facturas/reporteFacturaDetalle (3 JOINs reales)'}
                </p>
              </div>

              {/* Botones de acción y exportación */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {activeReport === 'articulos-filtro' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsSearchDialogOpen(true)}
                  >
                    <Filter size={16} />
                    <span>Cambiar Filtro</span>
                  </button>
                )}

                <button
                  className="btn btn-outline"
                  onClick={() => loadReportData(activeReport)}
                  disabled={loading}
                  title="Refrescar datos"
                >
                  <RefreshCw size={16} className={loading ? 'spinner' : ''} />
                  <span>Actualizar</span>
                </button>

                {/* Botón Exportar PDF */}
                <button
                  className="btn btn-pdf"
                  disabled={loading || (activeReport === 'articulos-filtro' ? articulosFiltro.length === 0 : false)}
                  onClick={() => {
                    if (activeReport === 'articulos-filtro') {
                      exportArticulosFiltroPdf(articulosFiltro, filtroNombre);
                    } else if (activeReport === 'articulos-categoria') {
                      exportArticulosCategoriaPdf(articulosCategoria);
                    } else if (activeReport === 'facturas-cliente') {
                      exportFacturasClientePdf(facturasCliente);
                    } else if (activeReport === 'facturas-detalle') {
                      exportFacturasDetallePdf(facturasDetalle);
                    }
                  }}
                >
                  <FileText size={16} />
                  <span>Exportar a PDF</span>
                </button>

                {/* Botón Exportar Excel */}
                <button
                  className="btn btn-excel"
                  disabled={loading || (activeReport === 'articulos-filtro' ? articulosFiltro.length === 0 : false)}
                  onClick={() => {
                    if (activeReport === 'articulos-filtro') {
                      exportArticulosFiltroExcel(articulosFiltro, filtroNombre);
                    } else if (activeReport === 'articulos-categoria') {
                      exportArticulosCategoriaExcel(articulosCategoria);
                    } else if (activeReport === 'facturas-cliente') {
                      exportFacturasClienteExcel(facturasCliente);
                    } else if (activeReport === 'facturas-detalle') {
                      exportFacturasDetalleExcel(facturasDetalle);
                    }
                  }}
                >
                  <FileSpreadsheet size={16} />
                  <span>Exportar a Excel</span>
                </button>
              </div>
            </div>

            {/* Mensajes de error */}
            {errorMsg && (
              <div style={{ padding: '16px 24px', backgroundColor: '#FEF2F2', borderBottom: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '10px', color: '#991B1B', fontSize: '0.88rem' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Spinner de carga */}
            {loading ? (
              <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', color: '#64748B' }}>
                <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>Consultando endpoint del backend...</span>
              </div>
            ) : (
              <div className="table-wrapper">
                {/* TABLA REPORTE 1: Artículos Filtrados */}
                {activeReport === 'articulos-filtro' && (
                  articulosFiltro.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748B' }}>
                      <Database size={40} style={{ margin: '0 auto 12px auto', color: '#CBD5E1' }} />
                      <h4 style={{ color: '#0F172A', fontWeight: 600 }}>No se encontraron artículos activos</h4>
                      <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        No hay artículos que coincidan con "{filtroNombre}". Haz clic en "Cambiar Filtro" para buscar otro término.
                      </p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '70px', textAlign: 'center' }}>ID</th>
                          <th>Nombre del Artículo</th>
                          <th>Marca</th>
                          <th>Categoría</th>
                          <th style={{ textAlign: 'right' }}>Precio Unitario</th>
                          <th style={{ textAlign: 'center' }}>Stock</th>
                          <th style={{ textAlign: 'center' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articulosFiltro.map((item) => (
                          <tr key={item.idArticulo}>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748B' }}>{item.idArticulo}</td>
                            <td style={{ fontWeight: 600, color: '#0F172A' }}>{item.nombre}</td>
                            <td>{item.marca || '-'}</td>
                            <td>
                              <span className="badge badge-info">{item.categoriaNombre || 'General'}</span>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.precio)}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontWeight: item.stock < 10 ? 700 : 500, color: item.stock < 10 ? '#DC2626' : '#0F172A' }}>
                                {item.stock}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`badge ${item.estado ? 'badge-success' : 'badge-danger'}`}>
                                {item.estado ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* TABLA REPORTE 2: Artículos con Categoría */}
                {activeReport === 'articulos-categoria' && (
                  articulosCategoria.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748B' }}>
                      <Database size={40} style={{ margin: '0 auto 12px auto', color: '#CBD5E1' }} />
                      <h4 style={{ color: '#0F172A', fontWeight: 600 }}>Sin datos disponibles</h4>
                      <p style={{ fontSize: '0.85rem' }}>Verifica que el backend esté ejecutándose con el script finalB cargado.</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                          <th>Nombre del Artículo</th>
                          <th>Marca</th>
                          <th>Nombre de la Categoría</th>
                          <th style={{ textAlign: 'right' }}>Precio</th>
                          <th style={{ textAlign: 'center' }}>Stock en Bodega</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articulosCategoria.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center', color: '#64748B' }}>{idx + 1}</td>
                            <td style={{ fontWeight: 600, color: '#0F172A' }}>{item.nombreArticulo}</td>
                            <td>{item.marca || '-'}</td>
                            <td>
                              <span className="badge badge-warning">{item.nombreCategoria}</span>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.precio)}</td>
                            <td style={{ textAlign: 'center', fontWeight: 500 }}>{item.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}

                {/* TABLA REPORTE 3: Facturas por Cliente */}
                {activeReport === 'facturas-cliente' && (
                  facturasCliente.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748B' }}>
                      <Database size={40} style={{ margin: '0 auto 12px auto', color: '#CBD5E1' }} />
                      <h4 style={{ color: '#0F172A', fontWeight: 600 }}>Sin facturas activas</h4>
                      <p style={{ fontSize: '0.85rem' }}>No se encontraron registros de facturación activa en la base de datos.</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                          <th>Cliente (Nombre y Apellido)</th>
                          <th style={{ textAlign: 'center' }}>NIT</th>
                          <th style={{ textAlign: 'center' }}>Fecha de Factura</th>
                          <th style={{ textAlign: 'right' }}>Total Facturado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facturasCliente.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center', color: '#64748B' }}>{idx + 1}</td>
                            <td style={{ fontWeight: 600, color: '#0F172A' }}>
                              {item.nombreCliente} {item.apellidoCliente}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>
                                {item.nit}
                              </code>
                            </td>
                            <td style={{ textAlign: 'center', color: '#475569' }}>{formatDate(item.fechaFactura)}</td>
                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'right' }}>TOTAL FACTURADO:</td>
                          <td style={{ textAlign: 'right', fontSize: '1rem' }}>
                            {formatCurrency(
                              facturasCliente.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  )
                )}

                {/* TABLA REPORTE 4: Detalle de Facturas (7 Campos) */}
                {activeReport === 'facturas-detalle' && (
                  facturasDetalle.length === 0 ? (
                    <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748B' }}>
                      <Database size={40} style={{ margin: '0 auto 12px auto', color: '#CBD5E1' }} />
                      <h4 style={{ color: '#0F172A', fontWeight: 600 }}>Sin renglones de factura</h4>
                      <p style={{ fontSize: '0.85rem' }}>No se encontraron detalles de facturación activa.</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'center' }}>Fecha Factura</th>
                          <th>Nombre Cliente</th>
                          <th>Apellido Cliente</th>
                          <th>Artículo Vendido</th>
                          <th style={{ textAlign: 'center' }}>Cantidad</th>
                          <th style={{ textAlign: 'right' }}>Precio Unitario</th>
                          <th style={{ textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facturasDetalle.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
                              {formatDate(item.fechaFactura)}
                            </td>
                            <td style={{ fontWeight: 600 }}>{item.nombreCliente}</td>
                            <td>{item.apellidoCliente}</td>
                            <td style={{ fontWeight: 500, color: '#1E3A8A' }}>{item.nombreArticulo}</td>
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.cantidad}</td>
                            <td style={{ textAlign: 'right' }}>{formatCurrency(item.precioUnitario)}</td>
                            <td style={{ textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                              {formatCurrency(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'right' }}>
                            TOTAL GENERAL (SUMA DE SUBTOCALES):
                          </td>
                          <td style={{ textAlign: 'right', fontSize: '1.05rem', color: '#B45309' }}>
                            {formatCurrency(totalGeneralFacturasDetalle)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  )
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Diálogo elegante de búsqueda */}
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onSearch={handlePerformSearch}
        initialValue={filtroNombre}
        loading={loading}
      />
    </div>
  );
};

export default Reportes;
