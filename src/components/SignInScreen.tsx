import React, { useState } from 'react';
import { ShieldCheck, UserCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Student } from '../data/tripData';

interface SignInScreenProps {
  students: Student[];
  onSignIn: (studentId: string, role: 'leader' | 'student', leaderPin?: string) => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ students, onSignIn }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 's1');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const isLeaderCandidate = ['s1', 's11', 's22'].includes(selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const role = isLeaderCandidate ? 'leader' : 'student';
    onSignIn(selectedStudentId, role, isLeaderCandidate ? 'leader' : undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            {/* DE Official Department Logo */}
            <div className="w-12 h-12 rounded-2xl bg-white p-1 border-2 border-emerald-500 shadow-md flex items-center justify-center">
              <img
                src="/assets/aistudio/image_7355fa1c.png"
                alt="DE Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            {/* Mascot */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md border-2 border-amber-200 text-2xl select-none">
              🐲
            </div>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            <span>QUEST</span>
            <span className="text-amber-500">SHANGHAI</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Overseas Immersion Programme • DE Group 2 Basecamp
          </p>
          <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Select Your Name to Enter</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Your Name
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
              >
                {students.map((student, idx) => (
                  <option key={student.id} value={student.id}>
                    {idx + 1}. {student.name} — {student.squad}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              No password or PIN required. Simply select your name to continue!
            </p>
          </div>

          {/* Selected Student Preview Chip */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedStudent.avatar}</span>
              <div>
                <div className="text-sm font-black text-slate-900">{selectedStudent.name}</div>
                <div className="text-xs text-slate-500 font-semibold">{selectedStudent.squad} • {selectedStudent.coins} coins</div>
              </div>
            </div>
            {isLeaderCandidate ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                👑 Student Leader
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                🎓 Student
              </span>
            )}
          </div>

          {/* Enter Basecamp Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <UserCheck className="w-4 h-4" />
            <span>Enter Shanghai Basecamp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Select for Leaders */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Quick Switch to Student Leaders:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedStudentId('s1');
                onSignIn('s1', 'leader');
              }}
              className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-center transition-all cursor-pointer text-xs font-bold text-slate-800"
            >
              👩🏻‍💼 Latasha
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStudentId('s11');
                onSignIn('s11', 'leader');
              }}
              className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-center transition-all cursor-pointer text-xs font-bold text-slate-800"
            >
              🧑🏻‍💻 ZhuoJing
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStudentId('s22');
                onSignIn('s22', 'leader');
              }}
              className="py-2 px-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-center transition-all cursor-pointer text-xs font-bold text-slate-800"
            >
              🧑🏻‍💼 Yu Zhe
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center mt-6 text-xs text-slate-400 max-w-sm">
        <p>Shanghai Immersion 2026 • 100 Quest Coins = 5.0% Module Grade</p>
        <p className="mt-1 text-[11px] text-slate-500">
          Basecamp: Homeinn Plus Hotel (Yanchang Middle Road, Jing'An District)
        </p>
      </div>
    </div>
  );
};
