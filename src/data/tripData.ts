export interface CoinHistoryPoint {
  day: string;
  coins: number;
  cumulativeGrade: number; // e.g. 4.8 (%)
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  squad: string;
  coins: number;
  questsCompleted: number;
  roomNumber: string;
  attendanceStatus: 'present' | 'late' | 'excused';
  coinHistory: CoinHistoryPoint[];
}

export interface Quest {
  id: string;
  title: string;
  category: 'Food' | 'Navigation' | 'Culture' | 'Academic';
  coins: number;
  description: string;
  task: string;
  icon: string;
  status: 'locked' | 'in_progress' | 'completed';
  badgeName: string;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Mythic';
  proofPhotoUrl?: string;
  proofLink?: string;
  proofNote?: string;
  submittedAt?: string;
}

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  departureTerminal?: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTerminal?: string;
  arrivalTime: string;
  groupMeetingTime: string;
  meetingLocation: string;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  dressCode: string;
  leadInCharge: string;
  highlights: string[];
  flightInfo?: FlightInfo;
  schedule: {
    time: string;
    event: string;
    location: string;
    metroTip?: string;
    coinsAvailable?: number;
    optional?: boolean;
    note?: string;
  }[];
}

export interface Announcement {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  title: string;
  content: string;
  priority: 'normal' | 'urgent';
}

export const INITIAL_STUDENTS: Student[] = [
  // --- Team Dragon (Group 1 - 10 Students, Led by Class Rep Latasha Srinidthi Cliffton) ---
  // Room 2 (Twin)
  {
    id: 's1',
    name: 'Latasha Srinidthi Cliffton (Class Rep)',
    avatar: '👩🏻‍💼',
    squad: 'Team Dragon',
    coins: 96,
    questsCompleted: 8,
    roomNumber: 'Room 2',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 25, cumulativeGrade: 1.25 },
      { day: 'Nov 9 (Tech)', coins: 45, cumulativeGrade: 2.25 },
      { day: 'Nov 10 (Uni)', coins: 65, cumulativeGrade: 3.25 },
      { day: 'Nov 11 (Lane)', coins: 80, cumulativeGrade: 4.0 },
      { day: 'Nov 12 (Art)', coins: 96, cumulativeGrade: 4.8 },
    ],
  },
  {
    id: 's2',
    name: 'Tan Yu Qi Kylie',
    avatar: '👩🏻‍💼',
    squad: 'Team Dragon',
    coins: 68,
    questsCompleted: 4,
    roomNumber: 'Room 2',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 10 (Uni)', coins: 35, cumulativeGrade: 1.75 },
      { day: 'Nov 11 (Lane)', coins: 50, cumulativeGrade: 2.5 },
      { day: 'Nov 12 (Art)', coins: 68, cumulativeGrade: 3.4 },
    ],
  },
  // Room 14 (Twin)
  {
    id: 's3',
    name: 'Bell Chai Jin Hui',
    avatar: '👩🏻‍🎨',
    squad: 'Team Dragon',
    coins: 83,
    questsCompleted: 6,
    roomNumber: 'Room 14',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 15, cumulativeGrade: 0.75 },
      { day: 'Nov 9 (Tech)', coins: 32, cumulativeGrade: 1.6 },
      { day: 'Nov 10 (Uni)', coins: 50, cumulativeGrade: 2.5 },
      { day: 'Nov 11 (Lane)', coins: 68, cumulativeGrade: 3.4 },
      { day: 'Nov 12 (Art)', coins: 83, cumulativeGrade: 4.15 },
    ],
  },
  {
    id: 's4',
    name: 'Liew Xuan Ru',
    avatar: '👩🏻‍🎨',
    squad: 'Team Dragon',
    coins: 88,
    questsCompleted: 7,
    roomNumber: 'Room 14',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 9 (Tech)', coins: 40, cumulativeGrade: 2.0 },
      { day: 'Nov 10 (Uni)', coins: 55, cumulativeGrade: 2.75 },
      { day: 'Nov 11 (Lane)', coins: 72, cumulativeGrade: 3.6 },
      { day: 'Nov 12 (Art)', coins: 88, cumulativeGrade: 4.4 },
    ],
  },
  // Room 4 (Twin)
  {
    id: 's5',
    name: 'Chang Jzen Da',
    avatar: '🧑🏻‍🚀',
    squad: 'Team Dragon',
    coins: 72,
    questsCompleted: 5,
    roomNumber: 'Room 4',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 25, cumulativeGrade: 1.25 },
      { day: 'Nov 10 (Uni)', coins: 40, cumulativeGrade: 2.0 },
      { day: 'Nov 11 (Lane)', coins: 55, cumulativeGrade: 2.75 },
      { day: 'Nov 12 (Art)', coins: 72, cumulativeGrade: 3.6 },
    ],
  },
  {
    id: 's6',
    name: 'Kagen Sew Wei Zhao',
    avatar: '🧑🏻‍💻',
    squad: 'Team Dragon',
    coins: 69,
    questsCompleted: 4,
    roomNumber: 'Room 4',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 22, cumulativeGrade: 1.1 },
      { day: 'Nov 10 (Uni)', coins: 38, cumulativeGrade: 1.9 },
      { day: 'Nov 11 (Lane)', coins: 54, cumulativeGrade: 2.7 },
      { day: 'Nov 12 (Art)', coins: 69, cumulativeGrade: 3.45 },
    ],
  },
  // Room 5 (Twin)
  {
    id: 's7',
    name: 'Aaron Goh Jia Yi',
    avatar: '🧑🏻‍🎤',
    squad: 'Team Dragon',
    coins: 85,
    questsCompleted: 6,
    roomNumber: 'Room 5',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 15, cumulativeGrade: 0.75 },
      { day: 'Nov 9 (Tech)', coins: 35, cumulativeGrade: 1.75 },
      { day: 'Nov 10 (Uni)', coins: 52, cumulativeGrade: 2.6 },
      { day: 'Nov 11 (Lane)', coins: 70, cumulativeGrade: 3.5 },
      { day: 'Nov 12 (Art)', coins: 85, cumulativeGrade: 4.25 },
    ],
  },
  {
    id: 's8',
    name: 'Kevin Yeo Jiajun',
    avatar: '🧑🏻‍💼',
    squad: 'Team Dragon',
    coins: 78,
    questsCompleted: 5,
    roomNumber: 'Room 5',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 28, cumulativeGrade: 1.4 },
      { day: 'Nov 10 (Uni)', coins: 45, cumulativeGrade: 2.25 },
      { day: 'Nov 11 (Lane)', coins: 62, cumulativeGrade: 3.1 },
      { day: 'Nov 12 (Art)', coins: 78, cumulativeGrade: 3.9 },
    ],
  },
  // Room 6 (Twin)
  {
    id: 's9',
    name: 'Tan Rui Xin Felice',
    avatar: '👩🏻‍🎓',
    squad: 'Team Dragon',
    coins: 76,
    questsCompleted: 5,
    roomNumber: 'Room 6',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 25, cumulativeGrade: 1.25 },
      { day: 'Nov 10 (Uni)', coins: 45, cumulativeGrade: 2.25 },
      { day: 'Nov 11 (Lane)', coins: 60, cumulativeGrade: 3.0 },
      { day: 'Nov 12 (Art)', coins: 76, cumulativeGrade: 3.8 },
    ],
  },
  {
    id: 's10',
    name: 'Ooi Kai Xuan Clarise',
    avatar: '👩🏻‍🍳',
    squad: 'Team Dragon',
    coins: 82,
    questsCompleted: 6,
    roomNumber: 'Room 6',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 15, cumulativeGrade: 0.75 },
      { day: 'Nov 9 (Tech)', coins: 30, cumulativeGrade: 1.5 },
      { day: 'Nov 10 (Uni)', coins: 48, cumulativeGrade: 2.4 },
      { day: 'Nov 11 (Lane)', coins: 66, cumulativeGrade: 3.3 },
      { day: 'Nov 12 (Art)', coins: 82, cumulativeGrade: 4.1 },
    ],
  },

  // --- Team Xiaolongbao (Group 2 - 10 Students, Led by Assis Ren ZhuoJing) ---
  // Room 7 (Twin)
  {
    id: 's11',
    name: 'Ren ZhuoJing (Assis)',
    avatar: '🧑🏻‍💻',
    squad: 'Team Xiaolongbao',
    coins: 94,
    questsCompleted: 8,
    roomNumber: 'Room 7',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 9 (Tech)', coins: 40, cumulativeGrade: 2.0 },
      { day: 'Nov 10 (Uni)', coins: 60, cumulativeGrade: 3.0 },
      { day: 'Nov 11 (Lane)', coins: 75, cumulativeGrade: 3.75 },
      { day: 'Nov 12 (Art)', coins: 94, cumulativeGrade: 4.7 },
    ],
  },
  {
    id: 's12',
    name: 'Beh Li Enn',
    avatar: '👩🏻‍🔬',
    squad: 'Team Xiaolongbao',
    coins: 80,
    questsCompleted: 6,
    roomNumber: 'Room 7',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 15, cumulativeGrade: 0.75 },
      { day: 'Nov 9 (Tech)', coins: 30, cumulativeGrade: 1.5 },
      { day: 'Nov 10 (Uni)', coins: 48, cumulativeGrade: 2.4 },
      { day: 'Nov 11 (Lane)', coins: 64, cumulativeGrade: 3.2 },
      { day: 'Nov 12 (Art)', coins: 80, cumulativeGrade: 4.0 },
    ],
  },
  // Room 8 (Twin)
  {
    id: 's13',
    name: 'Kong Tzing Enn',
    avatar: '🧑🏻‍💻',
    squad: 'Team Xiaolongbao',
    coins: 84,
    questsCompleted: 6,
    roomNumber: 'Room 8',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 15, cumulativeGrade: 0.75 },
      { day: 'Nov 9 (Tech)', coins: 35, cumulativeGrade: 1.75 },
      { day: 'Nov 10 (Uni)', coins: 50, cumulativeGrade: 2.5 },
      { day: 'Nov 11 (Lane)', coins: 68, cumulativeGrade: 3.4 },
      { day: 'Nov 12 (Art)', coins: 84, cumulativeGrade: 4.2 },
    ],
  },
  {
    id: 's14',
    name: 'Niya Danisyah Binte Zulkiflee',
    avatar: '👩🏽‍🎓',
    squad: 'Team Xiaolongbao',
    coins: 71,
    questsCompleted: 5,
    roomNumber: 'Room 8',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 24, cumulativeGrade: 1.2 },
      { day: 'Nov 10 (Uni)', coins: 40, cumulativeGrade: 2.0 },
      { day: 'Nov 11 (Lane)', coins: 56, cumulativeGrade: 2.8 },
      { day: 'Nov 12 (Art)', coins: 71, cumulativeGrade: 3.55 },
    ],
  },
  // Room 9 (Twin)
  {
    id: 's15',
    name: 'Lim Xuan Zheng Jacky',
    avatar: '🧑🏻‍🚀',
    squad: 'Team Xiaolongbao',
    coins: 65,
    questsCompleted: 4,
    roomNumber: 'Room 9',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 10 (Uni)', coins: 36, cumulativeGrade: 1.8 },
      { day: 'Nov 11 (Lane)', coins: 50, cumulativeGrade: 2.5 },
      { day: 'Nov 12 (Art)', coins: 65, cumulativeGrade: 3.25 },
    ],
  },
  {
    id: 's16',
    name: 'Ryyan Bin Saleehullah',
    avatar: '🧑🏽‍🍳',
    squad: 'Team Xiaolongbao',
    coins: 81,
    questsCompleted: 6,
    roomNumber: 'Room 9',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 15, cumulativeGrade: 0.75 },
      { day: 'Nov 9 (Tech)', coins: 32, cumulativeGrade: 1.6 },
      { day: 'Nov 10 (Uni)', coins: 48, cumulativeGrade: 2.4 },
      { day: 'Nov 11 (Lane)', coins: 65, cumulativeGrade: 3.25 },
      { day: 'Nov 12 (Art)', coins: 81, cumulativeGrade: 4.05 },
    ],
  },
  // Room 10 (Twin)
  {
    id: 's17',
    name: 'Ifah Zakirah Binte Asri',
    avatar: '👩🏽‍💼',
    squad: 'Team Xiaolongbao',
    coins: 77,
    questsCompleted: 5,
    roomNumber: 'Room 10',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 26, cumulativeGrade: 1.3 },
      { day: 'Nov 10 (Uni)', coins: 44, cumulativeGrade: 2.2 },
      { day: 'Nov 11 (Lane)', coins: 60, cumulativeGrade: 3.0 },
      { day: 'Nov 12 (Art)', coins: 77, cumulativeGrade: 3.85 },
    ],
  },
  {
    id: 's18',
    name: 'Siti Alisha Natasha Binte Zaini',
    avatar: '👩🏽‍🔬',
    squad: 'Team Xiaolongbao',
    coins: 75,
    questsCompleted: 5,
    roomNumber: 'Room 10',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 25, cumulativeGrade: 1.25 },
      { day: 'Nov 10 (Uni)', coins: 42, cumulativeGrade: 2.1 },
      { day: 'Nov 11 (Lane)', coins: 58, cumulativeGrade: 2.9 },
      { day: 'Nov 12 (Art)', coins: 75, cumulativeGrade: 3.75 },
    ],
  },
  // Room 3 (Twin)
  {
    id: 's19',
    name: 'Ng Kim Yong',
    avatar: '🧑🏻‍🏫',
    squad: 'Team Xiaolongbao',
    coins: 75,
    questsCompleted: 5,
    roomNumber: 'Room 3',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 25, cumulativeGrade: 1.25 },
      { day: 'Nov 10 (Uni)', coins: 42, cumulativeGrade: 2.1 },
      { day: 'Nov 11 (Lane)', coins: 58, cumulativeGrade: 2.9 },
      { day: 'Nov 12 (Art)', coins: 75, cumulativeGrade: 3.75 },
    ],
  },
  {
    id: 's20',
    name: 'Lim Jia En',
    avatar: '👩🏻‍🔬',
    squad: 'Team Xiaolongbao',
    coins: 66,
    questsCompleted: 4,
    roomNumber: 'Room 3',
    attendanceStatus: 'late',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 10 (Uni)', coins: 35, cumulativeGrade: 1.75 },
      { day: 'Nov 11 (Lane)', coins: 50, cumulativeGrade: 2.5 },
      { day: 'Nov 12 (Art)', coins: 66, cumulativeGrade: 3.3 },
    ],
  },

  // --- Team Maglev (Group 3 - 9 Students, Led by Treasurer Chua Yu Zhe) ---
  // Room 11 (Twin)
  {
    id: 's21',
    name: 'Adam Toh Yue Ren',
    avatar: '👨🏽‍💼',
    squad: 'Team Maglev',
    coins: 90,
    questsCompleted: 7,
    roomNumber: 'Room 11',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 9 (Tech)', coins: 35, cumulativeGrade: 1.75 },
      { day: 'Nov 10 (Uni)', coins: 55, cumulativeGrade: 2.75 },
      { day: 'Nov 11 (Lane)', coins: 70, cumulativeGrade: 3.5 },
      { day: 'Nov 12 (Art)', coins: 90, cumulativeGrade: 4.5 },
    ],
  },
  {
    id: 's22',
    name: 'Chua Yu Zhe (Treasurer)',
    avatar: '🧑🏻‍🔬',
    squad: 'Team Maglev',
    coins: 63,
    questsCompleted: 4,
    roomNumber: 'Room 11',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 10 (Uni)', coins: 34, cumulativeGrade: 1.7 },
      { day: 'Nov 11 (Lane)', coins: 48, cumulativeGrade: 2.4 },
      { day: 'Nov 12 (Art)', coins: 63, cumulativeGrade: 3.15 },
    ],
  },
  // Room 12 (Twin)
  {
    id: 's23',
    name: 'Emmanuel Bagyam',
    avatar: '🧑🏾‍💻',
    squad: 'Team Maglev',
    coins: 67,
    questsCompleted: 4,
    roomNumber: 'Room 12',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 22, cumulativeGrade: 1.1 },
      { day: 'Nov 10 (Uni)', coins: 38, cumulativeGrade: 1.9 },
      { day: 'Nov 11 (Lane)', coins: 52, cumulativeGrade: 2.6 },
      { day: 'Nov 12 (Art)', coins: 67, cumulativeGrade: 3.35 },
    ],
  },
  {
    id: 's24',
    name: 'Kenny Lim Tian Yong',
    avatar: '🧑🏻‍🎨',
    squad: 'Team Maglev',
    coins: 70,
    questsCompleted: 4,
    roomNumber: 'Room 12',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 25, cumulativeGrade: 1.25 },
      { day: 'Nov 10 (Uni)', coins: 40, cumulativeGrade: 2.0 },
      { day: 'Nov 11 (Lane)', coins: 55, cumulativeGrade: 2.75 },
      { day: 'Nov 12 (Art)', coins: 70, cumulativeGrade: 3.5 },
    ],
  },
  // Room 13 (Twin)
  {
    id: 's25',
    name: 'Chua Yuan Kai Brayden',
    avatar: '🧑🏻‍🚀',
    squad: 'Team Maglev',
    coins: 74,
    questsCompleted: 5,
    roomNumber: 'Room 13',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 25, cumulativeGrade: 1.25 },
      { day: 'Nov 10 (Uni)', coins: 42, cumulativeGrade: 2.1 },
      { day: 'Nov 11 (Lane)', coins: 58, cumulativeGrade: 2.9 },
      { day: 'Nov 12 (Art)', coins: 74, cumulativeGrade: 3.7 },
    ],
  },
  {
    id: 's26',
    name: 'Muhamad Nabil Harith Bin Mohamad Azlan',
    avatar: '🧑🏽‍💻',
    squad: 'Team Maglev',
    coins: 73,
    questsCompleted: 5,
    roomNumber: 'Room 13',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 24, cumulativeGrade: 1.2 },
      { day: 'Nov 10 (Uni)', coins: 40, cumulativeGrade: 2.0 },
      { day: 'Nov 11 (Lane)', coins: 56, cumulativeGrade: 2.8 },
      { day: 'Nov 12 (Art)', coins: 73, cumulativeGrade: 3.65 },
    ],
  },
  // Room 1 (Twin)
  {
    id: 's27',
    name: 'Lim Jia Zhe, Giovis',
    avatar: '🧑🏻‍🎓',
    squad: 'Team Maglev',
    coins: 62,
    questsCompleted: 3,
    roomNumber: 'Room 1',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 5, cumulativeGrade: 0.25 },
      { day: 'Nov 9 (Tech)', coins: 18, cumulativeGrade: 0.9 },
      { day: 'Nov 10 (Uni)', coins: 34, cumulativeGrade: 1.7 },
      { day: 'Nov 11 (Lane)', coins: 48, cumulativeGrade: 2.4 },
      { day: 'Nov 12 (Art)', coins: 62, cumulativeGrade: 3.1 },
    ],
  },
  {
    id: 's28',
    name: 'Lim Zhao Guang',
    avatar: '🧑🏻‍💻',
    squad: 'Team Maglev',
    coins: 79,
    questsCompleted: 5,
    roomNumber: 'Room 1',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 15, cumulativeGrade: 0.75 },
      { day: 'Nov 9 (Tech)', coins: 30, cumulativeGrade: 1.5 },
      { day: 'Nov 10 (Uni)', coins: 45, cumulativeGrade: 2.25 },
      { day: 'Nov 11 (Lane)', coins: 62, cumulativeGrade: 3.1 },
      { day: 'Nov 12 (Art)', coins: 79, cumulativeGrade: 3.95 },
    ],
  },
  // Room 15 (Single Occupancy)
  {
    id: 's29',
    name: 'Tan Jun Sen Ikko',
    avatar: '🧑🏻‍🍳',
    squad: 'Team Maglev',
    coins: 65,
    questsCompleted: 4,
    roomNumber: 'Room 15 (Single)',
    attendanceStatus: 'present',
    coinHistory: [
      { day: 'Nov 8 (Arr)', coins: 10, cumulativeGrade: 0.5 },
      { day: 'Nov 9 (Tech)', coins: 20, cumulativeGrade: 1.0 },
      { day: 'Nov 10 (Uni)', coins: 35, cumulativeGrade: 1.75 },
      { day: 'Nov 11 (Lane)', coins: 50, cumulativeGrade: 2.5 },
      { day: 'Nov 12 (Art)', coins: 65, cumulativeGrade: 3.25 },
    ],
  },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'The Great Xiaolongbao Quest',
    category: 'Food',
    coins: 15,
    description: 'Taste authentic soup dumplings and order using Chinese phrases.',
    task: 'Take a photo of steaming soup dumplings with black vinegar & ginger from a local shop near Jing’An.',
    icon: '🥟',
    status: 'in_progress',
    badgeName: 'Soup Dumpling Sage',
    badgeLevel: 'Silver',
  },
  {
    id: 'q2',
    title: 'Maglev 300 km/h Speed Run',
    category: 'Navigation',
    coins: 20,
    description: 'Experience magnetic levitation from Pudong Airport to Longyang Road at up to 300 km/h.',
    task: 'Snap a selfie next to the on-board speed display showing 300 km/h.',
    icon: '🚅',
    status: 'in_progress',
    badgeName: 'Sonic Levitation',
    badgeLevel: 'Gold',
  },
  {
    id: 'q3',
    title: 'Bund Night Skyline Mastery',
    category: 'Culture',
    coins: 15,
    description: 'Capture the dual juxtaposition of colonial Puxi and futuristic Lujiazui.',
    task: 'Photograph the illuminated Oriental Pearl Tower & Shanghai Tower across the Huangpu River.',
    icon: '🌃',
    status: 'in_progress',
    badgeName: 'Huangpu Luminary',
    badgeLevel: 'Silver',
  },
  {
    id: 'q4',
    title: 'Shanghainese Slang Street Test',
    category: 'Culture',
    coins: 20,
    description: 'Learn and use 3 authentic local expressions with local shopkeepers.',
    task: 'Greet someone with "Nong Hao" (侬好) and say "Xie Xie Nong" (谢谢侬) when receiving change or goods.',
    icon: '🗣️',
    status: 'in_progress',
    badgeName: 'Dialect Dynamo',
    badgeLevel: 'Gold',
  },
  {
    id: 'q5',
    title: 'AI Robotics & Innovation Lab',
    category: 'Academic',
    coins: 25,
    description: 'Engage with engineers during the Pudong High-Tech Enterprise immersion.',
    task: 'Ask one insightful question during the robotics tech demo and summarize key takeaways in the journal.',
    icon: '🤖',
    status: 'locked',
    badgeName: 'Future Architect',
    badgeLevel: 'Mythic',
  },
  {
    id: 'q6',
    title: 'Metro Line 2 Master Navigator',
    category: 'Navigation',
    coins: 15,
    description: 'Navigate without ride-hailing from Jing’An Temple to Lujiazui independently.',
    task: 'Take a picture of the Metro Line 2 transfer sign and keep a record of your transit card or Alipay transport QR.',
    icon: '🚇',
    status: 'in_progress',
    badgeName: 'Subway Pathfinder',
    badgeLevel: 'Bronze',
  },
  {
    id: 'q7',
    title: 'Yu Garden Tea House Ceremony',
    category: 'Culture',
    coins: 20,
    description: 'Experience traditional Gongfu tea brewing in Old Shanghai.',
    task: 'Identify 3 differences between Longjing Green Tea and Tieguanyin Oolong Tea with the tea sommelier.',
    icon: '🍵',
    status: 'locked',
    badgeName: 'Gongfu Tea Scholar',
    badgeLevel: 'Gold',
  },
  {
    id: 'q8',
    title: 'Tianzifang Shikumen Art Hunt',
    category: 'Culture',
    coins: 15,
    description: 'Explore the labyrinth of 1930s lane houses converted into art studios.',
    task: 'Find a traditional Shikumen stone arch doorway and an independent local craftsman studio.',
    icon: '🎨',
    status: 'locked',
    badgeName: 'Lanehouse Sleuth',
    badgeLevel: 'Bronze',
  },
  {
    id: 'q9',
    title: 'Shanghai University Youth Network',
    category: 'Academic',
    coins: 20,
    description: 'Connect and build authentic cross-border friendships with local Shanghai university undergraduates.',
    task: 'Exchange contacts (WeChat ID or social handle) with at least 5 Shanghai university students during campus exchanges.',
    icon: '🤝',
    status: 'in_progress',
    badgeName: 'Campus Ambassador',
    badgeLevel: 'Gold',
  },
  {
    id: 'q10',
    title: 'Closing Ceremony Spotlight Showcase',
    category: 'Culture',
    coins: 15,
    description: 'Celebrate the journey by performing on stage in the Grand Farewell Gala.',
    task: 'Perform a talent, musical song, dance, acoustic set, or energetic group skit during the OIP Shanghai Closing Ceremony.',
    icon: '🎭',
    status: 'in_progress',
    badgeName: 'Gala Showstopper',
    badgeLevel: 'Gold',
  },
  {
    id: 'q11',
    title: 'AP Plaza Street Bargain Master',
    category: 'Culture',
    coins: 15,
    description: 'Haggle like a local at the Science & Tech AP Plaza gift market using practical Chinese.',
    task: 'Successfully negotiate a souvenir discount using phrases like "太贵了" or "便宜一点" and show receipt/item photo.',
    icon: '🛍️',
    status: 'in_progress',
    badgeName: 'Bargain Champion',
    badgeLevel: 'Silver',
  },
  {
    id: 'q12',
    title: 'SJTU Dragon Pose Creative Snapshot',
    category: 'Academic',
    coins: 10,
    description: 'Take an epic team commemorative picture with Shanghai engineering buddies.',
    task: 'Strike a collaborative DE engineering dragon formation pose with local students in front of the iconic campus gate or engineering library.',
    icon: '🐉',
    status: 'in_progress',
    badgeName: 'Dragon Alliance',
    badgeLevel: 'Bronze',
  },
];

export const ITINERARY: ItineraryDay[] = [
  {
    dayNumber: 1,
    date: 'Sun, 8 Nov 2026',
    title: 'Touchdown Shanghai & Basecamp Setup',
    theme: 'Arrival & Transit Immersion',
    dressCode: 'Comfortable Travel Casual & Warm Jacket',
    leadInCharge: 'Latasha & Ren ZhuoJing',
    highlights: ['Singapore Changi (SIN)', 'Pudong International Airport (PVG) Terminal 1', 'Maglev High Speed Train', 'Homeinn Plus Hotel Check-in', 'Welcome Dinner'],
    flightInfo: {
      airline: 'China Eastern Airlines',
      flightNumber: 'MU546',
      departureAirport: 'Singapore Changi (SIN)',
      departureTerminal: 'Terminal 3',
      departureTime: '10:10',
      arrivalAirport: 'Shanghai Pudong (PVG)',
      arrivalTerminal: 'Terminal 1',
      arrivalTime: '15:35',
      groupMeetingTime: '08:00 am',
      meetingLocation: 'Changi Airport (China Eastern check-in counter)',
      notes: 'Group roll call with Latasha. Have passport, arrival card & boarding pass ready.',
    },
    schedule: [
      { time: '08:00', event: 'Group meet at Changi Airport (check-in counter) — roll call with Latasha', location: 'Singapore Changi Airport (SIN)' },
      { time: '10:10', event: 'Depart Singapore (China Eastern MU546)', location: 'Changi Airport' },
      { time: '15:35', event: 'Arrive Shanghai Pudong Terminal 1 (+5 Coins check-in) — immigration & baggage', location: 'Shanghai Pudong Terminal 1', coinsAvailable: 5 },
      { time: '16:45', event: 'Maglev Experience to Longyang Road (+20 Coins) — PVG Maglev Station; connect Metro Line 2 -> Line 1 to Yanchang Rd', location: 'PVG Maglev Station', metroTip: 'Connect to Metro Line 2 -> Line 1 to Yanchang Rd', coinsAvailable: 20 },
      { time: '18:00', event: 'Hotel Check-in & Room Allocation — Homeinn Plus Hotel (Yanchang Middle Rd 302)', location: 'Homeinn Plus Hotel (Yanchang Middle Rd 302)', metroTip: 'Line 1 Yanchang Road Station' },
      { time: '19:30', event: 'Welcome Orientation & Shengjianbao Dinner (+10 Coins) — Jing\'An Food Street', location: 'Jing\'An Food Street', coinsAvailable: 10 },
      { time: '21:30', event: 'Daily Briefing & Safety Roll Call with Latasha — Hotel Lobby Conference Rm', location: 'Hotel Lobby Conference Rm' },
    ],
  },
  {
    dayNumber: 2,
    date: 'Mon, 9 Nov 2026',
    title: 'Pudong High-Tech & Megacity Skyline',
    theme: 'Innovation & Urban Density',
    dressCode: 'Smart Casual (Campus & Enterprise Ready)',
    leadInCharge: 'Ren ZhuoJing & Chua Yu Zhe',
    highlights: ['Zhangjiang High-Tech Park', 'Robotics & AI Center', 'Shanghai Tower 118F Deck', 'Lujiazui Walkway'],
    schedule: [
      { time: '08:30', event: 'Morning Roll Call & Metro Transit', location: 'Hotel Lobby', metroTip: 'Line 2: Jing’An -> Zhangjiang Hi-Tech' },
      { time: '09:30', event: 'Zhangjiang AI Enterprise Immersion & Demo', location: 'AI Future Hub', coinsAvailable: 25 },
      { time: '12:30', event: 'Tech Park Cafeteria Networking Lunch', location: 'Zhangjiang Canteen', coinsAvailable: 5 },
      { time: '14:30', event: 'Shanghai Tower Top Observatory (632m)', location: 'Lujiazui Financial Center', coinsAvailable: 15 },
      { time: '18:00', event: 'Dinner at Super Brand Mall Pudong', location: 'Lujiazui', metroTip: 'Line 2 directly back to Jing’An' },
    ],
  },
  {
    dayNumber: 3,
    date: 'Tue, 10 Nov 2026',
    title: 'University Exchange & Academic Symposium',
    theme: 'Higher Education & Youth Perspectives',
    dressCode: 'Formal Academic (Collar / Blazer)',
    leadInCharge: 'Latasha & Ren ZhuoJing',
    highlights: ['Fudan / SJTU Campus Tour', 'Guest Lecture on Smart City Design', 'Peer Student Workshop', 'University Night Market'],
    schedule: [
      { time: '08:15', event: 'Charter Bus Departure', location: 'Hotel Forecourt' },
      { time: '09:15', event: 'Welcome by Dean & Campus Architecture Walk', location: 'Guanghua Twin Towers' },
      { time: '10:30', event: 'Lecture: Shanghai Smart Mobility 2035', location: 'Lecture Hall 301', coinsAvailable: 20 },
      { time: '13:00', event: 'Cross-Cultural Student Hackathon & Group Sync', location: 'Design Thinking Lab', coinsAvailable: 15 },
      { time: '17:30', event: 'Daxue Road Student Creative Street Dinner', location: 'Daxue Rd, Yangpu' },
    ],
  },
  {
    dayNumber: 4,
    date: 'Wed, 11 Nov 2026',
    title: 'Heritage, Lane Houses & Urban Renewal',
    theme: 'Historic Architecture & Modern Placemaking',
    dressCode: 'Comfortable walking shoes (15,000+ steps)',
    leadInCharge: 'Ren ZhuoJing',
    highlights: ['Fuxing Park Morning Tai Chi', 'Former French Concession Trees', 'Tianzifang Shikumen Alleyways', 'Xintiandi Plaza'],
    schedule: [
      { time: '08:30', event: 'Morning Tai Chi Cultural Practice', location: 'Fuxing Park', coinsAvailable: 15 },
      { time: '10:00', event: 'Shikumen Architectural Preservation Tour', location: 'Sinan Mansions' },
      { time: '12:30', event: 'Local Shanghainese Noodles (Scallion Oil & Pork Chop)', location: 'Huaihai Middle Rd', coinsAvailable: 10 },
      { time: '14:30', event: 'Tianzifang Art & Artisan Quest Hunt', location: 'Tianzifang', coinsAvailable: 20 },
      { time: '18:30', event: 'Urban Planning Reflection Dinner', location: 'Xintiandi South Block' },
    ],
  },
  {
    dayNumber: 5,
    date: 'Thu, 12 Nov 2026',
    title: 'Art District M50 & The Bund Evening River Cruise',
    theme: 'Contemporary Arts & Riverfront Revitalization',
    dressCode: 'Smart Casual / Evening Windbreaker',
    leadInCharge: 'Chua Yu Zhe & Latasha',
    highlights: ['M50 Moganshan Art Hub', 'Suzhou Creek Waterfront Promenade', 'The Bund Historical Buildings', 'Huangpu Night Cruise'],
    schedule: [
      { time: '09:30', event: 'Contemporary Art Galleries & Graffiti Wall Walk', location: 'M50 Moganshan Rd', coinsAvailable: 15 },
      { time: '13:00', event: 'Suzhou Creek Heritage Warehouse Lunch', location: 'Creek District' },
      { time: '15:30', event: 'The Bund Architecture Deep Dive (Peace Hotel)', location: 'Waitan (The Bund)', coinsAvailable: 15 },
      { time: '19:00', event: 'VIP Huangpu River Cruise (Illuminated Skyline)', location: 'Shiliupu Pier', coinsAvailable: 20 },
    ],
  },
  {
    dayNumber: 6,
    date: 'Fri, 13 Nov 2026',
    title: 'Traditional Yu Garden & Grand Module Banquet',
    theme: 'Classical Heritage & Final Assessment Showcase',
    dressCode: 'Semi-Formal Evening Attire',
    leadInCharge: 'Latasha, Ren ZhuoJing & Chua Yu Zhe',
    highlights: ['Yu Garden Ming Dynasty Pavilions', 'Old Town Bazaar & Tea House', 'Module Group Presentation', 'Nanjing Rd / AP Plaza Souvenir Hunt', 'Awards & 5% Grade Reveal'],
    schedule: [
      { time: '09:00', event: 'Yu Garden Classical Rockeries & Pavilions', location: 'Yuyuan Old City', coinsAvailable: 15 },
      { time: '11:00', event: 'Gongfu Tea Ceremony Challenge', location: 'Huxinting Teahouse', coinsAvailable: 20 },
      { time: '14:30', event: 'Final OIP Group Presentations & Quest Showcase', location: 'Hotel Multi-purpose Room' },
      { time: '18:30', event: 'Last-minute Souvenirs & Tea Gifts (+15 Coins) — Nanjing Rd / AP Plaza', location: 'Nanjing Rd / AP Plaza', metroTip: 'Metro Line 2 to East Nanjing Rd / Science & Tech Museum (AP Plaza)', coinsAvailable: 15 },
      { time: '20:00', event: 'Grand Farewell Banquet & Grade Award Ceremony', location: 'Shanghai Classical Garden Dining', coinsAvailable: 25 },
      { time: '21:30', event: 'Daily Briefing & Safety Roll Call with Latasha', location: 'Hotel Lobby Conference Rm' },
    ],
  },
  {
    dayNumber: 7,
    date: 'Sat, 14 Nov 2026',
    title: 'Homeward Bound to Singapore (Flight MU565)',
    theme: 'Checkout, PVG Transit & Changi Arrival',
    dressCode: 'Comfortable Travel Wear',
    leadInCharge: 'Latasha & Chua Yu Zhe',
    highlights: ['Final Hotel Checkout', 'Transit to PVG Terminal 1', 'Flight MU565 to Singapore'],
    flightInfo: {
      airline: 'China Eastern Airlines',
      flightNumber: 'MU565',
      departureAirport: 'Shanghai Pudong (PVG)',
      departureTerminal: 'Terminal 1',
      departureTime: '14:30',
      arrivalAirport: 'Singapore Changi (SIN)',
      arrivalTerminal: 'Terminal 3',
      arrivalTime: 'approx. 19:50 (local time)',
      groupMeetingTime: '10:30 am (Hotel Lobby) / 11:30 am (PVG T1 Counter)',
      meetingLocation: 'Homeinn Plus Hotel Lobby (bus departure) & PVG Terminal 1 China Eastern Counter',
      notes: 'Strict check-in roll call with Latasha & Chua Yu Zhe. Max check-in luggage 23kg.',
    },
    schedule: [
      { time: '07:30', event: 'Breakfast & final packing', location: 'Homeinn Plus Hotel' },
      { time: '08:30', event: 'Room Inspection & Check-out — Homeinn Plus Hotel', location: 'Homeinn Plus Hotel' },
      { time: '09:00', event: 'Last-minute snacks & tea gifts near the hotel, Jing\'An (optional, no coins)', location: 'Jing\'An / Yanchang Rd Area', optional: true },
      { time: '10:30', event: 'Bus departure to PVG — Hotel Lobby (strict, roll call with Latasha & Chua Yu Zhe)', location: 'Homeinn Plus Hotel Lobby' },
      { time: '11:30', event: 'Arrive PVG Terminal 1 — group check-in at China Eastern counter', location: 'Shanghai Pudong Terminal 1' },
      { time: '14:30', event: 'Depart Shanghai (China Eastern MU565)', location: 'Shanghai Pudong Terminal 1' },
      { time: '19:50', event: 'approx. 19:50 Arrive Singapore Changi — final roll call before dismissal', location: 'Singapore Changi Airport (SIN)' },
    ],
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a0',
    author: 'Teo Seow Hian',
    role: 'Faculty-in-Charge',
    timestamp: 'Today at 07:30',
    title: '📢 Mandatory Deliverables for 1 LU & NYC AEP Grant',
    content: 'Students: Under Brightspace module "Homepage - DE_OIP (Shanghai)_NOV26", ensure you complete: 1) Pre-trip Safety Quiz & Dialogue Recording, 2) NYC Online Modules at learn.nyc.gov.sg (Asia Ready, Module 10, Language & Culture), and 3) Reflection (min. 80 words) in Brightspace + Post-trip NYC Survey (sent Nov 13). Tap the "Deliverables" button in the header!',
    priority: 'urgent',
  },
  {
    id: 'a1',
    author: 'Latasha',
    role: 'Class Rep',
    timestamp: 'Today at 08:00',
    title: 'Morning Roll Call at 08:30 sharp in Lobby!',
    content: 'Good morning everyone! Please remember your passport cards and keep your metro QR ready on WeChat/Alipay. We head to Pudong Zhangjiang Tech Park at 08:45.',
    priority: 'urgent',
  },
  {
    id: 'a2',
    author: 'Chua Yu Zhe',
    role: 'Treasurer',
    timestamp: 'Yesterday at 21:15',
    title: 'Group Meal Subsidies Distributed (¥120/pax)',
    content: 'All group meal claims for yesterday’s dinner have been refunded. Remember to send receipt photos directly to me or upload them via the Leader Desk.',
    priority: 'normal',
  },
  {
    id: 'a3',
    author: 'Ren ZhuoJing',
    role: 'Assis',
    timestamp: 'Yesterday at 19:40',
    title: 'Metro Line 1 Tip & Hotel Address Card',
    content: 'If anyone gets separated, take Metro Line 1 back to Yanchang Road station (延长路站). Show the taxi card saved in the Leader Desk or header to any cab driver.',
    priority: 'normal',
  },
];
