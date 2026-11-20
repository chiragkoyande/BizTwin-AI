import React from 'react';
import { Activity, Menu, ZoomIn, ZoomOut } from 'lucide-react';

export default function Topbar({
  currentNav,
  setMobileNav,
  zoom,
  setZoom,
  apiUrl,
  setPage,
  dataset
}) {
  const ds = dataset || {
    date_from: '2015-01-01',
    date_to: '2018-01-31'
  };

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <button className="mobile-menu" onClick={() => setMobileNav(true)}>
          <Menu size={20} />
        </button>
        <span>Digital Twin</span>
        <span>/</span>
        <strong>{currentNav.label}</strong>
      </div>

      <div className="topbar-actions">
        <div className="zoom-widget" title="Display Zoom Scale">
          <button
            onClick={() => setZoom((z) => Math.max(90, z - 10))}
            disabled={zoom <= 90}
            aria-label="Zoom Out"
            title="Decrease scale"
          >
            <ZoomOut size={13} />
          </button>
          <span
            className="zoom-text"
            onClick={() => setZoom(110)}
            title="Click to reset (110%)"
            style={{ cursor: 'pointer' }}
          >
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(140, z + 10))}
            disabled={zoom >= 140}
            aria-label="Zoom In"
            title="Increase scale"
          >
            <ZoomIn size={13} />
          </button>
        </div>

        <div
          className="date-chip"
          style={{ cursor: 'pointer' }}
          onClick={() => setPage('settings')}
          title="Click to change port"
        >
          <span className="live-dot" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#4F46E5', fontWeight: 600 }}>
            PORT: {apiUrl.replace(/https?:\/\/[^:]+:/, '') || '8000'}
          </span>
        </div>
        <div className="date-chip">
          <Activity size={14} color="#4F46E5" />
          <span>{ds.date_from} → {ds.date_to}</span>
        </div>
        <span className="pill success">
          <span className="live-dot" /> Live Twin Engine
        </span>
      </div>
    </header>
  );
}
