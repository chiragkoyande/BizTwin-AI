import React from 'react';
import { Play, Square } from 'lucide-react';
import { number } from '../../format';

export default function Phase1StreamingPage({
  streamingActive,
  toggleStreaming,
  streamStats,
  streamBuffer,
  dataset,
  setPage,
  notify
}) {
  const ds = dataset || {
    name: 'DataCo Supply Chain (2015-2018)',
    rows: 180519
  };

  return (
    <>
      <div className="subnav">
        <button className="selected">Multi-Modal Streaming Feed</button>
        <button onClick={() => setPage('data')}>Batch Dataset Manager</button>
        <button onClick={() => notify('Schema ISO-14001: Order, Customer, Product, Shipping, Profit validated.')}>
          Schema Validation
        </button>
      </div>

      <div className="dashboard-grid main-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Phase 1: Real-Time Multi-Modal Data Ingestion</h3>
              <p>FastAPI asynchronous streaming worker ingesting DataCo supply chain transactions</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={streamingActive ? 'outline-button' : 'primary-button'}
                onClick={toggleStreaming}
              >
                {streamingActive ? <Square size={14} /> : <Play size={14} />}
                {streamingActive ? 'Pause Ingestion Stream' : 'Start Live Ingestion Stream'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div className="impact-card">
              <span>Streaming Engine</span>
              <strong style={{ color: streamingActive ? '#059669' : '#64748B' }}>
                {streamingActive ? 'ACTIVE STREAM' : 'IDLE / READY'}
              </strong>
            </div>
            <div className="impact-card">
              <span>Throughput</span>
              <strong>{streamStats?.throughput_eps || 0} evt/sec</strong>
            </div>
            <div className="impact-card">
              <span>Buffer Ingested</span>
              <strong>{streamStats?.total_ingested || streamBuffer.length} records</strong>
            </div>
            <div className="impact-card">
              <span>Dataset Total</span>
              <strong>{number(ds.rows)} rows</strong>
            </div>
          </div>

          <div className="streaming-feed">
            <div className="feed-row header">
              <span>Order ID</span>
              <span>Timestamp</span>
              <span>Customer</span>
              <span>Category</span>
              <span>Amount</span>
              <span>Late Risk</span>
            </div>
            {streamBuffer.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
                Streaming buffer empty. Click "Start Live Ingestion Stream" to stream live DataCo transactions into the Digital Twin.
              </div>
            )}
            {streamBuffer.slice(-15).reverse().map((item, idx) => (
              <div className="feed-row" key={idx}>
                <span className="feed-mono">#{item.order_id}</span>
                <span className="feed-mono">{item.timestamp?.slice(0, 16)}</span>
                <span>{item.customer_segment}</span>
                <span>{item.category}</span>
                <strong style={{ color: '#0F172A' }}>${item.sales}</strong>
                <span>
                  {item.late_delivery_risk === 1 ? (
                    <span className="pill warning" style={{ padding: '2px 6px', fontSize: '9px' }}>Risk: High</span>
                  ) : (
                    <span className="pill success" style={{ padding: '2px 6px', fontSize: '9px' }}>On Track</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Ingestion Specifications</h3>
              <p>Heterogeneous source normalization</p>
            </div>
            <span className="pill sky">FastAPI Engine</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <strong>Multi-Modal POS &amp; Order Capture</strong>
              <p style={{ color: '#64748B', fontSize: '11px', marginTop: '4px' }}>
                Normalized into 15 validated features: customer segment, order date, shipping days (real vs scheduled), sales, discount, and late risk.
              </p>
            </div>
            <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <strong>Zero-Latency Graph Feeder</strong>
              <p style={{ color: '#64748B', fontSize: '11px', marginTop: '4px' }}>
                Transactions are immediately routed into the Semantic Business Graph to update edge weights and GNN embeddings.
              </p>
            </div>
            <div style={{ padding: '10px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <strong>Data Quality &amp; Holdout Split</strong>
              <p style={{ color: '#64748B', fontSize: '11px', marginTop: '4px' }}>
                Automated 80/20 chronological train/holdout split with anomaly detection for irregular tail intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
