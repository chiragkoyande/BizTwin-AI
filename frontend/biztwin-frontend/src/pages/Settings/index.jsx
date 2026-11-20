import React from 'react';
import { setApiBase } from '../../api';

export default function SettingsPage({
  apiUrl,
  setApiUrl,
  loadPlatformData,
  loadSemanticGraph,
  loadTFTForecast,
  tftTarget,
  notify
}) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h3>Enterprise Digital Twin Settings</h3>
          <p>Workspace Configuration, Port Binding &amp; Deployment Preferences</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '520px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            FastAPI Backend URL &amp; Port
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '12.5px', fontFamily: 'JetBrains Mono' }}
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000"
            />
            <button className="primary-button" onClick={() => {
              setApiBase(apiUrl);
              loadPlatformData();
              loadSemanticGraph();
              loadTFTForecast(tftTarget);
              notify(`Connected to API at ${apiUrl}`);
            }}>
              Connect Port
            </button>
          </div>
          <small style={{ color: '#64748B', fontSize: '11px', display: 'block', marginTop: '4px' }}>
            Default: 8000. If another process is using port 8000, specify your custom port here (e.g. http://127.0.0.1:8001).
          </small>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Enterprise Workspace Name
          </label>
          <input
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px' }}
            defaultValue="Acme Retail & Supply Chain Twin"
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Primary Forecasting Architecture
          </label>
          <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px' }}>
            <option>Temporal Fusion Transformer (TFT) [Champion]</option>
            <option>iTransformer (Inverted Attention)</option>
            <option>PatchTST (Patch Tokenization)</option>
          </select>
        </div>
        <button className="outline-button" onClick={() => notify('Workspace preferences saved.')}>
          Save Configuration
        </button>
      </div>
    </div>
  );
}
