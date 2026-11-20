import React from 'react';

export default function ModelLabPage({ benchmarks }) {
  return (
    <>
      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Enterprise Model Lab &amp; Architectural Specifications</h3>
            <p>Chronological holdout benchmarking of Deep Learning Time-Series Architectures</p>
          </div>
          <span className="pill purple">Benchmark Leaderboard</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Category</th>
                <th>MAE</th>
                <th>RMSE</th>
                <th>MAPE</th>
                <th>Quantile Output</th>
                <th>Interpretability</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks?.models?.map((mdl, i) => (
                <tr key={i} className={i === 0 ? 'best-row' : ''}>
                  <td><strong>{mdl.name}</strong></td>
                  <td>{mdl.category}</td>
                  <td className="feed-mono">{mdl.mae}</td>
                  <td className="feed-mono">{mdl.rmse}</td>
                  <td className="feed-mono">{mdl.mape}</td>
                  <td>{mdl.quantile_support}</td>
                  <td>{mdl.interpretability}</td>
                  <td>
                    <span className={`pill ${i === 0 ? 'success' : 'purple'}`}>{mdl.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
