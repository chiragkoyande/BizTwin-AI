import React from 'react';
import { GitBranch } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import { money, number, pct } from '../../format';

export default function CausalPage({
  marketingChange,
  setMarketingChange,
  priceChange,
  setPriceChange,
  supplierDelay,
  setSupplierDelay,
  inventoryBuffer,
  setInventoryBuffer,
  causalResult,
  setPage,
  notify
}) {
  return (
    <>
      <div className="subnav">
        <button className="selected">Pearl's Do-Calculus Decision Sandbox</button>
        <button onClick={() => notify('DAG Interventions: SCM equations evaluated without confounding bias.')}>
          Causal DAG SCM
        </button>
        <button onClick={() => setPage('assistant')}>
          Consult GraphRAG Assistant
        </button>
      </div>

      <div className="dashboard-grid main-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Pearl's Do-Calculus Counterfactual Sandbox</h3>
              <p>Evaluate operational business interventions before real-world execution</p>
            </div>
            <span className="pill success">SCM Propagation Active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="slider-field">
              <div className="slider-label">
                <label>do(Marketing Spend)</label>
                <b>{marketingChange > 0 ? '+' : ''}{marketingChange}%</b>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={marketingChange}
                onChange={(e) => setMarketingChange(Number(e.target.value))}
              />
              <div className="range-labels"><span>-30%</span><span>+50%</span></div>
            </div>

            <div className="slider-field">
              <div className="slider-label">
                <label>do(Dynamic Pricing)</label>
                <b>{priceChange > 0 ? '+' : ''}{priceChange}%</b>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={priceChange}
                onChange={(e) => setPriceChange(Number(e.target.value))}
              />
              <div className="range-labels"><span>-20%</span><span>+20%</span></div>
            </div>

            <div className="slider-field">
              <div className="slider-label">
                <label>do(Supplier Delay)</label>
                <b>{supplierDelay > 0 ? '+' : ''}{supplierDelay} days</b>
              </div>
              <input
                type="range"
                min="-5"
                max="15"
                value={supplierDelay}
                onChange={(e) => setSupplierDelay(Number(e.target.value))}
              />
              <div className="range-labels"><span>-5 days</span><span>+15 days</span></div>
            </div>

            <div className="slider-field">
              <div className="slider-label">
                <label>do(Inventory Safety Buffer)</label>
                <b>{inventoryBuffer > 0 ? '+' : ''}{inventoryBuffer}%</b>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                value={inventoryBuffer}
                onChange={(e) => setInventoryBuffer(Number(e.target.value))}
              />
              <div className="range-labels"><span>-20%</span><span>+50%</span></div>
            </div>
          </div>

          <div className="impact-grid">
            <div className="impact-card">
              <span>Counterfactual Revenue</span>
              <strong>{money(causalResult?.scenario?.revenue, 'USD')}</strong>
              <small className={causalResult?.delta?.revenue >= 0 ? 'positive' : 'negative'}>
                {pct(causalResult?.delta?.revenue_change_pct)} vs Factual
              </small>
            </div>

            <div className="impact-card">
              <span>Counterfactual Profit</span>
              <strong>{money(causalResult?.scenario?.profit, 'USD')}</strong>
              <small className={causalResult?.delta?.profit >= 0 ? 'positive' : 'negative'}>
                {pct(causalResult?.delta?.profit_change_pct)} vs Factual
              </small>
            </div>

            <div className="impact-card">
              <span>Projected Margin</span>
              <strong>{causalResult?.scenario?.margin_pct}%</strong>
              <small className="muted">operating margin</small>
            </div>

            <div className="impact-card">
              <span>Demand Units</span>
              <strong>{number(causalResult?.scenario?.estimated_demand_units)}</strong>
              <small className="muted">demand-adjusted</small>
            </div>
          </div>

          <div className="causal-pathway-box">
            <h4><GitBranch size={15} /> Explainable Causal Pathway (Pearl's SCM)</h4>
            {causalResult?.explainable_causal_pathway?.map((step, idx) => (
              <div key={idx} className="causal-step">{step}</div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Counterfactual Cash Flow</h3>
              <p>Factual Baseline vs Intervened Trajectory</p>
            </div>
            <span className="pill emerald">6-Week Simulation</span>
          </div>

          <div className="chart-tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={causalResult?.cash_flow_projection?.weeks?.map((w, i) => ({
                  week: w,
                  Baseline: causalResult.cash_flow_projection.baseline_cash_flow[i],
                  Counterfactual: causalResult.cash_flow_projection.counterfactual_cash_flow[i],
                })) || []}
                margin={{ top: 12, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => money(v, 'USD')} />
                <Tooltip formatter={(v) => money(v, 'USD')} />
                <Legend />
                <Bar dataKey="Baseline" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Counterfactual" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
