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
    description: 'Master Chinese calligraphy brushwork during the Day 4 Cultural Workshop at Shanghai University (The 2nd floor of CIE).',
    task: 'Write a Chinese character (e.g. 龙, 德, 和) with traditional brush and ink during the Day 4 SHU Cultural Workshop (The 2nd floor of CIE).',
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
    description: 'Learn fundamental Taiji breathing, internal martial arts stances, and physical coordination at SHU (Day 2: 14:30–16:00).',
    task: 'Participate in Cultural Workshop 1 — Taiji on Day 2 afternoon (14:30–16:00) at Shanghai University.',
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
    description: 'Celebrate the journey in the Official Closing Ceremony (Day 6: 13:30–14:00 at The 3rd floor of CIE).',
    task: 'Participate in a performance, reflection presentation, or ceremony speech during the Day 6 Closing Ceremony at CIE (3rd Floor).',
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
    theme: 'Arrival & Airport Transfer',
    dressCode: 'Ngee Ann Polytechnic Tee-Shirt',
    leadInCharge: 'Latasha (Class Rep) & Ren ZhuoJing (Assis)',
    highlights: [
      'Changi Airport Terminal 3',
      'Dress Code: NP Tee-Shirt',
      'Group Check-in 08:10 & Photo 08:40',
      'China Eastern MU546 (10:10–15:15 PVG-T1)',
      'SHU-CIE Airport Bus Transfer',
      'Hotel Check-in (809 Guangzhong Rd)',
    ],
    flightInfo: {
      airline: 'China Eastern Airlines',
      flightNumber: 'MU546',
      departureAirport: 'Singapore Changi (SIN)',
      departureTerminal: 'Terminal 3',
      departureTime: '10:10',
      arrivalAirport: 'Shanghai Pudong (PVG)',
      arrivalTerminal: 'Terminal 1',
      arrivalTime: '15:15',
      groupMeetingTime: '08:00 am',
      meetingLocation: 'Changi Airport Terminal 3 (China Eastern check-in counter)',
      dressCode: 'Ngee Ann Polytechnic Tee-Shirt',
      notes: 'Meet at Changi Airport Dress Code: Ngee Ann Polytechnic Tee-Shirt. Group roll call with Latasha. Group Check-in at 8:10 am; Group Photo at 8:40 am. Direct flight MU546 (10:10–15:15 PVG-T1). After arrival, SHU-CIE bus transfer from PVG Terminal 1 to hotel (809 Guangzhong Rd).',
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
        time: '15:15',
        event: 'Arrival of NP staff and students at Shanghai Pudong Airport (PVG-T1)',
        location: 'Shanghai Pudong (PVG) Terminal 1',
        coinsAvailable: 5,
        checkInType: 'Arrival Check-in +5',
        note: 'Flight MU546, 10:10–15:15 PVG-T1',
      },
      {
        time: 'After arrival',
        event: 'SHU-CIE bus from airport to hotel',
        location: 'PVG Terminal 1 Bus Bay to Hotel (809 Guangzhong Rd, Jing\'An)',
      },
      {
        time: 'Check-in',
        event: "Check-in: Hotel at 809 Guangzhong Rd, Jing An Qu, Shang Hai Shi, China, 200072 (上海市静安区广中路809号 邮政编码: 200072)",
        location: "809 Guangzhong Rd, Jing An Qu, Shang Hai Shi (上海市静安区广中路809号)",
      },
    ],
  },
  {
    dayNumber: 2,
    date: 'Mon, 9 Nov 2026',
    title: 'Shanghai University (SHU): Orientation, ID Photos, Taiji & AHRI Talk',
    theme: 'CIE Orientation, China Introduction, Taiji & Industry Talk',
    dressCode: 'Smart casual for university and industry visits (comfortable clothes for Taiji workshop)',
    leadInCharge: 'Latasha (Class Rep) & Ren ZhuoJing (Assis)',
    highlights: [
      'The 3rd Floor of CIE (SHU)',
      'Orientation (09:00–09:30)',
      'ID Photo Taking (09:30–10:00)',
      'Introduction to the Host Country (10:00–11:30)',
      'Cultural Workshop 1 — Taiji (14:30–16:00)',
      'Industrial Partner Talk by AHRI (16:30–17:30)',
    ],
    schedule: [
      {
        time: '09:00–09:30',
        event: 'Orientation',
        location: 'The 3rd floor of CIE, Shanghai University',
        note: 'Welcome and briefing by SHU College of International Exchange (CIE) hosts.',
      },
      {
        time: '09:30–10:00',
        event: 'ID Photo taking',
        location: 'The 3rd floor of CIE, Shanghai University',
        note: 'Official student immersion identification pass photography.',
      },
      {
        time: '10:00–11:30',
        event: 'Introduction to the host country',
        location: 'The 3rd floor of CIE, Shanghai University',
        note: 'Lecture and activity on China history, geography, culture, and business practices.',
      },
      {
        time: '14:30–16:00',
        event: 'Cultural Workshop 1 — Taiji',
        location: 'Shanghai University (SHU)',
        coinsAvailable: 5,
        checkInType: 'Cultural Spirit +5',
        note: 'Fundamental Taiji martial arts movements and breath coordination.',
      },
      {
        time: '16:30–17:30',
        event: 'Industrial Partner talk by AHRI',
        location: 'The 3rd floor of CIE, Shanghai University',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Industry insights session by Ms Jenny, AHRI China.',
      },
    ],
  },
  {
    dayNumber: 3,
    date: 'Tue, 10 Nov 2026',
    title: 'Industry Visits: SJTU Cryogenics Lab & ebm-papst Motor',
    theme: 'Refrigeration Engineering & Precision Fan Aerodynamics',
    dressCode: 'Smart casual for university and industry visits (closed-toe shoes for laboratory & factory)',
    leadInCharge: 'Ren ZhuoJing (Assis) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'Departure Time: 08:15 Hotel Lobby',
      'SJTU Institute of Refrigeration and Cryogenics',
      'ebm-papst Motor (Shanghai) Co., Ltd.',
      'Transport Provided by SHU',
    ],
    schedule: [
      {
        time: '08:15',
        event: 'Departure Time: 8:15 Hotel Lobby',
        location: 'Hotel Lobby (809 Guangzhong Rd)',
        note: 'Strict departure time: 8:15 am. Transport provided by SHU.',
      },
      {
        time: '10:00–12:00',
        event: 'Industry Visit 1: Shanghai Jiao Tong University (SJTU)',
        location: '上海市闵行区东川路800号 上海交通大学机械与动力工程学院制冷与低温工程研究所 (800 Dongchuan Road, Minhang District, Shanghai 200240)',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Institute of Refrigeration and Cryogenics, School of Mechanical Engineering.',
      },
      {
        time: '14:00–16:00',
        event: 'Industry Visit 2: ebm-papst Motor (Shanghai) Co., Ltd.',
        location: 'No. 1, 2 and 9, Lane 196, Yuntong Road, Pudong, 201299 Shanghai, China (Representation Address)',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Precision EC motor engineering, fan aerodynamics, cleanroom air systems.',
      },
    ],
  },
  {
    dayNumber: 4,
    date: 'Wed, 11 Nov 2026',
    title: 'Chinese Calligraphy, Oriental Pearl TV Tower & River Cruise',
    theme: 'Calligraphy Workshop & Iconic Shanghai Skyline',
    dressCode: 'Comfortable walking shoes and a warm jacket (for river breeze on Huangpu cruise)',
    leadInCharge: 'Latasha (Class Rep) & Ren ZhuoJing (Assis)',
    highlights: [
      'Chinese Calligraphy (The 2nd floor of CIE, 09:30–11:00)',
      'Oriental Pearl TV Tower & Huangpu River cruise (12:30–17:00)',
      'Group Setting: 1 SHU buddy : 5 NP students',
      'Transport: SHU-CIE',
    ],
    schedule: [
      {
        time: '09:30–11:00',
        event: 'Chinese Calligraphy',
        location: 'The 2nd floor of CIE, Shanghai University',
        coinsAvailable: 5,
        checkInType: 'Cultural Spirit +5',
        note: 'Mastering traditional ink brush techniques, character balance, and cultural art.',
      },
      {
        time: '12:30–17:00',
        event: 'Oriental Pearl TV Tower & Huangpu River cruise',
        location: 'Oriental Pearl TV Tower & Huangpu River Cruise Pier',
        note: 'Group setting: 1 SHU student buddy with 5 NP students. Transport: SHU-CIE.',
      },
    ],
  },
  {
    dayNumber: 5,
    date: 'Thu, 12 Nov 2026',
    title: 'Shanghai Disneyland: Specialized Backoffice Operation Visit',
    theme: 'Specialized Operations & Facility Management',
    dressCode: 'Smart casual for specialised industry visit (comfortable walking shoes)',
    leadInCharge: 'Latasha (Class Rep) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'Specialized visit – Disneyland Backoffice Operation',
      'Disneyland Afternoon (Time TBC)',
      'Transport: SHU-CIE',
    ],
    schedule: [
      {
        time: 'Morning',
        event: 'Specialized visit – Disneyland Backoffice Operation',
        location: 'Shanghai Disneyland Back-Office Operations Facility',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Ride safety interlocks, sensor redundancy, crowd logistics, and facility management. Transport: SHU-CIE.',
      },
      {
        time: 'Afternoon',
        event: 'Shanghai Disney Resort Operations & Free Exploration',
        location: 'Shanghai Disney Resort',
        note: 'Transport: SHU-CIE.',
      },
    ],
  },
  {
    dayNumber: 6,
    date: 'Fri, 13 Nov 2026',
    title: 'Shanghai Urban Planning Exhibition Hall & Closing Ceremony',
    theme: 'Shanghai 2035 Master Plan & Official Closing Ceremony',
    dressCode: 'Smart casual / semi-formal for Day 6 closing ceremony',
    leadInCharge: 'Latasha (Class Rep), Ren ZhuoJing (Assis) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'Departure Time: 09:00 Hotel Lobby',
      'Visit to Shanghai Urban Planning Exhibition Hall (09:30–11:30)',
      'Closing Ceremony (13:30–14:00 at The 3rd floor of CIE)',
    ],
    schedule: [
      {
        time: '09:00',
        event: 'Departure Time: 9:00 Hotel Lobby',
        location: 'Hotel Lobby (809 Guangzhong Rd)',
        note: 'Prompt departure at 9:00 am. Transport: SHU-CIE.',
      },
      {
        time: '09:30–11:30',
        event: 'Visit to Shanghai Urban Planning Exhibition Hall',
        location: 'Shanghai Urban Planning Exhibition Hall, People\'s Square',
        coinsAvailable: 5,
        checkInType: 'Industry Inquiry +5',
        note: 'Sustainability planning in Shanghai, 3D scale master model, smart mobility.',
      },
      {
        time: '13:30–14:00',
        event: 'Closing Ceremony',
        location: 'The 3rd floor of CIE, Shanghai University',
        note: 'Official Closing Ceremony and certificate presentation hosted by SHU-CIE & NP.',
      },
    ],
  },
  {
    dayNumber: 7,
    date: 'Sat, 14 Nov 2026',
    title: 'Depart for Singapore (China Eastern MU565)',
    theme: 'Hotel Check-out & Flight to Singapore',
    dressCode: 'Comfortable travel wear for flight',
    leadInCharge: 'Latasha (Class Rep) & Chua Yu Zhe (Treasurer)',
    highlights: [
      'Hotel Check-out (809 Guangzhong Rd)',
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
      meetingLocation: 'Hotel Lobby (809 Guangzhong Rd) & PVG Terminal 1 China Eastern Counter',
      notes: 'Check-out, then SHU-CIE transport from hotel (809 Guangzhong Rd) to airport (departure time from hotel: Time TBC). Strict roll call with Latasha & Chua Yu Zhe.',
    },
    schedule: [
      {
        time: 'Time TBC',
        event: 'Check-out, then SHU-CIE transport from hotel to airport (departure time from hotel: Time TBC)',
        location: 'Hotel (809 Guangzhong Rd, Jing\'An) to PVG Terminal 1',
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
    content: 'If anyone gets separated, take Metro Line 1 back to Guangzhong Road / Yanchang area. Show the taxi card saved in the Leader Desk or header (809 Guangzhong Rd) to any cab driver.',
    priority: 'normal',
  },
];
