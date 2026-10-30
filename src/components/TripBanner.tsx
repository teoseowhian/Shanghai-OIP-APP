import React, { useState } from 'react';
import { PhoneCall, MapPin, Copy, Check, ShieldAlert, Sparkles, Navigation, Luggage, GraduationCap } from 'lucide-react';

interface TripBannerProps {
  onOpenPackingList?: () => void;
  onOpenDeliverables?: () => void;
}

export const TripBanner: React.FC<TripBannerProps> = ({ onOpenPackingList, onOpenDeliverables }) => {
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const hotelChineseAddress = "中国上海市静安区延长中路302号 如家精选酒店 (上海火车站延长路地铁站店) (Postal code: 200070)";
  const hotelPinyin = "Zhōngguó Shànghǎi Shì Jìng'ān Qū Yáncháng Zhōng Lù 302 Hào - Rújiā Jīngxuǎn Jiǔdiàn";

  const handleCopy = () => {
    navigator.clipboard.writeText(hotelChineseAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Main Immersion Info */}
          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold text-slate-800">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-900">Shanghai Immersion (DE Group 2)</span>
            <span className="text-amber-400">•</span>
            <span className="text-slate-700">8 to 14 Nov 2026</span>
            <span className="text-amber-400">•</span>
            <span className="text-amber-900 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600 inline" />
              Homeinn Plus Hotel
            </span>
          </div>

          {/* Student Leader Badges & Quick Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-amber-300 text-slate-800 shadow-2xs">
                <span className="text-slate-500 font-normal">Class Rep:</span>
                <span className="text-amber-700 font-bold">Latasha</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-amber-300 text-slate-800 shadow-2xs">
                <span className="text-slate-500 font-normal">Assis:</span>
                <span className="text-blue-700 font-bold">Ren ZhuoJing</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-amber-300 text-slate-800 shadow-2xs">
                <span className="text-slate-500 font-normal">Treasurer:</span>
                <span className="text-emerald-700 font-bold">Chua Yu Zhe</span>
              </span>
            </div>

            {/* Quick Action: Deliverables */}
            {onOpenDeliverables && (
              <button
                onClick={onOpenDeliverables}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs cursor-pointer active:scale-95"
                title="Deliverables: Brightspace & NYC AEP Modules (1 LU Grant)"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-200" />
                <span>Deliverables (1 LU)</span>
              </button>
            )}

            {/* Quick Action: Packing List */}
            {onOpenPackingList && (
              <button
                onClick={onOpenPackingList}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white hover:bg-amber-100 text-slate-900 border border-amber-300 transition-colors shadow-2xs cursor-pointer active:scale-95"
                title="7-Day Shanghai Packing List tailored for November"
              >
                <Luggage className="w-3.5 h-3.5 text-amber-600" />
                <span>Packing List</span>
              </button>
            )}

            {/* Quick Action: Taxi Card */}
            <button
              onClick={() => setShowTaxiModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition-colors shadow-xs"
              title="Show Chinese Address to Taxi Driver"
            >
              <span>🚕</span>
              <span>Taxi Address Card</span>
            </button>
          </div>

        </div>
      </div>

      {/* Taxi Address Modal */}
      {showTaxiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">
                  🚕
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Shanghai Taxi Helper</h3>
                  <p className="text-xs text-slate-500">Show this screen to your taxi or Didi driver</p>
                </div>
              </div>
              <button
                onClick={() => setShowTaxiModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Chinese Display Box */}
            <div className="mt-5 p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 block mb-1">
                师父，请送我到这里 (Driver, please take me here):
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-950 my-2 leading-relaxed tracking-wide">
                中国上海市静安区延长中路302号<br />
                <span className="text-amber-600">如家精选酒店 (上海火车站延长路地铁站店)</span>
              </p>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Homeinn Plus Hotel • Yanchang Middle Road 302, Jing An District, Shanghai 200070
              </p>
              <p className="text-xs text-slate-600 italic mt-1 font-mono">
                {hotelPinyin}
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-white rounded-lg border border-amber-300 text-xs text-slate-700 font-semibold">
                🚇 靠近: 地铁1号线 延长路站 (上海火车站商圈)
              </div>
            </div>

            {/* Emergency Contacts - Student Leaders listed without phone numbers, emergency lines kept */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-200">
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>👩🏻‍💼 Class Rep:</span>
                <span className="font-bold text-slate-900">Latasha</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>🧑🏻‍💻 Assistant Lead:</span>
                <span className="font-bold text-slate-900">Ren ZhuoJing</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>🚨 Shanghai Emergency Police:</span>
                <span className="font-mono font-bold text-rose-600">110 / Ambulance 120</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-amber-500/20"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Chinese Address!' : 'Copy Address Text'}
              </button>
              <button
                onClick={() => setShowTaxiModal(false)}
                className="py-3 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
