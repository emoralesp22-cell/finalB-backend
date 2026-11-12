import React from 'react';
import {
  FileText,
  Search,
  Layers,
  Users,
  Receipt,
  Wrench,
} from 'lucide-react';
import { ReportType } from '../types';

interface SidebarProps {
  activeReport: ReportType;
  onSelectReport: (report: ReportType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeReport,
  onSelectReport,
}) => {
  const menuItems: { id: ReportType; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      id: 'articulos-filtro',
      label: '1. Artículos por Nombre',
      icon: <Search size={18} className="nav-icon" />,
      badge: 'Filtro',
    },
    {
      id: 'articulos-categoria',
      label: '2. Artículos con Categoría',
      icon: <Layers size={18} className="nav-icon" />,
      badge: 'Catálogo',
    },
    {
      id: 'facturas-cliente',
      label: '3. Facturas por Cliente',
      icon: <Users size={18} className="nav-icon" />,
      badge: 'Ventas',
    },
    {
      id: 'facturas-detalle',
      label: '4. Detalle de Facturas',
      icon: <Receipt size={18} className="nav-icon" />,
      badge: '7 Campos',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div
          style={{
            padding: '8px',
            backgroundColor: '#1E3A8A',
            borderRadius: '8px',
            color: '#F59E0B',
            display: 'flex',
          }}
        >
          <Wrench size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            FINAL B
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Panel de Reportes
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '8px 12px',
          }}
        >
          Reportes de Serie IV
        </div>

        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeReport === item.id ? 'active' : ''}`}
            onClick={() => onSelectReport(item.id)}
          >
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: activeReport === item.id ? '#D97706' : '#1E293B',
                color: '#FFFFFF',
                fontWeight: 600,
              }}
            >
              {item.badge}
            </span>
          </button>
        ))}
      </nav>

      <div
        style={{
          padding: '16px',
          margin: '14px',
          backgroundColor: '#1E293B',
          borderRadius: '10px',
          fontSize: '0.8rem',
          color: '#94A3B8',
          border: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F1F5F9', fontWeight: 600, marginBottom: '4px' }}>
          <FileText size={16} color="#D97706" />
          <span>Examen Programación II</span>
        </div>
        <div>Universidad Mariano Gálvez</div>
        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
          Serie IV · Exportación PDF & Excel
        </div>
      </div>
    </aside>
  );
};
