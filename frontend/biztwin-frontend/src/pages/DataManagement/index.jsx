import React from 'react';
import { CloudUpload, Loader2, RefreshCw } from 'lucide-react';
import { number } from '../../format';

export default function DataManagementPage({
  dataset,
  profile,
  loading,
  fileRef,
  handleFileUpload,
  handleResetDataset
}) {
  const ds = dataset || {
    name: 'DataCo Supply Chain (2015-2018)',
    rows: 180519,
    orders: 65752,
    customers: 20652
  };

  return (
    <>
      <div className="dashboard-grid main-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Enterprise Dataset Management</h3>
              <p>Active Digital Twin Data Source: {ds.name}</p>
            </div>
            <button className="outline-button small-button" onClick={handleResetDataset}>
              <RefreshCw size={14} /> Reset to DataCo Default
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div className="impact-card">
              <span>Synchronized Rows</span>
              <strong>{number(profile?.rows || ds.rows)}</strong>
            </div>
            <div className="impact-card">
              <span>Orders Captured</span>
              <strong>{number(profile?.orders || ds.orders)}</strong>
            </div>
            <div className="impact-card">
              <span>Customer Accounts</span>
              <strong>{number(profile?.customers || ds.customers)}</strong>
            </div>
          </div>

          <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '36px', textAlign: 'center', background: '#F8FAFC' }}>
            <CloudUpload size={36} color="#4F46E5" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Upload New Business Dataset</h4>
            <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '400px', margin: '0 auto 16px' }}>
              Upload CSV or Excel transactions with date, quantity, and sales columns to dynamically recompute the Digital Twin.
            </p>
            <input
              type="file"
              ref={fileRef}
              style={{ display: 'none' }}
              accept=".csv,.xlsx,.xls"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
            />
            <button className="primary-button" onClick={() => fileRef.current?.click()} disabled={loading}>
              {loading ? <Loader2 size={14} className="spin" /> : <CloudUpload size={14} />} Choose Dataset File
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Pipeline Specifications</h3>
              <p>Active Multi-Modal Schema</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span>Order ID &amp; Date Orders</span>
              <span className="pill success">Validated</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span>Customer Segment &amp; Country</span>
              <span className="pill success">Validated</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span>Category &amp; Department</span>
              <span className="pill success">Validated</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span>Shipping Days (Real vs Scheduled)</span>
              <span className="pill success">Validated</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span>Late Delivery Risk Flag</span>
              <span className="pill success">Validated</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
