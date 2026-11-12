import React from 'react';
import { Hammer, Server, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  connectionStatus: 'checking' | 'connected' | 'disconnected';
  onCheckConnection: () => void;
  apiUrl: string;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  onCheckConnection,
  apiUrl,
}) => {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #D97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(30, 58, 138, 0.25)',
          }}
        >
          <Hammer size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Ferretería FinalB
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
            Módulo de Inteligencia de Negocios y Reportes Oficiales
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '30px',
            backgroundColor:
              connectionStatus === 'connected'
                ? '#ECFDF5'
                : connectionStatus === 'disconnected'
                ? '#FEF2F2'
                : '#F1F5F9',
            border: `1px solid ${
              connectionStatus === 'connected'
                ? '#A7F3D0'
                : connectionStatus === 'disconnected'
                ? '#FECACA'
                : '#CBD5E1'
            }`,
          }}
        >
          {connectionStatus === 'connected' ? (
            <>
              <CheckCircle2 size={16} color="#059669" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#065F46' }}>
                Backend Conectado ({apiUrl})
              </span>
            </>
          ) : connectionStatus === 'disconnected' ? (
            <>
              <XCircle size={16} color="#DC2626" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#991B1B' }}>
                Backend No Disponible ({apiUrl})
              </span>
            </>
          ) : (
            <>
              <Server size={16} color="#64748B" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                Verificando conexión...
              </span>
            </>
          )}

          <button
            onClick={onCheckConnection}
            title="Reintentar conexión"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              color: '#64748B',
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
