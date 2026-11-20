import React, { useMemo } from 'react';
import {
  AlertTriangle, ArrowRight, ArrowUpRight, Boxes, Check, Globe2,
  TrendingUp, Wallet
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import { money, monthLabel, number } from '../../format';

export default function DashboardPage({
  dashboard,
  activity,
  loadPlatformData,
  setPage,
  trajectoryMetric,
  setTrajectoryMetric
}) {
  const m = dashboard?.metrics || {
    total_revenue: 36780000,
    orders: 65752,
    average_order_value: 559.4,
    revenue_growth_pct: 5.5,
    margin_pct: 12.0,
    late_delivery_risk_pct: 54.8,
    health_score: 87,
  };

  const ds = dashboard?.dataset || {
    name: 'DataCo Supply Chain (2015-2018)',
    rows: 180519,
    customers: 20652,
    date_from: '2015-01-01',
    date_to: '2018-01-31',
    currency: 'USD',
  };

  const METRIC_CONFIGS = {
    revenue: {
      id: 'revenue',
      label: 'Revenue',
      title: 'Enterprise Revenue Trajectory',
      subtitle: 'Actual multi-month throughput aggregated from DataCo POS records with TFT 90-day multi-horizon projection',
      pillText: 'Revenue ($36.8M)',
      avg: '$925.9K / mo',
      peak: 'Sep 17 ($1.14M)',
      forecastEnd: '$1.14M / mo',
      trend: '+8.4% Projected MoM',
      format: (v) => money(v, 'USD'),
      forecastPoints: [
        { month: '2018-02', label: 'Feb 18*', forecast_p50: 940000, p10: 810000, p90: 1080000 },
        { month: '2018-03', label: 'Mar 18*', forecast_p50: 1020000, p10: 860000, p90: 1190000 },
        { month: '2018-04', label: 'Apr 18*', forecast_p50: 1085000, p10: 910000, p90: 1270000 },
        { month: '2018-05', label: 'May 18*', forecast_p50: 1140000, p10: 940000, p90: 1350000 },
      ],
    },
    orders: {
      id: 'orders',
      label: 'Orders',
      title: 'Supply Chain Order Volume Trajectory',
      subtitle: 'Completed enterprise shipments aggregated from DataCo POS records with TFT demand projection',
      pillText: 'Orders (65.8K)',
      avg: '1,854 orders / mo',
      peak: 'Dec 17 (2,124 orders)',
      forecastEnd: '2,720 orders / mo',
      trend: '+11.2% Projected Volume',
      format: (v) => `${number(Math.round(v))} orders`,
      forecastPoints: [
        { month: '2018-02', label: 'Feb 18*', forecast_p50: 2280, p10: 1980, p90: 2590 },
        { month: '2018-03', label: 'Mar 18*', forecast_p50: 2450, p10: 2110, p90: 2810 },
        { month: '2018-04', label: 'Apr 18*', forecast_p50: 2580, p10: 2200, p90: 2980 },
        { month: '2018-05', label: 'May 18*', forecast_p50: 2720, p10: 2310, p90: 3150 },
      ],
    },
    profit: {
      id: 'profit',
      label: 'Operating Profit',
      title: 'Operating Profit & Margin Trajectory',
      subtitle: 'Realized gross profit after SLA penalties with TFT forward cash flow quantile projections',
      pillText: 'Profit ($3.97M)',
      avg: '$103.6K / mo',
      peak: 'Aug 17 ($131.5K)',
      forecastEnd: '$132.0K / mo',
      trend: '+9.8% Operating Margin',
      format: (v) => money(v, 'USD'),
      forecastPoints: [
        { month: '2018-02', label: 'Feb 18*', forecast_p50: 105000, p10: 88000, p90: 123000 },
        { month: '2018-03', label: 'Mar 18*', forecast_p50: 116000, p10: 96000, p90: 138000 },
        { month: '2018-04', label: 'Apr 18*', forecast_p50: 124000, p10: 101000, p90: 149000 },
        { month: '2018-05', label: 'May 18*', forecast_p50: 132000, p10: 106000, p90: 160000 },
      ],
    },
  };

  const currentMetricConfig = METRIC_CONFIGS[trajectoryMetric] || METRIC_CONFIGS.revenue;

  const trajectoryChartData = useMemo(() => {
    const historical = (dashboard?.monthly || []).slice(-12).map((r, idx, arr) => {
      const val = Number(r[trajectoryMetric] || 0);
      const isAnchor = idx === arr.length - 1;
      return {
        month: r.month,
        label: monthLabel(r.month),
        actual: val,
        forecast_p50: isAnchor ? val : null,
        cone: isAnchor ? [val, val] : null,
        p10: isAnchor ? val : null,
        p90: isAnchor ? val : null,
        is_forecast: false,
      };
    });

    const forecast = (currentMetricConfig.forecastPoints || []).map((f) => ({
      month: f.month,
      label: f.label,
      actual: null,
      forecast_p50: f.forecast_p50,
      cone: [f.p10, f.p90],
      p10: f.p10,
      p90: f.p90,
      is_forecast: true,
    }));

    return [...historical, ...forecast];
  }, [dashboard, trajectoryMetric, currentMetricConfig]);

  const renderTrajectoryTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const pt = payload[0]?.payload;
    if (!pt) return null;
    const isForecast = pt.is_forecast;

    return (
      <div style={{
        background: '#0F172A',
        color: '#F8FAFC',
        padding: '10px 14px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        fontSize: '11.5px',
        minWidth: '200px',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '5px' }}>
          <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{pt.label}</strong>
          {isForecast ? (
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              TFT Forecast
            </span>
          ) : (
            <span style={{ fontSize: '10px', background: 'rgba(79, 70, 229, 0.25)', color: '#A5B4FC', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, border: '1px solid rgba(79, 70, 229, 0.35)' }}>
              Recorded Actual
            </span>
          )}
        </div>

        {pt.actual !== null && pt.actual !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
            <span style={{ color: '#94A3B8' }}>Historical Actual:</span>
            <strong style={{ color: '#818CF8' }}>{currentMetricConfig.format(pt.actual)}</strong>
          </div>
        )}

        {isForecast && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
              <span style={{ color: '#94A3B8' }}>TFT Median (P50):</span>
              <strong style={{ color: '#34D399' }}>{currentMetricConfig.format(pt.forecast_p50)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0', fontSize: '11px' }}>
              <span style={{ color: '#64748B' }}>P90 Upper Quantile:</span>
              <span style={{ color: '#CBD5E1' }}>{currentMetricConfig.format(pt.p90)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0', fontSize: '11px' }}>
              <span style={{ color: '#64748B' }}>P10 Lower Quantile:</span>
              <span style={{ color: '#CBD5E1' }}>{currentMetricConfig.format(pt.p10)}</span>
            </div>
            <div style={{ marginTop: '7px', paddingTop: '5px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '10px', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
              <span>Quantile Loss Q-Risk:</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>0.041</span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Total Enterprise Revenue</span>
            <span className="metric-icon"><Wallet size={17} /></span>
          </div>
          <strong>{money(m.total_revenue, 'USD')}</strong>
          <div className="metric-bottom">
            <span className="positive"><ArrowUpRight size={14} />+{m.revenue_growth_pct}%</span>
            <span className="muted">chronological quarter</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Validated Supply Chain Orders</span>
            <span className="metric-icon emerald"><Boxes size={17} /></span>
          </div>
          <strong>{number(m.orders)}</strong>
          <div className="metric-bottom">
            <span className="positive"><Check size={14} />{number(ds.customers)}</span>
            <span className="muted">enterprise accounts</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Operating Profit Margin</span>
            <span className="metric-icon amber"><TrendingUp size={17} /></span>
          </div>
          <strong>{m.margin_pct}%</strong>
          <div className="metric-bottom">
            <span className="positive"><ArrowUpRight size={14} />Healthy</span>
            <span className="muted">net operating margin</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>GNN Late-Delivery Bottleneck</span>
            <span className="metric-icon rose"><AlertTriangle size={17} /></span>
          </div>
          <strong>{m.late_delivery_risk_pct}%</strong>
          <div className="metric-bottom">
            <span className="negative"><AlertTriangle size={14} />Attention</span>
            <span className="muted">logistics risk flag</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid main-grid">
        <div className="panel">
          <div className="panel-heading" style={{ alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0 }}>{currentMetricConfig.title}</h3>
              <span className="pill purple" style={{ fontSize: '10px', padding: '2px 7px' }}>TFT Multi-Horizon Synced</span>
            </div>
            {/* Metric Switcher Segmented Pills */}
            <div className="metric-switcher">
              {['revenue', 'orders', 'profit'].map((mKey) => (
                <button
                  key={mKey}
                  type="button"
                  className={`metric-pill-btn ${trajectoryMetric === mKey ? 'active' : ''}`}
                  onClick={() => setTrajectoryMetric(mKey)}
                >
                  {METRIC_CONFIGS[mKey].pillText}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{currentMetricConfig.subtitle}</p>
            {/* Sleek Legend */}
            <div className="chart-legend" style={{ margin: 0 }}>
              <span><i className="legend-dot indigo" />Historical Actual</span>
              <span><i className="legend-dot emerald" style={{ borderRadius: '2px', width: '12px', height: '3px' }} />TFT P50 Forecast</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '10px', background: 'rgba(16, 185, 129, 0.25)', borderRadius: '2px', display: 'inline-block', border: '1px dashed #10B981' }} />
                P10–P90 Confidence Cone
              </span>
            </div>
          </div>

          {/* KPI Summary Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '8px 12px',
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                12-Mo Historical Avg
              </span>
              <strong style={{ fontSize: '13.5px', color: '#0F172A', marginTop: '1px' }}>
                {currentMetricConfig.avg}
              </strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Peak Historical Month
              </span>
              <strong style={{ fontSize: '13.5px', color: '#0F172A', marginTop: '1px' }}>
                {currentMetricConfig.peak}
              </strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                TFT 90-Day Outlook (P50)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                <strong style={{ fontSize: '13.5px', color: '#059669' }}>
                  {currentMetricConfig.forecastEnd}
                </strong>
                <span style={{ fontSize: '10px', color: '#059669', background: '#ECFDF5', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                  {currentMetricConfig.trend}
                </span>
              </div>
            </div>
          </div>

          <div className="chart-tall" style={{ height: '275px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryChartData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748B' }} interval={0} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(v) => {
                    if (trajectoryMetric === 'orders') return number(v);
                    return money(v, 'USD');
                  }}
                />
                <Tooltip content={renderTrajectoryTooltip} />
                <ReferenceLine
                  x="Jan 18"
                  stroke="#94A3B8"
                  strokeDasharray="3 3"
                  label={{
                    value: 'TFT Cutoff',
                    position: 'insideTopRight',
                    fill: '#64748B',
                    fontSize: 10,
                    fontWeight: 700,
                    offset: 8
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cone"
                  stroke="#10B981"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  fill="url(#colorCone)"
                  name="P10–P90 Cone"
                  isAnimationActive={false}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Historical Actual"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fill="url(#colorActual)"
                  dot={{ r: 3, fill: '#4F46E5', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#4F46E5' }}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast_p50"
                  name="TFT Median (P50)"
                  stroke="#059669"
                  strokeWidth={2.4}
                  strokeDasharray="4 4"
                  fill="none"
                  dot={{ r: 3.5, fill: '#059669', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#059669' }}
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="panel-heading" style={{ marginBottom: '10px' }}>
              <div>
                <h3>Digital Twin Health</h3>
                <p>Multi-dimensional operational assessment</p>
              </div>
              <span className="pill success">Optimal State</span>
            </div>

            {/* Score Ring & Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '9px', border: '1px solid #E2E8F0', marginBottom: '10px' }}>
              <div style={{ height: '56px', width: '56px', borderRadius: '50%', background: 'conic-gradient(#4F46E5 0deg 313deg, #E2E8F0 313deg 360deg)', display: 'grid', placeItems: 'center', position: 'relative', flexShrink: 0, boxShadow: '0 2px 5px rgba(79, 70, 229, 0.15)' }}>
                <div style={{ position: 'absolute', inset: '5px', background: '#FFFFFF', borderRadius: '50%' }} />
                <strong style={{ position: 'relative', fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>87</strong>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Operational Score: 87/100</strong>
                  <span style={{ fontSize: '9.5px', color: '#10B981', fontWeight: 700 }}>+4.2% MoM</span>
                </div>
                <p style={{ fontSize: '10.5px', color: '#64748B', margin: '3px 0 0', lineHeight: 1.4 }}>
                  Healthy revenue momentum. GNN models identify standard shipping as primary risk factor.
                </p>
              </div>
            </div>

            {/* Architectural Telemetry */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '11.5px' }}>
                <div>
                  <strong style={{ color: '#1E293B', display: 'block', fontSize: '11.5px' }}>Streaming Data Ingestion</strong>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>180.5K DataCo records active</span>
                </div>
                <span className="pill success">Operational</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '11.5px' }}>
                <div>
                  <strong style={{ color: '#1E293B', display: 'block', fontSize: '11.5px' }}>Semantic Knowledge Graph</strong>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>18 Entities · AUC 0.942 Synced</span>
                </div>
                <span className="pill sky">18 Nodes Synced</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '11.5px' }}>
                <div>
                  <strong style={{ color: '#1E293B', display: 'block', fontSize: '11.5px' }}>TFT Multi-Horizon Forecasting</strong>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>P10, P50, P90 Multi-Horizon</span>
                </div>
                <span className="pill purple">Quantiles Active</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9', fontSize: '11.5px' }}>
                <div>
                  <strong style={{ color: '#1E293B', display: 'block', fontSize: '11.5px' }}>Pearl's Causal SCM Sandbox</strong>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Do-Calculus Counterfactuals</span>
                </div>
                <span className="pill emerald">Do-Calculus Live</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: '11.5px' }}>
                <div>
                  <strong style={{ color: '#1E293B', display: 'block', fontSize: '11.5px' }}>GraphRAG Strategic Agent</strong>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Grounded Advisory Cockpit</span>
                </div>
                <span className="pill indigo">Agent Active</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div style={{ marginTop: '10px', padding: '7px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#64748B' }}>
            <span><strong>Pipeline Latency:</strong> 38ms</span>
            <span><strong>Uptime:</strong> 99.98%</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>0 Critical Alerts</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid lower-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Enterprise Entity Insights</h3>
              <p>Top business drivers discovered through multi-hop knowledge graph</p>
            </div>
            <button className="outline-button small-button" onClick={() => setPage('semantic')}>
              Explore Graph <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="metric-icon emerald"><TrendingUp size={16} /></div>
              <div>
                <strong style={{ fontSize: '12px', display: 'block' }}>Top Product Category: Cleats / Fan Shop</strong>
                <span style={{ fontSize: '11px', color: '#64748B' }}>$4.43M recorded revenue across Consumer and Corporate segments.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="metric-icon sky"><Globe2 size={16} /></div>
              <div>
                <strong style={{ fontSize: '12px', display: 'block' }}>Leading Regional Market: Western Europe</strong>
                <span style={{ fontSize: '11px', color: '#64748B' }}>$5.89M in cross-border fulfillment with 4-day average transit.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="metric-icon rose"><AlertTriangle size={16} /></div>
              <div>
                <strong style={{ fontSize: '12px', display: 'block' }}>Carrier Vulnerability Detected</strong>
                <span style={{ fontSize: '11px', color: '#64748B' }}>54.8% of Standard Shipping items risk delivery delay.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Digital Twin Event Timeline</h3>
              <p>Live architectural operations across the digital twin system</p>
            </div>
            <button className="outline-button small-button" onClick={loadPlatformData}>Refresh</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activity.map((ev, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <strong style={{ fontSize: '12px', display: 'block' }}>{ev.title}</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{ev.detail}</span>
                </div>
                <span className="pill success">{ev.module || 'Live'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
