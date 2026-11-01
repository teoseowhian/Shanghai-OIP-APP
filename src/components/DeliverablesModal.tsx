import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Award,
  AlertCircle,
  FileText,
  BookmarkCheck,
  Sparkles,
  Copy,
  Check,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Student } from '../data/tripData';

interface DeliverablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent?: Student;
}

interface DeliverableItem {
  id: string;
  category: string;
  title: string;
  description: string;
  requirement: string;
  link?: string;
  linkLabel?: string;
  subtasks: { id: string; label: string; note?: string }[];
}

const DELIVERABLES_LIST: DeliverableItem[] = [
  {
    id: 'pretrip',
    category: '1. Pre-Trip Activities',
    title: 'Safety Briefing & Dialogue Session',
    description: 'Essential mandatory pre-departure requirements on Brightspace.',
    requirement: 'Mandatory before trip commencement to clear travel readiness clearance.',
    subtasks: [
      {
        id: 'safety_quiz',
        label: 'Safety Briefing Quiz',
        note: 'Complete the quiz under Course Content on NP Brightspace.',
      },
      {
        id: 'dialogue_recording',
        label: 'OIP Dialogue Session Recording (China)',
        note: 'Watch the briefing recording covering travel protocol, emergency lines, and code of conduct.',
      },
    ],
  },
  {
    id: 'nyc_aep',
    category: "2. NYC's AEP Online Module",
    title: '[AEP] Language, Culture & Current Affairs [by Country]',
    description:
      'National Youth Council (NYC) Asia-Ready Exposure Programme (AEP) certified e-learning modules.',
    requirement: 'Mandatory to qualify for the NYC AEP grant and Global Readiness accreditation.',
    link: 'https://learn.nyc.gov.sg',
    linkLabel: 'Launch NYC Learn Portal (learn.nyc.gov.sg)',
    subtasks: [
      {
        id: 'asia_ready',
        label: 'Are you Asia Ready',
        note: 'Core foundational module on ASEAN & regional socio-economic dynamics.',
      },
      {
        id: 'module_10',
        label: 'Current Affairs Module 10',
        note: 'Covers contemporary developments, innovation trends, and business etiquette.',
      },
      {
        id: 'lang_culture',
        label: 'Language and Culture in country',
        note: 'Practical conversational Mandarin, cultural norms, and cross-cultural awareness.',
      },
    ],
  },
  {
    id: 'reflection_survey',
    category: '3. Reflection & Post-trip Survey',
    title: 'NP Brightspace Reflection & NYC Official Survey',
    description:
      'Synthesize your learning from site visits, university exchanges, and cultural quests.',
    requirement:
      'Required for 1 Learning Unit (1 LU) under PLP-Global Readiness & NYC Grant disbursement.',
    subtasks: [
      {
        id: 'reflection_80_words',
        label: 'Trip Reflection (min. 80 words)',
        note: 'Upload your written reflection in the Reflection Question section in NP Brightspace as official submission record.',
      },
      {
        id: 'post_trip_survey',
        label: 'NYC Post-trip Survey',
        note: 'Unique survey link will be sent to your NP student email & personal email on the second last day of the trip (Nov 13).',
      },
    ],
  },
  {
    id: 'linkedin_assignment',
    category: '4. LinkedIn Post Assignment',
    title: 'Technical Visit Reflection & Host Tagging (Deadline: 7th Nov 2026)',
    description:
      'Choose 2 of the 5 confirmed visits (SUPEC, ebm-papst, SHU, SJTU Building Lab, Shanghai Disney). Story-driven reflection, headline, original media & required hashtags.',
    requirement:
      'Mandatory core deliverable. Required hashtags: #NgeeAnnPolytechnic #NPGlobal #FacilitiesManagement #BuiltEnvironment #ShanghaiImmersion #SmartCities #TVET.',
    link: 'https://www.linkedin.com/feed/update/urn:li:activity:7521889898648358912/',
    linkLabel: 'View Reference Post',
    subtasks: [
      {
        id: 'linkedin_choose_visits',
        label: 'Select 2 of the 5 Confirmed Visits',
        note: 'Synthesize engineering and cultural observations into a narrative.',
      },
      {
        id: 'linkedin_media_tags',
        label: 'Original Media & Tag Host Organisations',
        note: 'Include on-site photos/videos taken during the technical tours.',
      },
      {
        id: 'linkedin_submit_url',
        label: 'Include Required Hashtags & Paste URL (Due 7 Nov 2026)',
        note: 'Copy hashtags: #NgeeAnnPolytechnic #NPGlobal #FacilitiesManagement #BuiltEnvironment #ShanghaiImmersion #SmartCities #TVET',
      },
    ],
  },
];

export const DeliverablesModal: React.FC<DeliverablesModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
}) => {
  const studentKey = currentStudent?.id || 'default_student';
  const storageKey = `np_de_deliverables_${studentKey}`;

  const [completedSubtasks, setCompletedSubtasks] = useState<Record<string, boolean>>({});
  const [reflectionDraft, setReflectionDraft] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Load saved checklist state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedSubtasks(JSON.parse(saved));
      } else {
        setCompletedSubtasks({});
      }

      const savedDraft = localStorage.getItem(`np_de_reflection_${studentKey}`);
      if (savedDraft) {
        setReflectionDraft(savedDraft);
      } else {
        setReflectionDraft('');
      }
    } catch {
      // fallback
    }
  }, [studentKey, isOpen]);

  // Save checklist state
  const toggleSubtask = (id: string) => {
    const updated = {
      ...completedSubtasks,
      [id]: !completedSubtasks[id],
    };
    setCompletedSubtasks(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const handleReflectionChange = (text: string) => {
    setReflectionDraft(text);
    try {
      localStorage.setItem(`np_de_reflection_${studentKey}`, text);
    } catch {
      // fallback
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (!isOpen) return null;

  // Calculate progress
  const allSubtaskIds = DELIVERABLES_LIST.flatMap((d) => d.subtasks.map((s) => s.id));
  const completedCount = allSubtaskIds.filter((id) => completedSubtasks[id]).length;
  const progressPercent = Math.round((completedCount / allSubtaskIds.length) * 100);

  const wordCount = reflectionDraft.trim() === '' ? 0 : reflectionDraft.trim().split(/\s+/).length;
  const isWordCountMet = wordCount >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border-4 border-emerald-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with DE Logo & Academic Accreditation */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex items-center gap-3.5">
              {/* Official DE Logo Image */}
              <div className="w-13 h-13 rounded-2xl bg-white p-1 shadow-md shadow-emerald-950/30 flex items-center justify-center shrink-0 border border-emerald-200">
                <img
                  src="/assets/aistudio/image_7355fa1c.png"
                  alt="DE Logo"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                    DE_OIP (Shanghai)_NOV26
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Award className="w-3.5 h-3.5" />
                    1 LU Global Readiness & NYC AEP Grant
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black mt-1 text-white tracking-tight flex items-center gap-2">
                  Academic Deliverables Tracker
                </h2>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Brightspace Module: <span className="font-mono font-bold text-white">Homepage - DE_OIP (Shanghai)_NOV26</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-base transition-colors shrink-0"
              aria-label="Close Deliverables Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Status & Progress Bar */}
          <div className="mt-4 pt-4 border-t border-emerald-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-200">Student:</span>
              <span className="font-bold text-white flex items-center gap-1 bg-emerald-900/40 px-2.5 py-1 rounded-lg">
                <span>{currentStudent?.avatar || '🧑🏻‍🎓'}</span>
                <span>{currentStudent?.name || 'Student'}</span>
                <span className="text-emerald-300">({currentStudent?.squad})</span>
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-36 bg-emerald-950/60 h-2.5 rounded-full overflow-hidden border border-emerald-500/30">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-100 whitespace-nowrap">
                {completedCount}/{allSubtaskIds.length} done ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Qualification Notice Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-amber-950 block">
                Requirement for 1 LU & NYC AEP Grant Qualification
              </strong>
              <p className="text-amber-900 text-xs leading-relaxed">
                To qualify for <strong>1 LU under PLP-Global Readiness</strong> and the <strong>NYC AEP grant</strong>, students are required to complete the Pre-trip Briefing quiz, NYC Online Module, the Reflection & Post-trip Survey via the NYC survey link.
              </p>
            </div>
          </div>

          {/* The 3 Deliverable Sections */}
          <div className="space-y-4">
            {DELIVERABLES_LIST.map((item, idx) => {
              const allItemSubtasksDone = item.subtasks.every((s) => completedSubtasks[s.id]);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all p-4.5 ${
                    allItemSubtasksDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                        {allItemSubtasksDone && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-600">{item.description}</p>
                    </div>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shrink-0 shadow-xs"
                      >
                        <span>NYC Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Subtask Checkboxes */}
                  <div className="mt-3.5 space-y-2 pt-3 border-t border-slate-100">
                    {item.subtasks.map((sub) => {
                      const isChecked = !!completedSubtasks[sub.id];

                      return (
                        <label
                          key={sub.id}
                          className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isChecked ? 'bg-emerald-100/60' : 'bg-slate-50 hover:bg-slate-100/80'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSubtask(sub.id)}
                            className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span
                              className={`text-xs font-bold block ${
                                isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {sub.label}
                            </span>
                            {sub.note && (
                              <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight">
                                {sub.note}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Special Link note for NYC Portal */}
                  {item.link && (
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <span className="font-mono text-slate-700 truncate">{item.link}</span>
                      <button
                        onClick={() => copyToClipboard(item.link!, 'nyc_link')}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200"
                      >
                        {copiedLink === 'nyc_link' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Reflection Draft & Submission Scratchpad */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Reflection Draft Scratchpad (Min. 80 words)
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isWordCountMet
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {wordCount} / 80 words {isWordCountMet ? '✓ Minimum Met' : '(Need min. 80)'}
                </span>

                {reflectionDraft.trim().length > 0 && (
                  <button
                    onClick={() => copyToClipboard(reflectionDraft, 'draft_copy')}
                    className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 shadow-2xs"
                    title="Copy reflection to paste into Brightspace"
                  >
                    {copiedLink === 'draft_copy' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={reflectionDraft}
              onChange={(e) => handleReflectionChange(e.target.value)}
              placeholder="Draft your trip reflection here (e.g. key takeaways from company visits, university exchange at Shanghai University / SJTU, Shanghai cultural immersion, and teamwork lessons)..."
              rows={4}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
            />

            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 text-[11px] leading-relaxed">
              <strong className="font-bold">Brightspace Submission Note:</strong> Please note that students need to upload their trip Reflection in <strong>Reflection Question in NP Brightspace</strong> as submission record.
            </div>
          </div>

          {/* Notice on Post-Trip Survey Timeline */}
          <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-700 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>Post-Trip Survey Link:</strong> Unique survey link will be sent to student's <strong>NP email & Personal email</strong> on the second last day of the trip (13 Nov 2026).
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Progress automatically saved locally for your student profile.</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs cursor-pointer"
            >
              Close & Continue Quest
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
