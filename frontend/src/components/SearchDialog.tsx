import React, { useState, useEffect } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (nombre: string) => void;
  initialValue?: string;
  loading?: boolean;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  onSearch,
  initialValue = '',
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(initialValue);
      setError(null);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setError('El campo de búsqueda no puede estar vacío.');
      return;
    }
    setError(null);
    onSearch(trimmed);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#EFF6FF',
                color: '#1E3A8A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                Búsqueda de Artículos Activos
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Consulta por coincidencia parcial en el catálogo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="nombreInput" className="form-label">
                Nombre del artículo a filtrar:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="nombreInput"
                  type="text"
                  className="form-input"
                  placeholder="Ej: martillo, taladro, tubo, pintura..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (error && e.target.value.trim()) {
                      setError(null);
                    }
                  }}
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="form-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '10px' }}>
                * La búsqueda filtra artículos en estado activo ignorando mayúsculas y minúsculas a través de <code>/articulos/mostrarActivosFiltro</code>.
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Consultar Catálogo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
