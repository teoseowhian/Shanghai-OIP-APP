/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TripBanner } from './components/TripBanner';
import { RankingsView } from './components/RankingsView';
import { LeaderDeskView, QuestClaim } from './components/LeaderDeskView';
import { LootBadgesView } from './components/LootBadgesView';
import { ItineraryView } from './components/ItineraryView';
import { AskBaoBot } from './components/AskBaoBot';
import { PackingListModal } from './components/PackingListModal';
import { DeliverablesModal } from './components/DeliverablesModal';
import { DeliverablesView } from './components/DeliverablesView';
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
  LECTURER_DATA,
} from './data/tripData';
import { ArrivalCardBanner } from './components/ArrivalCardBanner';

interface AuthSession {
  studentId: string;
  role: 'leader' | 'student' | 'lecturer';
  leaderPin?: string;
}

export default function App() {
  // Persistent student state so coins remain exactly as last access upon refresh
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('quest_shanghai_students_state_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('quest_shanghai_students_state_v2', JSON.stringify(students));
    } catch (e) {
      console.warn('Error saving students to localStorage', e);
    }
  }, [students]);

  // Sync state across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quest_shanghai_students_state_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
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

  const [activeTab, setActiveTab] = useState<'rankings' | 'leader_desk' | 'loot' | 'itinerary' | 'phrasebook' | 'survey' | 'deliverables'>('rankings');
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
  const [claims, setClaims] = useState<QuestClaim[]>([]);

  // Activity Feed built from verified real students and real coin changes
  const [recentLog, setRecentLog] = useState<{ studentName: string; delta: number; quest: string; time: string }[]>([
    { studentName: 'Latasha Srinidthi Cliffton', delta: 15, quest: 'Approved: The Great Xiaolongbao Quest', time: '10 mins ago' },
    { studentName: 'Ganesan Mohanapriya', delta: 0, quest: 'Submitted Claim: Maglev 300 km/h Speed Run (Pending Review)', time: '25 mins ago' },
    { studentName: 'Ren ZhuoJing', delta: 20, quest: 'Approved: Dialect Dynamo Street Test', time: '1 hr ago' },
    { studentName: 'Chua Yu Zhe', delta: 15, quest: 'Approved: Budget Group Receipt Audit', time: '2 hrs ago' },
  ]);

  // Live shared database sync
  const refreshBootstrap = async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        if (data.students && Array.isArray(data.students)) {
          setStudents(data.students);
          try {
            localStorage.setItem('quest_shanghai_students_state_v2', JSON.stringify(data.students));
          } catch {}
        }
        if (data.claims && Array.isArray(data.claims)) {
          setClaims(data.claims);
        }
        if (data.announcements && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
        if (data.activityLog && Array.isArray(data.activityLog)) {
          setRecentLog(
            data.activityLog.map((a: any) => ({
              studentName: a.studentName,
              delta: a.delta,
              quest: a.quest,
              time: a.time,
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Bootstrap fetch notice (using current state):', err);
    }
  };

  useEffect(() => {
    refreshBootstrap();
  }, []);

  const currentStudentId = auth?.studentId || 's1';
  const currentStudent =
    students.find((s) => s.id === currentStudentId) ||
    (currentStudentId === 'lecturer_teo' ? LECTURER_DATA : students[0]);
  const isLecturer = auth?.role === 'lecturer';
  const isLeader = auth?.role === 'leader' || isLecturer;

  // If a student somehow navigates to leader_desk, redirect to rankings
  useEffect(() => {
    if (!isLeader && activeTab === 'leader_desk') {
      setActiveTab('rankings');
    }
  }, [isLeader, activeTab]);

  const handleSignIn = (studentId: string, role: 'leader' | 'student' | 'lecturer', leaderPin?: string) => {
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

  // Claim quest from Loot tab: creates a PENDING claim via /api/quests/claim
  const handleClaimQuest = async (
    questId: string,
    proofData?: { photoUrl?: string; link?: string; note?: string }
  ) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    try {
      const res = await fetch('/api/quests/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: currentStudent.id,
          questId,
          proofPhotoUrl: proofData?.photoUrl,
          proofLink: proofData?.link,
          proofNote: proofData?.note,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.claim) {
          setClaims((prev) => [data.claim, ...prev.filter((c) => c.id !== data.claim.id)]);
        }
      }
    } catch (err) {
      console.warn('Network exception while submitting quest claim:', err);
    }

    // Update activity feed with pending state (coins NOT awarded yet!)
    setRecentLog((prev) => [
      {
        studentName: currentStudent.name,
        delta: 0,
        quest: `Submitted Proof: ${quest.title} (Pending Leader Review)`,
        time: 'Just now',
      },
      ...prev.slice(0, 8),
    ]);
  };

  // Leader reviews pending quest claim in Leader Desk
  const handleReviewClaim = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/quests/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-leader-pin': auth?.leaderPin || '',
        },
        body: JSON.stringify({
          claimId,
          action,
          reviewedBy: currentStudent.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.students) setStudents(data.students);
        if (data.claims) setClaims(data.claims);
        if (data.activityLog) {
          setRecentLog(
            data.activityLog.map((a: any) => ({
              studentName: a.studentName,
              delta: a.delta,
              quest: a.quest,
              time: a.time,
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Error reviewing claim:', err);
    }
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
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-amber-200 selection:text-slate-900 flex flex-col overflow-x-hidden overflow-y-auto">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStudent={currentStudent}
        isLeader={isLeader}
        isLecturer={isLecturer}
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

      {/* Action Required: China Digital Arrival Card Submission Banner */}
      <ArrivalCardBanner currentStudent={currentStudent} />

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

      {/* Main Content Area - pb-32 for complete mobile scrolling */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 sm:pb-20">
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
            claims={claims}
            onReviewClaim={handleReviewClaim}
            onToggleAttendance={handleToggleAttendance}
            onAddAnnouncement={handleAddAnnouncement}
            isLeader={isLeader}
          />
        )}

        {activeTab === 'loot' && (
          <LootBadgesView
            quests={quests}
            claims={claims}
            currentStudentId={currentStudent.id}
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
              if (isLeader) {
                // Leaders can view any student survey
              }
            }}
          />
        )}

        {activeTab === 'deliverables' && (
          <DeliverablesView
            currentStudent={currentStudent}
            onRefreshStudent={refreshBootstrap}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>
          Quest Shanghai • Overseas Immersion Programme (OIP 2026) • DE Group 2 Basecamp: 809 Guangzhong Rd, Jing'An District, Shanghai 200072 (上海市静安区广中路809号)
        </p>
      </footer>

      {/* Ask Bao! AI Trip Bot */}
      <AskBaoBot />
    </div>
  );
}
