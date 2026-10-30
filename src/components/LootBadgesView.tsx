import React, { useState } from 'react';
import { Gift, Award, CheckCircle2, Lock, Sparkles, Camera, ArrowRight, Star, Compass } from 'lucide-react';
import { Quest } from '../data/tripData';

interface LootBadgesViewProps {
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
  userCoins: number;
}

export const LootBadgesView: React.FC<LootBadgesViewProps> = ({
  quests,
  onClaimQuest,
  userCoins,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [activeModalQuest, setActiveModalQuest] = useState<Quest | null>(null);
  const [photoProofNote, setPhotoProofNote] = useState('');
  const [claimedAlert, setClaimedAlert] = useState<string | null>(null);

  const completedCount = quests.filter((q) => q.status === 'completed').length;
  const inProgressCount = quests.filter((q) => q.status === 'in_progress').length;
  const lockedCount = quests.filter((q) => q.status === 'locked').length;

  const filteredQuests = quests.filter((q) => {
    if (filterCategory === 'All') return true;
    return q.category === filterCategory;
  });

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalQuest) return;

    onClaimQuest(activeModalQuest.id);
    setClaimedAlert(`🎉 Congratulations! You unlocked the "${activeModalQuest.badgeName}" badge and earned +${activeModalQuest.coins} Quest Coins!`);
    setActiveModalQuest(null);
    setPhotoProofNote('');

    setTimeout(() => {
      setClaimedAlert(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Stat Overview */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-xs text-amber-100">
              <Gift className="w-3.5 h-3.5 text-amber-300" /> Shanghai Immersion Quest Vault
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Loot, Medals & Cultural Badges</h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
              Complete real-world immersion challenges around Shanghai. Each completed badge awards direct Quest Coins towards your <strong>5.0% Module Grade</strong>!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start md:self-auto">
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
            className="text-white hover:text-emerald-200 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Food', 'Navigation', 'Culture', 'Academic'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-slate-900 text-amber-300 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? '🌟 All Quests' : cat === 'Food' ? '🥟 Street Food' : cat === 'Navigation' ? '🚅 Transit & Metro' : cat === 'Culture' ? '🏮 Heritage & Art' : '🤖 Academic & Tech'}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-slate-500">
          Showing {filteredQuests.length} of {quests.length} challenges
        </span>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuests.map((quest) => {
          const isDone = quest.status === 'completed';
          const isInProgress = quest.status === 'in_progress';
          const isLocked = quest.status === 'locked';

          return (
            <div
              key={quest.id}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-emerald-200 shadow-xs'
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

                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                    <span>🪙</span>
                    <span>+{quest.coins} Coins</span>
                  </div>
                </div>

                {/* Badge Icon & Name */}
                <div className="flex items-start gap-3 my-2">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                    isDone
                      ? 'bg-emerald-100 border-emerald-300'
                      : isInProgress
                      ? 'bg-amber-100 border-amber-300'
                      : 'bg-slate-200 border-slate-300'
                  }`}>
                    {quest.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500">{quest.badgeName}</span>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        quest.badgeLevel === 'Mythic'
                          ? 'bg-purple-100 text-purple-800'
                          : quest.badgeLevel === 'Gold'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
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
              </div>

              {/* Action Button at bottom */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {isDone ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 w-full justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Unlocked & Awarded!</span>
                  </span>
                ) : isInProgress ? (
                  <button
                    onClick={() => setActiveModalQuest(quest)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Submit Proof & Claim +{quest.coins}c</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveModalQuest(quest)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
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

      {/* Proof Submission Modal */}
      {activeModalQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-300 animate-in fade-in zoom-in duration-150">
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
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="mt-5 space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-slate-800">
                <strong className="block text-amber-900 mb-1">Requirement:</strong>
                {activeModalQuest.task}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo / Experience Verification Note
                </label>
                <textarea
                  rows={3}
                  value={photoProofNote}
                  onChange={(e) => setPhotoProofNote(e.target.value)}
                  placeholder="e.g. Visited Jia Jia Tang Bao near Jing'An, ordered 12 pork & crab roe Xiaolongbao in Mandarin, tasted delicious! Photo attached."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                ></textarea>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50">
                <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-700 block">Attach Immersion Photo Proof</span>
                <span className="text-[10px] text-slate-400">Selfie at location, food receipt, or ticket voucher</span>
                <div className="mt-2 inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-emerald-700">
                  📷 Simulation: Shanghai_Quest_Photo_Proof.jpg attached
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-colors"
                >
                  Submit & Unlock Badge 🎁
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalQuest(null)}
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
