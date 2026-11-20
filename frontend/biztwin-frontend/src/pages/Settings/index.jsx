import React, { useState } from 'react';
import { Check, ShieldCheck, User, Building, Cpu } from 'lucide-react';
import { setApiBase } from '../../api';

export default function SettingsPage({
  apiUrl,
  setApiUrl,
  loadPlatformData,
  loadSemanticGraph,
  loadTFTForecast,
  tftTarget,
  notify,
  userProfile,
  setUserProfile
}) {
  const [nameInput, setNameInput] = useState(userProfile?.name || 'Sam Joshi');
  const [roleInput, setRoleInput] = useState(userProfile?.role || 'Enterprise Admin');

  const initials = (nameInput || 'SJ')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SJ';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      name: nameInput.trim() || 'Sam Joshi',
      role: roleInput.trim() || 'Enterprise Admin'
    };
    if (setUserProfile) {
      setUserProfile(updated);
      try {
        localStorage.setItem('biztwin_user_profile', JSON.stringify(updated));
      } catch {}
    }
    notify(`Profile updated: ${updated.name} (${updated.role})`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
      {/* 1. Executive Profile & Identity Section */}
      <div className="panel">
        <div className="panel-heading" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} style={{ color: '#4F46E5' }} />
              <h3>Executive Profile &amp; User Identity</h3>
            </div>
            <p style={{ marginTop: '3px' }}>
              Customize your displayed profile name, organizational role, and executive credentials
            </p>
          </div>
          <span className="pill green" style={{ fontSize: '10px' }}>
            <Check size={11} /> Active Session
          </span>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Avatar & Live Identity Preview */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px'
          }}>
            <div
              className="profile-avatar"
              style={{
                width: '48px',
                height: '48px',
                fontSize: '18px',
                fontWeight: 700,
                background: '#4F46E5',
                color: '#FFFFFF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
              }}
            >
              {initials}
            </div>
            <div>
              <strong style={{ fontSize: '15px', color: '#0F172A', display: 'block' }}>
                {nameInput || 'Enter your name'}
              </strong>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                {roleInput || 'Enter your role'} · Digital Twin Enterprise Workspace
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#1E293B' }}>
                Full Name
              </label>
              <input
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#0F172A'
                }}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Sam Joshi, Chirag K"
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#1E293B' }}>
                Executive Title / Role
              </label>
              <input
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#0F172A'
                }}
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="e.g. Enterprise Admin, Founder &amp; CEO"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="primary-button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', fontSize: '12.5px' }}
            >
              <Check size={14} /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. Workspace & Port Settings Section */}
      <div className="panel">
        <div className="panel-heading" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} style={{ color: '#4F46E5' }} />
              <h3>Digital Twin Workspace &amp; Deployment</h3>
            </div>
            <p style={{ marginTop: '3px' }}>
              Workspace preferences, FastAPI port binding &amp; deep forecasting architecture
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#1E293B' }}>
              FastAPI Backend URL &amp; Port
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12.5px', fontFamily: 'JetBrains Mono' }}
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://127.0.0.1:8000"
              />
              <button
                className="primary-button"
                onClick={() => {
                  setApiBase(apiUrl);
                  loadPlatformData();
                  loadSemanticGraph();
                  loadTFTForecast(tftTarget);
                  notify(`Connected to API at ${apiUrl}`);
                }}
              >
                Connect Port
              </button>
            </div>
            <small style={{ color: '#64748B', fontSize: '11px', display: 'block', marginTop: '4px' }}>
              Default: 8000. If another process uses port 8000, specify your custom port here (e.g. http://127.0.0.1:8001).
            </small>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#1E293B' }}>
              Enterprise Workspace Name
            </label>
            <input
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
              defaultValue="Acme Retail & Supply Chain Twin"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#1E293B' }}>
              Primary Forecasting Architecture
            </label>
            <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}>
              <option>Temporal Fusion Transformer (TFT) [Champion]</option>
              <option>iTransformer (Inverted Attention)</option>
              <option>PatchTST (Patch Tokenization)</option>
            </select>
          </div>

          <div>
            <button className="outline-button" onClick={() => notify('Workspace preferences saved.')}>
              Save Workspace Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
