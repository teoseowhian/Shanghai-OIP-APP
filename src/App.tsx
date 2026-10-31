/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { TripBanner } from './components/TripBanner';
import { RankingsView } from './components/RankingsView';
import { LeaderDeskView } from './components/LeaderDeskView';
import { LootBadgesView } from './components/LootBadgesView';
import { ItineraryView } from './components/ItineraryView';
import { AskBaoBot } from './components/AskBaoBot';
import { PackingListModal } from './components/PackingListModal';
import { DeliverablesModal } from './components/DeliverablesModal';
import { SurveyView } from './components/SurveyView';
import { PhrasebookView } from './components/PhrasebookView';
import {
  INITIAL_STUDENTS,
  INITIAL_QUESTS,
  INITIAL_ANNOUNCEMENTS,
  Student,
  Quest,
  Announcement,
} from './data/tripData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'rankings' | 'leader_desk' | 'loot' | 'itinerary' | 'phrasebook' | 'survey'>('rankings');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [currentStudentId, setCurrentStudentId] = useState<string>('s1');
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [showPackingModal, setShowPackingModal] = useState<boolean>(false);
  const [showDeliverablesModal, setShowDeliverablesModal] = useState<boolean>(false);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  // Add or deduct coins for student
  const handleModifyCoins = (studentId: string, delta: number, _reason: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newCoins = Math.max(0, Math.min(100, s.coins + delta));
          const newGrade = parseFloat(((newCoins / 100) * 5.0).toFixed(2));
          const updatedHistory = [...(s.coinHistory || [])];
          if (updatedHistory.length > 0) {
            updatedHistory[updatedHistory.length - 1] = {
              ...updatedHistory[updatedHistory.length - 1],
              coins: newCoins,
              cumulativeGrade: newGrade,
            };
          }
          return {
            ...s,
            coins: newCoins,
            questsCompleted: delta > 0 ? s.questsCompleted + 1 : s.questsCompleted,
            coinHistory: updatedHistory,
          };
        }
        return s;
      })
    );
  };

  // Reset all student coins to 0
  const handleResetAllCoins = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        coins: 0,
        questsCompleted: 0,
        coinHistory: (s.coinHistory || []).map((h) => ({
          ...h,
          coins: 0,
          cumulativeGrade: 0,
        })),
      }))
    );
  };

  // Claim quest from Loot tab
  const handleClaimQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'completed' as const } : q))
    );

    handleModifyCoins(currentStudent.id, quest.coins, quest.title);
  };

  // Toggle attendance status in Leader Desk
  const handleToggleAttendance = (studentId: string, newStatus: 'present' | 'late' | 'excused') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendanceStatus: newStatus } : s))
    );
  };

  // Post announcement
  const handleAddAnnouncement = (ann: Omit<Announcement, 'id' | 'timestamp'>) => {
    const newNotice: Announcement = {
      ...ann,
      id: Date.now().toString(),
      timestamp: 'Just now',
    };
    setAnnouncements((prev) => [newNotice, ...prev]);
  };

  // Check in for itinerary activity
  const handleCheckInEvent = (coins: number, eventTitle: string) => {
    handleModifyCoins(currentStudent.id, coins, `Itinerary Check-in: ${eventTitle}`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-amber-200 selection:text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStudent={currentStudent}
        onSelectStudent={setCurrentStudentId}
        allStudents={students}
        onOpenPackingList={() => setShowPackingModal(true)}
        onOpenDeliverables={() => setShowDeliverablesModal(true)}
      />

      {/* Sub-banner: Shanghai Immersion DE Group 2 details */}
      <TripBanner
        onOpenPackingList={() => setShowPackingModal(true)}
        onOpenDeliverables={() => setShowDeliverablesModal(true)}
      />

      {/* Shanghai November Packing List Modal */}
      <PackingListModal
        isOpen={showPackingModal}
        onClose={() => setShowPackingModal(false)}
      />

      {/* Academic Deliverables Modal (1 LU & NYC AEP Grant) */}
      <DeliverablesModal
        isOpen={showDeliverablesModal}
        onClose={() => setShowDeliverablesModal(false)}
        currentStudent={currentStudent}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'rankings' && (
          <RankingsView
            students={students}
            onModifyCoins={handleModifyCoins}
            onResetAllCoins={handleResetAllCoins}
            currentStudent={currentStudent}
          />
        )}

        {activeTab === 'leader_desk' && (
          <LeaderDeskView
            students={students}
            announcements={announcements}
            onToggleAttendance={handleToggleAttendance}
            onAddAnnouncement={handleAddAnnouncement}
          />
        )}

        {activeTab === 'loot' && (
          <LootBadgesView
            quests={quests}
            onClaimQuest={handleClaimQuest}
            userCoins={currentStudent.coins}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryView
            onCheckInEvent={handleCheckInEvent}
            onOpenPackingList={() => setShowPackingModal(true)}
          />
        )}

        {activeTab === 'phrasebook' && (
          <PhrasebookView
            currentStudent={currentStudent}
            onModifyCoins={handleModifyCoins}
          />
        )}

        {activeTab === 'survey' && (
          <SurveyView
            students={students}
            currentStudent={currentStudent}
            onSelectStudent={setCurrentStudentId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Quest Shanghai • Overseas Immersion Programme (OIP 2026) • DE Group 2 Basecamp: Homeinn Plus Hotel (Yanchang Middle Road, Jing'An District)
        </p>
      </footer>

      {/* Ask Bao! AI Trip Bot */}
      <AskBaoBot />
    </div>
  );
}
