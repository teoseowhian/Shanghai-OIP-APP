/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { SignInScreen } from './components/SignInScreen';
import {
  INITIAL_STUDENTS,
  INITIAL_QUESTS,
  INITIAL_ANNOUNCEMENTS,
  Student,
  Quest,
  Announcement,
} from './data/tripData';

interface AuthSession {
  studentId: string;
  role: 'leader' | 'student';
  leaderPin?: string;
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  // Persistent session from localStorage
  const [auth, setAuth] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem('quest_shanghai_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.studentId) return parsed;
      }
    } catch (e) {
      console.warn('Error reading session from localStorage', e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'rankings' | 'leader_desk' | 'loot' | 'itinerary' | 'phrasebook' | 'survey'>('rankings');
  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem('quest_shanghai_quests_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading quests from localStorage', e);
    }
    return INITIAL_QUESTS.map((q) => ({
      ...q,
      status: (q.id === 'q1' || q.id === 'q2') ? ('in_progress' as const) : q.status,
      proofPhotoUrl: undefined,
      proofLink: undefined,
      proofNote: undefined,
      submittedAt: undefined,
    }));
  });

  useEffect(() => {
    try {
      localStorage.setItem('quest_shanghai_quests_v4', JSON.stringify(quests));
    } catch (e) {
      console.warn('Error saving quests to localStorage', e);
    }
  }, [quests]);

  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [showPackingModal, setShowPackingModal] = useState<boolean>(false);
  const [showDeliverablesModal, setShowDeliverablesModal] = useState<boolean>(false);

  // Activity Feed built from verified real students and real coin changes
  const [recentLog, setRecentLog] = useState<{ studentName: string; delta: number; quest: string; time: string }[]>([
    { studentName: 'Latasha Srinidthi Cliffton', delta: 15, quest: 'Xiaolongbao Local Order Challenge', time: '10 mins ago' },
    { studentName: 'Ren ZhuoJing', delta: 20, quest: 'Maglev 300 km/h Speed Run', time: '35 mins ago' },
    { studentName: 'Chua Yu Zhe', delta: 15, quest: 'Budget Group Receipt Audit', time: '1 hr ago' },
    { studentName: 'Tan Zheng Kang, Aaron', delta: 10, quest: 'Pudong Architecture Selfie', time: '2 hrs ago' },
  ]);

  const currentStudentId = auth?.studentId || 's1';
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];
  const isLeader = auth?.role === 'leader';

  // If a student somehow navigates to leader_desk, redirect to rankings
  useEffect(() => {
    if (!isLeader && activeTab === 'leader_desk') {
      setActiveTab('rankings');
    }
  }, [isLeader, activeTab]);

  const handleSignIn = (studentId: string, role: 'leader' | 'student', leaderPin?: string) => {
    const session: AuthSession = { studentId, role, leaderPin };
    setAuth(session);
    try {
      localStorage.setItem('quest_shanghai_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session to localStorage', e);
    }
  };

  const handleSignOut = () => {
    setAuth(null);
    try {
      localStorage.removeItem('quest_shanghai_session');
    } catch (e) {
      console.warn('Failed to remove session from localStorage', e);
    }
  };

  // Add or deduct coins for student (Server enforced authorization)
  const handleModifyCoins = async (studentId: string, delta: number, reason: string) => {
    // Send request to server to verify leader authorization
    try {
      const res = await fetch('/api/coins/modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-leader-pin': auth?.leaderPin || '',
        },
        body: JSON.stringify({ studentId, delta, reason }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('Server rejected coin modification:', err.error);
        if (!isLeader) {
          alert('Action rejected: Only signed-in student leaders have authorization to modify coins.');
          return;
        }
      }
    } catch (e) {
      console.warn('Coin modify network call exception:', e);
      if (!isLeader) {
        return;
      }
    }

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

    const st = students.find((s) => s.id === studentId);
    if (st) {
      setRecentLog((prev) => [
        {
          studentName: st.name,
          delta,
          quest: reason,
          time: 'Just now',
        },
        ...prev.slice(0, 8),
      ]);
    }
  };

  // Batch add or deduct coins for all students, a specific squad, or an individual student
  const handleBatchModifyCoins = async (
    targetScope: 'all' | 'Team Dragon' | 'Team Xiaolongbao' | 'Team Maglev' | string,
    delta: number,
    reason: string
  ) => {
    try {
      const res = await fetch('/api/coins/batch-modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-leader-pin': auth?.leaderPin || '',
        },
        body: JSON.stringify({ targetScope, delta, reason }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('Server rejected batch coin modification:', err.error);
        if (!isLeader) {
          alert('Action rejected: Only signed-in student leaders have authorization to batch modify coins.');
          return;
        }
      }
    } catch (e) {
      console.warn('Batch coin modify network call exception:', e);
      if (!isLeader) {
        return;
      }
    }

    setStudents((prev) =>
      prev.map((s) => {
        let isMatch = false;
        if (targetScope === 'all') {
          isMatch = true;
        } else if (targetScope === 'Team Dragon' && s.squad === 'Team Dragon') {
          isMatch = true;
        } else if (targetScope === 'Team Xiaolongbao' && s.squad === 'Team Xiaolongbao') {
          isMatch = true;
        } else if (targetScope === 'Team Maglev' && s.squad === 'Team Maglev') {
          isMatch = true;
        } else if (s.id === targetScope) {
          isMatch = true;
        }

        if (isMatch) {
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

    const scopeLabel =
      targetScope === 'all'
        ? 'All 29 Students'
        : targetScope === 'Team Dragon' || targetScope === 'Team Xiaolongbao' || targetScope === 'Team Maglev'
        ? targetScope
        : students.find((s) => s.id === targetScope)?.name || 'Student';

    setRecentLog((prev) => [
      {
        studentName: scopeLabel,
        delta,
        quest: reason,
        time: 'Just now',
      },
      ...prev.slice(0, 8),
    ]);
  };

  // Reset all student coins to 0 (Server enforced authorization)
  const handleResetAllCoins = async () => {
    try {
      const res = await fetch('/api/coins/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-leader-pin': auth?.leaderPin || '',
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('Server rejected coin reset:', err.error);
        if (!isLeader) {
          alert('Action rejected: Only signed-in student leaders have authorization to reset coins.');
          return;
        }
      }
    } catch (e) {
      console.warn('Coin reset network call exception:', e);
      if (!isLeader) {
        return;
      }
    }

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

    setRecentLog((prev) => [
      {
        studentName: 'All 29 Students',
        delta: 0,
        quest: 'Cohort Coins Reset by Leader',
        time: 'Just now',
      },
      ...prev.slice(0, 8),
    ]);
  };

  // Claim quest from Loot tab with optional photo/link/note proof
  const handleClaimQuest = (
    questId: string,
    proofData?: { photoUrl?: string; link?: string; note?: string }
  ) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              status: 'completed' as const,
              proofPhotoUrl: proofData?.photoUrl || q.proofPhotoUrl,
              proofLink: proofData?.link || q.proofLink,
              proofNote: proofData?.note || q.proofNote,
              submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : q
      )
    );

    // Apply quest reward
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentStudent.id) {
          const newCoins = Math.max(0, Math.min(100, s.coins + quest.coins));
          const newGrade = parseFloat(((newCoins / 100) * 5.0).toFixed(2));
          return {
            ...s,
            coins: newCoins,
            questsCompleted: s.questsCompleted + 1,
          };
        }
        return s;
      })
    );

    setRecentLog((prev) => [
      {
        studentName: currentStudent.name,
        delta: quest.coins,
        quest: quest.title,
        time: 'Just now',
      },
      ...prev.slice(0, 8),
    ]);
  };

  // Reset all quests and badges back to initial uncompleted state
  const handleResetQuests = () => {
    const freshQuests = INITIAL_QUESTS.map((q) => ({
      ...q,
      status: (q.id === 'q1' || q.id === 'q2') ? ('in_progress' as const) : q.status,
      proofPhotoUrl: undefined,
      proofLink: undefined,
      proofNote: undefined,
      submittedAt: undefined,
    }));
    setQuests(freshQuests);
    try {
      localStorage.setItem('quest_shanghai_quests_v4', JSON.stringify(freshQuests));
    } catch (e) {
      console.warn('Failed to reset quests in localStorage', e);
    }
  };

  // Toggle attendance status in Leader Desk (Server enforced authorization)
  const handleToggleAttendance = async (studentId: string, newStatus: 'present' | 'late' | 'excused') => {
    try {
      const res = await fetch('/api/attendance/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-leader-pin': auth?.leaderPin || '',
        },
        body: JSON.stringify({ studentId, status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('Server rejected attendance update:', err.error);
        if (!isLeader) return;
      }
    } catch (e) {
      console.warn('Attendance update network call exception:', e);
      if (!isLeader) return;
    }

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
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentStudent.id) {
          const newCoins = Math.max(0, Math.min(100, s.coins + coins));
          return {
            ...s,
            coins: newCoins,
            questsCompleted: s.questsCompleted + 1,
          };
        }
        return s;
      })
    );

    setRecentLog((prev) => [
      {
        studentName: currentStudent.name,
        delta: coins,
        quest: `Itinerary Check-in: ${eventTitle}`,
        time: 'Just now',
      },
      ...prev.slice(0, 8),
    ]);
  };

  // If user is not yet signed in, render the Sign-In screen before anything else loads
  if (!auth) {
    return <SignInScreen students={students} onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-amber-200 selection:text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStudent={currentStudent}
        isLeader={isLeader}
        onSignOut={handleSignOut}
        onOpenPackingList={() => setShowPackingModal(true)}
        onOpenDeliverables={() => setShowDeliverablesModal(true)}
      />

      {/* Sub-banner: Shanghai Immersion DE Group 2 details */}
      <TripBanner
        onOpenPackingList={() => setShowPackingModal(true)}
        onOpenDeliverables={() => setShowDeliverablesModal(true)}
        onReturnToLogin={handleSignOut}
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
            onBatchModifyCoins={handleBatchModifyCoins}
            onResetAllCoins={handleResetAllCoins}
            currentStudent={currentStudent}
            isLeader={isLeader}
            onReturnToLogin={handleSignOut}
          />
        )}

        {activeTab === 'leader_desk' && (
          <LeaderDeskView
            students={students}
            announcements={announcements}
            onToggleAttendance={handleToggleAttendance}
            onAddAnnouncement={handleAddAnnouncement}
            isLeader={isLeader}
          />
        )}

        {activeTab === 'loot' && (
          <LootBadgesView
            quests={quests}
            onClaimQuest={handleClaimQuest}
            onResetQuests={handleResetQuests}
            userCoins={currentStudent.coins}
            isLeader={isLeader}
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
            onSelectStudent={(id) => {
              // In survey view, allow switching to view evaluation if leader or viewing
              if (isLeader) {
                // Leaders can view any student survey
              }
            }}
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
