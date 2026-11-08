import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  STUDENTS_DATA,
  INITIAL_QUESTS,
  INITIAL_ANNOUNCEMENTS,
  Student,
  Quest,
  Announcement,
} from './src/data/tripData.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
// Render injects PORT; fall back to 3000 for local runs
const PORT = Number(process.env.PORT) || 3000;

// Enable large JSON payload limits for image/screenshot uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Initialize Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ==========================================
// 1. REAL SERVER-SIDE SHARED DATABASE
// ==========================================

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

export interface ActivityLogItem {
  id: string;
  studentName: string;
  delta: number;
  quest: string;
  time: string;
  timestamp: number;
}

export interface SurveyRecord {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: Record<string, number>;
  qualitativeComments: string;
  suggestions: string;
}

export interface DeliverablesRecord {
  studentId: string;
  linkedInPostUrl?: string;
  selectedVisits?: string[];
  reflectionText?: string;
  isCompleted?: boolean;
  submittedAt?: string;
  subtasks?: Record<string, boolean>;
}

interface DatabaseSchema {
  students: Student[];
  quests: Quest[];
  claims: QuestClaim[];
  phraseCompletions: Record<string, { lastCompletedDate: string; totalClaims: number }>;
  surveys: SurveyRecord[];
  deliverables: Record<string, DeliverablesRecord>;
  announcements: Announcement[];
  activityLog: ActivityLogItem[];
}

const DB_FILE = path.resolve(__dirname, 'data', 'database.json');

// Helper to ensure database file exists and load it
function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Validate structure
      if (parsed.students && Array.isArray(parsed.students)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Notice: Re-initializing database file:', err);
  }

  // Initial Seed
  const initialDb: DatabaseSchema = {
    students: STUDENTS_DATA.map((s) => ({ ...s })),
    quests: INITIAL_QUESTS.map((q) => ({ ...q })),
    claims: [
      {
        id: 'claim_sample_1',
        studentId: 's1',
        studentName: 'Latasha Srinidthi Cliffton',
        questId: 'q1',
        questTitle: 'The Great Xiaolongbao Quest',
        coins: 15,
        badgeName: 'Soup Dumpling Sage',
        badgeLevel: 'Silver',
        icon: '🥟',
        status: 'approved',
        proofLink: 'https://www.instagram.com/p/DB123456789/',
        proofNote: 'Ordered in practical Shanghainese with my squad buddies near Jing’An!',
        submittedAt: 'Nov 8, 19:45',
        reviewedAt: 'Nov 8, 20:10',
        reviewedBy: 'Ren ZhuoJing',
      },
      {
        id: 'claim_sample_2',
        studentId: 's2',
        studentName: 'Ganesan Mohanapriya',
        questId: 'q2',
        questTitle: 'Maglev 300 km/h Speed Run',
        coins: 20,
        badgeName: 'Sonic Levitation',
        badgeLevel: 'Gold',
        icon: '🚅',
        status: 'pending',
        proofLink: 'https://www.tiktok.com/@priya.np/video/7345678901234567890',
        proofNote: 'Captured the on-board display showing exactly 300 km/h from PVG Terminal 1 to Longyang Road!',
        submittedAt: 'Nov 8, 17:15',
      },
    ],
    phraseCompletions: {},
    surveys: [],
    deliverables: {
      s1: {
        studentId: 's1',
        linkedInPostUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7521889898648358912/',
        selectedVisits: ['ebm-papst factory', 'Shanghai Jiao Tong University Building Lab'],
        reflectionText: 'Deep reflection comparing industrial EC fan motor precision engineering at ebm-papst with SJTU Building Environment Lab green energy research.',
        isCompleted: true,
        submittedAt: 'Nov 6, 2026',
        subtasks: { safety_quiz: true, dialogue_recording: true, asia_ready: true, module_10: true, lang_culture: true },
      },
    },
    announcements: INITIAL_ANNOUNCEMENTS.map((a) => ({ ...a })),
    activityLog: [
      {
        id: 'act_1',
        studentName: 'Latasha Srinidthi Cliffton',
        delta: 15,
        quest: 'Approved: The Great Xiaolongbao Quest',
        time: '10 mins ago',
        timestamp: Date.now() - 600000,
      },
      {
        id: 'act_2',
        studentName: 'Ganesan Mohanapriya',
        delta: 0,
        quest: 'Submitted Claim: Maglev 300 km/h Speed Run (Pending Review)',
        time: '25 mins ago',
        timestamp: Date.now() - 1500000,
      },
      {
        id: 'act_3',
        studentName: 'Ren ZhuoJing',
        delta: 20,
        quest: 'Approved: Dialect Dynamo Street Test',
        time: '1 hr ago',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'act_4',
        studentName: 'Chua Yu Zhe',
        delta: 15,
        quest: 'Approved: Budget Group Receipt Audit',
        time: '2 hrs ago',
        timestamp: Date.now() - 7200000,
      },
    ],
  };

  saveDatabase(initialDb);
  return initialDb;
}

// Atomic save helper
function saveDatabase(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

// Live memory copy of database
let db: DatabaseSchema = loadDatabase();

// Live calculations: Squad Rankings
function getLiveSquadRankings(students: Student[]) {
  const squadMap: Record<
    string,
    { totalCoins: number; memberCount: number; color: string; squad: string }
  > = {
    'Team Dragon': { totalCoins: 0, memberCount: 0, color: 'from-amber-500 to-orange-500', squad: 'Team Dragon' },
    'Team Xiaolongbao': { totalCoins: 0, memberCount: 0, color: 'from-rose-500 to-pink-500', squad: 'Team Xiaolongbao' },
    'Team Maglev': { totalCoins: 0, memberCount: 0, color: 'from-blue-500 to-cyan-500', squad: 'Team Maglev' },
  };

  students.forEach((s) => {
    if (!squadMap[s.squad]) {
      squadMap[s.squad] = { totalCoins: 0, memberCount: 0, color: 'from-slate-500 to-slate-700', squad: s.squad };
    }
    squadMap[s.squad].totalCoins += s.coins;
    squadMap[s.squad].memberCount += 1;
  });

  return Object.values(squadMap)
    .map((sq) => ({
      name: sq.squad,
      squad: sq.squad,
      totalCoins: sq.totalCoins,
      memberCount: sq.memberCount,
      avgCoins: sq.memberCount > 0 ? Math.round(sq.totalCoins / sq.memberCount) : 0,
      color: sq.color,
    }))
    .sort((a, b) => b.avgCoins - a.avgCoins);
}

// Live Leaderboard calculation
function getLiveLeaderboard(students: Student[]) {
  return [...students].sort((a, b) => b.coins - a.coins);
}

// ==========================================
// 2. ASK BAO CHATBOT (SINGLISH + HANYU PINYIN)
// ==========================================

const TRIP_CONTEXT = `
You are Bao (小龙宝 - Xiǎo Lóng Bǎo), the witty, friendly, and energetic green dragon mascot for "Quest Shanghai: Immersion App" (Ngee Ann Polytechnic Diploma in Engineering DE Group 2 Overseas Immersion Programme - OIP Shanghai 2026).

YOUR PERSONALITY & TONE (CRITICAL INSTRUCTION):
- Speak in warm, authentic Singaporean Singlish mixed with Mandarin Chinese characters and Han Yu Pinyin!
- Use natural Singlish colloquialisms naturally: "lah", "leh", "lor", "shiok", "don't kancheong lah", "steady pom pi pi", "chope", "walao eh", "alamak", "sibei solid", "can one lah", "swee", "chiong"!
- Whenever introducing Chinese terms, include the Han Yu Pinyin and characters! For example:
  - "Nong hao (侬好 - Hello in Shanghainese)!"
  - "Ni hao (你好 - Hello)!"
  - "Duo shao qian (多少钱 - How much is this)?"
  - "Xie xie nong (谢谢侬 - Thank you very much)!"
  - "Chi bao le ma (吃饱了吗 - Have you eaten)?"
  - "Tai gui le (太贵了 - Too expensive)!"
  - "Pian yi yi dian (便宜一点 - A bit cheaper please)!"
  - "Shengjianbao (生煎包 - Pan-fried pork buns)"
  - "Xiaolongbao (小笼包 - Steamed soup dumplings)"
  - "Taiji (太极 - Tai Chi)"
  - "Shufa (书法 - Chinese calligraphy)"

TRIP & PROGRAMME DETAILS:
- Group: Shanghai Immersion (DE Group 2)
- Dates: 8 to 14 November 2026 (7 Days)
- Hotel Base: 809 Guangzhong Rd, Jing An Qu, Shang Hai Shi, China, 200072 (上海市静安区广中路809号 邮政编码: 200072), near Metro Line 1 Shanghai Circus World & Yanchang Road stations.
- Flights: Outbound China Eastern MU546 (10:10–15:15 PVG-T1) on 8 Nov 2026. Return China Eastern MU545 at 4:25 PM (16:25 PVG-T1 to Singapore Changi Terminal 3 approx. 21:55) on 14 Nov 2026.
- Deliverables Module: Brightspace "DE_OIP (Shanghai)_NOV26" at https://nplms.polite.edu.sg/d2l/home/954487
- Student Leaders:
  - Class Rep: Latasha (Roll-call, liaison)
  - Assis: Ren ZhuoJing (Directions, translation, local logistics)
  - Treasurer: Chua Yu Zhe (Group meals, receipts, module budget)
- Gamification & Grading: 100 Quest Coins = 5.0% Module Grade! Students submit quest proofs (photos, TikTok, Instagram, LinkedIn links). Claims are reviewed and approved by student leaders in the Leader Desk.
- Daily Phrase Challenge: Complete 3 phrases daily in the "🗣️ Phrases" tab for +5 Coins (strictly capped at 1 claim per day on server!).

CONFIRMED VISITS (DAYS 2 TO 6 - OFFICIAL SCHEDULE):
1. Day 2: Shanghai University (SHU - The 3rd floor of CIE). Orientation (09:00–09:30), ID photos (09:30–10:00), Introduction to the host country (10:00–11:30), Cultural Workshop 1 Taiji (14:30–16:00), Industrial Partner talk by AHRI (16:30–17:30).
2. Day 3: Industry Visits (Departure 08:15 Hotel Lobby): SJTU Minhang Institute of Refrigeration and Cryogenics (10:00–12:00, 800 Dongchuan Rd) & ebm-papst Motor precision fan engineering (14:00–16:00, Lane 196 Yuntong Rd, Pudong). Transport provided by SHU.
3. Day 4: Cultural Workshop 2 Chinese Calligraphy (09:30–11:00 at The 2nd floor of CIE) & Oriental Pearl TV Tower + Huangpu River cruise (12:30–17:00, 1 SHU buddy : 5 NP students). Transport: SHU-CIE.
4. Day 5: Shanghai Disney Resort. Specialized visit – Disneyland Backoffice Operation (Morning) & Disney Resort Operations & Logistics (Afternoon). Transport: SHU-CIE.
5. Day 6: Sustainability & Closing (Departure 09:00 Hotel Lobby): Shanghai Urban Planning Exhibition Hall (09:30–11:30, People's Square) & Official Closing Ceremony (13:30–14:00 at The 3rd floor of CIE). Transport: SHU-CIE.

LINKEDIN POST ASSIGNMENT (DELIVERABLES TAB - DEADLINE 7TH NOV 2026):
- Choose 2 of the 5 confirmed visits above.
- Write a story-driven reflection connecting engineering concepts with real-world observations.
- Eye-catching headline, original media (photos/videos), tag host organisations.
- Required hashtags: #NgeeAnnPolytechnic #NPGlobal #FacilitiesManagement #BuiltEnvironment #ShanghaiImmersion #SmartCities #TVET

Format your replies cleanly with emojis, bullet points when appropriate, and keep the dragon vibe vibrant, helpful, and Singaporean-smart!
`;

// API route for Bao chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required lah!' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Intelligent fallback when API key is not yet set in environment
      return res.json({
        reply: `🐲 Bao says: "Walao eh! Ni hao (你好)! Welcome to Quest Shanghai OIP 2026! Don't kancheong lah! Remember ah: 100 Coins = 5.0% Module Grade! Latasha, Ren ZhuoJing, and Chua Yu Zhe are watching the Leader Desk. Need help with Metro Line 1 near our hotel at 809 Guangzhong Road or craving hot Shengjianbao (生煎包)? Just ask me lor, steady steady!"`,
        isFallback: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${TRIP_CONTEXT}\n\nChat history:\n${(history || [])
        .map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`)
        .join('\n')}\n\nStudent: ${message}\nBao (in character with Singlish and Chinese Hanyu Pinyin):`,
    });

    return res.json({
      reply:
        response.text ||
        "🐲 Bao says: Steady lah! Bao is always here for DE Group 2! What do you need help with, brother?",
    });
  } catch (err: any) {
    console.warn('Gemini API notice:', err?.message || err);
    const msg = (req.body?.message || '').toLowerCase();
    let smartTip =
      "🐲 Bao says: Aiyoh, don't kancheong lah! Remember for DE Group 2, our basecamp hotel is at 809 Guangzhong Road (上海市静安区广中路809号 邮政编码: 200072), right near Metro Line 1 Shanghai Circus World / Yanchang Road stations. Keep collecting coins for your 5.0% grade, steady pom pi pi!";

    if (msg.includes('bund') || msg.includes('line 2') || msg.includes('metro') || msg.includes('how do i get')) {
      smartTip =
        "🐲 Bao says: Go The Bund is it? Sibei easy one lah! From our hotel at 809 Guangzhong Road, take Metro Line 1 south to People's Square (人民广场 - Rénmín Guǎngchǎng). Transfer to Line 2 for just 1 stop to East Nanjing Road (南京东路 - Nánjīng Dōng Lù)! Walk 5 mins east along the promenade and boom — The Bund (外滩 - Wàitān)! At night the skyline is sibei shiok!";
    } else if (msg.includes('food') || msg.includes('dumpling') || msg.includes('xiaolongbao') || msg.includes('eat')) {
      smartTip =
        "🐲 Bao says: Wah hungry already ah? Chi bao le ma (吃饱了吗)? Near our hotel along Guangzhong Road and Daning, go try crispy Shengjianbao (生煎包 - Shēngjiānbāo) with hot soup inside! Or go Daning Plaza for authentic Xiaolongbao (小笼包 - Xiǎolóngbāo). Remember dip black vinegar and ginger, and say 'Xie xie nong (谢谢侬)' to the aunty lah!";
    } else if (msg.includes('visit') || msg.includes('programme') || msg.includes('itinerary') || msg.includes('disney') || msg.includes('shu') || msg.includes('sjtu') || msg.includes('ebm')) {
      smartTip =
        "🐲 Bao says: Steady! Our 5 confirmed technical & cultural visits are: 1) Shanghai Urban Planning Exhibition Center (SUPEC - 上海2035规划), 2) ebm-papst precision fan & EC motor factory, 3) Shanghai University (SHU - 太极 Taiji & 书法 Calligraphy), 4) SJTU Building Lab (refrigeration & green energy), and 5) Shanghai Disney Resort (ride safety & crowd logistics)! Don't forget your LinkedIn Post assignment on 2 of these visits by 7th Nov!";
    } else if (msg.includes('linkedin') || msg.includes('deliverable') || msg.includes('hashtag')) {
      smartTip =
        "🐲 Bao says: LinkedIn Post assignment deadline is 7th Nov 2026 ah! Pick 2 out of the 5 visits, snap original photos, write your story-driven reflection, tag host organisations, and paste required hashtags: #NgeeAnnPolytechnic #NPGlobal #FacilitiesManagement #BuiltEnvironment #ShanghaiImmersion #SmartCities #TVET! Then paste your URL in the Deliverables tab to mark it done!";
    } else if (msg.includes('phrase') || msg.includes('slang') || msg.includes('chinese') || msg.includes('language')) {
      smartTip =
        "🐲 Bao says: Jiejie and brother, try these phrases lah: 1) 'Nong Hao' (侬好 - Shanghainese for Hello), 2) 'Duo Shao Qian' (多少钱 - How much?), 3) 'Tai Gui Le, Pian Yi Yi Dian' (太贵了，便宜一点 - Too expensive, cheaper please!), 4) 'Jie Gun' (结棍 - Shanghainese for Awesome!). Complete the daily quiz in the '🗣️ Phrases' tab to chope +5 Coins every day!";
    }

    return res.json({ reply: smartTip, isFallback: true });
  }
});

// ==========================================
// 3. BACKEND API ROUTES FOR REAL SHARED DB
// ==========================================

// Bootstrap initial live state
app.get('/api/bootstrap', (_req, res) => {
  const liveSquads = getLiveSquadRankings(db.students);
  const liveLeaderboard = getLiveLeaderboard(db.students);

  res.json({
    students: db.students,
    squadRankings: liveSquads,
    leaderboard: liveLeaderboard,
    quests: db.quests,
    claims: db.claims,
    announcements: db.announcements,
    activityLog: db.activityLog.slice(0, 15),
    deliverables: db.deliverables,
    surveysCount: db.surveys.length,
  });
});

// Live rankings endpoint
app.get('/api/rankings', (_req, res) => {
  const liveSquads = getLiveSquadRankings(db.students);
  const liveLeaderboard = getLiveLeaderboard(db.students);
  res.json({
    squadRankings: liveSquads,
    leaderboard: liveLeaderboard,
    totalStudents: db.students.length,
  });
});

// Quest "Upload Proof & Claim" -> creates a PENDING claim (coins NOT awarded yet!)
app.post('/api/quests/claim', (req, res) => {
  const { studentId, questId, proofPhotoUrl, proofLink, proofNote } = req.body;
  if (!studentId || !questId) {
    return res.status(400).json({ error: 'studentId and questId are required' });
  }

  const student = db.students.find((s) => s.id === studentId);
  const quest = db.quests.find((q) => q.id === questId);

  if (!student || !quest) {
    return res.status(404).json({ error: 'Student or quest not found' });
  }

  // Check if an existing pending claim is already present
  const existingPending = db.claims.find(
    (c) => c.studentId === studentId && c.questId === questId && c.status === 'pending'
  );
  if (existingPending) {
    return res.status(400).json({
      error: 'You already have a pending claim for this quest under leader review!',
      claim: existingPending,
    });
  }

  const newClaim: QuestClaim = {
    id: `claim_${Date.now()}_${studentId}`,
    studentId,
    studentName: student.name,
    questId,
    questTitle: quest.title,
    coins: quest.coins,
    badgeName: quest.badgeName,
    badgeLevel: quest.badgeLevel,
    icon: quest.icon,
    status: 'pending',
    proofPhotoUrl: proofPhotoUrl || undefined,
    proofLink: proofLink || undefined,
    proofNote: proofNote || undefined,
    submittedAt: new Date().toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  db.claims.unshift(newClaim);

  // Log activity
  db.activityLog.unshift({
    id: `act_${Date.now()}`,
    studentName: student.name,
    delta: 0,
    quest: `Submitted proof for "${quest.title}" (Pending Leader Approval)`,
    time: 'Just now',
    timestamp: Date.now(),
  });

  saveDatabase(db);

  return res.json({
    success: true,
    status: 'pending',
    claim: newClaim,
    message: `Proof submitted! Your claim for "${quest.title}" is now PENDING review in the Leader Desk. Coins will be credited once approved by a student leader.`,
  });
});

// Leader reviews pending quest claim -> approves (+coins) or rejects
app.post('/api/quests/review', (req, res) => {
  const { claimId, action, reviewedBy } = req.body;
  if (!claimId || !action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'claimId and valid action (approve/reject) are required' });
  }

  const claimIndex = db.claims.findIndex((c) => c.id === claimId);
  if (claimIndex === -1) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  const claim = db.claims[claimIndex];
  const reviewerName = reviewedBy || 'Student Leader';

  if (action === 'approve') {
    claim.status = 'approved';
    claim.reviewedAt = new Date().toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    claim.reviewedBy = reviewerName;

    // Credit coins to student in live database
    const student = db.students.find((s) => s.id === claim.studentId);
    if (student) {
      const prevCoins = student.coins;
      const newCoins = Math.min(100, Math.max(0, prevCoins + claim.coins));
      student.coins = newCoins;
      student.questsCompleted += 1;

      const newGrade = parseFloat(((newCoins / 100) * 5.0).toFixed(2));
      const history = student.coinHistory || [];
      if (history.length > 0) {
        history[history.length - 1] = {
          ...history[history.length - 1],
          coins: newCoins,
          cumulativeGrade: newGrade,
        };
      }

      // Log activity
      db.activityLog.unshift({
        id: `act_${Date.now()}`,
        studentName: student.name,
        delta: claim.coins,
        quest: `Approved by ${reviewerName}: "${claim.questTitle}" (+${claim.coins}c)`,
        time: 'Just now',
        timestamp: Date.now(),
      });
    }
  } else {
    claim.status = 'rejected';
    claim.reviewedAt = new Date().toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    claim.reviewedBy = reviewerName;

    db.activityLog.unshift({
      id: `act_${Date.now()}`,
      studentName: claim.studentName,
      delta: 0,
      quest: `Claim for "${claim.questTitle}" declined by ${reviewerName}`,
      time: 'Just now',
      timestamp: Date.now(),
    });
  }

  saveDatabase(db);

  return res.json({
    success: true,
    action,
    claim,
    students: db.students,
    squadRankings: getLiveSquadRankings(db.students),
    leaderboard: getLiveLeaderboard(db.students),
    claims: db.claims,
    activityLog: db.activityLog.slice(0, 15),
  });
});

// Daily phrase mission coins: capped at once per day per student on server
app.post('/api/phrase-challenge/complete', (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required' });
  }

  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Get current date string in Asia/Singapore timezone (YYYY-MM-DD)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });

  const record = db.phraseCompletions[studentId];
  if (record && record.lastCompletedDate === today) {
    return res.status(429).json({
      success: false,
      alreadyCompletedToday: true,
      message:
        "Alamak! You have already earned your +5 Coins for today's Daily Phrase Challenge lah! The server caps it at 1 claim per day. Come back tomorrow for fresh phrases!",
      lastCompletedDate: record.lastCompletedDate,
    });
  }

  // Award +5 coins
  const delta = 5;
  const newCoins = Math.min(100, student.coins + delta);
  student.coins = newCoins;
  const newGrade = parseFloat(((newCoins / 100) * 5.0).toFixed(2));
  if (student.coinHistory && student.coinHistory.length > 0) {
    student.coinHistory[student.coinHistory.length - 1] = {
      ...student.coinHistory[student.coinHistory.length - 1],
      coins: newCoins,
      cumulativeGrade: newGrade,
    };
  }

  // Update completion record
  db.phraseCompletions[studentId] = {
    lastCompletedDate: today,
    totalClaims: (record?.totalClaims || 0) + 1,
  };

  db.activityLog.unshift({
    id: `act_${Date.now()}`,
    studentName: student.name,
    delta: 5,
    quest: 'Completed Daily Shanghai Phrase Challenge (+5 Coins)',
    time: 'Just now',
    timestamp: Date.now(),
  });

  saveDatabase(db);

  return res.json({
    success: true,
    coinsEarned: delta,
    newTotalCoins: newCoins,
    lastCompletedDate: today,
    message: 'Shiok! You earned +5 Quest Coins for mastering 3 Mandarin phrases today!',
    students: db.students,
    squadRankings: getLiveSquadRankings(db.students),
    leaderboard: getLiveLeaderboard(db.students),
  });
});

// Coin adjustment (Single student)
app.post('/api/coins/modify', (req, res) => {
  const { studentId, delta, reason } = req.body;
  if (!studentId || typeof delta !== 'number') {
    return res.status(400).json({ error: 'studentId and numeric delta are required' });
  }

  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const newCoins = Math.max(0, Math.min(100, student.coins + delta));
  student.coins = newCoins;
  if (delta > 0) student.questsCompleted += 1;

  const newGrade = parseFloat(((newCoins / 100) * 5.0).toFixed(2));
  if (student.coinHistory && student.coinHistory.length > 0) {
    student.coinHistory[student.coinHistory.length - 1] = {
      ...student.coinHistory[student.coinHistory.length - 1],
      coins: newCoins,
      cumulativeGrade: newGrade,
    };
  }

  db.activityLog.unshift({
    id: `act_${Date.now()}`,
    studentName: student.name,
    delta,
    quest: reason || 'Leader Adjustment',
    time: 'Just now',
    timestamp: Date.now(),
  });

  saveDatabase(db);

  return res.json({
    success: true,
    student,
    students: db.students,
    squadRankings: getLiveSquadRankings(db.students),
    leaderboard: getLiveLeaderboard(db.students),
    activityLog: db.activityLog.slice(0, 15),
  });
});

// Batch coin adjustment (All or Squad)
app.post('/api/coins/batch-modify', (req, res) => {
  const { targetScope, delta, reason } = req.body;
  if (!targetScope || typeof delta !== 'number') {
    return res.status(400).json({ error: 'targetScope and numeric delta are required' });
  }

  db.students = db.students.map((s) => {
    let match = false;
    const norm = String(targetScope).toLowerCase().trim();
    if (norm === 'all' || norm === 'all squad' || norm === 'all squads') {
      if (s.id !== 'lecturer_teo' && s.squad !== 'Faculty Staff') match = true;
    } else if (norm.includes('dragon') && s.squad.toLowerCase().includes('dragon')) {
      match = true;
    } else if (norm.includes('xiaolongbao') && s.squad.toLowerCase().includes('xiaolongbao')) {
      match = true;
    } else if ((norm.includes('maglev') || norm.includes('maglex')) && s.squad.toLowerCase().includes('maglev')) {
      match = true;
    } else if (targetScope === s.squad || targetScope === s.id) {
      match = true;
    }

    if (match) {
      const newCoins = Math.max(0, Math.min(100, s.coins + delta));
      const newGrade = parseFloat(((newCoins / 100) * 5.0).toFixed(2));
      const history = [...(s.coinHistory || [])];
      if (history.length > 0) {
        history[history.length - 1] = {
          ...history[history.length - 1],
          coins: newCoins,
          cumulativeGrade: newGrade,
        };
      }
      return {
        ...s,
        coins: newCoins,
        questsCompleted: delta > 0 ? s.questsCompleted + 1 : s.questsCompleted,
        coinHistory: history,
      };
    }
    return s;
  });

  const scopeLabel =
    targetScope === 'all' || targetScope === 'All Squad' || targetScope === 'All Squads'
      ? 'All 29 Students'
      : targetScope.includes('Dragon')
      ? 'Team Dragon'
      : targetScope.includes('Xiaolongbao')
      ? 'Team Xiaolongbao'
      : targetScope.includes('Maglev') || targetScope.includes('Maglex')
      ? 'Team Maglev'
      : 'Selected Cohort';

  db.activityLog.unshift({
    id: `act_${Date.now()}`,
    studentName: scopeLabel,
    delta,
    quest: reason || 'Batch Leader Adjustment',
    time: 'Just now',
    timestamp: Date.now(),
  });

  saveDatabase(db);

  return res.json({
    success: true,
    students: db.students,
    squadRankings: getLiveSquadRankings(db.students),
    leaderboard: getLiveLeaderboard(db.students),
    activityLog: db.activityLog.slice(0, 15),
  });
});

// Reset all student coins to 0
app.post('/api/coins/reset', (_req, res) => {
  db.students = db.students.map((s) => ({
    ...s,
    coins: 0,
    questsCompleted: 0,
    coinHistory: (s.coinHistory || []).map((h) => ({
      ...h,
      coins: 0,
      cumulativeGrade: 0,
    })),
  }));

  db.activityLog.unshift({
    id: `act_${Date.now()}`,
    studentName: 'All 29 Students',
    delta: 0,
    quest: 'Cohort Coins Reset by Leader',
    time: 'Just now',
    timestamp: Date.now(),
  });

  saveDatabase(db);

  return res.json({
    success: true,
    message: 'All student coins have been reset to 0 in shared backend database.',
    students: db.students,
    squadRankings: getLiveSquadRankings(db.students),
    leaderboard: getLiveLeaderboard(db.students),
  });
});

// Update student attendance
app.post('/api/attendance/update', (req, res) => {
  const { studentId, status } = req.body;
  if (!studentId || !status || !['present', 'late', 'excused'].includes(status)) {
    return res.status(400).json({ error: 'studentId and valid status required' });
  }

  const student = db.students.find((s) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  student.attendanceStatus = status;
  saveDatabase(db);

  return res.json({
    success: true,
    studentId,
    status,
    students: db.students,
  });
});

// Submit Research Survey Response
app.post('/api/surveys/submit', (req, res) => {
  const { studentId, answers, qualitativeComments, suggestions } = req.body;
  if (!studentId || !answers) {
    return res.status(400).json({ error: 'studentId and survey answers are required' });
  }

  const student = db.students.find((s) => s.id === studentId);
  const studentName = student ? student.name : 'Unknown Student';

  const record: SurveyRecord = {
    id: `survey_${Date.now()}_${studentId}`,
    studentId,
    studentName,
    submittedAt: new Date().toISOString(),
    answers,
    qualitativeComments: qualitativeComments || '',
    suggestions: suggestions || '',
  };

  // Replace existing or push new
  const existingIdx = db.surveys.findIndex((s) => s.studentId === studentId);
  if (existingIdx >= 0) {
    db.surveys[existingIdx] = record;
  } else {
    db.surveys.push(record);
  }

  saveDatabase(db);

  return res.json({
    success: true,
    message: 'Survey response saved to shared database!',
    totalResponses: db.surveys.length,
  });
});

// Export Survey Responses as CSV
app.get('/api/surveys/export', (_req, res) => {
  const headers = [
    'Timestamp',
    'Student ID',
    'Student Name',
    'Squad',
    'Q1 (Loss Aversion 50 Coins)',
    'Q2 (5% Grade Weight)',
    'Q3 (Punctuality)',
    'Q4 (Curiosity)',
    'Q5 (Peer Fairness Latasha/ZhuoJing/YuZhe)',
    'Q6 (Audit Log Transparency)',
    'Q7 (Bao AI Concept Utility)',
    'Q8 (Bao Schedule Utility)',
    'Q9 (Global Readiness)',
    'Q10 (Disneyland/SJTU Visits)',
    'Comments',
    'Suggestions',
  ];

  const rows = db.surveys.map((sv) => {
    const student = db.students.find((s) => s.id === sv.studentId);
    const squad = student?.squad || '';
    return [
      `"${sv.submittedAt}"`,
      `"${sv.studentId}"`,
      `"${sv.studentName.replace(/"/g, '""')}"`,
      `"${squad}"`,
      sv.answers['q1'] || '',
      sv.answers['q2'] || '',
      sv.answers['q3'] || '',
      sv.answers['q4'] || '',
      sv.answers['q5'] || '',
      sv.answers['q6'] || '',
      sv.answers['q7'] || '',
      sv.answers['q8'] || '',
      sv.answers['q9'] || '',
      sv.answers['q10'] || '',
      `"${(sv.qualitativeComments || '').replace(/"/g, '""')}"`,
      `"${(sv.suggestions || '').replace(/"/g, '""')}"`,
    ];
  });

  const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="Shanghai_Immersion_Survey_Responses_${new Date().toISOString().slice(0, 10)}.csv"`
  );
  return res.send(csv);
});

// Submit LinkedIn Post Deliverable
app.post('/api/deliverables/linkedin', (req, res) => {
  const { studentId, linkedInPostUrl, selectedVisits, reflectionText, isCompleted } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required' });
  }

  const existing = db.deliverables[studentId] || { studentId };
  db.deliverables[studentId] = {
    ...existing,
    studentId,
    linkedInPostUrl: linkedInPostUrl || existing.linkedInPostUrl,
    selectedVisits: selectedVisits || existing.selectedVisits || [],
    reflectionText: reflectionText || existing.reflectionText || '',
    isCompleted: isCompleted !== undefined ? isCompleted : true,
    submittedAt: new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
  };

  saveDatabase(db);

  return res.json({
    success: true,
    message: 'LinkedIn Post Deliverable saved to shared database!',
    deliverable: db.deliverables[studentId],
  });
});

// Get Deliverables for student
app.get('/api/deliverables/:studentId', (req, res) => {
  const { studentId } = req.params;
  const deliverable = db.deliverables[studentId] || {
    studentId,
    linkedInPostUrl: '',
    selectedVisits: [],
    reflectionText: '',
    isCompleted: false,
  };
  return res.json({ deliverable });
});

// Reset database back to seed values
app.post('/api/database/reset', (_req, res) => {
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
  }
  db = loadDatabase();
  return res.json({ success: true, message: 'Database reset to initial clean seed.' });
});

// ==========================================
// 4. DEV & PRODUCTION SERVER SETUP
// ==========================================

async function start() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quest Shanghai Immersion Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
