export const curatedGraphNodes = [
  // Tier 1: Market & Demand (center x = 95)
  { id: 'CustomerSegment:Consumer', label: 'Consumer', type: 'CustomerSegment', value: 22095790, risk: 0.15, x: 95, y: 68, color: '#10B981', bg: '#ECFDF5', sub: '60% Vol · $22.1M' },
  { id: 'CustomerSegment:Corporate', label: 'Corporate', type: 'CustomerSegment', value: 11450000, risk: 0.15, x: 95, y: 190, color: '#10B981', bg: '#ECFDF5', sub: '30% Vol · $11.5M' },
  { id: 'CustomerSegment:Home Office', label: 'Home Office', type: 'CustomerSegment', value: 3238945, risk: 0.15, x: 95, y: 312, color: '#10B981', bg: '#ECFDF5', sub: '10% Vol · $3.2M' },
  { id: 'Region:Western Europe', label: 'Western Europe', type: 'Region', value: 18400000, risk: 0.35, x: 95, y: 434, color: '#06B6D4', bg: '#ECFEFF', sub: 'Top Market · $18.4M' },

  // Tier 2: Core Product Categories (center x = 327)
  { id: 'Category:Fan Shop & Apparel', label: 'Fan Shop & Apparel', type: 'Category', value: 17042394, risk: 0.20, x: 327, y: 68, color: '#4F46E5', bg: '#EEF2FF', sub: '$17.04M Dept Sales' },
  { id: 'Category:Cleats & Footwear', label: 'Cleats & Footwear', type: 'Category', value: 7323699, risk: 0.42, x: 327, y: 190, color: '#4F46E5', bg: '#EEF2FF', sub: '$7.32M Sales · Core' },
  { id: 'Category:Camping & Outdoor', label: 'Camping & Outdoor', type: 'Category', value: 7232270, risk: 0.22, x: 327, y: 312, color: '#4F46E5', bg: '#EEF2FF', sub: '$7.23M Sales · Gear' },
  { id: 'Category:Cardio & Fitness', label: 'Cardio & Fitness', type: 'Category', value: 5186600, risk: 0.25, x: 327, y: 434, color: '#4F46E5', bg: '#EEF2FF', sub: '$5.19M Sales · Equip' },

  // Tier 3: Supply Chain & Hubs (center x = 560)
  { id: 'Supplier:Tier-1 Suppliers', label: 'Tier-1 Suppliers', type: 'Supplier', value: 14890000, risk: 0.12, x: 560, y: 68, color: '#7C3AED', bg: '#F5F3FF', sub: 'Contract Mfgs' },
  { id: 'Inventory:Central DC Hub', label: 'Central DC Hub', type: 'Warehouse', value: 24500000, risk: 0.38, x: 560, y: 190, color: '#7C3AED', bg: '#F5F3FF', sub: 'Primary Warehouse' },
  { id: 'Inventory:Buffer Safety Stock', label: 'Buffer Stock Reserve', type: 'Inventory', value: 6200000, risk: 0.18, x: 560, y: 312, color: '#7C3AED', bg: '#F5F3FF', sub: '14 Days Reserve' },
  { id: 'Logistics:Standard Carrier Fleet', label: 'Standard Carrier Fleet', type: 'LogisticsCarrier', value: 23174383, risk: 0.58, x: 560, y: 434, color: '#F59E0B', bg: '#FFFBEB', sub: '63% Freight Mode' },

  // Tier 4: Logistics & Risk (center x = 792)
  { id: 'LogisticsCarrier:First Class Express', label: 'First Class Express', type: 'LogisticsCarrier', value: 13610352, risk: 0.12, x: 792, y: 105, color: '#10B981', bg: '#ECFDF5', sub: '37% Vol · 91.8% OTD' },
  { id: 'FulfillmentStatus:Late Delivery Risk', label: 'Late Delivery Risk', type: 'FulfillmentStatus', value: 41023, risk: 0.88, x: 792, y: 251, color: '#E11D48', bg: '#FFF1F2', sub: '54.8% Delay Bottleneck' },
  { id: 'FulfillmentStatus:On-Time Fulfillment', label: 'On-Time Delivery', type: 'FulfillmentStatus', value: 20538, risk: 0.05, x: 792, y: 397, color: '#10B981', bg: '#ECFDF5', sub: '45.2% Fulfilled · Normal' },

  // Tier 5: Financial Outcomes (center x = 1025)
  { id: 'FinancialOutcome:Gross Revenue', label: 'Gross Revenue', type: 'FinancialOutcome', value: 36784735, risk: 0.08, x: 1025, y: 105, color: '#059669', bg: '#ECFDF5', sub: '$36.78M Total Top-Line' },
  { id: 'FinancialOutcome:SLA Delay Penalties', label: 'SLA Delay Penalties', type: 'FinancialOutcome', value: 1240000, risk: 0.92, x: 1025, y: 251, color: '#E11D48', bg: '#FFF1F2', sub: '-$1.24M Margin Drag' },
  { id: 'FinancialOutcome:Operating Margin', label: 'Operating Margin', type: 'FinancialOutcome', value: 3966902, risk: 0.22, x: 1025, y: 397, color: '#059669', bg: '#ECFDF5', sub: '$3.97M Profit (10.8%)' }
];

export const curatedGraphEdges = [
  // Tier 1 -> Tier 2 (Demand to Categories)
  { source: 'CustomerSegment:Consumer', target: 'Category:Fan Shop & Apparel', relation: 'BUYS_FROM', label: 'High Demand' },
  { source: 'CustomerSegment:Consumer', target: 'Category:Cleats & Footwear', relation: 'BUYS_FROM', label: 'Primary Vol' },
  { source: 'CustomerSegment:Consumer', target: 'Category:Camping & Outdoor', relation: 'BUYS_FROM', label: 'Seasonal' },
  { source: 'CustomerSegment:Corporate', target: 'Category:Fan Shop & Apparel', relation: 'BUYS_FROM', label: 'Bulk Merch' },
  { source: 'CustomerSegment:Corporate', target: 'Category:Cardio & Fitness', relation: 'BUYS_FROM', label: 'B2B Wellness' },
  { source: 'CustomerSegment:Home Office', target: 'Category:Camping & Outdoor', relation: 'BUYS_FROM', label: 'Recreation' },
  { source: 'CustomerSegment:Home Office', target: 'Category:Cardio & Fitness', relation: 'BUYS_FROM', label: 'Home Gym' },
  { source: 'Region:Western Europe', target: 'Category:Fan Shop & Apparel', relation: 'MARKET_DEMAND', label: 'Euro Orders' },
  { source: 'Region:Western Europe', target: 'Category:Cleats & Footwear', relation: 'MARKET_DEMAND', label: 'Soccer Gear' },

  // Tier 2 -> Tier 3 (Categories to Supply Hubs)
  { source: 'Category:Fan Shop & Apparel', target: 'Supplier:Tier-1 Suppliers', relation: 'SUPPLIED_BY', label: 'Contract Sourcing' },
  { source: 'Category:Fan Shop & Apparel', target: 'Inventory:Central DC Hub', relation: 'STOCKED_AT', label: 'DC Stock' },
  { source: 'Category:Cleats & Footwear', target: 'Inventory:Central DC Hub', relation: 'STOCKED_AT', label: 'High Velocity' },
  { source: 'Category:Camping & Outdoor', target: 'Inventory:Buffer Safety Stock', relation: 'BUFFERED_IN', label: 'Safety Stock' },
  { source: 'Category:Cardio & Fitness', target: 'Inventory:Central DC Hub', relation: 'STOCKED_AT', label: 'Heavy Freight' },

  // Tier 3 -> Tier 4 (Hubs to Logistics Carriers & Risk)
  { source: 'Inventory:Central DC Hub', target: 'Logistics:Standard Carrier Fleet', relation: 'ROUTES_VIA', label: '63% Freight' },
  { source: 'Logistics:Standard Carrier Fleet', target: 'FulfillmentStatus:Late Delivery Risk', relation: 'CAUSES_DELAY', label: '54.8% Delay' },
  { source: 'Logistics:Standard Carrier Fleet', target: 'FulfillmentStatus:On-Time Fulfillment', relation: 'FULFILLS', label: '45.2% On-Time' },
  { source: 'Supplier:Tier-1 Suppliers', target: 'LogisticsCarrier:First Class Express', relation: 'EXPEDITES', label: 'Express Mode' },
  { source: 'Inventory:Buffer Safety Stock', target: 'FulfillmentStatus:On-Time Fulfillment', relation: 'PREVENTS_STOCKOUT', label: 'Buffer Shield' },
  { source: 'LogisticsCarrier:First Class Express', target: 'FulfillmentStatus:On-Time Fulfillment', relation: 'EXPEDITES', label: '91.8% On-Time' },

  // Tier 4 -> Tier 5 (Risk & Logistics to Financial Outcomes)
  { source: 'FulfillmentStatus:Late Delivery Risk', target: 'FinancialOutcome:SLA Delay Penalties', relation: 'INFLICTS_PENALTY', label: 'SLA Fines' },
  { source: 'FinancialOutcome:SLA Delay Penalties', target: 'FinancialOutcome:Operating Margin', relation: 'ERODES_MARGIN', label: '-$1.24M Drag' },
  { source: 'FulfillmentStatus:On-Time Fulfillment', target: 'FinancialOutcome:Gross Revenue', relation: 'REALIZES_SALES', label: 'Realizes Sales' },
  { source: 'FinancialOutcome:Gross Revenue', target: 'FinancialOutcome:Operating Margin', relation: 'NET_PROFIT_FLOW', label: '10.8% Net Margin' }
];

export const bottleneckNodeIds = [
  'CustomerSegment:Consumer',
  'Category:Cleats & Footwear',
  'Inventory:Central DC Hub',
  'Logistics:Standard Carrier Fleet',
  'FulfillmentStatus:Late Delivery Risk',
  'FinancialOutcome:SLA Delay Penalties',
  'FinancialOutcome:Operating Margin'
];
