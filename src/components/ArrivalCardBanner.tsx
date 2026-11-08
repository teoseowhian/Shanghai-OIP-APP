import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, AlertCircle, ChevronDown, ChevronUp, Plane, CheckCircle2, Building, Phone } from 'lucide-react';
import { Student } from '../data/tripData';

interface ArrivalCardBannerProps {
  currentStudent: Student;
}

export const ArrivalCardBanner: React.FC<ArrivalCardBannerProps> = ({ currentStudent }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const storageKey = `arrival_card_completed_${currentStudent.id}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setIsCompleted(saved === 'true');
    } catch {
      // ignore
    }
  }, [currentStudent.id, storageKey]);

  const handleToggleComplete = () => {
    const nextVal = !isCompleted;
    setIsCompleted(nextVal);
    try {
      localStorage.setItem(storageKey, String(nextVal));
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const arrivalCardUrl = 'https://s.nia.gov.cn/ArrivalCardFillingPhone/';
  const invitationParty = 'Shanghai University';
  const phoneNumber = '18516246729';
  const hotelAddress = '上海市静安区广中路809号 邮政编码: 200072';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div className={`rounded-2xl border-2 transition-all shadow-md overflow-hidden ${
        isCompleted
          ? 'bg-emerald-50/90 border-emerald-400 text-slate-800'
          : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/90 border-amber-400 text-slate-900'
      }`}>
        {/* Banner Top Header */}
        <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs border ${
              isCompleted
                ? 'bg-emerald-500 text-white border-emerald-300'
                : 'bg-amber-500 text-white border-amber-300 animate-pulse'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isCompleted
                    ? 'bg-emerald-200/80 text-emerald-900'
                    : 'bg-rose-500 text-white'
                }`}>
                  {isCompleted ? '✓ Completed' : '🚨 Action Required by This Friday'}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  From: Faculty-in-Charge (Mr Teo Seow Hian)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight mt-0.5 truncate">
                China Digital Arrival Card Filling (s.nia.gov.cn)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleComplete}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-amber-300'
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : null}
              <span className="hidden sm:inline">{isCompleted ? 'Submitted' : 'Mark as Done'}</span>
              <span className="sm:hidden">{isCompleted ? 'Done' : 'Mark'}</span>
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl hover:bg-black/5 text-slate-600 transition-colors"
              title={isCollapsed ? 'Expand details' : 'Collapse banner'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Banner Expandable Body */}
        {!isCollapsed && (
          <div className="px-3 sm:px-4 pb-3.5 pt-1 border-t border-amber-200/60 bg-white/60">
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-3">
              <strong>Dear all:</strong> Please help to enter the arrival card as per official address details below before departure. Complete submission by <strong>this Friday</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-3">
              {/* Field 1: Invitation Party */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-emerald-600" />
                    <span>Invitation Party</span>
                  </div>
                  <div className="text-xs font-black text-slate-900 truncate">{invitationParty}</div>
                  <div className="text-[10px] text-slate-500">上海大学 (SHU)</div>
                </div>
                <button
                  onClick={() => copyToClipboard(invitationParty, 'party')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors cursor-pointer shrink-0"
                  title="Copy Shanghai University"
                >
                  {copiedField === 'party' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Field 2: Phone Number */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-blue-600" />
                    <span>Phone Number</span>
                  </div>
                  <div className="text-xs font-black text-slate-900">{phoneNumber}</div>
                  <div className="text-[10px] text-slate-500">SHU-CIE Coordinator Phone</div>
                </div>
                <button
                  onClick={() => copyToClipboard(phoneNumber, 'phone')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors cursor-pointer shrink-0"
                  title="Copy phone number"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Field 3: Basecamp Address */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Hotel Address</div>
                  <div className="text-xs font-black text-slate-900 truncate">809 Guangzhong Rd, Jing'An</div>
                  <div className="text-[10px] text-slate-500 truncate">{hotelAddress}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(hotelAddress, 'address')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 transition-colors cursor-pointer shrink-0"
                  title="Copy Chinese hotel address"
                >
                  {copiedField === 'address' ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Direct Link Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              <a
                href={arrivalCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <span>Open China NIA Arrival Card Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
              </a>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Official Portal:</span>
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-800">
                  s.nia.gov.cn/ArrivalCardFillingPhone/
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
