import React from 'react';
import { ArrowRight } from 'lucide-react';
import { money } from '../../format';
import {
  curatedGraphNodes,
  curatedGraphEdges,
  bottleneckNodeIds
} from '../../constants/graphData';

export default function Phase2SemanticPage({
  graphFilter,
  setGraphFilter,
  selectedNode,
  setSelectedNode,
  loadSemanticGraph,
  setPage,
  notify
}) {
  return (
    <>
      <div className="subnav">
        <button
          className={graphFilter === 'all' ? 'selected' : ''}
          onClick={() => {
            setGraphFilter('all');
            setSelectedNode(null);
          }}
        >
          Heterogeneous Knowledge Graph
        </button>
        <button
          className={graphFilter === 'bottleneck' ? 'selected' : ''}
          onClick={() => {
            setGraphFilter('bottleneck');
            setSelectedNode(curatedGraphNodes.find(n => n.id === 'FulfillmentStatus:Late Delivery Risk'));
            notify('Highlighted Standard Logistics 54.8% Delay Bottleneck Pathway.');
          }}
        >
          Bottleneck Pathway (Late Risk)
        </button>
        <button
          className={graphFilter === 'products' ? 'selected' : ''}
          onClick={() => {
            setGraphFilter('products');
            notify('Filtered to Product & Supply Hierarchy.');
          }}
        >
          Product &amp; Supply Hierarchy
        </button>
        <button
          className={graphFilter === 'finance' ? 'selected' : ''}
          onClick={() => {
            setGraphFilter('finance');
            notify('Filtered to Financial Value Stream.');
          }}
        >
          Financial Value Stream
        </button>
        <button onClick={() => setPage('causal')}>
          Propagate to Causal SCM
        </button>
        <button onClick={() => {
          loadSemanticGraph();
          notify('Graph state synchronized with DataCo supply chain.');
        }}>
          Refresh Graph
        </button>
      </div>

      {/* TOP: Full-Width Spacious Graph Panel */}
      <div className="panel" style={{ marginBottom: '16px' }}>
        <div className="panel-heading">
          <div>
            <h3>Phase 2: Semantic Business Graph &amp; GNN Architecture</h3>
            <p>Multi-hop structural dependencies learned via Graph Convolutional Networks (Widescreen DAG Architecture)</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="pill sky">18 Core Entities · 24 Directed Links</span>
            <span className="pill success">AUC: 0.942</span>
          </div>
        </div>

        <div className="graph-canvas">
          <div className="graph-column-headers">
            <span style={{ left: '8.5%' }}>1. MARKET &amp; DEMAND</span>
            <span style={{ left: '29.2%' }}>2. CORE CATEGORIES</span>
            <span style={{ left: '50.0%' }}>3. SUPPLY &amp; HUBS</span>
            <span style={{ left: '70.7%' }}>4. LOGISTICS &amp; RISK</span>
            <span style={{ left: '91.5%' }}>5. FINANCIAL OUTCOMES</span>
          </div>

          <svg className="graph-lines" viewBox="0 0 1120 540" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Subtle dot grid blueprint pattern */}
              <pattern id="dot-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#E2E8F0" />
              </pattern>

              {/* Sleek, Professional Micro-Arrowheads */}
              <marker id="arr-default" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M 0 0.5 L 4 2.5 L 0 4.5 Z" fill="#94A3B8" />
              </marker>
              <marker id="arr-indigo" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M 0 0.5 L 4 2.5 L 0 4.5 Z" fill="#6366F1" />
              </marker>
              <marker id="arr-carrier" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M 0 0.5 L 4 2.5 L 0 4.5 Z" fill="#F59E0B" />
              </marker>
              <marker id="arr-risk" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M 0 0.5 L 4 2.5 L 0 4.5 Z" fill="#E11D48" />
              </marker>
              <marker id="arr-revenue" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M 0 0.5 L 4 2.5 L 0 4.5 Z" fill="#10B981" />
              </marker>
              <marker id="arr-highlight" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M 0 0.5 L 5 3 L 0 5.5 Z" fill="#4F46E5" />
              </marker>
            </defs>

            {/* Dot Grid Background */}
            <rect width="100%" height="100%" fill="url(#dot-grid)" opacity="0.75" />

            {/* Render Connection Edges */}
            {curatedGraphEdges.map((e, idx) => {
              const s = curatedGraphNodes.find(n => n.id === e.source);
              const t = curatedGraphNodes.find(n => n.id === e.target);
              if (!s || !t) return null;

              const isConn = selectedNode && (selectedNode.id === e.source || selectedNode.id === e.target);
              const isBottleneckEdge = (
                (e.source === 'CustomerSegment:Consumer' && e.target === 'Category:Cleats & Footwear') ||
                (e.source === 'Category:Cleats & Footwear' && e.target === 'Inventory:Central DC Hub') ||
                (e.source === 'Inventory:Central DC Hub' && e.target === 'Logistics:Standard Carrier Fleet') ||
                (e.source === 'Logistics:Standard Carrier Fleet' && e.target === 'FulfillmentStatus:Late Delivery Risk') ||
                (e.source === 'FulfillmentStatus:Late Delivery Risk' && e.target === 'FinancialOutcome:SLA Delay Penalties') ||
                (e.source === 'FinancialOutcome:SLA Delay Penalties' && e.target === 'FinancialOutcome:Operating Margin')
              );

              const isFilterActive =
                graphFilter === 'bottleneck' ? isBottleneckEdge :
                graphFilter === 'products' ? (e.relation === 'BUYS_FROM' || e.relation === 'MARKET_DEMAND' || e.relation === 'SUPPLIED_BY' || e.relation === 'STOCKED_AT' || e.relation === 'BUFFERED_IN') :
                graphFilter === 'finance' ? (e.relation === 'ROUTES_VIA' || e.relation === 'CAUSES_DELAY' || e.relation === 'FULFILLS' || e.relation === 'EXPEDITES' || e.relation === 'INFLICTS_PENALTY' || e.relation === 'ERODES_MARGIN' || e.relation === 'REALIZES_SALES' || e.relation === 'NET_PROFIT_FLOW' || e.relation === 'PREVENTS_STOCKOUT') :
                true;

              if (!isFilterActive && !isConn) return null;

              const isRiskEdge = isBottleneckEdge || e.relation === 'ERODES_MARGIN' || e.relation === 'CAUSES_DELAY' || e.relation === 'INFLICTS_PENALTY';
              const isRevEdge = e.relation === 'REALIZES_SALES' || e.relation === 'NET_PROFIT_FLOW' || e.relation === 'PREVENTS_STOCKOUT' || e.relation === 'EXPEDITES';
              const isCarrierEdge = e.relation === 'ROUTES_VIA';
              const isBuysEdge = e.relation === 'BUYS_FROM' || e.relation === 'MARKET_DEMAND' || e.relation === 'SUPPLIED_BY' || e.relation === 'STOCKED_AT' || e.relation === 'BUFFERED_IN';

              const strokeColor = isConn ? '#4F46E5' : isRiskEdge ? '#E11D48' : isRevEdge ? '#10B981' : isCarrierEdge ? '#F59E0B' : isBuysEdge ? '#6366F1' : '#94A3B8';
              const strokeWidth = isConn ? 2.0 : isRiskEdge ? 1.6 : isRevEdge ? 1.4 : 1.25;
              const marker = isConn ? 'url(#arr-highlight)' : isRiskEdge ? 'url(#arr-risk)' : isRevEdge ? 'url(#arr-revenue)' : isCarrierEdge ? 'url(#arr-carrier)' : isBuysEdge ? 'url(#arr-indigo)' : 'url(#arr-default)';

              // Precise connection port anchors
              let pathD = '';
              if (Math.abs(s.x - t.x) < 20) {
                // Vertical connection within same column
                const startY = s.y < t.y ? s.y + 22 : s.y - 22;
                const endY = s.y < t.y ? t.y - 22 : t.y + 22;
                pathD = `M ${s.x} ${startY} L ${t.x} ${endY}`;
              } else {
                // Forward bezier curve from source right port to target left port
                const sx = s.x + 63;
                const sy = s.y;
                const tx = t.x - 63;
                const ty = t.y;
                const dx = Math.max(35, Math.abs(tx - sx) * 0.45);
                pathD = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
              }

              // Midpoints for sleek badges
              const midX = (s.x + t.x) / 2;
              const midY = (s.y + t.y) / 2;

              return (
                <g key={`edge-${idx}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    markerEnd={marker}
                    className={isRiskEdge ? 'flow-edge' : ''}
                    opacity={selectedNode && !isConn ? 0.12 : 0.88}
                  />

                  {/* Sleek Edge Badges on Critical Paths */}
                  {e.relation === 'CAUSES_DELAY' && (
                    <foreignObject x={midX - 36} y={midY - 12} width={72} height={20} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                      <div style={{
                        background: '#FFF1F2',
                        color: '#BE123C',
                        border: '1px solid #FECDD3',
                        borderRadius: '3px',
                        fontSize: '7.5px',
                        fontWeight: 700,
                        padding: '1px 4px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(225, 29, 72, 0.1)'
                      }}>
                        54.8% Delay
                      </div>
                    </foreignObject>
                  )}

                  {e.relation === 'ERODES_MARGIN' && (
                    <foreignObject x={s.x + 10} y={midY - 10} width={76} height={20} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                      <div style={{
                        background: '#FFF1F2',
                        color: '#BE123C',
                        border: '1px solid #FECDD3',
                        borderRadius: '3px',
                        fontSize: '7.5px',
                        fontWeight: 700,
                        padding: '1px 4px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(225, 29, 72, 0.1)'
                      }}>
                        -$1.24M Drag
                      </div>
                    </foreignObject>
                  )}

                  {e.relation === 'NET_PROFIT_FLOW' && (
                    <foreignObject x={s.x - 82} y={midY - 10} width={74} height={20} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                      <div style={{
                        background: '#F0FDF4',
                        color: '#047857',
                        border: '1px solid #A7F3D0',
                        borderRadius: '3px',
                        fontSize: '7.5px',
                        fontWeight: 700,
                        padding: '1px 4px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(4, 120, 87, 0.1)'
                      }}>
                        10.8% Margin
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}

            {/* Render Subtle Connection Port Pins */}
            {curatedGraphNodes.map((node) => (
              <g key={`ports-${node.id}`} opacity={0.75}>
                <circle cx={node.x - 63} cy={node.y} r="2.5" fill="#FFFFFF" stroke={node.color} strokeWidth="1.2" />
                <circle cx={node.x + 63} cy={node.y} r="2.5" fill="#FFFFFF" stroke={node.color} strokeWidth="1.2" />
              </g>
            ))}

            {/* Render Sleek Node Cards */}
            {curatedGraphNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isBottleneck = bottleneckNodeIds.includes(node.id);
              const isDimmed =
                (graphFilter === 'bottleneck' && !isBottleneck) ||
                (graphFilter === 'products' && node.type !== 'Category' && node.type !== 'Supplier' && node.type !== 'Warehouse' && node.type !== 'CustomerSegment' && node.type !== 'Region') ||
                (graphFilter === 'finance' && node.type !== 'LogisticsCarrier' && node.type !== 'FulfillmentStatus' && node.type !== 'FinancialOutcome');
              const isConn = selectedNode && (
                selectedNode.id === node.id ||
                curatedGraphEdges.some(e => (e.source === selectedNode.id && e.target === node.id) || (e.target === selectedNode.id && e.source === node.id))
              );

              return (
                <foreignObject
                  key={`node-${node.id}`}
                  x={node.x - 63}
                  y={node.y - 22}
                  width={126}
                  height={44}
                  style={{ overflow: 'visible' }}
                >
                  <div
                    className={`graph-card ${isSelected ? 'card-selected' : ''} ${isDimmed && !isConn ? 'card-dimmed' : ''} ${graphFilter === 'bottleneck' && isBottleneck ? 'card-bottleneck' : ''}`}
                    style={{
                      borderColor: isSelected ? '#4F46E5' : node.color,
                      background: isSelected ? '#EEF2FF' : node.bg
                    }}
                    onClick={() => setSelectedNode(node)}
                    title={`${node.label} (${node.type}) - Click to inspect GNN properties`}
                  >
                    <small style={{ color: node.color }}>{node.type}</small>
                    <b>{node.label}</b>
                    <span className="card-sub">{node.sub}</span>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '11px', color: '#64748B', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span><i className="legend-dot" style={{ background: '#10B981' }} />Demand &amp; Fulfillment</span>
            <span><i className="legend-dot" style={{ background: '#4F46E5' }} />Core Categories</span>
            <span><i className="legend-dot" style={{ background: '#7C3AED' }} />Supply &amp; Hubs</span>
            <span><i className="legend-dot" style={{ background: '#F59E0B' }} />Carriers</span>
            <span><i className="legend-dot" style={{ background: '#E11D48' }} />Bottleneck Risk (54.8%)</span>
            <span><i className="legend-dot" style={{ background: '#059669' }} />Financial Outcomes</span>
          </div>
          <span style={{ color: '#94A3B8' }}>Interactive supply chain DAG · Click any entity to inspect multi-hop traversal</span>
        </div>
      </div>

      {/* BOTTOM: GNN Reasoning & Metrics in DOWN (3 Balanced Cards) */}
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>GNN Reasoning &amp; Causal Metrics</h3>
            <p>Heterogeneous link prediction, multi-hop traversal &amp; explainable structural embeddings</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="pill success">Link Prediction AUC: 0.942</span>
            <span className="pill indigo">PyTorch Geometric HGNN</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '14px' }}>
          {/* Card 1: Interactive Entity Inspector */}
          <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '11.5px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {selectedNode ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: '#0F172A' }}>{selectedNode.label}</strong>
                  <span className="pill" style={{ background: selectedNode.bg, color: selectedNode.color, border: `1px solid ${selectedNode.color}`, fontSize: '9.5px', padding: '1px 6px' }}>
                    {selectedNode.type}
                  </span>
                </div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#64748B' }}>
                  <div><strong>Economic Volume:</strong> {money(selectedNode.value, 'USD')}</div>
                  <div><strong>GNN Risk Score:</strong> {(selectedNode.risk * 100).toFixed(1)}% Attention</div>
                  <div><strong>Embedding Cluster:</strong> Cluster {selectedNode.type === 'Category' ? 1 : selectedNode.type === 'Warehouse' || selectedNode.type === 'Supplier' ? 2 : selectedNode.type === 'LogisticsCarrier' ? 4 : 3}</div>
                </div>

                <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #E2E8F0', fontSize: '10.5px' }}>
                  <strong style={{ color: '#334155' }}>Active Connections:</strong>
                  <ul style={{ paddingLeft: '14px', marginTop: '3px', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {curatedGraphEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).slice(0, 3).map((e, idx) => (
                      <li key={idx}>
                        {e.source === selectedNode.id ? (
                          <span>→ <strong style={{ color: '#4F46E5' }}>{e.relation}</strong> ({e.label}) → {e.target.split(':')[1]}</span>
                        ) : (
                          <span>← <strong style={{ color: '#4F46E5' }}>{e.relation}</strong> ({e.label}) ← {e.source.split(':')[1]}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '6px', fontSize: '12.5px' }}>Interactive Entity Inspector</strong>
                <p style={{ color: '#64748B', margin: 0, lineHeight: 1.5, fontSize: '11px' }}>
                  Click any node in the 5 supply chain tiers above to view GNN structural embeddings, learned link probabilities, and connected upstream/downstream dependencies.
                </p>
                <div style={{ marginTop: '10px', fontSize: '10.5px', color: '#4F46E5', fontWeight: 600 }}>
                  💡 Tip: Click Late Delivery Risk to view bottleneck exposure.
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Causal Bottleneck Pathway */}
          <div style={{ padding: '14px', background: '#FFF1F2', borderRadius: '10px', border: '1px solid #FECDD3', fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '12.5px', color: '#9F1239' }}>Causal Bottleneck Pathway (Paper Spec)</strong>
                <span className="pill danger" style={{ fontSize: '9px', padding: '1px 6px' }}>54.8% Delay</span>
              </div>
              <p style={{ fontSize: '10.5px', color: '#BE123C', fontFamily: 'JetBrains Mono', margin: 0, lineHeight: 1.6 }}>
                Consumer → BUYS → Cleats ($7.32M) → Central DC Hub → Standard Fleet → Late Delivery Risk (54.8%) → -$1.24M Margin Drag
              </p>
            </div>
            <div style={{ marginTop: '10px', fontSize: '10.5px', color: '#9F1239', lineHeight: 1.4 }}>
              Heterogeneous graph embeddings confirm <strong>Standard Carrier Fleet</strong> as the critical bottleneck propagating late penalties directly into gross profit margin.
            </div>
          </div>

          {/* Card 3: GNN Link Prediction Verification */}
          <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>GNN Link Prediction Verification</strong>
                <span className="pill success" style={{ fontSize: '9px', padding: '1px 6px' }}>AUC: 0.942</span>
              </div>
              <p style={{ color: '#64748B', margin: 0, lineHeight: 1.5, fontSize: '11px' }}>
                Heterogeneous GNN achieved <strong>0.942 AUC</strong> on holdout link prediction. Multi-hop traversal successfully maps non-linear supply chain risk across 5 tiers from Customer Demand to Operating Cash Flow.
              </p>
            </div>
            <button
              className="primary-button"
              style={{ marginTop: '12px', width: '100%', justifyContent: 'center', fontSize: '11px', padding: '7px 12px' }}
              onClick={() => setPage('causal')}
            >
              Simulate Intervention in What-If Sandbox <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
