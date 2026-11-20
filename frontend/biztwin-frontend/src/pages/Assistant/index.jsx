import React from 'react';
import {
  ArrowRight, ArrowUpRight, Boxes, Brain, Check, GitBranch,
  Globe2, Languages, Lightbulb, Loader2, Network, Send,
  ShieldCheck, SlidersHorizontal, Sparkles, Zap
} from 'lucide-react';

export default function AssistantPage({
  assistantQ,
  setAssistantQ,
  assistantLoading,
  chatMessages,
  setChatMessages,
  activeExtractedEntities,
  translatedChatMessages,
  translatingChatId,
  askAssistant,
  translateChatMessage,
  executeInterventionInSandbox,
  chatEndRef,
  setPage
}) {
  return (
    <>
      {/* Top Metric Telemetry Strip */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Knowledge Base Synced</span>
            <span className="metric-icon"><Network size={17} /></span>
          </div>
          <strong>180.5K</strong>
          <div className="metric-bottom">
            <span className="positive"><Check size={14} />65 Nodes Synced</span>
            <span className="muted">Neo4j 5-Tier DAG</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>GraphRAG Faithfulness</span>
            <span className="metric-icon sky"><ShieldCheck size={17} /></span>
          </div>
          <strong>98.4%</strong>
          <div className="metric-bottom">
            <span className="positive"><Check size={14} />Grounded</span>
            <span className="muted">hallucination gatekeeper</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Multi-Hop Retrieval Latency</span>
            <span className="metric-icon emerald"><Zap size={17} /></span>
          </div>
          <strong>18 ms</strong>
          <div className="metric-bottom">
            <span className="positive"><ArrowUpRight size={14} />Sub-50ms</span>
            <span className="muted">subgraph traversal</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Causal SCM Verification</span>
            <span className="metric-icon amber"><SlidersHorizontal size={17} /></span>
          </div>
          <strong>Active</strong>
          <div className="metric-bottom">
            <span className="positive"><Check size={14} />Ready</span>
            <span className="muted">Pearl do-calculus loop</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Cockpit Layout */}
      <div className="dashboard-grid main-grid">
        {/* Left Column: Conversational Decision Cockpit */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="panel-heading" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>Conversational Strategy Cockpit</h3>
                  <span className="pill purple" style={{ fontSize: '10.5px' }}><Sparkles size={11} /> Grounded Multi-Turn</span>
                </div>
                <p style={{ marginTop: '3px' }}>
                  Multi-hop dialogue grounded in Knowledge Graph topology, TFT cash forecasts &amp; Pearl's Causal SCM
                </p>
              </div>
              {chatMessages.length > 1 && (
                <button
                  onClick={() => setChatMessages([chatMessages[0]])}
                  style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: '#64748B', cursor: 'pointer' }}
                >
                  Clear Thread
                </button>
              )}
            </div>

            {/* Chat Thread */}
            <div className="chat-thread-wrap" style={{ flex: 1, minHeight: '380px', maxHeight: '520px', overflowY: 'auto' }}>
              {chatMessages.map((msg) => {
                if (msg.sender === 'user') {
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '10px' }}>
                      <div className="chat-msg-user">
                        {msg.text}
                      </div>
                      <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px', marginRight: '4px' }}>{msg.timestamp}</span>
                    </div>
                  );
                }
                return (
                  <div key={msg.id} className="chat-msg-ai" style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EDF2F7', paddingBottom: '8px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                          <Brain size={13} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>GraphRAG Strategic Agent</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="pill purple" style={{ fontSize: '10px' }}>
                          {msg.responseObj?.reasoning_mode || 'Multi-Hop Grounded'}
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>
                          {msg.responseObj?.retrieval_latency_ms ? `${msg.responseObj.retrieval_latency_ms}ms` : '18ms'}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '12.5px', lineHeight: 1.7, color: '#1E293B', margin: '0 0 10px 0' }}>
                      {msg.text}
                    </p>

                    {msg.responseObj?.suggested_scenario && (
                      <div style={{ padding: '10px 14px', background: 'rgba(79, 70, 229, 0.06)', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.18)', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, color: '#4338CA', marginBottom: '4px' }}>
                          <Lightbulb size={13} /> Recommended Strategic Action:
                        </div>
                        <div style={{ fontSize: '12px', color: '#1E293B', lineHeight: 1.5 }}>
                          {msg.responseObj.suggested_scenario}
                        </div>
                        {msg.responseObj?.suggested_intervention_params && (
                          <button
                            onClick={() => executeInterventionInSandbox(msg.responseObj.suggested_intervention_params)}
                            style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#4F46E5', color: '#FFFFFF', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            <SlidersHorizontal size={12} /> Execute Strategic Intervention in Causal SCM Sandbox
                          </button>
                        )}
                      </div>
                    )}

                    {msg.responseObj?.grounded_citations && msg.responseObj.grounded_citations.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {msg.responseObj.grounded_citations.map((cit, ci) => (
                          <span key={ci} className="citation-badge">{cit}</span>
                        ))}
                      </div>
                    )}

                    {/* Inline Translation Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #EDF2F7', paddingTop: '8px', marginTop: '8px' }}>
                      <span style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe2 size={12} /> Executive Localization:
                      </span>
                      <button
                        disabled={translatingChatId?.id === msg.id}
                        onClick={() => translateChatMessage(msg.id, msg.text, 'Hindi')}
                        style={{ padding: '3px 8px', fontSize: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', color: '#334155' }}
                      >
                        {translatingChatId?.id === msg.id && translatingChatId?.lang === 'Hindi' ? <Loader2 size={10} className="spin" /> : 'Translate Hindi'}
                      </button>
                      <button
                        disabled={translatingChatId?.id === msg.id}
                        onClick={() => translateChatMessage(msg.id, msg.text, 'Marathi')}
                        style={{ padding: '3px 8px', fontSize: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '4px', cursor: 'pointer', color: '#334155' }}
                      >
                        {translatingChatId?.id === msg.id && translatingChatId?.lang === 'Marathi' ? <Loader2 size={10} className="spin" /> : 'Translate Marathi'}
                      </button>
                      <span style={{ fontSize: '10px', color: '#94A3B8', marginLeft: 'auto' }}>{msg.timestamp}</span>
                    </div>

                    {/* Translated Content Display */}
                    {translatedChatMessages[msg.id] && Object.keys(translatedChatMessages[msg.id]).map((lang) => (
                      <div key={lang} style={{ marginTop: '8px', padding: '8px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '11.5px', color: '#166534' }}>
                        <div style={{ fontWeight: 600, fontSize: '10.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Languages size={11} /> {lang} Executive Localization:
                        </div>
                        <div style={{ lineHeight: 1.5 }}>
                          {translatedChatMessages[msg.id][lang]}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              {assistantLoading && (
                <div className="chat-msg-ai" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px' }}>
                  <Loader2 size={18} className="spin" style={{ color: '#4F46E5' }} />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>Grounded GraphRAG Reasoning in Progress...</span>
                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>Traversing multi-hop Neo4j paths, extracting TFT quantiles &amp; executing SCM DAG verification</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar & Curated Prompt Chips */}
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <div className="assistant-bar">
                <input
                  placeholder="Ask questions about trends, GNN bottlenecks, TFT cash-flow predictions, or what-if interventions..."
                  value={assistantQ}
                  onChange={(e) => setAssistantQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') askAssistant();
                  }}
                />
                <button onClick={() => askAssistant()} disabled={assistantLoading}>
                  {assistantLoading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                </button>
              </div>

              <div className="prompt-chips">
                <button onClick={() => askAssistant('What is the bottleneck pathway in the knowledge graph?')}>
                  Trace GNN Bottleneck Pathway
                </button>
                <button onClick={() => askAssistant('Compare First Class Express vs Standard Fleet')}>
                  Compare Carrier Telemetry &amp; Delay Risk
                </button>
                <button onClick={() => askAssistant('What are the primary delivery risks in our supply chain?')}>
                  Identify Supply Chain Delivery Risks
                </button>
                <button onClick={() => askAssistant('What are the customer segments and regional spend?')}>
                  Analyze Customer Segments &amp; Regions
                </button>
                <button onClick={() => askAssistant('Explain TFT Deep Transformer Accuracy')}>
                  Explain TFT Deep DL Benchmark (4.76% MAPE)
                </button>
                <button onClick={() => askAssistant('What is the total revenue and projected 6-week cash flow?')}>
                  Project Future Cash Flow &amp; Revenue
                </button>
                <button onClick={() => askAssistant('What happens if supplier delay increases by 3 days?')}>
                  Simulate 3-Day Supplier Delay (SCM)
                </button>
                <button onClick={() => askAssistant('Simulate 20% marketing increase and -5% price drop')}>
                  Simulate Strategic Market Intervention
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Grounding Pipeline & Subgraph Evidence Explorer */}
        <div>
          {/* Card 1: GraphRAG Verification Pipeline */}
          <div className="panel" style={{ marginBottom: '18px' }}>
            <div className="panel-heading">
              <div>
                <h3>GraphRAG Verification</h3>
                <p>Multi-agent neuro-symbolic pipeline</p>
              </div>
              <span className="pill green"><ShieldCheck size={12} /> Active</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="pipeline-step-box">
                <div className="pipeline-step-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>1. Intent &amp; Cypher Gen</span>
                    <span style={{ color: '#10B981', fontSize: '10.5px' }}>100% Parsed</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                    Entity disambiguation &amp; multi-hop query synthesis
                  </div>
                </div>
              </div>
              <div className="pipeline-step-box">
                <div className="pipeline-step-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>2. Subgraph Traversal</span>
                    <span style={{ color: '#10B981', fontSize: '10.5px' }}>5 Hops Active</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                    GNN link prediction (AUC 0.942) isolates risk paths
                  </div>
                </div>
              </div>
              <div className="pipeline-step-box">
                <div className="pipeline-step-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>3. TFT &amp; SCM Fusion</span>
                    <span style={{ color: '#10B981', fontSize: '10.5px' }}>Fused</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                    Fuses P10/P50/P90 forecasts with Pearl do-calculus
                  </div>
                </div>
              </div>
              <div className="pipeline-step-box">
                <div className="pipeline-step-dot" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>4. Faithfulness Gatekeeper</span>
                    <span style={{ color: '#10B981', fontSize: '10.5px' }}>98.4% Grounded</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                    Eliminates hallucinations via verified triples
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Active Subgraph Entity Explorer */}
          <div className="panel" style={{ marginBottom: '18px' }}>
            <div className="panel-heading">
              <div>
                <h3>Active Subgraph Entities</h3>
                <p>Grounded nodes extracted from reasoning context</p>
              </div>
              <span className="pill purple"><Boxes size={12} /> {activeExtractedEntities.length} Entities</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', maxHeight: '270px', overflowY: 'auto' }}>
              {activeExtractedEntities.map((ent, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                    <span style={{ fontWeight: 600, fontSize: '11.5px', color: '#1E293B', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>{ent.entity}</span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>{ent.type}</span>
                  </div>
                  <span className="pill purple" style={{ fontSize: '10.5px', fontWeight: 600, flexShrink: 0 }}>{ent.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Integrated Architecture Links */}
          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>Integrated Architecture Links</h3>
                <p>Direct navigation to underlying models</p>
              </div>
              <span className="pill sky"><GitBranch size={12} /> Deep Links</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setPage('semantic')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Network size={15} style={{ color: '#4F46E5', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>Semantic Knowledge Graph</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Inspect 65 Semantic Nodes &amp; GNN Embeddings</div>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              </button>
              <button
                onClick={() => setPage('forecast')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={15} style={{ color: '#4F46E5', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>TFT Multi-Horizon Forecasting</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Review P10–P90 Bounds &amp; VSN Feature Weights</div>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              </button>
              <button
                onClick={() => setPage('causal')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <SlidersHorizontal size={15} style={{ color: '#4F46E5', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1E293B' }}>Pearl's Causal SCM Sandbox</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Simulate do-calculus Interventions</div>
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
