export const translationPresets = [
  {
    id: 'bottleneck',
    title: 'GNN Logistics Bottleneck Briefing',
    text: 'GNN analysis reveals standard carrier logistics causes a 54.8% late delivery risk in consumer orders, causing $1.24M in SLA penalties. Shifting 25% order volume to express freight increases operating profit margin to 16.7%.'
  },
  {
    id: 'tft',
    title: 'TFT 6-Week Cash Flow Forecast',
    text: 'Temporal Fusion Transformer projects third-quarter demand to surge by 14.8%, reaching $36.78M in gross enterprise revenue with P90 cash flow reserves at $335,000. Inventory safety buffers should be increased by 10% to prevent stockouts.'
  },
  {
    id: 'causal',
    title: 'Pearl SCM Policy Intervention',
    text: 'Applying do-calculus intervention do(Marketing=+15%, Price=0%, Delay=-3 days) stimulates customer conversion, mitigating supplier bottlenecks and generating $238,500 in incremental net profit.'
  },
  {
    id: 'working_capital',
    title: 'Quarterly Operating Margin & EBITDA',
    text: 'Operating profit margin is holding at 12% across 65,752 validated orders. SLA delay penalties represent our largest cost leakage. Immediate carrier reallocation will protect EBITDA.'
  }
];

export const supportedDialects = [
  { id: 'Hindi', label: 'Hindi (हिंदी)', script: 'Devanagari', region: 'North/Central India' },
  { id: 'Marathi', label: 'Marathi (मराठी)', script: 'Devanagari', region: 'Maharashtra Hub' },
  { id: 'Gujarati', label: 'Gujarati (ગુજરાતી)', script: 'Gujarati', region: 'Gujarat Corridor' },
  { id: 'Tamil', label: 'Tamil (தமிழ்)', script: 'Tamil', region: 'Tamil Nadu Hub' },
  { id: 'Telugu', label: 'Telugu (తెలుగు)', script: 'Telugu', region: 'Telangana & AP' }
];

export const defaultGlossary = [
  {
    english: "Gross Revenue",
    category: "Financial & Margin",
    hindi: "सकल राजस्व (Gross Revenue)",
    marathi: "एकूण महसूल (Gross Revenue)",
    gujarati: "કુલ આવક (Gross Revenue)",
    acronym: "REV",
    definition: "Total chronological throughput before deduction of operating freight & overheads."
  },
  {
    english: "Operating Profit Margin",
    category: "Financial & Margin",
    hindi: "परिचालन लाभ मार्जिन (Operating Margin)",
    marathi: "कार्यकारी नफा मार्जिन (Operating Margin)",
    gujarati: "સંચાલન નફા માર્જિન (Operating Margin)",
    acronym: "EBITDA Margin",
    definition: "Net profitability percentage after logistics costs, SLA fines, and inventory carrying drag."
  },
  {
    english: "Late Delivery Risk",
    category: "Supply Chain & Logistics",
    hindi: "देरी से वितरण जोखिम (Late Delivery Risk)",
    marathi: "उशिरा वितरणाची जोखीम (Late Delivery Risk)",
    gujarati: "વિલંબિત વિતરણ જોખમ (Late Delivery Risk)",
    acronym: "SLA Delay Risk",
    definition: "Probability of shipments exceeding guaranteed transit windows, incurring SLA fines."
  },
  {
    english: "Standard Carrier Fleet",
    category: "Supply Chain & Logistics",
    hindi: "मानक वाहक फ्लीट (Standard Fleet - 63% Vol)",
    marathi: "स्टँडर्ड कॅरियर फ्लीट (Standard Fleet - 63% Vol)",
    gujarati: "સ્ટાન્ડર્ડ કેરિયર ફ્લીટ (Standard Fleet)",
    acronym: "Fleet Mode 1",
    definition: "Primary road freight mode handling 63% of orders with 54.8% late dispatch vulnerability."
  },
  {
    english: "Inventory Safety Buffer",
    category: "Supply Chain & Logistics",
    hindi: "सुरक्षा इन्वेंटरी बफर (Safety Stock)",
    marathi: "सुरक्षा साठा बफर (Safety Buffer)",
    gujarati: "ઇન્વેન્ટરી સુરક્ષા બફર (Safety Buffer)",
    acronym: "Buffer Stock",
    definition: "Reserve units retained at regional distribution centers to insulate against demand surges."
  },
  {
    english: "Supplier Bottleneck Delay",
    category: "Supply Chain & Logistics",
    hindi: "आपूर्तिकर्ता गतिरोध देरी (Supplier Delay)",
    marathi: "पुरवठादार अडथळा विलंब (Supplier Delay)",
    gujarati: "સપ્લાયર વિલંબ (Supplier Delay)",
    acronym: "Lead Time Drag",
    definition: "Inbound manufacturing lead-time extensions that cascade downstream into order fulfillment delays."
  },
  {
    english: "Multi-Horizon Quantiles",
    category: "AI & Digital Twin",
    hindi: "बहु-क्षितिज पूर्वानुमान (P10/P50/P90)",
    marathi: "बहु-क्षितिज अंदाज (P10/P50/P90)",
    gujarati: "મલ્ટી-હોરિઝન ક્વોન્ટાઇલ્સ (P10/P50/P90)",
    acronym: "TFT Quantiles",
    definition: "Temporal Fusion Transformer probability envelopes providing 10th, 50th, and 90th percentile bounds."
  },
  {
    english: "Causal Counterfactual Policy",
    category: "AI & Digital Twin",
    hindi: "कारण प्रति-तथ्यात्मक नीति (Counterfactual Policy)",
    marathi: "कारणात्मक प्रत्यक्षात पर्यायी धोरण (Counterfactual Policy)",
    gujarati: "કારણાત્મક કાઉન્ટરફેક્ચ્યુઅલ નીતિ (Counterfactual Policy)",
    acronym: "do-calculus SCM",
    definition: "Judea Pearl structural causal equation intervention estimating outcomes under unobserved policies."
  },
  {
    english: "SLA Delay Penalties",
    category: "Operations & Risk",
    hindi: "सेवा स्तर समझौता जुर्माना (SLA Penalties)",
    marathi: "सेवा स्तर करार दंड (SLA Penalties)",
    gujarati: "એસએલએ દંડ (SLA Penalties)",
    acronym: "SLA Penalties",
    definition: "Direct monetary deductions imposed by enterprise corporate buyers for late freight delivery."
  },
  {
    english: "Working Capital Drag",
    category: "Financial & Margin",
    hindi: "कार्यशील पूंजी दबाव (Working Capital Drag)",
    marathi: "खेळत्या भांडवलावरील ताण (Working Capital Drag)",
    gujarati: "કાર્યકારી મૂડી દબાણ (Working Capital Drag)",
    acronym: "Cash Drag",
    definition: "Liquidity lock-up resulting from unsold safety stock and delayed customer payment cycles."
  }
];
