import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Download } from 'lucide-react';
import { api, getApiBase, setApiBase } from './api';
import { downloadCsv, money, monthLabel, number, pct } from './format';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

// Constants
import { navItems } from './constants/navigation';
import { defaultGlossary } from './constants/translationData';

// Page Components
import DashboardPage from './pages/Dashboard';
import StreamingPage from './pages/Streaming';
import SemanticPage from './pages/Semantic';
import ForecastPage from './pages/Forecast';
import CausalPage from './pages/Causal';
import AssistantPage from './pages/Assistant';
import TranslationPage from './pages/Translation';
import ModelLabPage from './pages/ModelLab';
import DataManagementPage from './pages/DataManagement';
import SettingsPage from './pages/Settings';

// ─────────────────────────────────────────────────────────────────────────────
// App Shell — Routing, State Management & Data Orchestration
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Shell & UI State ────────────────────────────────────────────────────
  const [page, setPage] = useState('dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [apiUrl, setApiUrl] = useState(getApiBase());
  const [zoom, setZoom] = useState(() => {
    try { return Number(localStorage.getItem('biztwin_zoom')) || 110; }
    catch { return 110; }
  });

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('biztwin_user_profile');
      return saved ? JSON.parse(saved) : { name: 'Sam Joshi', role: 'Enterprise Admin' };
    } catch {
      return { name: 'Sam Joshi', role: 'Enterprise Admin' };
    }
  });

  useEffect(() => {
    try {
      document.documentElement.style.zoom = `${zoom}%`;
      localStorage.setItem('biztwin_zoom', String(zoom));
    } catch {}
  }, [zoom]);

  // ── Core Data State ─────────────────────────────────────────────────────
  const [dashboard, setDashboard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trajectoryMetric, setTrajectoryMetric] = useState('revenue');

  // Streaming Ingestion
  const [streamingActive, setStreamingActive] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState([]);
  const [streamStats, setStreamStats] = useState(null);

  // Semantic Graph
  const [semanticGraph, setSemanticGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphFilter, setGraphFilter] = useState('all');

  // TFT Forecasting
  const [tftTarget, setTftTarget] = useState('future_cash_flow');
  const [tftData, setTftData] = useState(null);
  const [tftLoading, setTftLoading] = useState(false);
  const [benchmarks, setBenchmarks] = useState(null);

  // Causal AI
  const [demandChange, setDemandChange] = useState(15);
  const [priceChange, setPriceChange] = useState(-5);
  const [marketingChange, setMarketingChange] = useState(20);
  const [supplierDelay, setSupplierDelay] = useState(3);
  const [inventoryBuffer, setInventoryBuffer] = useState(10);
  const [hiringDelta, setHiringDelta] = useState(2);
  const [causalResult, setCausalResult] = useState(null);
  const [causalLoading, setCausalLoading] = useState(false);

  // GraphRAG Assistant
  const [assistantQ, setAssistantQ] = useState('');
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Welcome to the GraphRAG AI Strategy Cockpit. I synthesize multi-hop knowledge graph relationships from Neo4j (180.5K records), multi-horizon quantile projections from Temporal Fusion Transformer (TFT), and Pearl's SCM Structural Causal Models. Select a prompt below or ask any operational query to trace bottlenecks and simulate counterfactual interventions.",
      responseObj: {
        engine: "GraphRAG Grounded Strategic Agent",
        grounded_citations: [
          "[Neo4j 5-Tier Supply Chain Graph: 65 Semantic Nodes]",
          "[TFT Deep Quantiles: P10, P50, P90 Multi-Horizon]",
          "[Pearl SCM: do-calculus Interventions]"
        ],
        reasoning_mode: "Multi-Hop Knowledge Graph + TFT Deep Forecast + Causal DAG Verification",
        faithfulness_score: 0.99,
        retrieval_latency_ms: 14,
        extracted_entities: [
          { entity: "CustomerSegment:Consumer", type: "Demand Root", val: "60% Order Vol" },
          { entity: "Logistics:Standard Carrier Fleet", type: "Freight Mode", val: "63% Freight" },
          { entity: "FulfillmentStatus:Late Delivery Risk", type: "Delay Risk", val: "54.8% Delay" }
        ],
        suggested_scenario: "Trace the multi-hop bottleneck pathway to isolate the root cause of late deliveries."
      },
      timestamp: '10:00 AM'
    }
  ]);
  const [activeExtractedEntities, setActiveExtractedEntities] = useState([
    { entity: "CustomerSegment:Consumer", type: "Demand Root", val: "60% Order Vol" },
    { entity: "Category:Cleats & Footwear", type: "Product Line", val: "$7.32M Sales" },
    { entity: "Inventory:Central DC Hub", type: "Warehouse DC", val: "Primary Stock" },
    { entity: "Logistics:Standard Carrier Fleet", type: "Freight Mode", val: "63% Freight" },
    { entity: "FulfillmentStatus:Late Delivery Risk", type: "Delay Bottleneck", val: "54.8% Delay" },
    { entity: "FinancialOutcome:SLA Delay Penalties", type: "Cost Drag", val: "-$1.24M Penalty" },
    { entity: "FinancialOutcome:Operating Margin", type: "Net Margin", val: "10.8% Margin" }
  ]);
  const [translatedChatMessages, setTranslatedChatMessages] = useState({});
  const [translatingChatId, setTranslatingChatId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, assistantLoading]);

  // Translation State
  const [translationText, setTranslationText] = useState('');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [translationResult, setTranslationResult] = useState({
    translated_text: 'GNN विश्लेषण से पता चलता है कि मानक वाहक लॉजिस्टिक्स उपभोक्ता ऑर्डर में 54.8% देरी से वितरण जोखिम का कारण बनता है, जिसके कारण $1.24M SLA विलंब जुर्माना होता है। 25% ऑर्डर मात्रा को फर्स्ट क्लास एक्सप्रेस फ्रेट में स्थानांतरित करने से परिचालन लाभ मार्जिन बढ़कर 16.7% हो जाता है।',
    target_language: 'Hindi',
    language_script: 'Devanagari (देवनागरी)',
    regional_hub: 'North & Central India / NCR Commercial Belt',
    target_hubs: 'Delhi-NCR, Mumbai, UP, Rajasthan, MP SMBs',
    fidelity_score: 0.98,
    mode: 'Domain-Preserving Executive Hindi Localization',
    preservation_status: 'Financial & Supply Chain Acronyms 100% Preserved',
    preserved_acronyms: ['GNN', 'SLA', 'EBITDA'],
    word_count: 32,
    char_count: 228
  });
  const [translating, setTranslating] = useState(false);
  const [copiedInsight, setCopiedInsight] = useState(false);
  const [glossaryCategory, setGlossaryCategory] = useState('All');
  const [glossaryTerms, setGlossaryTerms] = useState(defaultGlossary);

  const fileRef = useRef(null);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // ── API Loaders ─────────────────────────────────────────────────────────
  const loadPlatformData = async () => {
    try {
      const [d, p, a, b] = await Promise.all([
        api.get('/api/dashboard'),
        api.get('/api/data/profile'),
        api.get('/api/activity'),
        api.get('/api/models/benchmarks'),
      ]);
      setDashboard(d);
      setProfile(p);
      setActivity(a?.events || []);
      setBenchmarks(b);
    } catch (e) {
      notify(`Connection note: ${e.message}`);
    }
  };

  const loadSemanticGraph = async () => {
    setGraphLoading(true);
    try {
      const res = await api.get('/api/graph/semantic');
      setSemanticGraph(res);
    } catch (e) {
      notify(e.message);
    } finally {
      setGraphLoading(false);
    }
  };

  const loadTFTForecast = async (target) => {
    setTftLoading(true);
    try {
      const res = await api.get(`/api/forecast/tft?target=${encodeURIComponent(target)}`);
      setTftData(res);
    } catch (e) {
      notify(e.message);
    } finally {
      setTftLoading(false);
    }
  };

  const runCausalSimulation = async () => {
    setCausalLoading(true);
    try {
      const res = await api.post('/api/causal/counterfactual', {
        demand_change_pct: demandChange,
        price_change_pct: priceChange,
        marketing_change_pct: marketingChange,
        supplier_delay_days: supplierDelay,
        inventory_buffer_pct: inventoryBuffer,
        hiring_delta: hiringDelta,
      });
      setCausalResult(res);
    } catch (e) {
      notify(e.message);
    } finally {
      setCausalLoading(false);
    }
  };

  const toggleStreaming = async () => {
    if (streamingActive) {
      await api.post('/api/v1/stream/stop', {});
      setStreamingActive(false);
      notify('Multi-modal streaming stopped.');
    } else {
      await api.post('/api/v1/stream/start?interval=0.4&limit=200', {});
      setStreamingActive(true);
      notify('Validated streaming pipeline ingestion online.');
    }
  };

  const askAssistant = async (question) => {
    const q = (question || assistantQ).trim();
    if (!q) return;
    const userMsgId = 'usr-' + Date.now();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: q, timestamp: nowTime }]);
    setAssistantQ('');
    setAssistantLoading(true);
    try {
      const res = await api.post('/api/assistant/graphrag', { question: q });
      setAssistantResponse(res);
      if (res.extracted_entities && res.extracted_entities.length > 0) {
        setActiveExtractedEntities(res.extracted_entities);
      }
      setChatMessages((prev) => [...prev, {
        id: 'ai-' + Date.now(), sender: 'ai', text: res.answer,
        responseObj: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      notify(e.message);
      setChatMessages((prev) => [...prev, {
        id: 'err-' + Date.now(), sender: 'ai',
        text: `Unable to complete GraphRAG inference: ${e.message}. Ensure backend is operational.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const translateChatMessage = async (msgId, text, lang) => {
    setTranslatingChatId({ id: msgId, lang });
    try {
      const res = await api.post('/api/translation', { text, target_language: lang });
      setTranslatedChatMessages((prev) => ({
        ...prev,
        [msgId]: { ...(prev[msgId] || {}), [lang]: res.translated_text }
      }));
      notify(`Translated insight to ${lang}`);
    } catch (e) {
      notify(`Translation failed: ${e.message}`);
    } finally {
      setTranslatingChatId(null);
    }
  };

  const executeInterventionInSandbox = (params) => {
    if (!params) return;
    if (params.marketing_change !== undefined) setMarketingChange(params.marketing_change);
    if (params.price_change !== undefined) setPriceChange(params.price_change);
    if (params.supplier_delay !== undefined) setSupplierDelay(params.supplier_delay);
    if (params.inventory_buffer !== undefined) setInventoryBuffer(params.inventory_buffer);
    if (params.hiring_delta !== undefined) setHiringDelta(params.hiring_delta);
    setPage('causal');
    notify('Loaded recommended intervention parameters into Causal AI Sandbox');
  };

  const runTranslation = async (overrideText, overrideLang) => {
    const textToUse = (overrideText !== undefined ? overrideText : translationText).trim();
    const langToUse = overrideLang || targetLang;
    if (!textToUse) return;
    setTranslating(true);
    try {
      const res = await api.post('/api/translation', { text: textToUse, target_language: langToUse });
      setTranslationResult(res);
      notify(`Localized executive narrative into ${langToUse}`);
    } catch (e) {
      notify(e.message);
    } finally {
      setTranslating(false);
    }
  };

  const loadTranslationGlossary = async () => {
    try {
      const res = await api.get('/api/translation/glossary');
      if (res && res.terms && res.terms.length > 0) setGlossaryTerms(res.terms);
    } catch (e) {
      console.warn('Glossary fetch fallback:', e);
    }
  };

  const copyTranslatedText = () => {
    if (!translationResult?.translated_text) return;
    navigator.clipboard?.writeText(translationResult.translated_text);
    setCopiedInsight(true);
    notify('Copied localized briefing to clipboard');
    setTimeout(() => setCopiedInsight(false), 2500);
  };

  const downloadTranslatedBriefing = () => {
    if (!translationResult) return;
    const content = `=====================================================
BIZTWIN AI - MULTILINGUAL EXECUTIVE LOCALIZATION BRIEFING
=====================================================
Target Dialect:    ${translationResult.target_language} (${translationResult.language_script || ''})
Regional Hub:      ${translationResult.regional_hub || ''}
Preservation Mode: ${translationResult.mode || ''}
Fidelity Score:    ${translationResult.fidelity_score || 0.98} BLEU
Preserved Acronyms: ${(translationResult.preserved_acronyms || []).join(', ')}

-----------------------------------------------------
SOURCE EXECUTIVE NARRATIVE (ENGLISH):
-----------------------------------------------------
${translationResult.source_text}

-----------------------------------------------------
LOCALIZED EXECUTIVE REPORT:
-----------------------------------------------------
${translationResult.translated_text}

=====================================================
Generated by Digital Twin for Small Businesses Platform
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BizTwin_${translationResult.target_language}_Briefing.txt`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Downloaded multilingual executive briefing.');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.upload('/api/data/upload', form);
      notify(`Dataset uploaded: ${res.filename} (${number(res.rows)} records).`);
      loadPlatformData();
      loadSemanticGraph();
    } catch (e) {
      notify(`Upload failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDataset = async () => {
    try {
      await api.post('/api/data/reset', {});
      notify('Reset to default DataCo Supply Chain dataset.');
      loadPlatformData();
      loadSemanticGraph();
    } catch (e) {
      notify(e.message);
    }
  };

  // ── Side Effects ────────────────────────────────────────────────────────
  useEffect(() => {
    loadPlatformData();
    loadTFTForecast('future_cash_flow');
    loadSemanticGraph();
    runCausalSimulation();
    loadTranslationGlossary();
  }, []);

  // Causal debounce
  useEffect(() => {
    const timer = setTimeout(runCausalSimulation, 250);
    return () => clearTimeout(timer);
  }, [demandChange, priceChange, marketingChange, supplierDelay, inventoryBuffer, hiringDelta]);

  // Stream polling
  useEffect(() => {
    let interval = null;
    if (streamingActive || page === 'streaming') {
      const fetchBuffer = async () => {
        try {
          const res = await api.get('/api/v1/stream/buffer?limit=25');
          setStreamBuffer(res.recent_transactions || []);
          const stats = await api.get('/api/v1/stream/stats');
          setStreamStats(stats);
          if (stats.streaming_active !== streamingActive) setStreamingActive(stats.streaming_active);
        } catch {}
      };
      fetchBuffer();
      interval = setInterval(fetchBuffer, 800);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [streamingActive, page]);

  // ── Derived Data ────────────────────────────────────────────────────────
  const ds = dashboard?.dataset || {
    name: 'DataCo Supply Chain (2015-2018)',
    rows: 180519, customers: 20652,
    date_from: '2015-01-01', date_to: '2018-01-31', currency: 'USD',
  };

  const currentNav = navItems.find((n) => n.id === page) || navItems[0];

  // ── Page Router Map ─────────────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <DashboardPage
            dashboard={dashboard}
            activity={activity}
            loadPlatformData={loadPlatformData}
            setPage={setPage}
            trajectoryMetric={trajectoryMetric}
            setTrajectoryMetric={setTrajectoryMetric}
          />
        );

      case 'streaming':
        return (
          <StreamingPage
            streamingActive={streamingActive}
            toggleStreaming={toggleStreaming}
            streamStats={streamStats}
            streamBuffer={streamBuffer}
            dataset={ds}
            setPage={setPage}
            notify={notify}
          />
        );

      case 'semantic':
        return (
          <SemanticPage
            graphFilter={graphFilter}
            setGraphFilter={setGraphFilter}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            loadSemanticGraph={loadSemanticGraph}
            setPage={setPage}
            notify={notify}
          />
        );

      case 'forecast':
        return (
          <ForecastPage
            tftTarget={tftTarget}
            setTftTarget={setTftTarget}
            tftData={tftData}
            tftLoading={tftLoading}
            loadTFTForecast={loadTFTForecast}
            benchmarks={benchmarks}
            setPage={setPage}
            notify={notify}
          />
        );

      case 'causal':
        return (
          <CausalPage
            marketingChange={marketingChange}
            setMarketingChange={setMarketingChange}
            priceChange={priceChange}
            setPriceChange={setPriceChange}
            supplierDelay={supplierDelay}
            setSupplierDelay={setSupplierDelay}
            inventoryBuffer={inventoryBuffer}
            setInventoryBuffer={setInventoryBuffer}
            causalResult={causalResult}
            setPage={setPage}
            notify={notify}
          />
        );

      case 'assistant':
        return (
          <AssistantPage
            assistantQ={assistantQ}
            setAssistantQ={setAssistantQ}
            assistantLoading={assistantLoading}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            activeExtractedEntities={activeExtractedEntities}
            translatedChatMessages={translatedChatMessages}
            translatingChatId={translatingChatId}
            askAssistant={askAssistant}
            translateChatMessage={translateChatMessage}
            executeInterventionInSandbox={executeInterventionInSandbox}
            chatEndRef={chatEndRef}
            setPage={setPage}
          />
        );

      case 'translation':
        return (
          <TranslationPage
            translationText={translationText}
            setTranslationText={setTranslationText}
            targetLang={targetLang}
            setTargetLang={setTargetLang}
            translationResult={translationResult}
            translating={translating}
            copiedInsight={copiedInsight}
            glossaryCategory={glossaryCategory}
            setGlossaryCategory={setGlossaryCategory}
            glossaryTerms={glossaryTerms}
            runTranslation={runTranslation}
            copyTranslatedText={copyTranslatedText}
            downloadTranslatedBriefing={downloadTranslatedBriefing}
          />
        );

      case 'models':
        return <ModelLabPage benchmarks={benchmarks} />;

      case 'data':
        return (
          <DataManagementPage
            dataset={ds}
            profile={profile}
            loading={loading}
            fileRef={fileRef}
            handleFileUpload={handleFileUpload}
            handleResetDataset={handleResetDataset}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            apiUrl={apiUrl}
            setApiUrl={setApiUrl}
            loadPlatformData={loadPlatformData}
            loadSemanticGraph={loadSemanticGraph}
            loadTFTForecast={loadTFTForecast}
            tftTarget={tftTarget}
            notify={notify}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        );

      default:
        return (
          <DashboardPage
            dashboard={dashboard}
            activity={activity}
            loadPlatformData={loadPlatformData}
            setPage={setPage}
            trajectoryMetric={trajectoryMetric}
            setTrajectoryMetric={setTrajectoryMetric}
          />
        );
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        search={search}
        setSearch={setSearch}
        dataset={ds}
        userProfile={userProfile}
      />

      <main className="main-area">
        <Topbar
          currentNav={currentNav}
          setMobileNav={setMobileNav}
          zoom={zoom}
          setZoom={setZoom}
          apiUrl={apiUrl}
          setPage={setPage}
          dataset={ds}
        />

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">AI-POWERED DIGITAL TWINS FOR SMALL BUSINESSES</div>
              <h1>{currentNav.label}</h1>
              <p>Multi-Modal GNN, Temporal Fusion Transformer (TFT) &amp; Pearl's Counterfactual AI</p>
            </div>
            <div className="heading-actions">
              <button
                className="outline-button"
                onClick={() => {
                  if (dashboard?.monthly) {
                    downloadCsv('biztwin-enterprise-metrics.csv', dashboard.monthly);
                    notify('Exported Digital Twin metrics to CSV.');
                  }
                }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {renderPage()}
        </div>
      </main>

      {toast && <div className="toast"><Check size={16} color="#34D399" /> {toast}</div>}
    </div>
  );
}
