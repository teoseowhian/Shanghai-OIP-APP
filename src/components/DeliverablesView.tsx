import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Share2,
  FileText,
  Calendar,
  Sparkles,
  BookmarkCheck,
  CheckSquare,
  Square,
  Building2,
  Flame,
} from 'lucide-react';
import { Student } from '../data/tripData';

interface DeliverablesViewProps {
  currentStudent: Student;
  onRefreshStudent?: () => void;
}

const CONFIRMED_VISITS = [
  { id: 'shu', name: 'Shanghai University (SHU)', detail: 'Taiji, calligraphy, local etiquette & student dialogue' },
  { id: 'sjtu', name: 'Shanghai Jiao Tong University Building Lab', detail: 'Refrigeration / green building energy research' },
  { id: 'supec', name: 'Shanghai Urban Planning Exhibition Center', detail: 'Shanghai 2035 master plan & 3D city scale model' },
  { id: 'ebm', name: 'ebm-papst China Factory', detail: 'Precision EC fan motor engineering & aerodynamics' },
  { id: 'disney', name: 'Shanghai Disney Resort', detail: 'Theme park operations, ride safety interlocks & crowd logistics' },
];

const REQUIRED_HASHTAGS =
  '#NgeeAnnPolytechnic #NPGlobal #FacilitiesManagement #BuiltEnvironment #ShanghaiImmersion #SmartCities #TVET';

export const DeliverablesView: React.FC<DeliverablesViewProps> = ({ currentStudent }) => {
  const [selectedVisits, setSelectedVisits] = useState<string[]>([
    'ebm-papst factory',
    'Shanghai Jiao Tong University Building Lab',
  ]);
  const [linkedInUrl, setLinkedInUrl] = useState<string>(
    'https://www.linkedin.com/feed/update/urn:li:activity:7521889898648358912/'
  );
  const [reflectionText, setReflectionText] = useState<string>('');
  const [isLinkedInSubmitted, setIsLinkedInSubmitted] = useState<boolean>(false);
  const [copiedHashtags, setCopiedHashtags] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Subtasks checklist
  const [subtasks, setSubtasks] = useState<Record<string, boolean>>({
    safety_quiz: true,
    dialogue_recording: true,
    asia_ready: true,
    module_10: true,
    lang_culture: true,
    reflection_80_words: false,
    post_trip_survey: false,
    linkedin_post: false,
  });

  // Fetch student deliverable state from shared backend database
  useEffect(() => {
    async function loadDeliverable() {
      try {
        const res = await fetch(`/api/deliverables/${currentStudent.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.deliverable) {
            if (data.deliverable.linkedInPostUrl) {
              setLinkedInUrl(data.deliverable.linkedInPostUrl);
            }
            if (data.deliverable.selectedVisits && data.deliverable.selectedVisits.length > 0) {
              setSelectedVisits(data.deliverable.selectedVisits);
            }
            if (data.deliverable.reflectionText) {
              setReflectionText(data.deliverable.reflectionText);
            }
            if (data.deliverable.isCompleted) {
              setIsLinkedInSubmitted(true);
              setSubtasks((prev) => ({ ...prev, linkedin_post: true }));
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch deliverable from backend:', err);
      }
    }
    loadDeliverable();
  }, [currentStudent.id]);

  const toggleVisitSelection = (visitName: string) => {
    if (selectedVisits.includes(visitName)) {
      setSelectedVisits(selectedVisits.filter((v) => v !== visitName));
    } else {
      if (selectedVisits.length >= 2) {
        // replace earliest
        setSelectedVisits([selectedVisits[1], visitName]);
      } else {
        setSelectedVisits([...selectedVisits, visitName]);
      }
    }
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(REQUIRED_HASHTAGS);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Submit LinkedIn Post to Backend
  const handleSubmitLinkedIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedInUrl.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/deliverables/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          linkedInPostUrl: linkedInUrl.trim(),
          selectedVisits,
          reflectionText,
          isCompleted: true,
        }),
      });

      if (res.ok) {
        setIsLinkedInSubmitted(true);
        setSubtasks((prev) => ({ ...prev, linkedin_post: true }));
        setSaveStatus('✓ Saved to Shared Backend Database! Your LinkedIn post assignment is recorded.');
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus('Failed to save to backend. Please check network.');
      }
    } catch (err) {
      console.warn('Error saving to backend:', err);
      setSaveStatus('Network error connecting to backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const wordCount = reflectionText.trim() === '' ? 0 : reflectionText.trim().split(/\s+/).length;
  const isWordCountMet = wordCount >= 80;

  const totalTasks = Object.keys(subtasks).length;
  const completedTasks = Object.values(subtasks).filter(Boolean).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      
      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 border border-emerald-300">
              <img
                src="/assets/aistudio/image_7355fa1c.png"
                alt="DE Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-emerald-100">
                  DE_OIP (Shanghai)_NOV26
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                  1 LU Global Readiness & NYC AEP Grant
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-1.5 tracking-tight text-white">
                Academic Deliverables & LinkedIn Assignment
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
                Brightspace Module: <strong className="font-mono text-white">Homepage - DE_OIP (Shanghai)_NOV26</strong>.
                Complete all deliverables to qualify for 1 LU accreditation and grant disbursement.
              </p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-2xl font-black text-amber-300">{progressPercent}%</span>
            <span className="text-[11px] uppercase font-bold block text-emerald-100">Completion</span>
            <span className="text-[10px] text-white/80 block mt-0.5">{completedTasks}/{totalTasks} tasks cleared</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-600/60 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-emerald-200">Viewing submissions for:</span>
            <span className="font-black text-white bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-500/40 flex items-center gap-1.5">
              <span>{currentStudent.avatar}</span>
              <span>{currentStudent.name}</span>
              <span className="text-emerald-300 font-normal">({currentStudent.squad})</span>
            </span>
          </div>

          <div className="text-emerald-100 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>LinkedIn Post Deadline: <strong className="text-amber-300">7th Nov 2026</strong></span>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{saveStatus}</span>
          </div>
          <button onClick={() => setSaveStatus(null)} className="text-xs underline text-white ml-2 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* NEW: LinkedIn Post Assignment Box */}
      <div className="bg-white rounded-3xl border-2 border-blue-400 p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0077b5] text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              in
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900">
                  Featured Core Assignment
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  Deadline: 7th Nov 2026
                </span>
                {isLinkedInSubmitted && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Submitted & Saved in Backend
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">LinkedIn Post Assignment</h3>
            </div>
          </div>

          <a
            href={linkedInUrl || 'https://www.linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0077b5] hover:bg-[#006097] text-white transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>Open Post on LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Assignment Briefing */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
              <strong className="block text-sm font-black text-blue-950">Assignment Instructions:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                <li>
                  <strong>Choose 2 of the 5 confirmed technical visits</strong> (select below) and synthesize your observations.
                </li>
                <li>
                  Write a <strong>story-driven reflection</strong> connecting engineering concepts (e.g. EC fan motor aerodynamics, refrigeration thermodynamics, or theme park ride safety) with real-world observations.
                </li>
                <li>
                  Craft an <strong>eye-catching professional headline</strong> that invites discourse.
                </li>
                <li>
                  Include <strong>original media</strong> (high-resolution photos or short videos taken by you on site).
                </li>
                <li>
                  <strong>Tag host organisations</strong> and include the mandatory required hashtags.
                </li>
              </ul>
            </div>

            {/* Visit Selector (Choose 2 of 5) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-2 flex items-center justify-between">
                <span>Select 2 Confirmed Visits Analyzed in Your Post:</span>
                <span className="text-[11px] font-semibold text-blue-700 font-mono">
                  {selectedVisits.length}/2 Selected
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONFIRMED_VISITS.map((visit) => {
                  const isSelected = selectedVisits.includes(visit.name);
                  return (
                    <button
                      key={visit.id}
                      type="button"
                      onClick={() => toggleVisitSelection(visit.name)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block leading-tight">{visit.name}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{visit.detail}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mandatory Hashtags Copy Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Required Hashtags (Include all in post)
                </span>
                <button
                  type="button"
                  onClick={handleCopyHashtags}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                >
                  {copiedHashtags ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Hashtags</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-emerald-200 break-words leading-relaxed select-all">
                {REQUIRED_HASHTAGS}
              </p>
            </div>
          </div>

          {/* Submission Form Card */}
          <form
            onSubmit={handleSubmitLinkedIn}
            className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200 flex flex-col justify-between space-y-4"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Post URL & Verification
              </span>
              <p className="text-xs text-slate-500 mb-3 leading-tight">
                Paste your published LinkedIn post URL below and mark it done to store in the shared database.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                  LinkedIn Post URL
                </label>
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/feed/update/urn:li:activity:..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div className="mt-3">
                <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
                  <span>Key Reflection Summary (Optional)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Stored in DB</span>
                </label>
                <textarea
                  rows={3}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Summary of your post's main technical thesis..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 px-4 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{isLinkedInSubmitted ? 'Update Submission in DB' : 'Mark as Done & Save to Shared DB'}</span>
              </button>

              <span className="text-[10px] text-slate-400 text-center block mt-2">
                Persisted directly on Render full-stack backend
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Brightspace & NYC Modules Deliverable Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1 & 2 Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                1 & 2 • Pre-Trip & NYC AEP
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Pre-Trip Briefing & NYC Learn Modules</h3>
            </div>
            <a
              href="https://learn.nyc.gov.sg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              <span>NYC Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {[
              { id: 'safety_quiz', title: 'Safety Briefing Quiz', desc: 'Complete under Course Content on NP Brightspace' },
              { id: 'dialogue_recording', title: 'OIP Dialogue Session Recording (China)', desc: 'Travel protocols, code of conduct & emergency lines' },
              { id: 'asia_ready', title: 'NYC AEP: Are you Asia Ready', desc: 'Core foundational module on regional socio-economic dynamics' },
              { id: 'module_10', title: 'NYC AEP: Current Affairs Module 10', desc: 'Contemporary technological developments & business norms' },
              { id: 'lang_culture', title: 'NYC AEP: Language and Culture in Country', desc: 'Practical conversational Mandarin & cross-cultural etiquette' },
            ].map((task) => {
              const isChecked = !!subtasks[task.id];
              return (
                <label
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isChecked ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSubtask(task.id)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className={`text-xs font-bold block ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{task.desc}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Module 3 Card: Brightspace Reflection & NYC Survey */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md">
                  3 • Academic Reflection & Survey
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">NP Brightspace Reflection & Post-Trip Survey</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">Min. 80 Words</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Trip Reflection Draft
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isWordCountMet
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {wordCount} / 80 words {isWordCountMet ? '✓ Minimum Met' : '(Need min. 80)'}
                </span>
              </div>

              <textarea
                rows={5}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Draft your trip reflection here (e.g. key takeaways from SUPEC master plan, ebm-papst fan engineering, SJTU green refrigeration, and Shanghai Disney operations)..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[11px] leading-relaxed">
                <strong>Submission Requirement:</strong> Upload your trip reflection in the{' '}
                <strong>Reflection Question in NP Brightspace</strong> as the official submission record.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>NYC Post-Trip Survey:</strong> Unique survey link will be sent to your NP student & personal email on the second last day of the trip (13 Nov 2026).
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
