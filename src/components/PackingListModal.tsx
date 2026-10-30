import React, { useState, useEffect } from 'react';
import {
  Luggage,
  CheckCircle2,
  Circle,
  Shirt,
  Footprints,
  Briefcase,
  Smartphone,
  HeartPulse,
  ThermometerSnowflake,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Info,
  Copy,
  Check,
} from 'lucide-react';

export interface PackingItem {
  id: string;
  category: 'clothing' | 'footwear' | 'gear' | 'tech' | 'health';
  categoryLabel: string;
  name: string;
  quantity?: string;
  detail: string;
  requiredForPT?: boolean;
}

const DEFAULT_PACKING_ITEMS: PackingItem[] = [
  // 1. Clothing (Layering Strategy)
  {
    id: 'c1',
    category: 'clothing',
    categoryLabel: 'Clothing (Layering)',
    name: 'Outerwear (Windproof / Puffer Jacket)',
    quantity: '1–2 pieces',
    detail: '1 windproof jacket or a medium-weight coat/down jacket. A lightweight packable puffer jacket is ideal for chilly mornings (10°C) and packs small when the sun warms up (18°C).',
    requiredForPT: true,
  },
  {
    id: 'c2',
    category: 'clothing',
    categoryLabel: 'Clothing (Layering)',
    name: 'Tops & Smart-Casual Collared Shirts',
    quantity: '7–8 items',
    detail: 'Mix of long-sleeve t-shirts and button-downs. Must bring at least 1 or 2 smart-casual collared shirts or blouses for company/factory site visits and professional interactions.',
    requiredForPT: true,
  },
  {
    id: 'c3',
    category: 'clothing',
    categoryLabel: 'Clothing (Layering)',
    name: 'Mid-layers (Sweaters / Cardigans / Hoodies)',
    quantity: '2 items',
    detail: 'To throw on over tops when university lecture halls, transit hubs, or site offices get drafty. Indoor heating varies widely.',
  },
  {
    id: 'c4',
    category: 'clothing',
    categoryLabel: 'Clothing (Layering)',
    name: 'Bottoms (Jeans / Chinos / Trousers)',
    quantity: '3–4 pairs',
    detail: 'Jeans, chinos, or thick trousers. Note: Avoid overly distressed or ripped jeans, as corporate site visits enforce conservative/neat dress codes.',
    requiredForPT: true,
  },
  {
    id: 'c5',
    category: 'clothing',
    categoryLabel: 'Clothing (Layering)',
    name: 'Undergarments & Moisture-Wicking Socks',
    quantity: '7–8 sets',
    detail: 'Comfortable underwear and cushioned, moisture-wicking socks to prevent blisters during long walking days.',
  },

  // 2. Footwear
  {
    id: 'f1',
    category: 'footwear',
    categoryLabel: 'Footwear',
    name: 'Broken-in Walking Shoes / Sneakers',
    quantity: '1 pair',
    detail: 'Well-broken-in sneakers. You will easily rack up 15,000+ steps per day navigating Shanghai Metro, industrial parks, and university grounds.',
    requiredForPT: true,
  },
  {
    id: 'f2',
    category: 'footwear',
    categoryLabel: 'Footwear',
    name: 'Smart-Casual Closed-Toe Shoes',
    quantity: '1 pair',
    detail: 'Clean loafers, neat leather sneakers, or dark flats for corporate/institutional visits. Strict rule: Many technical and factory sites strictly prohibit open-toe shoes.',
    requiredForPT: true,
  },

  // 3. Practical Training & Site Visit Gear
  {
    id: 'g1',
    category: 'gear',
    categoryLabel: 'PT & Site Visit Gear',
    name: 'Sturdy Daypack / Backpack (15–20L)',
    quantity: '1 bag',
    detail: '15–20L capacity with secure zippers to carry your notebook, tablet/laptop, water bottle, and site documentation.',
    requiredForPT: true,
  },
  {
    id: 'g2',
    category: 'gear',
    categoryLabel: 'PT & Site Visit Gear',
    name: 'Field Notebook & Pens',
    quantity: '1 set',
    detail: 'Essential for jotting observations, speaker notes, and QA during corporate tech briefings and company overviews.',
    requiredForPT: true,
  },
  {
    id: 'g3',
    category: 'gear',
    categoryLabel: 'PT & Site Visit Gear',
    name: 'Specific PPE Check (Safety Glasses / Vest)',
    quantity: 'Check with rep',
    detail: 'Most host industrial sites provide standard on-site PPE, but verify beforehand if specific safety footwear or eye protection is requested for your track.',
  },

  // 4. Tech & Connectivity Essentials
  {
    id: 't1',
    category: 'tech',
    categoryLabel: 'Tech & Connectivity',
    name: 'Smartphone Pre-setup: Alipay & WeChat Pay',
    quantity: 'Crucial',
    detail: 'Download Alipay and WeChat, and link an international credit card BEFORE flying. China is cashless; all transit, meals, and convenience purchases rely on QR code pay.',
    requiredForPT: true,
  },
  {
    id: 't2',
    category: 'tech',
    categoryLabel: 'Tech & Connectivity',
    name: 'Data Plan / China eSIM',
    quantity: '1 active',
    detail: 'Secure an international data roaming pass or a mainland China eSIM before landing at Pudong Airport (PVG).',
  },
  {
    id: 't3',
    category: 'tech',
    categoryLabel: 'Tech & Connectivity',
    name: 'VPN (Pre-installed & Tested)',
    quantity: '1–2 apps',
    detail: 'Ensure a working VPN is installed before arriving. Foreign apps (Google, Gmail, WhatsApp, Instagram, school portal) are blocked by the Great Firewall.',
  },
  {
    id: 't4',
    category: 'tech',
    categoryLabel: 'Tech & Connectivity',
    name: 'Power Bank (Must be in Carry-on Luggage)',
    quantity: '1 unit (≤20,000mAh)',
    detail: 'Essential for full days running maps, translation, and transit apps. CRITICAL: Power banks MUST be in your carry-on luggage and show a clear Wh or mAh rating.',
    requiredForPT: true,
  },
  {
    id: 't5',
    category: 'tech',
    categoryLabel: 'Tech & Connectivity',
    name: 'Universal Plug Adapter',
    quantity: '1 adapter',
    detail: 'China primarily uses Type A (two flat pins) and Type I (three angled pins). A multi-plug adapter ensures hassle-free hotel charging.',
  },

  // 5. Health, Toiletries & Misc
  {
    id: 'h1',
    category: 'health',
    categoryLabel: 'Health & Misc',
    name: 'Compact Travel Umbrella',
    quantity: '1 piece',
    detail: 'November can bring crisp, occasional light drizzle. Keep a light folding umbrella in your daypack.',
  },
  {
    id: 'h2',
    category: 'health',
    categoryLabel: 'Health & Misc',
    name: 'Personal Medications & First Aid',
    quantity: '1 pouch',
    detail: 'Basic travel meds: painkillers, antidiarrheals, motion sickness pills, and plenty of band-aids for walking blisters.',
  },
  {
    id: 'h3',
    category: 'health',
    categoryLabel: 'Health & Misc',
    name: 'Pocket Tissues & Hand Sanitizer',
    quantity: 'Multiple packs',
    detail: 'Pro-tip: Many public restrooms in historic areas, parks, or older venues do not supply toilet paper. Always carry pocket tissues.',
    requiredForPT: true,
  },
  {
    id: 'h4',
    category: 'health',
    categoryLabel: 'Health & Misc',
    name: 'Lip Balm & Facial Moisturizer',
    quantity: '1 each',
    detail: 'Shanghai late autumn air is crisp and dry with chilly winds. Lip balm and moisturizer prevent chapped skin.',
  },
];

interface PackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PackingListModal: React.FC<PackingListModalProps> = ({ isOpen, onClose }) => {
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('quest_shanghai_packed_items');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('quest_shanghai_packed_items', JSON.stringify(packedItems));
    } catch {
      // Ignore storage errors
    }
  }, [packedItems]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setPackedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset your packing checklist progress?')) {
      setPackedItems({});
    }
  };

  const handleCheckAll = () => {
    const allChecked: Record<string, boolean> = {};
    DEFAULT_PACKING_ITEMS.forEach((item) => {
      allChecked[item.id] = true;
    });
    setPackedItems(allChecked);
  };

  const handleCopyText = () => {
    let text = "🧳 QUEST SHANGHAI (OIP 2026) - 7-DAY PACKING CHECKLIST (NOVEMBER)\n";
    text += "Shanghai Autumn Climate: 10°C to 18°C • Crisp winds • Layering required\n\n";

    DEFAULT_PACKING_ITEMS.forEach((item, index) => {
      const isChecked = !!packedItems[item.id];
      text += `${isChecked ? '[x]' : '[ ]'} ${item.name} (${item.quantity || ''})\n   - ${item.detail}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalCount = DEFAULT_PACKING_ITEMS.length;
  const packedCount = DEFAULT_PACKING_ITEMS.filter((item) => packedItems[item.id]).length;
  const progressPercent = Math.round((packedCount / totalCount) * 100);

  const filteredItems = DEFAULT_PACKING_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'All Items', icon: Luggage, count: totalCount },
    { id: 'clothing', label: 'Clothing & Layers', icon: Shirt, count: DEFAULT_PACKING_ITEMS.filter(i => i.category === 'clothing').length },
    { id: 'footwear', label: 'Footwear', icon: Footprints, count: DEFAULT_PACKING_ITEMS.filter(i => i.category === 'footwear').length },
    { id: 'gear', label: 'PT & Site Gear', icon: Briefcase, count: DEFAULT_PACKING_ITEMS.filter(i => i.category === 'gear').length },
    { id: 'tech', label: 'Tech & Pay', icon: Smartphone, count: DEFAULT_PACKING_ITEMS.filter(i => i.category === 'tech').length },
    { id: 'health', label: 'Health & Misc', icon: HeartPulse, count: DEFAULT_PACKING_ITEMS.filter(i => i.category === 'health').length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border-2 border-amber-300 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white flex items-start justify-between relative shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                <Luggage className="w-6 h-6 text-amber-100" />
              </span>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-200">
                  Student Preparation Guide • OIP 2026
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Shanghai 7-Day Immersion Packing List
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 mt-2 max-w-xl leading-relaxed">
              Tailored for Shanghai in November (late autumn). Crisp daytime highs (15°C–18°C), chilly morning/evening drops (10°C or lower), and Practical Training (PT) site visits.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center font-bold text-base transition-colors shrink-0"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Climate & Advisory Strip */}
        <div className="px-5 py-3 bg-amber-50/90 border-b border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-800 font-medium">
            <ThermometerSnowflake className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Weather Tip:</strong> Layering strategy is essential! Morning chills give way to sunny afternoons, and site visits alternate between outdoor transit and heated indoor labs.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyText}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Copy entire checklist as text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
              <span>{copied ? 'Copied!' : 'Copy List'}</span>
            </button>

            <button
              onClick={handleCheckAll}
              className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition-colors"
            >
              Check All
            </button>

            <button
              onClick={handleResetChecklist}
              className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
              title="Reset checkmarks"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Packing Progress: {packedCount} of {totalCount} items checked</span>
            <span className={packedCount === totalCount ? 'text-emerald-600 font-black' : 'text-amber-600'}>
              {progressPercent}% Complete {packedCount === totalCount ? '🎉 Ready to fly!' : ''}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                packedCount === totalCount
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-3 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Checklist Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredItems.map((item) => {
            const isPacked = !!packedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                  isPacked
                    ? 'bg-emerald-50/60 border-emerald-300 text-slate-600'
                    : 'bg-white hover:bg-amber-50/30 border-slate-200 text-slate-900 shadow-2xs'
                }`}
              >
                {/* Checkbox Icon */}
                <div className="pt-0.5 shrink-0">
                  {isPacked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-amber-500" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-bold ${isPacked ? 'line-through text-slate-500' : 'text-slate-950'}`}>
                      {item.name}
                    </h4>

                    {item.quantity && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {item.quantity}
                      </span>
                    )}

                    {item.requiredForPT && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Essential for PT
                      </span>
                    )}

                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <p className={`text-xs mt-1 leading-relaxed ${isPacked ? 'text-slate-500' : 'text-slate-600'}`}>
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Pro-Tips Callout Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 mt-4">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShoppingBag className="w-4 h-4 text-amber-700" />
              <span>Pro Luggage Tip: Leave Extra Space!</span>
            </div>
            <p className="leading-relaxed text-amber-900/90">
              Shanghai is a world-class shopping and tech hub (Nanjing Road, Tianzifang, Xintiandi, Miniso flagship stores). Leave 20–30% empty capacity in your suitcase for souvenirs, snacks (White Rabbit candies, tea, local treats), and gifts!
            </p>
            <p className="text-[11px] text-amber-800 italic">
              * Note: These are recommendations tailored for student comfort and official site visit requirements, not rigid constraints.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Checked items are saved automatically to this device.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs transition-colors shadow-sm"
          >
            Done & Save
          </button>
        </div>

      </div>
    </div>
  );
};
