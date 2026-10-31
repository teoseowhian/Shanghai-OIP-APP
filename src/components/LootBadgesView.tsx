import React, { useState } from 'react';
import {
  Gift,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Camera,
  ArrowRight,
  Star,
  Compass,
  RotateCcw,
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  ShieldAlert,
  X,
  FileCheck,
  AlertCircle,
  Share2,
  Clock,
} from 'lucide-react';
import { Quest } from '../data/tripData';
import { QuestClaim } from './LeaderDeskView';

interface LootBadgesViewProps {
  quests: Quest[];
  claims?: QuestClaim[];
  currentStudentId?: string;
  onClaimQuest: (
    questId: string,
    proofData?: { photoUrl?: string; link?: string; note?: string }
  ) => void;
  onResetQuests?: () => void;
  userCoins: number;
  isLeader?: boolean;
}

export const getLinkMeta = (url?: string) => {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes('tiktok.com') || lower.includes('vm.tiktok.com')) {
    return {
      type: 'tiktok' as const,
      name: 'TikTok',
      label: '🎵 View TikTok Video',
      tag: 'TikTok Proof',
      badgeClass: 'bg-slate-950 text-white hover:bg-slate-800 border-slate-900',
      pillClass: 'bg-slate-950 text-white',
    };
  }
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    return {
      type: 'instagram' as const,
      name: 'Instagram',
      label: '📸 View Instagram Post/Reel',
      tag: 'Instagram Proof',
      badgeClass: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white hover:opacity-90 border-transparent',
      pillClass: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white',
    };
  }
  if (lower.includes('linkedin.com')) {
    return {
      type: 'linkedin' as const,
      name: 'LinkedIn',
      label: '💼 View LinkedIn Post',
      tag: 'LinkedIn Post',
      badgeClass: 'bg-[#0077b5] text-white hover:bg-[#006097] border-[#0077b5]',
      pillClass: 'bg-[#0077b5] text-white',
    };
  }
  if (lower.includes('drive.google.com') || lower.includes('photos.app.goo.gl')) {
    return {
      type: 'drive' as const,
      name: 'Google Drive',
      label: '📁 View Drive / Photos Proof',
      tag: 'Google Drive',
      badgeClass: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
      pillClass: 'bg-blue-600 text-white',
    };
  }
  return {
    type: 'web' as const,
    name: 'Web Link',
    label: '🔗 View Verification Link',
    tag: 'Web Link',
    badgeClass: 'bg-slate-800 text-white hover:bg-slate-900 border-slate-800',
    pillClass: 'bg-slate-800 text-white',
  };
};

export const LootBadgesView: React.FC<LootBadgesViewProps> = ({
  quests,
  claims = [],
  currentStudentId,
  onClaimQuest,
  onResetQuests,
  userCoins,
  isLeader = false,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Submit Proof Modal State
  const [activeModalQuest, setActiveModalQuest] = useState<Quest | null>(null);
  const [photoProofNote, setPhotoProofNote] = useState('');
  const [proofWebLink, setProofWebLink] = useState('');
  const [selectedSocialTab, setSelectedSocialTab] = useState<'tiktok' | 'instagram' | 'linkedin' | 'link'>('tiktok');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [claimedAlert, setClaimedAlert] = useState<string | null>(null);

  // View Submitted Proof Modal State
  const [viewProofQuest, setViewProofQuest] = useState<Quest | null>(null);

  // Reset Quests Modal State (No password required)
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetSuccessAlert, setResetSuccessAlert] = useState<string | null>(null);

  const completedCount = quests.filter((q) => {
    const userClaim = claims.find((c) => c.studentId === currentStudentId && c.questId === q.id);
    return userClaim?.status === 'approved' || (!userClaim && q.status === 'completed');
  }).length;
  const inProgressCount = quests.filter((q) => {
    const userClaim = claims.find((c) => c.studentId === currentStudentId && c.questId === q.id);
    return !userClaim && q.status === 'in_progress';
  }).length;

  const filteredQuests = quests.filter((q) => {
    if (filterCategory === 'All') return true;
    return q.category === filterCategory;
  });

  // Handle local file selection (photo / screenshot / pdf)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitError(null);
    setUploadedFileName(file.name);
    const sizeInKb = (file.size / 1024).toFixed(1);
    setUploadedFileSize(
      Number(sizeInKb) > 1024 ? `${(Number(sizeInKb) / 1024).toFixed(1)} MB` : `${sizeInKb} KB`
    );

    // If it's an image, read preview data URL
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedImage(null);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedImage(null);
    setUploadedFileName(null);
    setUploadedFileSize(null);
  };

  // Submit proof handler (Accepts Photo OR TikTok/Instagram/LinkedIn link OR Note)
  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalQuest) return;

    const hasPhoto = Boolean(uploadedImage || uploadedFileName);
    const hasLink = Boolean(proofWebLink.trim());
    const hasNote = Boolean(photoProofNote.trim());

    if (!hasPhoto && !hasLink && !hasNote) {
      setSubmitError('Please upload a photo/screenshot, paste a social link (TikTok, Instagram, or LinkedIn), or write a reflection note.');
      return;
    }

    onClaimQuest(activeModalQuest.id, {
      photoUrl: uploadedImage || (uploadedFileName ? `file://${uploadedFileName}` : undefined),
      link: proofWebLink.trim() || undefined,
      note: photoProofNote.trim() || undefined,
    });

    setClaimedAlert(
      `🎉 Proof submitted! Your claim for "${activeModalQuest.title}" is now PENDING review in the Leader Desk. Coins (+${activeModalQuest.coins}c) will be credited once approved by a student leader.`
    );
    setActiveModalQuest(null);
    setPhotoProofNote('');
    setProofWebLink('');
    setUploadedImage(null);
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setSubmitError(null);

    setTimeout(() => {
      setClaimedAlert(null);
    }, 5000);
  };

  // Reset Quests Confirmation (No Password Required)
  const handleConfirmResetQuests = (e: React.FormEvent) => {
    e.preventDefault();
    if (onResetQuests) {
      onResetQuests();
    }
    setShowResetModal(false);
    setResetSuccessAlert('All Loot, Medals and Badges have been successfully reset to default!');
    setTimeout(() => setResetSuccessAlert(null), 4000);
  };

  const activeLinkMeta = getLinkMeta(proofWebLink);

  return (
    <div className="space-y-6">
      
      {/* Banner / Stat Overview */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-xs text-amber-100">
                <Gift className="w-3.5 h-3.5 text-amber-300" /> Shanghai Immersion Quest Vault
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/30 text-amber-100 border border-amber-300/30">
                {quests.length} Challenges Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Loot, Medals & Cultural Badges</h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              Complete real-world immersion challenges around Shanghai. Upload photos or share your <strong>TikTok, Instagram, or LinkedIn</strong> posts to verify achievements and earn Quest Coins towards your <strong>5.0% Module Grade</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="text-center px-3 border-r border-white/20">
                <span className="text-2xl font-black text-amber-200">{completedCount}</span>
                <span className="text-[10px] uppercase font-bold block text-white/80">Unlocked</span>
              </div>
              <div className="text-center px-3 border-r border-white/20">
                <span className="text-2xl font-black text-white">{inProgressCount}</span>
                <span className="text-[10px] uppercase font-bold block text-white/80">Active</span>
              </div>
              <div className="text-center px-3">
                <span className="text-2xl font-black text-amber-300">{userCoins}c</span>
                <span className="text-[10px] uppercase font-bold block text-white/80">Your Coins</span>
              </div>
            </div>

            {/* Reset All Loot and Badges Button (No password required) */}
            {onResetQuests && (
              <button
                onClick={() => setShowResetModal(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/30 backdrop-blur-xs cursor-pointer shadow-sm active:scale-95"
                title="Reset all quests back to initial uncompleted state"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-200" />
                <span>Reset Badges</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Celebration Notification */}
      {claimedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{claimedAlert}</span>
          </div>
          <button
            onClick={() => setClaimedAlert(null)}
            className="text-white hover:text-emerald-200 text-xs font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reset Success Banner */}
      {resetSuccessAlert && (
        <div className="p-4 rounded-2xl bg-emerald-700 text-white font-bold text-sm shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>{resetSuccessAlert}</span>
          </div>
          <button
            onClick={() => setResetSuccessAlert(null)}
            className="text-white hover:text-emerald-200 text-xs font-bold px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Filter Pills & Reset Action */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Food', 'Navigation', 'Culture', 'Academic'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-slate-900 text-amber-300 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All'
                ? '🌟 All Quests'
                : cat === 'Food'
                ? '🥟 Street Food'
                : cat === 'Navigation'
                ? '🚅 Transit & Metro'
                : cat === 'Culture'
                ? '🏮 Heritage & Gala'
                : '🤖 Academic & Tech'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">
            Showing {filteredQuests.length} of {quests.length} challenges
          </span>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuests.map((quest) => {
          const userClaim = claims.find(
            (c) => c.studentId === currentStudentId && c.questId === quest.id
          );
          const isPending = userClaim?.status === 'pending';
          const isApproved = userClaim?.status === 'approved';
          const isRejected = userClaim?.status === 'rejected';

          const isDone = isApproved || (!userClaim && quest.status === 'completed');
          const isInProgress = !isDone && !isPending;

          const proofPhoto = userClaim?.proofPhotoUrl || quest.proofPhotoUrl;
          const proofLink = userClaim?.proofLink || quest.proofLink;
          const proofNote = userClaim?.proofNote || quest.proofNote;
          const submittedTime = userClaim?.submittedAt || quest.submittedAt;
          const linkMeta = getLinkMeta(proofLink);

          return (
            <div
              key={quest.id}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-emerald-200 shadow-xs'
                  : isPending
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50/40 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                  : isInProgress
                  ? 'bg-white border-amber-300 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              }`}
            >
              <div>
                {/* Header row: Category & Coin reward */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700">
                    {quest.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isPending && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black border border-amber-300 animate-pulse flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                      <span>🪙</span>
                      <span>+{quest.coins} Coins</span>
                    </div>
                  </div>
                </div>

                {/* Badge Icon & Name */}
                <div className="flex items-start gap-3 my-2">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                      isDone
                        ? 'bg-emerald-100 border-emerald-300'
                        : isPending
                        ? 'bg-amber-100 border-amber-400'
                        : isInProgress
                        ? 'bg-amber-100 border-amber-300'
                        : 'bg-slate-200 border-slate-300'
                    }`}
                  >
                    {quest.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">{quest.badgeName}</span>
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                          quest.badgeLevel === 'Mythic'
                            ? 'bg-purple-100 text-purple-800'
                            : quest.badgeLevel === 'Gold'
                            ? 'bg-amber-100 text-amber-800'
                            : quest.badgeLevel === 'Silver'
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {quest.badgeLevel}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
                      {quest.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {quest.description}
                </p>

                {/* Task Requirement Box */}
                <div className="mt-3 p-3 rounded-xl bg-white/80 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-amber-600" /> Mission Task:
                  </span>
                  {quest.task}
                </div>

                {/* Proof preview indicator if submitted or completed */}
                {(isDone || isPending) && (proofPhoto || proofLink || proofNote) && (
                  <div
                    className={`mt-2.5 p-2.5 rounded-xl border text-xs space-y-1.5 ${
                      isDone
                        ? 'bg-emerald-100/70 border-emerald-300'
                        : 'bg-amber-100/80 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex items-center gap-1 font-bold text-[11px] ${
                          isDone ? 'text-emerald-900' : 'text-amber-900'
                        }`}
                      >
                        {isDone ? (
                          <FileCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        )}
                        <span>
                          {isDone ? 'Proof Verified' : 'Proof Submitted (Awaiting Approval)'}{' '}
                          {submittedTime ? `(${submittedTime})` : ''}
                        </span>
                      </span>
                      <button
                        onClick={() =>
                          setViewProofQuest({
                            ...quest,
                            proofPhotoUrl: proofPhoto,
                            proofLink: proofLink,
                            proofNote: proofNote,
                            submittedAt: submittedTime,
                          })
                        }
                        className={`text-[11px] font-extrabold underline cursor-pointer ${
                          isDone
                            ? 'text-emerald-800 hover:text-emerald-950'
                            : 'text-amber-900 hover:text-amber-950'
                        }`}
                      >
                        View Proof
                      </button>
                    </div>

                    {/* Social / Link indicator pill */}
                    {linkMeta && (
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${linkMeta.pillClass}`}>
                          {linkMeta.tag}
                        </span>
                        <a
                          href={proofLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-700 underline truncate max-w-[160px] inline-flex items-center gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="truncate">{proofLink}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button at bottom */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {isDone ? (
                  <button
                    onClick={() =>
                      setViewProofQuest({
                        ...quest,
                        proofPhotoUrl: proofPhoto,
                        proofLink: proofLink,
                        proofNote: proofNote,
                        submittedAt: submittedTime,
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-2 rounded-xl border border-emerald-300 w-full justify-center transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Unlocked & Awarded! (+{quest.coins}c)</span>
                  </button>
                ) : isPending ? (
                  <button
                    onClick={() =>
                      setViewProofQuest({
                        ...quest,
                        proofPhotoUrl: proofPhoto,
                        proofLink: proofLink,
                        proofNote: proofNote,
                        submittedAt: submittedTime,
                      })
                    }
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    title="Your proof has been submitted and is waiting for student leader approval in the Leader Desk"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-950" />
                    <span>⏳ Pending Leader Review (View Submission)</span>
                  </button>
                ) : isRejected ? (
                  <button
                    onClick={() => {
                      setActiveModalQuest(quest);
                      setPhotoProofNote('');
                      setProofWebLink('');
                      setUploadedImage(null);
                      setUploadedFileName(null);
                      setSubmitError('Your previous submission was declined. Please upload fresh proof.');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>✕ Proof Declined (Click to Re-submit)</span>
                  </button>
                ) : isInProgress ? (
                  <button
                    onClick={() => {
                      setActiveModalQuest(quest);
                      setPhotoProofNote('');
                      setProofWebLink('');
                      setUploadedImage(null);
                      setUploadedFileName(null);
                      setSubmitError(null);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Proof & Claim +{quest.coins}c</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveModalQuest(quest);
                      setPhotoProofNote('');
                      setProofWebLink('');
                      setUploadedImage(null);
                      setUploadedFileName(null);
                      setSubmitError(null);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Quest Challenge</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Submission Modal (Supports Real File/Photo Upload & TikTok, Instagram, LinkedIn links) */}
      {activeModalQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-300 animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeModalQuest.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeModalQuest.title}</h3>
                  <span className="text-xs font-bold text-amber-600">
                    Reward: +{activeModalQuest.coins} Quest Coins (+{((activeModalQuest.coins / 100) * 5).toFixed(1)}% Grade)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalQuest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="mt-5 space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-slate-800">
                <strong className="block text-amber-900 mb-1">Requirement:</strong>
                {activeModalQuest.task}
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* 1. Real File / Photo Upload Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5 flex items-center justify-between">
                  <span>1. Upload Photo / Screenshot / Ticket</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(optional if link provided)</span>
                </label>
                
                {uploadedFileName ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Proof preview"
                          className="w-14 h-14 object-cover rounded-xl border border-emerald-300 shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block truncate">{uploadedFileName}</span>
                        <span className="text-[10px] text-emerald-700 font-mono">{uploadedFileSize}</span>
                        <span className="text-[10px] text-emerald-800 block font-semibold">✓ Photo ready for verification</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveUploadedFile}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold shrink-0 cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-4 text-center bg-slate-50 hover:bg-amber-50/50 cursor-pointer transition-all block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Click to Browse or Take Photo</span>
                    <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP, or PDF proof from device camera or gallery</span>
                  </label>
                )}
              </div>

              {/* 2. TikTok, Instagram, LinkedIn, or Web Link Input */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase">
                    2. Share Social Media or Web Link
                  </label>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(optional if photo uploaded)</span>
                </div>

                {/* Preset Social Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSocialTab('tiktok');
                      if (!proofWebLink) setProofWebLink('https://www.tiktok.com/@');
                    }}
                    className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px] ${
                      selectedSocialTab === 'tiktok'
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>🎵</span>
                    <span>TikTok</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSocialTab('instagram');
                      if (!proofWebLink) setProofWebLink('https://www.instagram.com/p/');
                    }}
                    className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px] ${
                      selectedSocialTab === 'instagram'
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>📸</span>
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSocialTab('linkedin');
                      if (!proofWebLink) setProofWebLink('https://www.linkedin.com/posts/');
                    }}
                    className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px] ${
                      selectedSocialTab === 'linkedin'
                        ? 'bg-[#0077b5] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>💼</span>
                    <span>LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSocialTab('link');
                    }}
                    className={`py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px] ${
                      selectedSocialTab === 'link'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>🔗</span>
                    <span>Web/Drive</span>
                  </button>
                </div>

                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={proofWebLink}
                    onChange={(e) => {
                      setProofWebLink(e.target.value);
                      if (submitError) setSubmitError(null);
                    }}
                    placeholder={
                      selectedSocialTab === 'tiktok'
                        ? 'https://www.tiktok.com/@your_user/video/...'
                        : selectedSocialTab === 'instagram'
                        ? 'https://www.instagram.com/p/... or reel link'
                        : selectedSocialTab === 'linkedin'
                        ? 'https://www.linkedin.com/posts/... or activity link'
                        : 'https://drive.google.com/... or public web link'
                    }
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {activeLinkMeta && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                    <span className="text-slate-400">Detected format:</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold ${activeLinkMeta.pillClass}`}>
                      {activeLinkMeta.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Verification Reflection Note (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1 flex items-center justify-between">
                  <span>3. Immersion Note / Reflection</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={photoProofNote}
                  onChange={(e) => {
                    setPhotoProofNote(e.target.value);
                    if (submitError) setSubmitError(null);
                  }}
                  placeholder="e.g. Completed with squad buddies, ordered in Chinese and exchanged contacts with local students!"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-colors cursor-pointer active:scale-98"
                >
                  Submit Proof & Unlock Badge 🎁
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalQuest(null);
                    setSubmitError(null);
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submitted Proof Modal */}
      {viewProofQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-300 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{viewProofQuest.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{viewProofQuest.title}</h3>
                  <span className="text-xs font-bold text-emerald-700">
                    Badge: {viewProofQuest.badgeName} (+{viewProofQuest.coins} Coins)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewProofQuest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800">
                <strong className="block text-slate-900 mb-0.5">Task Verified:</strong>
                {viewProofQuest.task}
              </div>

              {/* Uploaded Photo Preview */}
              {viewProofQuest.proofPhotoUrl && viewProofQuest.proofPhotoUrl.startsWith('data:image') && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Attached Photo Proof:</span>
                  <img
                    src={viewProofQuest.proofPhotoUrl}
                    alt="Proof"
                    className="w-full max-h-64 object-cover rounded-2xl border border-slate-200 shadow-sm"
                  />
                </div>
              )}

              {/* Uploaded Document / File indicator if not an inline image */}
              {viewProofQuest.proofPhotoUrl && !viewProofQuest.proofPhotoUrl.startsWith('data:image') && (
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-800 font-mono text-xs">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>{viewProofQuest.proofPhotoUrl.replace('file://', '')}</span>
                </div>
              )}

              {/* Social / Web Link */}
              {viewProofQuest.proofLink && (() => {
                const meta = getLinkMeta(viewProofQuest.proofLink);
                return (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Submitted Link:</span>
                      {meta && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${meta.pillClass}`}>
                          {meta.tag}
                        </span>
                      )}
                    </div>
                    <a
                      href={viewProofQuest.proofLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-opacity cursor-pointer ${
                        meta?.badgeClass || 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <span>{meta?.label || 'Open Verification Link'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-[10px] text-slate-500 font-mono break-all block">
                      {viewProofQuest.proofLink}
                    </span>
                  </div>
                );
              })()}

              {/* Reflection Note */}
              {viewProofQuest.proofNote && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-slate-800">
                  <span className="font-bold text-emerald-900 block mb-0.5">Student Reflection Note:</span>
                  <p className="italic leading-relaxed">{viewProofQuest.proofNote}</p>
                </div>
              )}

              <div className="pt-2 text-right">
                <button
                  onClick={() => setViewProofQuest(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Quests Confirmation Modal (No Passcode Required) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-400 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 font-black">
                <RotateCcw className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Reset Loot & Badges</h3>
                <p className="text-xs text-slate-500">Restore all challenges to default</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <strong className="block mb-1">⚠️ Reset Confirmation:</strong>
              This will reset all quest milestones, unlock states, and submitted proof attachments back to default. (No password or PIN required).
            </div>

            <form onSubmit={handleConfirmResetQuests} className="mt-5 space-y-4">
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-colors cursor-pointer active:scale-98"
                >
                  Yes, Reset Badges
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
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
