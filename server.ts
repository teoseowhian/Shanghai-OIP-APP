import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
// Render injects PORT; fall back to 3000 for local runs
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Trip context for Bao (Immersion Trip AI Bot)
const TRIP_CONTEXT = `
You are Bao (小龙宝), the energetic, encouraging, and witty green dragon mascot and AI Trip Bot for "Quest Shanghai: Immersion App" (Overseas Immersion Programme - OIP 2026).
Group Details:
- Group: Shanghai Immersion (DE Group 2)
- Dates: 8 to 14 November 2026 (7 Days)
- Hotel Base: Homeinn Plus Hotel (Address: Yanchang Middle Road 302, Jing An District, Shanghai, China 200070 | 如家精选酒店 上海火车站延长路地铁站店, near Metro Line 1 Yanchang Road Station)
- Student Leaders:
  - Class Rep: Latasha (Handles overall roll call & faculty liaison)
  - Assis: Ren ZhuoJing (Local logistics, directions & translation)
  - Treasurer: Chua Yu Zhe (OIP module fund, meal group bills & receipts)
- Gamification Rule: 100 Quest Coins = 5.0% Module Grade. Students earn coins through cultural quests, language missions, attending itinerary check-ins, and group challenges.

Key Itinerary Highlights:
- Day 1 (Nov 8): Outbound flight China Eastern MU546 (SIN 10:10 -> PVG Terminal 1 15:35). Maglev train ride to Longyang Rd, transfer Line 2 & Line 1 to Homeinn Plus Hotel. Orientation dinner (Xiaolongbao & Shengjianbao).
- Day 2 (Nov 9): High-Tech Innovation Hub & AI Robotics Park in Pudong, Lujiazui Skyline (Shanghai Tower observation deck).
- Day 3 (Nov 10): University Academic Exchange & Lecture at Fudan University / Shanghai Jiao Tong, Campus Tour & Student Partner Meetup.
- Day 4 (Nov 11): Heritage & Urban Renewal - Tianzifang, Former French Concession historical walk, Fuxing Park morning Tai Chi.
- Day 5 (Nov 12): M50 Contemporary Art District creative immersion, Suzhou Creek walk, Evening Huangpu River Cruise (The Bund vs Pudong).
- Day 6 (Nov 13): Yu Garden (Yuyuan), Old Shanghai Bazaar, cultural tea ceremony quest, Last-minute souvenirs & tea gifts (Nanjing Rd / AP Plaza), Final Group Presentations & Grand Farewell Banquet.
- Day 7 (Nov 14): Hotel checkout, charter bus to PVG Terminal 1, return flight China Eastern MU565 to Singapore Changi (depart PVG 14:30, arrive SIN approx. 19:50).

7-Day November Shanghai Packing Strategy:
- Weather: Late autumn, 10°C to 18°C. Crisp daytime, sharp morning/evening drops, damp chill.
- Layering Strategy: 1 packable windproof/puffer jacket, 7-8 long-sleeve/collared shirts (smart-casual for site visits), 2 mid-layer sweaters/hoodies, 3-4 neat bottoms (no ripped jeans for corporate visits).
- Footwear: 1 pair broken-in walking sneakers (15,000+ steps/day), 1 pair clean closed-toe shoes (mandatory for industrial/factory sites).
- PT Gear: 15-20L backpack, field notebook & pens, verify PPE if required.
- Tech & Pay: Alipay/WeChat Pay linked to international card (China is cashless), China eSIM/roaming, tested VPN, power bank (carry-on only, clear Wh rating), universal plug adapter.
- Health: Compact umbrella, pocket tissues/hand sanitizer (many restrooms lack TP), lip balm/moisturizer, leave 25% empty luggage space for Shanghai shopping!

Academic Deliverables (1 LU PLP-Global Readiness & NYC AEP Grant):
- Brightspace Module: Homepage - DE_OIP (Shanghai)_NOV26
- To qualify for 1 LU under PLP-Global Readiness and NYC AEP grant, students must complete:
  1. Pre-trip Activities: Safety Briefing Quiz, OIP Dialogue Session Recording (China).
  2. NYC's AEP Online Module (https://learn.nyc.gov.sg): "[AEP] Language, Culture & Current Affairs [by Country]" comprising: Are you Asia Ready, Current Affairs Module 10, and Language and Culture in country.
  3. Reflection & Post-trip Survey: Trip Reflection (min. 80 words, uploaded to Reflection Question in NP Brightspace), and Post-trip Survey via unique link sent to NP email & personal email on the second last day of the trip (Nov 13).

Your Persona:
- Warm, cheerful, bilingual flair (knows practical Mandarin & Shanghainese like "Nong Hao" 侬好, "Xie Xie" 谢谢, "Mibaobu" 没搞头).
- Helpful with metro tips (Line 1 to People's Square, transfer to Line 2), food recommendations near Yanchang Road / Jing'an, emergency advice (contact Latasha or Ren ZhuoJing immediately), and tips to conquer quests and get the full 5% grade.
- Keep responses friendly, concise, and formatted nicely with emojis.
`;

// API route for Bao chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Intelligent fallback when API key is not yet set in environment
      return res.json({
        reply: `🐲 Bao says: "Nong Hao (侬好)! Welcome to Quest Shanghai OIP 2026! Remember: 100 Coins = 5% Module Grade! Latasha, Ren ZhuoJing, and Chua Yu Zhe are at the Leader Desk. For emergencies or roll-call, check the Leader Desk. Need food tips near Homeinn Plus Hotel? Try the restaurants along Yanchang Middle Road!"`,
        isFallback: true,
      });
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${TRIP_CONTEXT}\n\nStudent asks: ${message}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${TRIP_CONTEXT}\n\nChat history:\n${(history || [])
        .map((h: { sender: string; text: string }) => `${h.sender}: ${h.text}`)
        .join('\n')}\n\nStudent: ${message}\nBao (in character):`,
    });

    return res.json({ reply: response.text || "Bao is here! Let me know what you need for Quest Shanghai!" });
  } catch (err: any) {
    console.warn('Gemini API call notice:', err?.message || err);
    // Helpful in-character fallback for student trip immersion
    const msg = (req.body?.message || '').toLowerCase();
    let smartTip = "🐲 Bao says: Don't worry! Remember for DE Group 2, Homeinn Plus Hotel is at Yanchang Middle Road 302, Jing'An District (near Metro Line 1 Yanchang Road Station). Latasha and Ren ZhuoJing have live roll-call at the Leader Desk. Keep earning those coins towards your 5.0% grade!";
    
    if (msg.includes('bund') || msg.includes('line 2') || msg.includes('metro') || msg.includes('how do i get')) {
      smartTip = "🐲 Bao says: To get to The Bund from Homeinn Plus Hotel: Walk to Yanchang Road Station (Line 1), take Line 1 Southbound to People's Square (人民广场), then transfer to Line 2 for 1 stop to East Nanjing Road (南京东路). Walk 5 mins east straight down the pedestrian promenade to reach The Bund!";
    } else if (msg.includes('food') || msg.includes('dumpling') || msg.includes('xiaolongbao') || msg.includes('eat')) {
      smartTip = "🐲 Bao says: Craving dumplings? Right near Homeinn Plus Hotel on Yanchang Middle Road, try local eateries or head towards Daning International Commercial Plaza for Shengjianbao and soup dumplings!";
    } else if (msg.includes('phrase') || msg.includes('slang') || msg.includes('language') || msg.includes('chinese')) {
      smartTip = "🐲 Bao says: Try these 3 Shanghainese survival phrases: 1) 'Nong Hao' (侬好 - Hello), 2) 'Xie Xie Nong' (谢谢侬 - Thank you), 3) 'Jie Gun' (结棍 - Awesome!), or ask 'Duo Shao Tie' (多少钿 - How much?)! Switch to the '🗣️ Phrases' tab in the top navigation to listen to native audio and complete the Daily Challenge for +5 Coins!";
    } else if (msg.includes('emergency') || msg.includes('contact') || msg.includes('call') || msg.includes('lost')) {
      smartTip = "🐲 Bao says: If you are separated: 1) Contact Class Rep Latasha or Assis Ren ZhuoJing, 2) Show any taxi driver our Chinese Taxi Address Card in the header (Homeinn Plus Hotel, Yanchang Middle Road 302 / 中国上海市静安区延长中路302号)!";
    } else if (msg.includes('coin') || msg.includes('grade') || msg.includes('quest')) {
      smartTip = "🐲 Bao says: You need 100 Quest Coins for the full 5.0% Module Grade! Head over to the 'Loot & Badges' tab to claim coins for eating Xiaolongbao, riding the Maglev, or exploring Tianzifang!";
    } else if (msg.includes('pack') || msg.includes('wear') || msg.includes('clothes') || msg.includes('luggage') || msg.includes('jacket')) {
      smartTip = "🐲 Bao says: For Shanghai in November (10°C–18°C): 1) Layer up with a packable puffer jacket and smart-casual collared shirts for company visits, 2) Wear broken-in walking sneakers (15,000+ steps!) + clean closed-toe shoes for factory sites, 3) Bring a 15–20L daypack & notebook, 4) Pre-link Alipay/WeChat Pay & test your VPN, 5) Carry pocket tissues and lip balm, and leave 25% suitcase room for souvenirs! Click the 'Packing List' button in the header to view the full interactive checklist!";
    } else if (msg.includes('deliverable') || msg.includes('brightspace') || msg.includes('nyc') || msg.includes('grant') || msg.includes('1 lu') || msg.includes('reflection') || msg.includes('survey')) {
      smartTip = "🐲 Bao says: Don't forget your Academic Deliverables for 1 LU (PLP-Global Readiness & NYC AEP Grant)! Under Brightspace module 'Homepage - DE_OIP (Shanghai)_NOV26': 1) Complete Pre-trip Safety Quiz & Dialogue Recording, 2) Complete NYC AEP Online Modules at learn.nyc.gov.sg, 3) Upload your min. 80-word trip reflection to Brightspace and finish the post-trip survey (unique link sent to your NP & personal email on Nov 13)! Click the 'Deliverables' button in the top bar to track your tasks!";
    }

    return res.json({ reply: smartTip, isFallback: true });
  }
});

// Authentication verification endpoint (Passwordless login)
const LEADER_IDS = ['s1', 's11', 's22'];

app.post('/api/auth/verify', (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const isLeaderId = LEADER_IDS.includes(studentId);
  return res.json({
    success: true,
    role: isLeaderId ? 'leader' : 'student',
    leaderPin: isLeaderId ? 'leader' : undefined,
  });
});

// Middleware for authorization (passcode requirement removed per request)
function requireLeaderAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Seamless authorization without password blocking
  next();
}

// Protected Coin Modification Endpoints
app.post('/api/coins/modify', requireLeaderAuth, (req, res) => {
  const { studentId, delta, reason } = req.body;
  if (!studentId || typeof delta !== 'number') {
    return res.status(400).json({ error: 'studentId and numeric delta are required' });
  }
  return res.json({ success: true, studentId, delta, reason: reason || 'Leader Adjustment' });
});

app.post('/api/coins/batch-modify', requireLeaderAuth, (req, res) => {
  const { targetScope, delta, reason } = req.body;
  if (!targetScope || typeof delta !== 'number') {
    return res.status(400).json({ error: 'targetScope and numeric delta are required' });
  }
  return res.json({ success: true, targetScope, delta, reason: reason || 'Batch Adjustment' });
});

app.post('/api/coins/reset', requireLeaderAuth, (_req, res) => {
  return res.json({ success: true, message: 'All student coins have been reset to 0 by authorized leader.' });
});

// Protected Attendance Endpoint
app.post('/api/attendance/update', requireLeaderAuth, (req, res) => {
  const { studentId, status } = req.body;
  if (!studentId || !status) {
    return res.status(400).json({ error: 'studentId and status are required' });
  }
  return res.json({ success: true, studentId, status });
});

// Protected Room Modification Endpoint
app.post('/api/rooms/update', requireLeaderAuth, (req, res) => {
  const { studentId, roomNumber } = req.body;
  if (!studentId || !roomNumber) {
    return res.status(400).json({ error: 'studentId and roomNumber are required' });
  }
  return res.json({ success: true, studentId, roomNumber });
});

// Start server and mount Vite middleware
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
    console.log(`Quest Shanghai App running on http://0.0.0.0:${PORT}`);
  });
}

start();
