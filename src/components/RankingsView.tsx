import React, { useState, useRef } from 'react';
import {
  Trophy,
  Flame,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Search,
  ArrowDownCircle,
  RotateCcw,
  Lock,
  AlertTriangle,
  ShieldAlert,
  Eye,
  EyeOff,
  Download,
  Users,
  Check,
  LogOut,
} from 'lucide-react';
import { Student } from '../data/tripData';

interface RankingsViewProps {
  students: Student[];
  onModifyCoins: (studentId: string, amount: number, questTitle: string) => void;
  onBatchModifyCoins?: (
    targetScope: 'all' | 'Team Dragon' | 'Team Xiaolongbao' | 'Team Maglev' | string,
    amount: number,
    questTitle: string
  ) => void;
  onResetAllCoins: () => void;
  currentStudent: Student;
  isLeader: boolean;
  onReturnToLogin?: () => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({
  students,
  onModifyCoins,
  onBatchModifyCoins,
  onResetAllCoins,
  currentStudent,
  isLeader,
  onReturnToLogin,
}) => {
  const [selectedSquad, setSelectedSquad] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Coin Modification Modal State (No passcode required)
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'award' | 'deduct'>('award');
  const [targetScope, setTargetScope] = useState<'all' | 'Team Dragon' | 'Team Xiaolongbao' | 'Team Maglev' | 'individual'>('individual');
  const [targetStudentId, setTargetStudentId] = useState<string>(currentStudent.id);
  const [questTitle, setQuestTitle] = useState<string>('Completed Metro Line 2 Landmark Check');
  const [coinAmount, setCoinAmount] = useState<number>(15);

  // CSV Export Dropdown State
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Reset Coins Modal State (No password required)
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetSuccessBanner, setResetSuccessBanner] = useState<boolean>(false);

  const tableScrollRef = useRef<HTMLDivElement | null>(null);
  const currentUserRowRef = useRef<HTMLTableRowElement | null>(null);

  const [recentLog, setRecentLog] = useState<{ studentName: string; delta: number; quest: string; time: string }[]>([
    { studentName: 'Latasha Srinidthi Cliffton', delta: 15, quest: 'Xiaolongbao Local Order Challenge', time: '10 mins ago' },
    { studentName: 'Ren ZhuoJing', delta: 20, quest: 'Maglev 300 km/h Speed Run', time: '35 mins ago' },
    { studentName: 'Chua Yu Zhe', delta: 15, quest: 'Budget Group Receipt Audit', time: '1 hr ago' },
    { studentName: 'Tan Zheng Kang, Aaron', delta: 10, quest: 'Pudong Architecture Selfie', time: '2 hrs ago' },
  ]);

  // Sort students by coins descending
  const sortedStudents = [...students].sort((a, b) => b.coins - a.coins);

  // Calculate Squad Stats
  const squadMap: Record<string, { totalCoins: number; memberCount: number; color: string }> = {};
  students.forEach((s) => {
    if (!squadMap[s.squad]) {
      squadMap[s.squad] = {
        totalCoins: 0,
        memberCount: 0,
        color:
          s.squad === 'Team Dragon'
            ? 'from-amber-500 to-orange-500'
            : s.squad === 'Team Xiaolongbao'
            ? 'from-rose-500 to-pink-500'
            : 'from-blue-500 to-cyan-500',
      };
    }
    squadMap[s.squad].totalCoins += s.coins;
    squadMap[s.squad].memberCount += 1;
  });

  const squadList = Object.entries(squadMap).map(([name, data]) => ({
    name,
    avgCoins: data.memberCount > 0 ? Math.round(data.totalCoins / data.memberCount) : 0,
    totalCoins: data.totalCoins,
    memberCount: data.memberCount,
    color: data.color,
  })).sort((a, b) => b.avgCoins - a.avgCoins);

  // Filtered Students
  const filteredStudents = sortedStudents.filter((s) => {
    const matchesSquad = selectedSquad === 'All' || s.squad === selectedSquad;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSquad && matchesSearch;
  });

  const handleOpenModal = (
    studentId: string,
    mode: 'award' | 'deduct',
    scope: 'all' | 'Team Dragon' | 'Team Xiaolongbao' | 'Team Maglev' | 'individual' = 'individual'
  ) => {
    setTargetStudentId(studentId);
    setTargetScope(scope);
    setModalMode(mode);
    if (mode === 'award') {
      setCoinAmount(15);
      setQuestTitle('Completed Immersion Task');
    } else {
      setCoinAmount(10);
      setQuestTitle('Curfew Infraction (Returned past 22:30)');
    }
    setShowLogModal(true);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const delta = modalMode === 'award' ? Math.abs(Number(coinAmount)) : -Math.abs(Number(coinAmount));
    
    if (targetScope === 'individual') {
      const student = students.find((s) => s.id === targetStudentId);
      if (!student) return;

      if (onBatchModifyCoins) {
        onBatchModifyCoins(targetStudentId, delta, questTitle);
      } else {
        onModifyCoins(targetStudentId, delta, questTitle);
      }

      setRecentLog([
        {
          studentName: student.name.split(' ')[0],
          delta,
          quest: questTitle,
          time: 'Just now',
        },
        ...recentLog.slice(0, 5),
      ]);
    } else {
      // Batch update for all students or a specific squad
      if (onBatchModifyCoins) {
        onBatchModifyCoins(targetScope, delta, questTitle);
      } else {
        students
          .filter((s) => targetScope === 'all' || s.squad === targetScope)
          .forEach((s) => onModifyCoins(s.id, delta, questTitle));
      }

      const scopeLabel = targetScope === 'all' ? 'All 29 Students' : targetScope;
      setRecentLog([
        {
          studentName: scopeLabel,
          delta,
          quest: `${questTitle} (${targetScope === 'all' ? 'Cohort' : 'Squad'})`,
          time: 'Just now',
        },
        ...recentLog.slice(0, 5),
      ]);
    }

    setShowLogModal(false);
  };

  // Export Leaderboard CSV for All or Selected Squad
  const handleExportCSV = (squadChoice: 'All' | 'Team Dragon' | 'Team Xiaolongbao' | 'Team Maglev') => {
    const exportList =
      squadChoice === 'All'
        ? [...students].sort((a, b) => b.coins - a.coins)
        : [...students].filter((s) => s.squad === squadChoice).sort((a, b) => b.coins - a.coins);

    const headers = [
      'Rank',
      'Student ID',
      'Full Name',
      'Squad',
      'Attendance Status',
      'Quest Coins',
      'Module Grade (%)',
      'Quests Completed',
    ];

    const rows = exportList.map((st, idx) => [
      idx + 1,
      st.id,
      `"${st.name.replace(/"/g, '""')}"`,
      `"${st.squad}"`,
      `"${st.attendanceStatus}"`,
      st.coins,
      ((st.coins / 100) * 5.0).toFixed(2),
      st.questsCompleted,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const cleanSquadName = squadChoice.replace(/\s+/g, '_');
    link.setAttribute(
      'download',
      `Quest_Shanghai_Leaderboard_${cleanSquadName}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    onResetAllCoins();
    setShowResetModal(false);
    setResetSuccessBanner(true);
    setTimeout(() => setResetSuccessBanner(false), 5000);
  };

  const handleScrollToCurrentUser = () => {
    currentUserRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const targetStudent = students.find((s) => s.id === targetStudentId) || currentStudent;

  return (
    <div className="space-y-6">

      {/* Reset Success Banner */}
      {resetSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            <span>Success: All 29 students' coins and module grade progress have been reset to 0!</span>
          </div>
          <button
            onClick={() => setResetSuccessBanner(false)}
            className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Welcome / Motivation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Module Grade Goal Card */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Assessment Criteria
            </span>
            <span className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </span>
          </div>

          <div className="mt-3">
            <div className="text-3xl font-black">100 Coins = 5.0%</div>
            <p className="text-xs text-emerald-100 mt-1">
              Every 20 Quest Coins = 1.0% grade unlocked! Earn all 100 coins to secure the full 5.0% module component.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/40 flex items-center justify-between text-xs">
            <span className="text-emerald-200">Cohort Average:</span>
            <span className="font-bold text-amber-300">
              {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + s.coins, 0) / students.length) : 0} Coins (
              {students.length > 0 ? (((students.reduce((acc, s) => acc + s.coins, 0) / students.length) / 100) * 5.0).toFixed(1) : 0}% avg)
            </span>
          </div>
        </div>

        {/* Top Squad Standing Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Squad Rankings (3 Groups)
              </span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-2 mt-2">
              {squadList.slice(0, 3).map((sq, idx) => (
                <div key={sq.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                      idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{sq.name}</span>
                  </div>
                  <div className="text-xs text-right">
                    <span className="font-extrabold text-amber-600">{sq.avgCoins}c</span>
                    <span className="text-[10px] text-slate-400 block">{sq.memberCount} students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-slate-100">
            Top squad wins special Shanghai tea ceremony loot!
          </div>
        </div>

        {/* Coin Action Card: Leader Controls or Student Status */}
        {isLeader ? (
          <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 rounded-3xl p-5 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                <span>Leader Coin Controls</span>
                <Flame className="w-5 h-5 text-rose-700 fill-rose-600" />
              </div>
              <h3 className="text-xl font-black mt-2">Award or Adjust Quest Coins</h3>
              <p className="text-xs font-medium text-amber-950/80 mt-1">
                Log completed immersion quests (+coins) or record discipline infractions (-coins).
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenModal(currentStudent.id, 'award')}
                  className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Award Coins</span>
                </button>
                <button
                  onClick={() => handleOpenModal(currentStudent.id, 'deduct')}
                  className="py-2.5 px-3 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5 text-rose-400" />
                  <span>- Deduct Coins</span>
                </button>
              </div>
              {onReturnToLogin && (
                <button
                  onClick={onReturnToLogin}
                  className="w-full py-1.5 px-3 rounded-xl bg-amber-600/25 hover:bg-amber-600/40 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors border border-amber-600/30 cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-rose-800" />
                  <span>Return to Login / Switch User</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-5 shadow-md flex flex-col justify-between border border-slate-700/80">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-300">
                <span>Your Immersion Progress</span>
                <span className="text-xl">{currentStudent.avatar}</span>
              </div>
              <h3 className="text-xl font-black mt-2 text-white">{currentStudent.name}</h3>
              <p className="text-xs text-slate-300 mt-1">
                {currentStudent.squad} • {currentStudent.questsCompleted} quests completed
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <span className="text-[11px] text-slate-400 block">Your Standing</span>
                <span className="text-xl font-black text-amber-400">{currentStudent.coins} Coins</span>
                <span className="text-xs text-emerald-400 font-bold ml-1.5">
                  ({((currentStudent.coins / 100) * 5.0).toFixed(1)}% / 5.0%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleScrollToCurrentUser}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" />
                  <span>Jump to My Rank</span>
                </button>
                {onReturnToLogin && (
                  <button
                    onClick={onReturnToLogin}
                    className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Return to Login Screen"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Return to Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Main Leaderboard Table Section (All 29 Students with Scrollable View) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900">Student Immersion Leaderboard</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {filteredStudents.length} Students (3 Groups)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick jump to current student */}
            <button
              onClick={handleScrollToCurrentUser}
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Scroll directly to your rank row"
            >
              <ArrowDownCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Jump to My Rank</span>
            </button>

            {/* Reset All Coins (No Password Required, Leader Only) */}
            {isLeader && (
              <button
                onClick={() => {
                  setShowResetModal(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset all student coins to 0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Reset All Coins</span>
              </button>
            )}

            {/* Download CSV Dropdown with Squad Selection */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Download standings as CSV Excel file (Select squad or all)"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download CSV</span>
                <span className="text-[10px] text-emerald-600 font-normal">▼</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in duration-100 text-xs space-y-1">
                  <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                    <span>Select Squad to Export:</span>
                    <span className="text-[9px] text-emerald-700 font-mono">Excel Ready</span>
                  </div>
                  <button
                    onClick={() => {
                      handleExportCSV('All');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>🌟 All Squads (29 Students)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Cohort</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV('Team Dragon');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-amber-50 text-amber-900 font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>🐉 Team Dragon (10)</span>
                    <span className="text-[10px] text-amber-600 font-normal">CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV('Team Xiaolongbao');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-rose-50 text-rose-900 font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>🥟 Team Xiaolongbao (10)</span>
                    <span className="text-[10px] text-rose-600 font-normal">CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV('Team Maglev');
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-blue-50 text-blue-900 font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>🚅 Team Maglev (9)</span>
                    <span className="text-[10px] text-blue-600 font-normal">CSV</span>
                  </button>
                </div>
              )}
            </div>

            {/* Squad Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['All', 'Team Dragon', 'Team Xiaolongbao', 'Team Maglev'].map((sq) => (
                <button
                  key={sq}
                  onClick={() => setSelectedSquad(sq)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedSquad === sq
                      ? 'bg-white text-slate-950 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sq === 'All' ? 'All Squads' : sq.replace('Team ', '')}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Container with Sticky Table Header */}
        <div ref={tableScrollRef} className="max-h-[560px] overflow-y-auto overflow-x-auto relative">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200 shadow-2xs">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Squad</th>
                <th className="py-3.5 px-4">Quests Done</th>
                <th className="py-3.5 px-4">Quest Coins</th>
                <th className="py-3.5 px-4">Module Grade %</th>
                {isLeader && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((student, index) => {
                const isCurrentUser = student.id === currentStudent.id;
                const gradePercent = ((student.coins / 100) * 5.0).toFixed(1);

                return (
                  <tr
                    key={student.id}
                    ref={isCurrentUser ? currentUserRowRef : null}
                    className={`hover:bg-amber-50/50 transition-colors ${
                      isCurrentUser
                        ? 'bg-amber-100/60 font-semibold ring-1 ring-inset ring-amber-300'
                        : index % 2 === 1
                        ? 'bg-slate-50/40'
                        : 'bg-white'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black shadow-xs">
                          🥇
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black shadow-xs">
                          🥈
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black shadow-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 font-mono">#{index + 1}</span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{student.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {student.name}
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Squad */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        {student.squad}
                      </span>
                    </td>

                    {/* Quests Done */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-bold">{student.questsCompleted}</span> completed
                      </div>
                    </td>

                    {/* Coins */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, student.coins)}%` }}
                          ></div>
                        </div>
                        <span className="font-black text-amber-600 text-sm font-mono">{student.coins}</span>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                    </td>

                    {/* Module Grade % */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span>🎯</span> {gradePercent}% / 5.0%
                      </span>
                    </td>

                    {/* Actions: Add (+) or Deduct (-) - Visible only to signed-in leaders */}
                    {isLeader && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenModal(student.id, 'award')}
                            className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Award coins"
                          >
                            <Plus className="w-3 h-3 text-emerald-700" />
                            <span>Add</span>
                          </button>
                          <button
                            onClick={() => handleOpenModal(student.id, 'deduct')}
                            className="px-2 py-1 rounded-lg text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Deduct coins"
                          >
                            <Minus className="w-3 h-3 text-rose-700" />
                            <span>Deduct</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Scroll footer status bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing all {filteredStudents.length} students in Shanghai DE Group 2</span>
          <span className="text-slate-400 italic">Scroll vertically to view all entries</span>
        </div>
      </div>

      {/* Recent Coin Activity Log */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">Recent Quest & Penalty Activity</h3>
          </div>
          <span className="text-xs text-slate-400">Live Immersion Stream</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentLog.map((log, i) => (
            <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                <span>{log.studentName}</span>
                <span className={log.delta >= 0 ? "text-emerald-600 font-extrabold" : "text-rose-600 font-extrabold"}>
                  {log.delta >= 0 ? `+${log.delta}` : `${log.delta}`} Coins
                </span>
              </div>
              <p className="text-slate-600 line-clamp-1">{log.quest}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Log / Deduct Quest Coins Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className={`bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 transition-all ${
            modalMode === 'award' ? 'border-emerald-300' : 'border-rose-300'
          } animate-in fade-in zoom-in duration-150`}>
            
            {/* Header with Mode Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{modalMode === 'award' ? '🪙' : '⚠️'}</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {modalMode === 'award' ? 'Award Quest Coins' : 'Deduct Coins (Infraction)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalMode === 'award' ? 'Reward student immersion effort' : 'Record penalty for rule infraction'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-4 grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setModalMode('award');
                  setQuestTitle('Completed Metro Line 2 Landmark Check');
                  setCoinAmount(15);
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  modalMode === 'award'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Award Coins (+)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMode('deduct');
                  setQuestTitle('Curfew Infraction (Returned past 22:30)');
                  setCoinAmount(10);
                }}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  modalMode === 'deduct'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Deduct Coins (-)</span>
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="mt-4 space-y-4">
              {/* Target Audience Scope Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
                  <span>Target Audience (All / Squad / Student)</span>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {targetScope === 'all'
                      ? '👥 All 29 Students'
                      : targetScope === 'Team Dragon'
                      ? '🐉 10 Students in Team Dragon'
                      : targetScope === 'Team Xiaolongbao'
                      ? '🥟 10 Students in Team Xiaolongbao'
                      : targetScope === 'Team Maglev'
                      ? '🚅 9 Students in Team Maglev'
                      : '👤 1 Student'}
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold mb-2">
                  <button
                    type="button"
                    onClick={() => setTargetScope('all')}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      targetScope === 'all'
                        ? 'bg-slate-950 text-amber-300 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>👥 All (29)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetScope('Team Dragon')}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      targetScope === 'Team Dragon'
                        ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🐉 Dragon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetScope('Team Xiaolongbao')}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      targetScope === 'Team Xiaolongbao'
                        ? 'bg-rose-500 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🥟 Xiaolongbao</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetScope('Team Maglev')}
                    className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      targetScope === 'Team Maglev'
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🚅 Maglev</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetScope('individual')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      targetScope === 'individual'
                        ? 'bg-emerald-600 text-white shadow-xs font-black'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>👤 Single Student Selection</span>
                  </button>
                </div>

                {targetScope === 'individual' && (
                  <div className="mt-2 animate-in fade-in">
                    <select
                      value={targetStudentId}
                      onChange={(e) => setTargetStudentId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.squad}) — Current: {s.coins} coins
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {modalMode === 'award' ? 'Quest / Immersion Task' : 'Infraction / Penalty Reason'}
                </label>
                <input
                  type="text"
                  value={questTitle}
                  onChange={(e) => setQuestTitle(e.target.value)}
                  placeholder={modalMode === 'award' ? "e.g. Ordered Shengjianbao in Chinese" : "e.g. Late for morning briefing"}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Quick Preset Reason Chips */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                  Quick Select Preset:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {modalMode === 'award' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Local Food Order in Mandarin'); setCoinAmount(15); }}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                      >
                        🍜 Ordered Food in Mandarin (+15)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Metro Line 2 Navigation Quest'); setCoinAmount(15); }}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                      >
                        🚇 Line 2 Navigation (+15)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Museum Cultural Reflection'); setCoinAmount(20); }}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                      >
                        🏛️ Museum Reflection (+20)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Exemplary Team Spirit & Buddy Care'); setCoinAmount(10); }}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                      >
                        🤝 Buddy Care (+10)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Group Punctuality & Morning Roll Call'); setCoinAmount(5); }}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200"
                      >
                        ⏰ Full Squad On-Time (+5)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Late for Morning Roll Call / Assembly'); setCoinAmount(5); }}
                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200"
                      >
                        ⏰ Late for Assembly (-5)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Curfew Infraction (Returned past 22:30)'); setCoinAmount(10); }}
                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200"
                      >
                        🌙 Curfew Breach (-10)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Separated from Buddy / Group without Notice'); setCoinAmount(10); }}
                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200"
                      >
                        🚶 Wandering off Buddy (-10)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Lost Room Key Card / Hotel Badge'); setCoinAmount(5); }}
                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200"
                      >
                        🔑 Lost Room Card (-5)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setQuestTitle('Disruptive Conduct during Immersion Site Visit'); setCoinAmount(15); }}
                        className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200"
                      >
                        ⚠️ Disruptive Conduct (-15)
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {modalMode === 'award' ? 'Coins to Award' : 'Coins to Deduct'}
                </label>
                <div className="flex items-center gap-2">
                  {(modalMode === 'award' ? [5, 10, 15, 20, 25] : [5, 10, 15, 20]).map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCoinAmount(amt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        coinAmount === amt
                          ? modalMode === 'award'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {modalMode === 'award' ? `+${amt}` : `-${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Card */}
              {modalMode === 'award' ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Grade Impact:</span>
                    <span className="text-emerald-700 font-extrabold">+{((coinAmount / 100) * 5.0).toFixed(2)}%</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    {targetScope === 'all'
                      ? `Will award +${coinAmount} coins to ALL 29 students across all squads!`
                      : targetScope === 'individual'
                      ? `${targetStudent.name.split(' ')[0]}'s balance will increase from ${targetStudent.coins} to ${Math.min(100, targetStudent.coins + coinAmount)} coins.`
                      : `Will award +${coinAmount} coins to all ${students.filter((s) => s.squad === targetScope).length} members of ${targetScope}!`}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Grade Impact:</span>
                    <span className="text-rose-700 font-extrabold">-{((coinAmount / 100) * 5.0).toFixed(2)}%</span>
                  </div>
                  <p className="text-[11px] text-rose-700">
                    {targetScope === 'all'
                      ? `Will deduct -${coinAmount} coins from ALL 29 students across all squads (minimum 0).`
                      : targetScope === 'individual'
                      ? `${targetStudent.name.split(' ')[0]}'s balance will decrease from ${targetStudent.coins} to ${Math.max(0, targetStudent.coins - coinAmount)} coins.`
                      : `Will deduct -${coinAmount} coins from all ${students.filter((s) => s.squad === targetScope).length} members of ${targetScope} (minimum 0).`}
                  </p>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-colors ${
                    modalMode === 'award'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {modalMode === 'award' ? 'Confirm & Award Coins 🎯' : 'Confirm & Deduct Coins ⚠️'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset All Coins Password-Protected Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-400 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Admin Authorization</h3>
                  <p className="text-xs text-slate-500">Reset All 29 Students' Coins to 0</p>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReset} className="mt-4 space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-bold">Warning: Irreversible Immersion Reset</strong>
                  <p className="leading-relaxed">
                    This will clear all quest coin balances for all 29 students back to <strong>0 coins</strong> and reset their module assessment component to <strong>0.0%</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Confirm Reset (Clear All)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
