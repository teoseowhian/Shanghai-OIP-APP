import React, { useState } from 'react';
import {
  ClipboardCheck,
  Building,
  DollarSign,
  Bell,
  Users,
  Check,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  Calculator,
  ShieldAlert,
  Phone,
  FileText,
  FileSpreadsheet,
  GraduationCap,
  Download,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Image as ImageIcon,
  Camera,
  Eye,
} from 'lucide-react';
import { Student, Announcement } from '../data/tripData';
import {
  getAllSurveyResponses,
  downloadSurveyCSV,
  SURVEY_QUESTIONS,
  SurveyResponse,
} from '../data/surveyData';
import { getLinkMeta } from './LootBadgesView';

export interface QuestClaim {
  id: string;
  studentId: string;
  studentName: string;
  questId: string;
  questTitle: string;
  coins: number;
  badgeName: string;
  badgeLevel: string;
  icon: string;
  status: 'pending' | 'approved' | 'rejected';
  proofPhotoUrl?: string;
  proofLink?: string;
  proofNote?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface LeaderDeskViewProps {
  students: Student[];
  announcements: Announcement[];
  claims?: QuestClaim[];
  onReviewClaim?: (claimId: string, action: 'approve' | 'reject') => void;
  onToggleAttendance: (studentId: string, newStatus: 'present' | 'late' | 'excused') => void;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  isLeader: boolean;
}

export const LeaderDeskView: React.FC<LeaderDeskViewProps> = ({
  students,
  announcements,
  claims = [],
  onReviewClaim,
  onToggleAttendance,
  onAddAnnouncement,
  isLeader,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'approvals' | 'attendance' | 'hotel' | 'budget' | 'notices' | 'research'>('approvals');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  if (!isLeader) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-lg mx-auto my-12 shadow-sm animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl">
          🔒
        </div>
        <h2 className="text-xl font-black text-slate-900">Leader Desk Restricted</h2>
        <p className="text-sm text-slate-600 mt-2">
          This area contains private hotel room assignments, emergency roll-call desks, and administrative controls restricted strictly to signed-in student leaders (Latasha, Ren ZhuoJing, Chua Yu Zhe) and faculty.
        </p>
      </div>
    );
  }
  
  // Notice form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAuthor, setNoticeAuthor] = useState('Latasha');
  const [noticeRole, setNoticeRole] = useState('Class Rep');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'urgent'>('normal');

  // Currency Converter state
  const [sgdAmount, setSgdAmount] = useState('50');
  const rmbRate = 5.35; // 1 SGD ~ 5.35 RMB
  const rmbCalculated = (parseFloat(sgdAmount || '0') * rmbRate).toFixed(2);

  // Budget expense log
  const [expenses, setExpenses] = useState([
    { item: 'Day 1 Welcome Shengjianbao Dinner (Group 2)', paidBy: 'Chua Yu Zhe (Treasurer Fund)', amountRmb: 1440, pax: 24, status: 'Reimbursed' },
    { item: 'SHU Transport Day 3 (SJTU & ebm-papst Industry Visits)', paidBy: 'Faculty Module Grant', amountRmb: 2200, pax: 24, status: 'Paid by School' },
    { item: 'Huangpu River Cruise Group Tickets', paidBy: 'Chua Yu Zhe (OIP Reserve)', amountRmb: 2880, pax: 24, status: 'Booked & Confirmed' },
  ]);

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    onAddAnnouncement({
      author: noticeAuthor,
      role: noticeRole,
      title: noticeTitle,
      content: noticeContent,
      priority: noticePriority,
    });

    setNoticeTitle('');
    setNoticeContent('');
  };

  const presentCount = students.filter((s) => s.attendanceStatus === 'present').length;
  const lateCount = students.filter((s) => s.attendanceStatus === 'late').length;
  const excusedCount = students.filter((s) => s.attendanceStatus === 'excused').length;

  return (
    <div className="space-y-6">
      
      {/* Leader Desk Header Overview */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>🛡️ Student Leadership Operations</span>
            <span>•</span>
            <span>DE Group 2 Desk</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Leader Control Center</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Managed by <strong>Latasha</strong> (Class Rep), <strong>Ren ZhuoJing</strong> (Assis / Logistics & Translation), and <strong>Chua Yu Zhe</strong> (Treasurer). Roll call, room allocations, module budget, and official broadcasts.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={() => downloadSurveyCSV(students)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              title="Download all 29 student survey responses in RFC 4180 CSV format for Excel research analysis"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-950" />
              <span>Export Survey Responses to CSV</span>
            </button>
            <span className="text-[11px] text-slate-400 font-medium">
              Teaching & Learning Conference Dataset (29 Students)
            </span>
          </div>
        </div>

        {/* Sub-nav switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('approvals')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'approvals'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quest Approvals</span>
            {claims.filter((c) => c.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                {claims.filter((c) => c.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'attendance'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Roll Call ({presentCount}/{students.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hotel')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'hotel'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Hotel Rooms</span>
          </button>

          <button
            onClick={() => setActiveSubTab('budget')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'budget'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Yu Zhe's Budget</span>
          </button>

          <button
            onClick={() => setActiveSubTab('notices')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'notices'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Broadcasts ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('research')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'research'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📋 Research Survey (29)</span>
          </button>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {previewPhotoUrl && (
        <div
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-3xl p-2 shadow-2xl overflow-hidden">
            <img src={previewPhotoUrl} alt="Full preview" className="max-h-[80vh] w-auto object-contain rounded-2xl" />
            <button
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 text-white font-bold flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Sub-tab 0: Quest Proof Approvals */}
      {activeSubTab === 'approvals' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Live Quest Proof Verification & Approval Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students upload photo proof or TikTok/Instagram/LinkedIn links. Coins are ONLY added when approved by a leader here.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {claims.filter((c) => c.status === 'pending').length} Pending Approval
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                {claims.filter((c) => c.status === 'approved').length} Approved
              </span>
            </div>
          </div>

          {/* Pending Queue */}
          {claims.filter((c) => c.status === 'pending').length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-base font-black text-slate-900">All Quest Proofs Verified!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No pending claims in the queue. When students submit photos, TikToks, or LinkedIn links for their Shanghai immersion challenges, they will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block px-1">
                Pending Verification ({claims.filter((c) => c.status === 'pending').length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claims
                  .filter((c) => c.status === 'pending')
                  .map((claim) => {
                    const linkMeta = getLinkMeta(claim.proofLink);
                    return (
                      <div
                        key={claim.id}
                        className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl p-2 bg-amber-50 rounded-2xl border border-amber-200">
                                {claim.icon}
                              </span>
                              <div>
                                <span className="font-black text-sm text-slate-900 block">{claim.studentName}</span>
                                <span className="text-xs font-bold text-amber-800">{claim.questTitle}</span>
                              </div>
                            </div>

                            <div className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs shrink-0">
                              +{claim.coins} Coins
                            </div>
                          </div>

                          <div className="text-[11px] text-slate-500 font-medium">
                            Submitted: <span className="font-mono text-slate-700">{claim.submittedAt}</span>
                          </div>

                          {/* Proof Content Box */}
                          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                            {claim.proofPhotoUrl && claim.proofPhotoUrl.startsWith('data:image') && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Photo Proof:</span>
                                <div
                                  onClick={() => setPreviewPhotoUrl(claim.proofPhotoUrl!)}
                                  className="relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer group max-h-48"
                                >
                                  <img
                                    src={claim.proofPhotoUrl}
                                    alt="Proof thumbnail"
                                    className="w-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                                    <Eye className="w-4 h-4 mr-1" /> Click to View Full Photo
                                  </div>
                                </div>
                              </div>
                            )}

                            {claim.proofLink && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Shared Link:</span>
                                <a
                                  href={claim.proofLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-between shadow-xs transition-opacity cursor-pointer ${
                                    linkMeta?.badgeClass || 'bg-slate-900 text-white hover:bg-slate-800'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5 truncate">
                                    <span>{linkMeta?.label || 'Open Verification Link'}</span>
                                  </span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                </a>
                              </div>
                            )}

                            {claim.proofNote && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-0.5">Student Note:</span>
                                <p className="text-xs text-slate-800 italic bg-white p-2 rounded-xl border border-slate-200">
                                  "{claim.proofNote}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Leader Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => onReviewClaim && onReviewClaim(claim.id, 'approve')}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve (+{claim.coins}c)</span>
                          </button>
                          <button
                            onClick={() => onReviewClaim && onReviewClaim(claim.id, 'reject')}
                            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                          >
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Past Reviewed Claims */}
          {claims.filter((c) => c.status !== 'pending').length > 0 && (
            <div className="mt-6 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block px-1">
                Recent Approval History ({claims.filter((c) => c.status !== 'pending').length})
              </span>
              <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                {claims
                  .filter((c) => c.status !== 'pending')
                  .slice(0, 10)
                  .map((claim) => (
                    <div key={claim.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{claim.icon}</span>
                        <div>
                          <div className="font-bold text-slate-900">{claim.studentName} — {claim.questTitle}</div>
                          <div className="text-[11px] text-slate-500">
                            Reviewed: {claim.reviewedAt || 'Recently'} by {claim.reviewedBy || 'Leader'}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {claim.status === 'approved' ? `✓ +${claim.coins} Coins Approved` : '✕ Declined'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 1: Roll Call & Attendance */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Live Attendance & Headcount Tracker
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Morning meeting point: 08:30 AM Hotel Lobby • Evening Curfew: 22:30 PM
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {presentCount} Present
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {lateCount} En Route
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                {excusedCount} Excused
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{student.avatar}</span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{student.squad}</span>
                        <span>•</span>
                        <span className="font-medium text-amber-700">{student.roomNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Toggle Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => onToggleAttendance(student.id, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        student.attendanceStatus === 'present'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() => onToggleAttendance(student.id, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        student.attendanceStatus === 'late'
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>En Route</span>
                    </button>

                    <button
                      onClick={() => onToggleAttendance(student.id, 'excused')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        student.attendanceStatus === 'excused'
                          ? 'bg-slate-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Excused</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Hotel & Basecamp Directory */}
      {activeSubTab === 'hotel' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                  Official Accommodation
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Basecamp Hotel • 809 Guangzhong Rd (上海市静安区广中路809号)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  809 Guangzhong Rd, Jing An Qu, Shang Hai Shi, China, 200072 | 上海市静安区广中路809号 邮政编码: 200072
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Front Desk:</span>
                  <span className="font-mono font-bold text-sm">+86 21 6211 8888</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-900 block">🚇 Nearest Metro</span>
                <p className="text-slate-600 mt-0.5">Guangzhong Road (Near Metro Line 1 Shanghai Circus World / Yanchang Rd stations)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-900 block">📶 High-Speed WiFi</span>
                <p className="text-slate-600 mt-0.5">SSID: <code className="font-bold">Hotel_Guest_WiFi</code> (Room # + Last 4 digits of passport)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-900 block">🍳 Breakfast Times</span>
                <p className="text-slate-600 mt-0.5">07:00 - 09:30 AM (Level 2 Dining Hall)</p>
              </div>
            </div>
          </div>

          {/* Room Allocation Grid */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                Official Accommodation Allocation (809 Guangzhong Rd • Rooms 1–15 & Staff)
              </h4>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                {students.length} Students (14 Twin + 1 Single) • 3 Groups
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from(new Set(students.map((s) => s.roomNumber)))
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                .map((roomNo) => {
                  const roomStudents = students.filter((s) => s.roomNumber === roomNo);
                  const isRep = roomStudents.some((s) => s.name.includes('Class Rep'));
                  const isLead = roomStudents.some((s) => s.name.includes('Assistant'));
                  const isTreasurer = roomStudents.some((s) => s.name.includes('Treasurer'));
                  const isSingle = roomNo.toLowerCase().includes('single');
                  const squad = roomStudents[0]?.squad || '';

                  return (
                    <div key={roomNo} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between font-black text-slate-900 text-sm mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <span>{roomNo}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isRep
                              ? 'bg-amber-200 text-amber-900'
                              : isLead
                              ? 'bg-blue-100 text-blue-800'
                              : isTreasurer
                              ? 'bg-emerald-100 text-emerald-800'
                              : isSingle
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isRep
                            ? 'Rep Suite'
                            : isLead
                            ? 'Assistant Lead'
                            : isTreasurer
                            ? 'Finance Lead'
                            : isSingle
                            ? 'Single Room'
                            : 'Twin Room'}
                        </span>
                      </div>

                      <div className="mb-2">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            squad === 'Team Dragon'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : squad === 'Team Xiaolongbao'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-sky-100 text-sky-800 border border-sky-300'
                          }`}
                        >
                          {squad}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        {roomStudents.map((st) => (
                          <div key={st.id} className="flex items-center gap-1.5">
                            <span className="text-sm shrink-0">{st.avatar}</span>
                            <span className="truncate font-medium text-slate-800" title={st.name}>
                              {st.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {/* Accompanying Staff Rooms from Official Roster */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between font-black text-slate-900 text-sm mb-1.5">
                  <span>Room S1</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900">
                    Faculty Staff
                  </span>
                </div>
                <div className="mb-2">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Faculty in-Charge
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                  <span className="text-sm">👨🏻‍🏫</span>
                  <span>Teo Seow Hian</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between font-black text-slate-900 text-sm mb-1.5">
                  <span>Room S2</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900">
                    Faculty Staff
                  </span>
                </div>
                <div className="mb-2">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Faculty in-Charge
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                  <span className="text-sm">👨🏻‍🏫</span>
                  <span>Tan Yi Zhi, Kelvin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Chua Yu Zhe's Budget & Calculator */}
      {activeSubTab === 'budget' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Quick SGD -> RMB Converter */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-100">
                <span>Currency Converter</span>
                <Calculator className="w-4 h-4 text-amber-300" />
              </div>
              <h4 className="text-xl font-black mt-2">SGD to RMB (¥)</h4>
              <p className="text-xs text-emerald-100 mt-1">
                Current exchange rate: 1 SGD ≈ 5.35 RMB
              </p>

              <div className="mt-4 space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-emerald-100 uppercase">Singapore Dollars ($)</label>
                  <input
                    type="number"
                    value={sgdAmount}
                    onChange={(e) => setSgdAmount(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-white text-slate-900 font-bold text-base focus:outline-none"
                    placeholder="Enter SGD"
                  />
                </div>
                <div className="p-3 bg-emerald-950/40 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-emerald-200 font-medium">Chinese Yuan:</span>
                  <span className="text-xl font-black text-amber-300 font-mono">¥ {rmbCalculated}</span>
                </div>
              </div>
            </div>

            {/* Treasurer Pool Summary */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Group Meal & Logistics Pool
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">¥ 18,480</div>
                <p className="text-xs text-slate-500 mt-1">
                  Total OIP 2026 student fund managed by Chua Yu Zhe for communal meals & excursions.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Spent to date:</span>
                  <span className="font-bold text-slate-900">¥ 6,520 (35.2%)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Remaining Balance:</span>
                  <span className="font-bold text-emerald-600">¥ 11,960</span>
                </div>
              </div>
            </div>

            {/* Payment Tips */}
            <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 text-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <span>💳 Payment Guidance</span>
                </div>
                <h4 className="text-lg font-black mt-1">Alipay & WeChat Pay Ready</h4>
                <p className="text-xs text-slate-700 mt-1">
                  Foreign credit cards (Visa / Mastercard) can be bound to Alipay & WeChat without extra fees for transactions under ¥200.
                </p>
              </div>

              <div className="mt-3 text-xs bg-white/80 p-2.5 rounded-xl border border-amber-300 font-medium text-amber-950">
                💡 Need cash emergency? Latasha has backup cash in RMB at the Leader Desk.
              </div>
            </div>

          </div>

          {/* Group Expense Records */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
            <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Audited Group Expenditures (OIP Shanghai DE Group 2)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Expense Item</th>
                    <th className="p-3">Payment Source</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Per Pax</th>
                    <th className="p-3 text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {expenses.map((exp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{exp.item}</td>
                      <td className="p-3 text-slate-600">{exp.paidBy}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">¥{exp.amountRmb.toLocaleString()}</td>
                      <td className="p-3 font-mono text-slate-500">¥{(exp.amountRmb / exp.pax).toFixed(1)}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Broadcast Notice Board */}
      {activeSubTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Post Notice Form */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs h-fit">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-500" />
              Post Leader Broadcast
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant alerts sent to all 24 immersion students.
            </p>

            <form onSubmit={handlePostNotice} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Leader Author
                  </label>
                  <select
                    value={noticeAuthor}
                    onChange={(e) => {
                      setNoticeAuthor(e.target.value);
                      if (e.target.value === 'Latasha') setNoticeRole('Class Rep');
                      else if (e.target.value === 'Ren ZhuoJing') setNoticeRole('Assis');
                      else setNoticeRole('Treasurer');
                    }}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
                  >
                    <option value="Latasha">Latasha</option>
                    <option value="Ren ZhuoJing">Ren ZhuoJing (Assis)</option>
                    <option value="Chua Yu Zhe">Chua Yu Zhe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as 'normal' | 'urgent')}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent Alert ⚠️</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Bus departs at 08:30 AM tomorrow"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Message Details
                </label>
                <textarea
                  rows={3}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Include meeting points, what to wear, or safety notices..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            </form>
          </div>

          {/* Broadcast Feed */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              Active Trip Announcements ({announcements.length})
            </h3>

            {announcements.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border transition-all ${
                  item.priority === 'urgent'
                    ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{item.author}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                      {item.role}
                    </span>
                    {item.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{item.timestamp}</span>
                </div>

                <h4 className="text-sm font-black text-slate-900 mt-2">{item.title}</h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Sub-tab 5: Research Survey & CSV Export */}
      {activeSubTab === 'research' && (() => {
        const responses = getAllSurveyResponses(students);
        const totalCount = students.length;
        const submittedCount = Object.keys(responses).length;

        // Calculate aggregate construct averages
        const getAggregateCategoryAverage = (cat: 'motivation' | 'peer_fairness' | 'ai_guide' | 'global_readiness') => {
          const catQuestions = SURVEY_QUESTIONS.filter(q => q.category === cat);
          if (catQuestions.length === 0 || totalCount === 0) return '0.00';
          let sum = 0;
          let count = 0;
          students.forEach(st => {
            const resp = responses[st.id];
            if (resp && resp.ratings) {
              catQuestions.forEach(q => {
                if (resp.ratings[q.id]) {
                  sum += resp.ratings[q.id];
                  count++;
                }
              });
            }
          });
          return count > 0 ? (sum / count).toFixed(2) : '0.00';
        };

        const motivationAgg = getAggregateCategoryAverage('motivation');
        const peerAgg = getAggregateCategoryAverage('peer_fairness');
        const aiAgg = getAggregateCategoryAverage('ai_guide');
        const globalAgg = getAggregateCategoryAverage('global_readiness');

        const overallGrandMean = (
          (parseFloat(motivationAgg) + parseFloat(peerAgg) + parseFloat(aiAgg) + parseFloat(globalAgg)) / 4
        ).toFixed(2);

        return (
          <div className="space-y-6">
            {/* Research & Analytics Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>Teaching & Learning Conference 2026 Research Analytics</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  Student Feedback & Evaluation Dataset
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluating gamified coin mechanics (loss aversion at 50 coins, 5% grade impact), peer co-assessment fairness (Latasha, Ren ZhuoJing, Chua Yu Zhe), and pedagogical AI utility under the 3As framework across all 29 students.
                </p>
              </div>

              {/* CSV Export Action Button */}
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <button
                  onClick={() => downloadSurveyCSV(students)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-950" />
                  <span>Export Survey Responses to CSV</span>
                </button>
                <div className="text-[11px] text-center text-slate-400 font-medium">
                  Exports RFC 4180 CSV for direct Excel / SPSS analysis
                </div>
              </div>
            </div>

            {/* Research Constructs Mean Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Sample Size (N)
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {submittedCount} / {totalCount}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">
                  100% Cohort Responded
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-black uppercase text-amber-600 tracking-wider truncate" title="Coins & Loss Aversion">
                  🪙 Motivation & Coins
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                  <span>{motivationAgg}</span>
                  <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  Loss Aversion & 5% Grade
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-black uppercase text-indigo-600 tracking-wider truncate" title="Peer Co-Assessment Fairness">
                  ⚖️ Peer Fairness
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                  <span>{peerAgg}</span>
                  <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  Positive-Only & Audit Log
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-black uppercase text-teal-600 tracking-wider truncate" title="Pedagogical AI Utility">
                  🐲 Bao AI (3As)
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                  <span>{aiAgg}</span>
                  <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  Auto • Augment • Agency
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-black uppercase text-rose-600 tracking-wider truncate" title="Global Readiness & Site Visits">
                  🌏 Global Readiness
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                  <span>{globalAgg}</span>
                  <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">
                  SJTU & Disney Systems
                </div>
              </div>
            </div>

            {/* Complete 29 Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    All 29 Student Survey Responses (Cohort Breakdown)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Individual Likert mean scores and qualitative takeaways ready for research dissemination.
                  </p>
                </div>
                <button
                  onClick={() => downloadSurveyCSV(students)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-300 self-start sm:self-auto cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download .CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Student</th>
                      <th className="py-3 px-3">Room</th>
                      <th className="py-3 px-3">Squad</th>
                      <th className="py-3 px-2 text-center" title="Motivation: Coins & Loss Aversion">🪙 Motiv.</th>
                      <th className="py-3 px-2 text-center" title="Peer Fairness: Latasha, Ren ZhuoJing, Chua Yu Zhe">⚖️ Peer</th>
                      <th className="py-3 px-2 text-center" title="AI Guide: 3As Framework">🐲 AI (3As)</th>
                      <th className="py-3 px-2 text-center" title="Global Readiness: SJTU & Disney">🌏 Global</th>
                      <th className="py-3 px-2 text-center">Mean</th>
                      <th className="py-3 px-4 min-w-[200px]">Qualitative Highlight</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {students.map((st, idx) => {
                      const resp = responses[st.id];
                      const r = resp?.ratings || {};

                      const calcStudentCat = (cat: 'motivation' | 'peer_fairness' | 'ai_guide' | 'global_readiness') => {
                        const qList = SURVEY_QUESTIONS.filter(q => q.category === cat);
                        if (qList.length === 0) return '-';
                        const sum = qList.reduce((acc, q) => acc + (r[q.id] || 0), 0);
                        return (sum / qList.length).toFixed(1);
                      };

                      const sMotivation = calcStudentCat('motivation');
                      const sPeer = calcStudentCat('peer_fairness');
                      const sAi = calcStudentCat('ai_guide');
                      const sGlobal = calcStudentCat('global_readiness');

                      const totalScore = SURVEY_QUESTIONS.reduce((acc, q) => acc + (r[q.id] || 0), 0);
                      const sMean = (totalScore / SURVEY_QUESTIONS.length).toFixed(2);

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                            <span>{st.avatar}</span>
                            <span>{st.name}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-600 whitespace-nowrap">{st.roomNumber}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                              {st.squad}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-amber-700">{sMotivation}</td>
                          <td className="py-2.5 px-2 text-center font-bold text-indigo-700">{sPeer}</td>
                          <td className="py-2.5 px-2 text-center font-bold text-teal-700">{sAi}</td>
                          <td className="py-2.5 px-2 text-center font-bold text-rose-700">{sGlobal}</td>
                          <td className="py-2.5 px-2 text-center font-black text-slate-900 bg-slate-50/50">{sMean}</td>
                          <td className="py-2.5 px-4 text-[11px] text-slate-600 italic truncate max-w-xs" title={resp?.qualitativePositive}>
                            "{resp?.qualitativePositive || 'No comment'}"
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                              Recorded ✓
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
