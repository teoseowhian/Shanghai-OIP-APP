import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  HelpCircle,
  Award,
  Users,
  Compass,
  Download,
  AlertCircle,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { Student } from '../data/tripData';
import {
  SURVEY_QUESTIONS,
  LIKERT_OPTIONS,
  SurveyResponse,
  getStudentSurveyResponse,
  saveStudentSurveyResponse,
  getAllSurveyResponses,
  downloadSurveyCSV
} from '../data/surveyData';

interface SurveyViewProps {
  students: Student[];
  currentStudent: Student;
  onSelectStudent: (studentId: string) => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({
  students,
  currentStudent,
  onSelectStudent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(currentStudent.id);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [qualitativePositive, setQualitativePositive] = useState<string>('');
  const [qualitativeSuggestions, setQualitativeSuggestions] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Sync with prop when parent student changes
  useEffect(() => {
    setSelectedStudentId(currentStudent.id);
  }, [currentStudent.id]);

  // Load selected student's responses
  useEffect(() => {
    const existing = getStudentSurveyResponse(selectedStudentId, students);
    if (existing) {
      setRatings(existing.ratings || {});
      setQualitativePositive(existing.qualitativePositive || '');
      setQualitativeSuggestions(existing.qualitativeSuggestions || '');
      setIsSubmitted(true);
    } else {
      // Default to neutral/agree if brand new
      const initialRatings: Record<string, number> = {};
      SURVEY_QUESTIONS.forEach(q => {
        initialRatings[q.id] = 4;
      });
      setRatings(initialRatings);
      setQualitativePositive('');
      setQualitativeSuggestions('');
      setIsSubmitted(false);
    }
  }, [selectedStudentId, students]);

  const activeStudent = students.find(s => s.id === selectedStudentId) || currentStudent;
  const allResponses = getAllSurveyResponses(students);
  const totalSubmissions = Object.keys(allResponses).length;

  const handleRatingChange = (questionId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all questions answered
    const unanswered = SURVEY_QUESTIONS.filter(q => !ratings[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions before submitting. Unanswered: ${unanswered.map(u => u.title).join(', ')}`);
      return;
    }

    const newResponse: SurveyResponse = {
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      roomNumber: activeStudent.roomNumber,
      squad: activeStudent.squad,
      ratings,
      qualitativePositive: qualitativePositive.trim(),
      qualitativeSuggestions: qualitativeSuggestions.trim(),
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    saveStudentSurveyResponse(newResponse, students);
    setIsSubmitted(true);
    setSaveSuccessMessage(`Survey response for ${activeStudent.name} saved successfully! Thank you for supporting our Teaching & Learning Conference research study.`);

    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 5000);
  };

  // Group questions by category
  const categories = [
    {
      key: 'motivation',
      title: '1. Motivation & Behavioral Economics (Coins & Loss Aversion)',
      badge: '🪙 Endowment & 5% Grade Anchor',
      desc: 'Investigating how starting with 50 coins (endowment effect), loss aversion, and grade integration influence trip accountability and curiosity.',
      questions: SURVEY_QUESTIONS.filter(q => q.category === 'motivation'),
    },
    {
      key: 'peer_fairness',
      title: '2. Peer Co-Assessment & Leadership Fairness',
      badge: '⚖️ Positive-Only Scoring & Transparency',
      desc: 'Assessing the credibility, transparency, and peer dynamics of student leaders (Latasha, Ren ZhuoJing, Chua Yu Zhe) facilitating positive-only recognition.',
      questions: SURVEY_QUESTIONS.filter(q => q.category === 'peer_fairness'),
    },
    {
      key: 'ai_guide',
      title: '3. AI Pedagogical Agent Utility (Bao the Dragon & 3As Framework)',
      badge: '🐲 3As: Automation • Augmentation • Agency',
      desc: 'Evaluating how generative AI assists across logistical automation, deep engineering concept augmentation, and autonomous student agency.',
      questions: SURVEY_QUESTIONS.filter(q => q.category === 'ai_guide'),
    },
    {
      key: 'global_readiness',
      title: '4. Global Readiness & Experiential Visits Impact',
      badge: '🌏 SJTU Exchange & Disney Systems Engineering',
      desc: 'Measuring academic and cross-cultural impact from Shanghai Jiao Tong University (SJTU) and applied theme park systems engineering.',
      questions: SURVEY_QUESTIONS.filter(q => q.category === 'global_readiness'),
    },
  ];

  // Calculate live mean scores for the current response
  const calcCatAverage = (catQuestions: typeof SURVEY_QUESTIONS) => {
    if (catQuestions.length === 0) return '0.0';
    const sum = catQuestions.reduce((acc, q) => acc + (ratings[q.id] || 0), 0);
    return (sum / catQuestions.length).toFixed(1);
  };

  const totalQuestions = SURVEY_QUESTIONS.length;
  const answeredCount = Object.keys(ratings).filter(k => ratings[k] > 0).length;

  return (
    <div className="space-y-6">
      {/* Research Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black tracking-wider uppercase">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Teaching & Learning Conference 2026
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-300">Ngee Ann Polytechnic DE OIP Shanghai</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              📋 Student Feedback & Pedagogical Research Survey
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              This survey evaluates the educational effectiveness of <strong>gamified coin mechanics (loss aversion)</strong>, 
              <strong> peer co-assessment governance</strong>, and <strong>pedagogical AI assistance (the 3As Framework: Automation, Augmentation, Agency)</strong> 
              during our 7-day Shanghai immersion. All 29 student responses will be compiled for academic conference publication.
            </p>
          </div>

          {/* Quick CSV Export Button for Lecturers */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <button
              onClick={() => downloadSurveyCSV(students)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95 cursor-pointer"
              title="Download all 29 student survey responses in RFC 4180 CSV format for Excel analysis"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export All 29 Responses to CSV</span>
            </button>
            <div className="text-[11px] text-center text-slate-400 font-medium">
              Ready for Excel / SPSS / R Analysis ({totalSubmissions}/29 Records)
            </div>
          </div>
        </div>
      </div>

      {/* Success alert message */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-bold flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Student Selector Card & Live Stats */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Dropdown Selector */}
          <div className="flex-1">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Select Student Respondent ({students.length} Total on Roster)
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  onSelectStudent(e.target.value);
                }}
                className="w-full pl-3.5 pr-10 py-3 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-white focus:bg-white text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                {students.map((st, idx) => {
                  const hasSubmitted = !!allResponses[st.id];
                  return (
                    <option key={st.id} value={st.id}>
                      {idx + 1}. {st.name} — {st.squad} {hasSubmitted ? '✓ [Submitted]' : '⏳ [Pending]'}
                    </option>
                  );
                })}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Switching student updates the form with their saved survey responses. Lecturers can review any student's evaluation.
            </p>
          </div>

          {/* Student Status Summary Badge */}
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-3xl">{activeStudent.avatar}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900">{activeStudent.name}</span>
                {isSubmitted && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Recorded
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 font-semibold flex items-center gap-2 mt-0.5">
                <span>{activeStudent.squad}</span>
                <span>•</span>
                <span className="text-amber-700 font-bold">{activeStudent.coins} coins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Averages Pills for this Student */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          {categories.map((c) => {
            const avg = calcCatAverage(c.questions);
            return (
              <div key={c.key} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider truncate" title={c.badge}>
                  {c.badge}
                </div>
                <div className="text-xl font-black text-slate-900 mt-1 flex items-baseline justify-center gap-1">
                  <span>{avg}</span>
                  <span className="text-[11px] font-medium text-slate-400">/ 5.0</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Survey Scale Legend */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Likert Rating Scale Guide:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {LIKERT_OPTIONS.map((opt) => (
            <span
              key={opt.value}
              className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${opt.color}`}
            >
              <strong>{opt.value}</strong>: {opt.label}
            </span>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={cat.key} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            {/* Section Header */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {cat.badge}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Section {catIdx + 1} of 4 • {cat.questions.length} Questions
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-2">{cat.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cat.desc}</p>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {cat.questions.map((q, qIndex) => {
                const currentRating = ratings[q.id] || 0;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      currentRating > 0
                        ? 'bg-slate-50/60 border-slate-200'
                        : 'bg-rose-50/30 border-rose-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {qIndex + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{q.title}</h4>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed pl-7 font-medium">
                          "{q.statement}"
                        </p>
                      </div>

                      <span className="self-start sm:self-auto px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-700 whitespace-nowrap">
                        {q.frameworkTag}
                      </span>
                    </div>

                    {/* 5-Point Likert Radio Options */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 pl-0 sm:pl-7">
                      <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
                        {LIKERT_OPTIONS.map((opt) => {
                          const isSelected = currentRating === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleRatingChange(q.id, opt.value)}
                              className={`py-2 px-1 sm:px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                  ? `${opt.color} ring-2 ring-indigo-500 font-extrabold shadow-xs scale-102`
                                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold'
                              }`}
                            >
                              <span className="text-base sm:text-lg font-black">{opt.value}</span>
                              <span className="text-[9px] sm:text-[10px] leading-tight text-center hidden sm:block">
                                {opt.label}
                              </span>
                              <span className="text-[9px] sm:hidden leading-tight text-center">
                                {opt.value === 1 ? 'SD' : opt.value === 2 ? 'D' : opt.value === 3 ? 'N' : opt.value === 4 ? 'A' : 'SA'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Qualitative Feedback Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              💬 Qualitative Reflections
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              Qualitative Student Comments & Suggestions
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Please share specific reflections on what was most impactful and suggestions for future cohort gamification.
            </p>
          </div>

          <div className="space-y-4">
            {/* Box 1: Positive Reflections */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                1. What aspects of the gamified coin system, peer leadership, or Bao AI were most effective for your learning?
              </label>
              <textarea
                rows={3}
                value={qualitativePositive}
                onChange={(e) => setQualitativePositive(e.target.value)}
                placeholder="e.g. Loss aversion with 50 coins made our room wake up early without alarms; Bao AI's explanations on the Maglev electromagnetic suspension were super helpful..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                required
              />
            </div>

            {/* Box 2: Suggestions for future cohorts */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                2. Suggestions for future cohorts & educational research improvements:
              </label>
              <textarea
                rows={3}
                value={qualitativeSuggestions}
                onChange={(e) => setQualitativeSuggestions(e.target.value)}
                placeholder="e.g. Add squad vs squad technical challenge quests; integrate quick post-site visit reflection quizzes directly into Bao AI..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit & Action Controls */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-black flex items-center justify-center sm:justify-start gap-2 text-amber-300">
              <ClipboardCheck className="w-4 h-4" />
              <span>Survey Progress: {answeredCount} / {totalQuestions} Questions Completed</span>
            </div>
            <p className="text-xs text-slate-300">
              Saving will update {activeStudent.name}'s record in the dataset for conference analysis.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-lg shadow-amber-400/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-900" />
              <span>Submit Survey</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
