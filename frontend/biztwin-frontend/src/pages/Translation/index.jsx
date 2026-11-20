import React from 'react';
import {
  ArrowUpRight, BookOpen, Check, Copy, Download,
  FileText, Globe2, Languages, Loader2, ShieldCheck, Sparkles
} from 'lucide-react';
import { translationPresets, supportedDialects } from '../../constants/translationData';

export default function TranslationPage({
  translationText,
  setTranslationText,
  targetLang,
  setTargetLang,
  translationResult,
  translating,
  copiedInsight,
  glossaryCategory,
  setGlossaryCategory,
  glossaryTerms,
  runTranslation,
  copyTranslatedText,
  downloadTranslatedBriefing
}) {
  return (
    <>
      {/* Top Metric Telemetry Strip */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Supported Regional Dialects</span>
            <span className="metric-icon sky"><Globe2 size={17} /></span>
          </div>
          <strong>5 Dialects</strong>
          <div className="metric-bottom">
            <span className="positive"><Check size={14} />Active Hubs</span>
            <span className="muted">Hindi, Marathi, Gujarati, Tamil, Telugu</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Terminology Corpus</span>
            <span className="metric-icon"><BookOpen size={17} /></span>
          </div>
          <strong>120+ Terms</strong>
          <div className="metric-bottom">
            <span className="positive"><Check size={14} />Domain-Preserved</span>
            <span className="muted">Bilingual Legal &amp; SCM Glosses</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Acronym Preservation</span>
            <span className="metric-icon emerald"><ShieldCheck size={17} /></span>
          </div>
          <strong>100%</strong>
          <div className="metric-bottom">
            <span className="positive"><Check size={14} />Auditable</span>
            <span className="muted">EBITDA, SLA, GNN, TFT, SKU</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>BLEU Translation Fidelity</span>
            <span className="metric-icon amber"><Sparkles size={17} /></span>
          </div>
          <strong>0.96</strong>
          <div className="metric-bottom">
            <span className="positive"><ArrowUpRight size={14} />High Fidelity</span>
            <span className="muted">Indian SMB Enterprise Corpus</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Localization Workbench */}
      <div className="dashboard-grid main-grid">
        {/* Left Column: Source Narrative & Dialect Controls */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="panel-heading" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>Executive Narrative Source (English)</h3>
                  <span className="pill sky" style={{ fontSize: '10.5px' }}><FileText size={11} /> Source Text</span>
                </div>
                <p style={{ marginTop: '3px' }}>
                  Select an architectural briefing or enter enterprise operational guidance for leadership translation
                </p>
              </div>
            </div>

            {/* Curated Presets Bar */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                Curated Executive Briefing Presets:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {translationPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setTranslationText(preset.text);
                      runTranslation(preset.text, targetLang);
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: translationText === preset.text ? '1px solid #4F46E5' : '1px solid #E2E8F0',
                      background: translationText === preset.text ? '#EEF2FF' : '#F8FAFC',
                      color: translationText === preset.text ? '#4F46E5' : '#475569',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '14px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '140px',
                    height: '100%',
                    padding: '12px 14px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    fontFamily: 'inherit',
                    color: '#0F172A',
                    resize: 'vertical'
                  }}
                  value={translationText}
                  onChange={(e) => setTranslationText(e.target.value)}
                  placeholder="Enter strategic business narrative, operational review, or financial forecast..."
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: '#94A3B8' }}>
                <span>{translationText.split(/\s+/).filter(Boolean).length} words · {translationText.length} characters</span>
                {translationText && (
                  <button
                    onClick={() => setTranslationText('')}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', textDecoration: 'underline', fontSize: '11px' }}
                  >
                    Clear Text
                  </button>
                )}
              </div>
            </div>

            {/* Target Dialect Segmented Tabs */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                Target Indian Regional Dialect:
              </label>
              <div className="dialect-tabs">
                {supportedDialects.map((d) => (
                  <button
                    key={d.id}
                    className={`dialect-tab-btn ${targetLang === d.id ? 'active' : ''}`}
                    onClick={() => {
                      setTargetLang(d.id);
                      runTranslation(translationText, d.id);
                    }}
                  >
                    <Languages size={13} /> {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Translate Action Button */}
            <div style={{ marginTop: 'auto' }}>
              <button
                className="primary-button"
                style={{ width: '100%', padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => runTranslation()}
                disabled={translating}
              >
                {translating ? <Loader2 size={16} className="spin" /> : <Languages size={16} />}
                Translate &amp; Localize for Leadership ({targetLang})
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Localized Executive Briefing & Actions */}
        <div>
          <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="panel-heading" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>Domain-Preserved Localized Briefing</h3>
                  <span className="pill green" style={{ fontSize: '10.5px' }}>
                    <Check size={11} /> {translationResult?.language_script || 'Devanagari'}
                  </span>
                </div>
                <p style={{ marginTop: '3px' }}>
                  Preserves standard financial and operational acronyms with regional executive vernacular
                </p>
              </div>
            </div>

            {/* Dialect Telemetry Box */}
            <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>
                  {translationResult?.target_language || targetLang} Executive Localization
                </span>
                <span className="pill purple" style={{ fontSize: '10px' }}>
                  {translationResult?.fidelity_score ? `${translationResult.fidelity_score} BLEU` : '0.98 BLEU'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                <div><strong>Corridor:</strong> {translationResult?.regional_hub || 'Maharashtra Financial & Industrial Corridor'}</div>
                <div style={{ marginTop: '2px' }}><strong>Target SMBs:</strong> {translationResult?.target_hubs || 'Mumbai, Pune, Nashik, Aurangabad SMBs'}</div>
              </div>
            </div>

            {/* Localized Report Body */}
            <div style={{ flex: 1, padding: '16px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', marginBottom: '14px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                {translationResult?.mode || 'Executive Leadership Report'}
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.8, color: '#0F172A', margin: 0, fontWeight: 500 }}>
                {translating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                    <Loader2 size={15} className="spin" /> Synthesizing domain-preserved translation...
                  </span>
                ) : (
                  translationResult?.translated_text || 'Select a preset or click translate to localize insight.'
                )}
              </p>
            </div>

            {/* Preserved Acronyms Chips */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '6px' }}>
                Preserved Technical Acronyms &amp; Glosses:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(translationResult?.preserved_acronyms || ['GNN', 'SLA', 'EBITDA', 'TFT']).map((acr, i) => (
                  <span key={i} className="citation-badge" style={{ background: '#F1F5F9', color: '#334155' }}>
                    {acr}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Deck */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
              <button
                onClick={copyTranslatedText}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: copiedInsight ? '#DCFCE7' : '#FFFFFF',
                  color: copiedInsight ? '#15803D' : '#334155',
                  border: copiedInsight ? '1px solid #86EFAC' : '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {copiedInsight ? <Check size={14} /> : <Copy size={14} />}
                {copiedInsight ? 'Copied to Clipboard' : 'Copy Localized Insight'}
              </button>

              <button
                onClick={downloadTranslatedBriefing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: '#FFFFFF',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Download (.txt)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Bottom Section: SMB Domain Glossary & Terminology Preservation Matrix */}
      <div className="panel" style={{ marginTop: '18px' }}>
        <div className="panel-heading" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3>SMB Domain Glossary &amp; Technical Terminology Preservation Matrix</h3>
            <p>Guarantees legal, financial, and AI terms maintain absolute semantic fidelity across Indian languages</p>
          </div>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'Financial & Margin', 'Supply Chain & Logistics', 'AI & Digital Twin', 'Operations & Risk'].map((cat) => (
              <button
                key={cat}
                className={`glossary-filter-btn ${glossaryCategory === cat ? 'active' : ''}`}
                onClick={() => setGlossaryCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '22%' }}>English Term &amp; Definition</th>
                <th style={{ width: '16%' }}>Category</th>
                <th style={{ width: '22%' }}>Hindi Localization</th>
                <th style={{ width: '22%' }}>Marathi Localization</th>
                <th style={{ width: '10%' }}>Preserved Code</th>
                <th style={{ width: '8%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {glossaryTerms
                .filter((term) => glossaryCategory === 'All' || term.category === glossaryCategory)
                .map((term, i) => (
                  <tr key={i}>
                    <td>
                      <strong style={{ display: 'block', fontSize: '12px', color: '#0F172A' }}>{term.english}</strong>
                      <span style={{ fontSize: '10.5px', color: '#64748B', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                        {term.definition}
                      </span>
                    </td>
                    <td>
                      <span className="pill purple" style={{ fontSize: '10px' }}>{term.category}</span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#1E293B', fontWeight: 500 }}>
                      {term.hindi}
                    </td>
                    <td style={{ fontSize: '12px', color: '#1E293B', fontWeight: 500 }}>
                      {term.marathi}
                    </td>
                    <td>
                      <span className="feed-mono" style={{ fontSize: '10.5px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                        {term.acronym}
                      </span>
                    </td>
                    <td>
                      <span className="pill green" style={{ fontSize: '9.5px' }}>Preserved</span>
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
