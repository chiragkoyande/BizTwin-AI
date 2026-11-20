import {
  Activity, Brain, Database, Languages, Layers, LayoutDashboard,
  Network, Settings, SlidersHorizontal, Sparkles
} from 'lucide-react';

export const navSections = [
  {
    category: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Overview' },
    ]
  },
  {
    category: 'RESEARCH ARCHITECTURE',
    items: [
      { id: 'streaming', label: 'Phase 1: Ingestion Stream', icon: Layers, badge: 'Streaming' },
      { id: 'semantic', label: 'Phase 2: Semantic Graph', icon: Network, badge: 'GNN' },
      { id: 'forecast', label: 'Phase 3A: TFT Forecasting', icon: Brain, badge: 'TFT DL' },
      { id: 'causal', label: 'Phase 3B: Causal AI Sandbox', icon: SlidersHorizontal, badge: 'Do-Calculus' },
      { id: 'assistant', label: 'Phase 4: GraphRAG Assistant', icon: Sparkles, badge: 'Agentic' },
    ]
  },
  {
    category: 'OPERATIONS & LAB',
    items: [
      { id: 'translation', label: 'Executive Translation', icon: Languages, badge: 'i18n' },
      { id: 'models', label: 'Model Lab & Benchmarks', icon: Activity, badge: 'Eval' },
      { id: 'data', label: 'Data Management', icon: Database, badge: '180K Rows' },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

export const navItems = navSections.flatMap((s) => s.items);
