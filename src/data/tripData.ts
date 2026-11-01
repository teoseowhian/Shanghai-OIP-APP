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
  dressCode?: string;
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
    checkInType?: string;
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

export const STUDENTS_DATA: Student[] = INITIAL_STUDENTS;

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
    title: 'Maglev 300 km/h Speed Run (Optional Free-Time)',
    category: 'Navigation',
    coins: 20,
    description: 'Optional self-arranged exploration during personal free time: experience magnetic levitation at up to 300 km/h (not on official schedule).',
    task: 'Snap a selfie next to the on-board speed display showing 300 km/h during self-arranged transit.',
    icon: '🚅',
    status: 'in_progress',
    badgeName: 'Sonic Levitation',
    badgeLevel: 'Gold',
  },
  {
    id: 'q3',
    title: 'Oriental Pearl & Huangpu Cruise Skyline',
    category: 'Culture',
    coins: 15,
    description: 'Capture Shanghai’s blend of history and modernity from the Oriental Pearl TV Tower and Huangpu River cruise (Day 4 Cultural Visit).',
    task: 'Photograph the illuminated skyline from the Oriental Pearl TV Tower observation deck or during the Huangpu River Cruise.',
    icon: '🌃',
    status: 'in_progress',
    badgeName: 'Huangpu River Luminary',
    badgeLevel: 'Silver',
  },
  {
    id: 'q4',
    title: 'Shanghainese Slang Street Test',
    category: 'Culture',
    coins: 20,
    description: 'Learn and use authentic local expressions with local shopkeepers.',
    task: 'Greet someone with "Nong Hao" (侬好) and say "Xie Xie Nong" (谢谢侬) when receiving change or goods.',
    icon: '🗣️',
    status: 'in_progress',
    badgeName: 'Dialect Dynamo',
    badgeLevel: 'Gold',
  },
  {
    id: 'q5',
    title: 'ebm-papst & SJTU Green Engineering Pioneer',
    category: 'Academic',
    coins: 25,
    description: 'Engage with engineers on EC motor aerodynamics at ebm-papst and refrigeration research at SJTU.',
    task: 'Take a photo or note key engineering takeaways during the ebm-papst factory or SJTU Building Environment Lab visits.',
    icon: '⚡',
    status: 'in_progress',
    badgeName: 'Green Tech Pioneer',
    badgeLevel: 'Mythic',
  },
  {
    id: 'q6',
    title: 'Metro Navigation Pathfinder',
    category: 'Navigation',
    coins: 15,
    description: 'Navigate Shanghai’s public transit network using local metro QR or transportation cards.',
    task: 'Take a picture of a Shanghai Metro station platform or transfer signage and keep a record of your transit card or Alipay transport QR.',
    icon: '🚇',
    status: 'in_progress',
    badgeName: 'Subway Pathfinder',
    badgeLevel: 'Bronze',
  },
  {
    id: 'q7',
    title: 'Cultural Workshop: Chinese Calligraphy',
    category: 'Culture',
    coins: 15,
    description: 'Master Chinese calligraphy brushwork during the Day 6 Cultural Workshop at Shanghai University.',
    task: 'Write a Chinese character (e.g. 龙, 德, 和) with traditional brush and ink during the SHU Cultural Workshop.',
    icon: '🖌️',
    status: 'in_progress',
    badgeName: 'Ink Brush Master',
    badgeLevel: 'Silver',
  },
  {
    id: 'q8',
    title: 'Cultural Workshop: Taiji Mind-Body Balance',
    category: 'Culture',
    coins: 15,
    description: 'Learn fundamental Taiji breathing, internal martial arts stances, and physical coordination at SHU.',
    task: 'Participate in Cultural Workshop 1 — Taiji on Day 2 at Shanghai University.',
    icon: '🥋',
    status: 'in_progress',
    badgeName: 'Taiji Practitioner',
    badgeLevel: 'Silver',
  },
  {
    id: 'q9',
    title: 'Shanghai University Youth Network',
    category: 'Academic',
    coins: 20,
    description: 'Connect and build authentic cross-border friendships with local Shanghai University undergraduates.',
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
    description: 'Celebrate the journey by performing or sharing reflections in the Official Closing Ceremony hosted by NP.',
    task: 'Participate in a performance, talent presentation, or speech during the Day 6 Closing Ceremony hosted by NP.',
    icon: '🎭',
    status: 'in_progress',
    badgeName: 'Gala Showstopper',
    badgeLevel: 'Gold',
  },
  {
    id: 'q11',
    title: 'Shanghai Local Market Bargain Master',
    category: 'Culture',
    coins: 15,
    description: 'Practice everyday conversational Mandarin at a local market or shop using polite bargaining etiquette.',
    task: 'Successfully negotiate a souvenir discount using phrases like "多少钱" or "便宜一点" and show receipt/item photo.',
    icon: '🛍️',
    status: 'in_progress',
    badgeName: 'Bargain Champion',
    badgeLevel: 'Silver',
  },
  {
    id: 'q12',
    title: 'SJTU & ebm-papst Technical Inquiry',
    category: 'Academic',
    coins: 15,
    description: 'Pose an insightful technical question to research scientists or plant engineers during Day 3 Industry Visits.',
    task: 'Document an engineering inquiry regarding refrigeration cycles at SJTU or EC motor efficiency at ebm-papst.',
    icon: '🔬',
    status: 'in_progress',
    badgeName: 'Technical Inquirer',
    badgeLevel: 'Bronze',
  },
];

export const ITINERARY: ItineraryDay[] = [
  {
    dayNumber: 1,
    date: 'Sun, 8 Nov 2026',
    title: 'Arrival in Shanghai & Basecamp Check-in',
    theme: 'Arrival & Transit',
    dressCode: 'Ngee Ann Polytechnic Tee-Shirt',
    leadInCharge: 'Latasha (Class Rep) & Ren ZhuoJing (Assis)',
    highlights: [
      'Changi Airport Terminal 3',
      'Dress Code: NP Tee-Shirt',
      'Group Check-in 08:10 & Photo 08:40',
      'China Eastern MU546 to PVG Terminal 1',
      'SHU-CIE Airport Bus Transfer',
      'Homeinn Plus Hotel Check-in',
    ],
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
      meetingLocation: 'Changi Airport Terminal 3 (China Eastern check-in counter)',
      dressCode: 'Ngee Ann Polytechnic Tee-Shirt',
      notes: 'Meet at Changi Airport Dress Code: Ngee Ann Polytechnic Tee-Shirt. Group roll call with Latasha. Group Check-in at 8:10 am; Group Photo at 8:40 am. Direct flight MU546. After arrival, SHU-CIE bus transfer from PVG Terminal 1 to hotel.',
    },
    schedule: [
      {
        time: '08:00',
        event: 'Group meeting at Changi Airport Terminal 3 (China Eastern counter) — roll call',
        location: 'Singapore Changi Airport (SIN) Terminal 3',
        note: 'Meet at Changi Airport Dress Code: Ngee Ann Polytechnic Tee-Shirt. Roll call with Latasha.',
      },
      {
        time: '08:10',
        event: 'Group Check-in at China Eastern counter',
        location: 'Changi Airport Terminal 3 (China Eastern counter)',
      },
      {
        time: '08:40',
        event: 'Group Photo',
        location: 'Changi Airport Terminal 3 Departure Hall',
      },
      {
        time: '10:10',
        event: 'Depart Singapore, China Eastern MU546 (direct)',
        location: 'Changi Airport Terminal 3',
      },
      {
        time: '15:35',
        event: 'Arrive Shanghai Pudong (PVG) Terminal 1 — arrival of NP staff and students',
        location: 'Shanghai Pudong (PVG) Terminal 1',
        coinsAvailable: 5,
        checkInType: 'Arrival Check-in +5',
      },
      {
        time: 'Time TBC',
        event: 'After arrival: SHU-CIE bus from airport to hotel',
        location: 'PVG Terminal 1 Bus Bay to Homeinn Plus Hotel',
      },
      {
        time: 'Time TBC',
        event: "Check-in: Homeinn Plus Hotel, Yanchang Middle Road 302, Jing'An District, Shanghai 200070",
        location: "Homeinn Plus Hotel (Yanchang Middle Road 302, Jing'An District)",
      },
    ],
  },
  {
    dayNumber: 2,
    date: 'Mon, 9 Nov 2026',
    title: 'Shanghai University (SHU): Orientation, Taiji & AHRI Industry Talk',
    theme: 'China Overview, Cultural Arts & HVAC Industry Insights',
    dressCode: 'Smart casual for university and industry visits (comfortable clothes for Taiji workshop)',
    leadInCharge: 'Latasha (Class Rep) & Ren ZhuoJing (Assis)',
    highlights: [
      'Shanghai University (SHU)',
      'Icebreakers & Introduction to China (2-hr lecture)',
      'Cultural Workshop 1 — Taiji',
      'AHRI China Industry Talk (Ms Jenny)',
    ],
    schedule: [
      {
        time: 'Time TBC',
        event: 'Morning: Icebreakers & orientation with SHU host students; Introduction to China — history, geography, culture and business practices (2-hour lecture and activity)',
        location: 'Shanghai University (SHU)',
      },
      {
        time: 'Time TBC',
        event: 'Afternoon: Cultural Workshop 1 — Taiji',
        location: 'Shanghai University (SHU)',
        coinsAvailable: 5,
        checkInType: 'Cultural Spirit +5',
      },
      {
        time: '16:30–17:30',
        event: 'Industry partner talk by Ms Jenny, AHRI China',
        location: 'Shanghai University (SHU)',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Venue: SHU (all-day). Host: SHU-CIE.',
      },
    ],
  },
  {
    dayNumber: 3,
    date: 'Tue, 10 Nov 2026',
    title: 'Industry Visits: SJTU Cryogenics Lab & ebm-papst Motor',
    theme: 'Refrigeration Research & Precision Fan/Motor Engineering',
    dressCode: 'Smart casual for university and industry visits (closed-toe shoes for laboratory & factory)',
    leadInCharge: 'Ren ZhuoJing (Assis) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'SJTU Institute of Refrigeration and Cryogenics (Minhang)',
      'ebm-papst Motor (Shanghai) Co., Ltd. (Pudong)',
      'SHU Provided Transport',
    ],
    schedule: [
      {
        time: '10:00–12:00',
        event: 'Industry Visit 1: Shanghai Jiao Tong University (SJTU), Institute of Refrigeration and Cryogenics, School of Mechanical Engineering',
        location: '800 Dongchuan Road, Minhang District, Shanghai 200240 (上海市闵行区东川路800号 上海交通大学机械与动力工程学院制冷与低温工程研究所)',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
      },
      {
        time: '14:00–16:00',
        event: 'Industry Visit 2: ebm-papst Motor (Shanghai) Co., Ltd.',
        location: 'No. 1, 2 and 9, Lane 196, Yuntong Road, Pudong, Shanghai 201299',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Transport: provided by SHU.',
      },
    ],
  },
  {
    dayNumber: 4,
    date: 'Wed, 11 Nov 2026',
    title: 'Sustainability & Culture: Oriental Pearl Tower & Huangpu River Cruise',
    theme: 'Sustainability Planning, History & Modernity',
    dressCode: 'Comfortable walking shoes and a warm jacket (for river breeze on Huangpu cruise)',
    leadInCharge: 'Latasha (Class Rep) & Ren ZhuoJing (Assis)',
    highlights: [
      'Shanghai Urban Planning Exhibition Hall',
      'Oriental Pearl TV Tower',
      'Huangpu River Cruise',
      'SHU Student Buddy Groups (1 SHU : 5 NP)',
    ],
    schedule: [
      {
        time: 'Time TBC',
        event: 'Morning: Sustainability Visit 1 — Sustainability Planning in Shanghai, Shanghai Urban Planning Exhibition Hall',
        location: 'Shanghai Urban Planning Exhibition Hall, People\'s Square',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
      },
      {
        time: 'Time TBC',
        event: 'Afternoon & evening: Cultural Visit 1 — Shanghai\'s blend of history and modernity: Oriental Pearl TV Tower and Huangpu River cruise',
        location: 'Oriental Pearl TV Tower & Huangpu River Cruise Pier',
        note: 'Group setting: 1 SHU student buddy with 5 NP students. Transport: SHU-CIE.',
      },
    ],
  },
  {
    dayNumber: 5,
    date: 'Thu, 12 Nov 2026',
    title: 'Shanghai Disneyland: Specialized Back-Office Operations Visit',
    theme: 'Theme Park Operations & Specialised Facilities',
    dressCode: 'Smart casual for specialised industry visit (comfortable walking shoes)',
    leadInCharge: 'Latasha (Class Rep) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'Shanghai Disneyland Back-Office Operations',
      'Disneyland Afternoon (Time TBC)',
      'SHU-CIE Transport',
    ],
    schedule: [
      {
        time: 'Time TBC',
        event: 'Morning: Industry Visit 3 — Shanghai Disneyland back-office operations (specialised visit)',
        location: 'Shanghai Disneyland Back-Office Operations Facility',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Transport: SHU-CIE.',
      },
      {
        time: 'Time TBC',
        event: 'Afternoon: Time TBC',
        location: 'Shanghai Disney Resort',
        note: 'Transport: SHU-CIE.',
      },
    ],
  },
  {
    dayNumber: 6,
    date: 'Fri, 13 Nov 2026',
    title: 'Chinese Calligraphy Workshop & Official Closing Ceremony',
    theme: 'Cultural Workshop & Official Closing Ceremony',
    dressCode: 'Smart casual / semi-formal for Day 6 closing ceremony',
    leadInCharge: 'Latasha (Class Rep), Ren ZhuoJing (Assis) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'Cultural Workshop 2 — Chinese Calligraphy',
      'Closing Ceremony (hosted by NP)',
    ],
    schedule: [
      {
        time: 'Time TBC',
        event: 'Morning: Cultural Workshop 2 — Chinese Calligraphy',
        location: 'Shanghai University (SHU)',
        coinsAvailable: 5,
        checkInType: 'Cultural Spirit +5',
      },
      {
        time: 'Time TBC',
        event: 'Afternoon: Closing Ceremony (hosted by NP)',
        location: 'Official Closing Ceremony Venue (hosted by NP)',
      },
    ],
  },
  {
    dayNumber: 7,
    date: 'Sat, 14 Nov 2026',
    title: 'Homeward Bound to Singapore (China Eastern MU565)',
    theme: 'Check-out, SHU-CIE Airport Transport & Return Flight',
    dressCode: 'Comfortable travel wear for flight',
    leadInCharge: 'Latasha (Class Rep) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'Homeinn Plus Hotel Check-out',
      'SHU-CIE Transport to PVG Terminal 1',
      'Depart PVG Terminal 1 (China Eastern MU565)',
      'Arrive Singapore Changi',
    ],
    flightInfo: {
      airline: 'China Eastern Airlines',
      flightNumber: 'MU565',
      departureAirport: 'Shanghai Pudong (PVG)',
      departureTerminal: 'Terminal 1',
      departureTime: '14:30',
      arrivalAirport: 'Singapore Changi (SIN)',
      arrivalTerminal: 'Terminal 3',
      arrivalTime: 'approx. 19:50 (local time)',
      groupMeetingTime: 'Hotel departure: Time TBC (SHU-CIE transport)',
      meetingLocation: 'Homeinn Plus Hotel Lobby & PVG Terminal 1 China Eastern Counter',
      notes: 'Check-out, then SHU-CIE transport from hotel to airport (departure time from hotel: Time TBC). Strict roll call with Latasha & Chua Yu Zhe.',
    },
    schedule: [
      {
        time: 'Time TBC',
        event: 'Check-out, then SHU-CIE transport from hotel to airport (departure time from hotel: Time TBC)',
        location: 'Homeinn Plus Hotel to PVG Terminal 1',
        note: 'Transport: SHU-CIE.',
      },
      {
        time: '14:30',
        event: 'Depart PVG Terminal 1, China Eastern MU565',
        location: 'Shanghai Pudong (PVG) Terminal 1',
      },
      {
        time: 'approx. 19:50',
        event: 'approx. 19:50 Arrive Singapore Changi — final roll call before dismissal',
        location: 'Singapore Changi Airport (SIN) Terminal 3',
      },
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
    content: 'Good morning everyone! Please remember your passport cards and student passes. SHU-CIE transport departs on schedule for Shanghai University orientation, Taiji workshop and AHRI talk.',
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
