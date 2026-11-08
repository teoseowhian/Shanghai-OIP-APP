import React from 'react';
import { Trophy, ClipboardList, Gift, MapPin, User, Sparkles, Luggage, GraduationCap, ClipboardCheck, Languages, LogOut } from 'lucide-react';
import { Student } from '../data/tripData';

interface HeaderProps {
  activeTab: 'rankings' | 'leader_desk' | 'loot' | 'itinerary' | 'phrasebook' | 'survey' | 'deliverables';
  setActiveTab: (tab: 'rankings' | 'leader_desk' | 'loot' | 'itinerary' | 'phrasebook' | 'survey' | 'deliverables') => void;
  currentStudent: Student;
  isLeader: boolean;
  isLecturer?: boolean;
  onSignOut: () => void;
  onOpenPackingList?: () => void;
  onOpenDeliverables?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentStudent,
  isLeader,
  isLecturer,
  onSignOut,
  onOpenPackingList,
  onOpenDeliverables,
}) => {
  const gradeUnlocked = ((currentStudent.coins / 100) * 5.0).toFixed(1);

  return (
    <header className="bg-white border-b border-amber-100 shadow-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* DE Official Department Logo */}
            <div
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white p-1 border-2 border-emerald-400/80 shadow-md shadow-emerald-700/10 flex items-center justify-center shrink-0 transform transition-transform hover:scale-105 cursor-pointer"
              title="Diploma in Engineering (DE) • NP OIP Shanghai"
              onClick={onOpenDeliverables}
            >
              <img
                src="/assets/aistudio/image_7355fa1c.png"
                alt="DE Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Dragon Avatar Badge (matching shared prototype) */}
            <div className="relative group cursor-pointer" title="Quest Mascot: Bao the Dragon">
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 border-2 border-amber-200 transform transition-transform hover:scale-105">
                <span className="text-2xl sm:text-3xl select-none" role="img" aria-label="Bao Dragon">🐲</span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-baseline gap-1.5 font-sans">
                  <span className="text-slate-900 tracking-wider">QUEST</span>
                  <span className="text-amber-500 font-extrabold tracking-wide">SHANGHAI</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  DE OIP '26
                </span>
              </div>

              {/* Module Grade Tracker Banner */}
              <div className="flex items-center gap-2 text-xs font-semibold mt-0.5 text-slate-700">
                <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  <span>🎯</span> 100 Coins = <strong className="text-emerald-700">5.0% Module Grade</strong>
                </span>
                <span className="hidden sm:inline-block text-slate-300">|</span>
                {isLecturer ? (
                  <span className="text-purple-700 font-bold hidden sm:inline-flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    👨🏻‍🏫 Faculty In-Charge • Cohort Supervisor Access
                  </span>
                ) : (
                  <span className="text-slate-600 hidden sm:inline-flex items-center gap-1">
                    You have <span className="font-bold text-amber-600">{currentStudent.coins} Coins</span> ({gradeUnlocked}% unlocked)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                activeTab === 'rankings'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Trophy className={`w-4 h-4 ${activeTab === 'rankings' ? 'text-amber-300' : 'text-amber-500'}`} />
              <span>Rankings</span>
            </button>

            {/* Leader Desk - Only accessible and visible to signed-in student leaders */}
            {isLeader && (
              <button
                onClick={() => setActiveTab('leader_desk')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                  activeTab === 'leader_desk'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <ClipboardList className={`w-4 h-4 ${activeTab === 'leader_desk' ? 'text-amber-300' : 'text-blue-500'}`} />
                <span>Leader Desk</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('loot')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                activeTab === 'loot'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Gift className={`w-4 h-4 ${activeTab === 'loot' ? 'text-amber-300' : 'text-rose-500'}`} />
              <span>Loot & Badges</span>
            </button>

            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                activeTab === 'itinerary'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <MapPin className={`w-4 h-4 ${activeTab === 'itinerary' ? 'text-amber-300' : 'text-indigo-500'}`} />
              <span>Itinerary</span>
            </button>

            <button
              onClick={() => setActiveTab('phrasebook')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                activeTab === 'phrasebook'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Languages className={`w-4 h-4 ${activeTab === 'phrasebook' ? 'text-amber-300' : 'text-teal-600'}`} />
              <span>🗣️ Phrases</span>
            </button>

            <button
              onClick={() => setActiveTab('survey')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                activeTab === 'survey'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <ClipboardCheck className={`w-4 h-4 ${activeTab === 'survey' ? 'text-amber-300' : 'text-indigo-600'}`} />
              <span>📋 Survey</span>
            </button>

            <button
              onClick={() => setActiveTab('deliverables')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                activeTab === 'deliverables'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${activeTab === 'deliverables' ? 'text-amber-300' : 'text-emerald-600'}`} />
              <span>🎓 Deliverables</span>
              <span className="hidden xl:inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                1 LU
              </span>
            </button>

            {/* Quick Deliverables Button */}
            {onOpenDeliverables && (
              <button
                onClick={onOpenDeliverables}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Open Academic Deliverables (1 LU Global Readiness & NYC AEP Grant)"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Deliverables</span>
                <span className="hidden lg:inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white">
                  1 LU
                </span>
              </button>
            )}

            {/* Quick Packing List Button */}
            {onOpenPackingList && (
              <button
                onClick={onOpenPackingList}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Open 7-Day Shanghai Immersion Packing List"
              >
                <Luggage className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Packing List</span>
                <span className="sm:hidden">Pack</span>
              </button>
            )}

            {/* Signed-in User Identity & Sign Out */}
            <div className="relative ml-1 sm:ml-2 flex items-center gap-2">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs shadow-2xs"
                title={`Signed in as ${currentStudent.name}`}
              >
                <span className="text-base">{currentStudent.avatar}</span>
                <div className="leading-tight text-left">
                  <div className="font-bold text-slate-800 flex items-center gap-1 max-w-[140px] truncate">
                    <span>{currentStudent.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    {isLecturer ? (
                      <span className="text-purple-800 font-extrabold flex items-center gap-1">
                        👨🏻‍🏫 Faculty In-Charge
                      </span>
                    ) : (
                      <>
                        <span className="text-amber-700 font-bold">{currentStudent.coins}c</span>
                        <span>•</span>
                        {isLeader ? (
                          <span className="text-amber-800 font-extrabold">👑 Leader</span>
                        ) : (
                          <span className="text-slate-600 font-medium">🎓 Student</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Return to Login / Switch User */}
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 font-bold text-xs shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
                title="Return to Login Screen / Switch Account"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Return to Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
