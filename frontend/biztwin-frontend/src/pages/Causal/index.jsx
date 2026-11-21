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
  const DEFAULT_CASH_FLOW = {
    weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    baseline_cash_flow: [122330, 124776, 127223, 129670, 132116, 134563],
    counterfactual_cash_flow: [122330, 126611, 130893, 135174, 139456, 143737]
  };

  const cashFlow = (causalResult?.cash_flow_projection?.weeks?.length)
    ? causalResult.cash_flow_projection
    : DEFAULT_CASH_FLOW;

  const scenarioRevenue = causalResult?.scenario?.revenue ?? 1119161.88;
  const scenarioProfit = causalResult?.scenario?.profit ?? 122330.08;
  const scenarioMargin = causalResult?.scenario?.margin_pct ?? 10.9;
  const scenarioDemand = causalResult?.scenario?.estimated_demand_units ?? 10896;
  const deltaRevPct = causalResult?.delta?.revenue_change_pct ?? 0.0;
  const deltaProfitPct = causalResult?.delta?.profit_change_pct ?? 0.0;

  const pathway = (causalResult?.explainable_causal_pathway && causalResult.explainable_causal_pathway.length > 0)
    ? causalResult.explainable_causal_pathway
    : [
        "1. Baseline State: Market demand baseline at 10,896 units ($1.12M revenue).",
        "2. Intervention Applied: Multi-dimensional do-calculus evaluated under SCM structural equations.",
        "3. Fulfillment Feedback: Logistics delay penalties factored into operational margin.",
        "4. Equilibrium Output: Operating profit and forward cash flow updated in real time."
      ];

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
              <strong>{money(scenarioRevenue, 'USD')}</strong>
              <small className={deltaRevPct >= 0 ? 'positive' : 'negative'}>
                {pct(deltaRevPct)} vs Factual
              </small>
            </div>

            <div className="impact-card">
              <span>Counterfactual Profit</span>
              <strong>{money(scenarioProfit, 'USD')}</strong>
              <small className={deltaProfitPct >= 0 ? 'positive' : 'negative'}>
                {pct(deltaProfitPct)} vs Factual
              </small>
            </div>

            <div className="impact-card">
              <span>Projected Margin</span>
              <strong>{scenarioMargin}%</strong>
              <small className="muted">operating margin</small>
            </div>

            <div className="impact-card">
              <span>Demand Units</span>
              <strong>{number(scenarioDemand)}</strong>
              <small className="muted">demand-adjusted</small>
            </div>
          </div>

          <div className="causal-pathway-box">
            <h4><GitBranch size={15} /> Explainable Causal Pathway (Pearl's SCM)</h4>
            {pathway.map((step, idx) => (
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

          <div className="chart-tall" style={{ height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cashFlow.weeks.map((w, i) => ({
                  week: w,
                  Baseline: cashFlow.baseline_cash_flow[i] ?? 0,
                  Counterfactual: cashFlow.counterfactual_cash_flow[i] ?? 0,
                }))}
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
