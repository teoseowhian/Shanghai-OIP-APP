export interface Phrase {
  id: string;
  category: 'greetings' | 'dining' | 'transit' | 'shopping' | 'emergency';
  hanzi: string;
  pinyin: string;
  english: string;
  literalNote?: string;
  isShanghainese?: boolean;
  shanghaineseTip?: string;
  situationTip?: string;
}

export const PHRASE_CATEGORIES = [
  { id: 'all', label: 'All Phrases', labelZh: '全部短语', icon: '✨' },
  { id: 'greetings', label: 'Greetings', labelZh: '礼貌问候', icon: '👋' },
  { id: 'dining', label: 'Food & Dining', labelZh: '点餐美食', icon: '🥟' },
  { id: 'transit', label: 'Metro & Taxi', labelZh: '交通出行', icon: '🚇' },
  { id: 'shopping', label: 'Bargaining & Pay', labelZh: '购物砍价', icon: '🛍️' },
  { id: 'emergency', label: 'Help & Medical', labelZh: '求助急诊', icon: '🚨' },
] as const;

export const SHANGHAI_PHRASES: Phrase[] = [
  // 1. 问候与礼貌 (Greetings & Social)
  {
    id: 'p1',
    category: 'greetings',
    hanzi: '你好！',
    pinyin: 'Nǐ hǎo!',
    english: 'Hello!',
    situationTip: 'Universal standard greeting anytime, anywhere.',
  },
  {
    id: 'p2',
    category: 'greetings',
    hanzi: '侬好！',
    pinyin: 'Nóng hǎo!',
    english: 'Hello! (Shanghainese)',
    isShanghainese: true,
    shanghaineseTip: 'Shanghai local dialect for "Hello". Guaranteed to get a warm smile from shopkeepers and elders!',
  },
  {
    id: 'p3',
    category: 'greetings',
    hanzi: '谢谢！',
    pinyin: 'Xiè xie!',
    english: 'Thank you!',
    situationTip: 'Everyday gratitude for drivers, servers, and locals.',
  },
  {
    id: 'p4',
    category: 'greetings',
    hanzi: '谢谢侬！',
    pinyin: 'Xiè xie nóng!',
    english: 'Thank you very much! (Shanghainese)',
    isShanghainese: true,
    shanghaineseTip: 'Shanghainese phrase for "Thank you" (Nong = you). Bao\'s favorite phrase!',
  },
  {
    id: 'p5',
    category: 'greetings',
    hanzi: '不好意思，打扰一下。',
    pinyin: 'Bù hǎo yì si, dǎ rǎo yí xià.',
    english: 'Excuse me / Sorry to bother you.',
    situationTip: 'Use before asking directions or asking a server for assistance.',
  },
  {
    id: 'p6',
    category: 'greetings',
    hanzi: '结棍！',
    pinyin: 'Jié gùn!',
    english: 'Awesome / Impressive! (Shanghainese)',
    isShanghainese: true,
    shanghaineseTip: 'Super popular Shanghai slang meaning "super strong", "impressive", or "pro"!',
  },
  {
    id: 'p7',
    category: 'greetings',
    hanzi: '没搞头。',
    pinyin: 'Mè gǎo tóu.',
    english: 'No deal / Boring / Hopeless (Shanghainese)',
    isShanghainese: true,
    shanghaineseTip: 'Shanghainese colloquialism used humorously when something is uninteresting or pointless.',
  },
  {
    id: 'p8',
    category: 'greetings',
    hanzi: '再见！明天见。',
    pinyin: 'Zài jiàn! Míng tiān jiàn.',
    english: 'Goodbye! See you tomorrow.',
    situationTip: 'Saying goodbye to university exchange partners and instructors.',
  },

  // 2. 点餐与美食 (Dining & Food)
  {
    id: 'p9',
    category: 'dining',
    hanzi: '服务员，买单！',
    pinyin: 'Fú wù yuán, mǎi dān!',
    english: 'Waiter, check please!',
    situationTip: 'Standard phrase to ask for the bill at restaurants.',
  },
  {
    id: 'p10',
    category: 'dining',
    hanzi: '请给我一份小笼包和生煎包。',
    pinyin: 'Qǐng gěi wǒ yí fèn xiǎo lóng bāo hé shēng jiān bāo.',
    english: 'One order of soup dumplings and pan-fried pork buns, please.',
    situationTip: 'Essential Shanghai food breakfast/lunch order!',
  },
  {
    id: 'p11',
    category: 'dining',
    hanzi: '不要辣，少油少盐。',
    pinyin: 'Bú yào là, shǎo yóu shǎo yán.',
    english: 'Not spicy, less oil and less salt.',
    situationTip: 'Great if you have sensitive digestion or dietary preferences.',
  },
  {
    id: 'p12',
    category: 'dining',
    hanzi: '请问有热水吗？',
    pinyin: 'Qǐng wèn yǒu rè shuǐ ma?',
    english: 'Excuse me, do you have hot water?',
    situationTip: 'Restaurants in China always have hot drinking water upon request.',
  },
  {
    id: 'p13',
    category: 'dining',
    hanzi: '请问洗手间在哪里？',
    pinyin: 'Qǐng wèn xǐ shǒu jiān zài nǎ lǐ?',
    english: 'Excuse me, where is the restroom?',
    situationTip: 'Crucial phrase in restaurants, malls, and metro stations.',
  },
  {
    id: 'p14',
    category: 'dining',
    hanzi: '鲜得来眉毛掉下来！',
    pinyin: 'Xiān dé lái méi máo diào xià lái!',
    english: 'So delicious my eyebrows are falling off! (Shanghainese idiom)',
    isShanghainese: true,
    shanghaineseTip: 'Classic Shanghai foodie expression praising supreme umami (鲜 xiān) in dumplings or broth!',
  },
  {
    id: 'p15',
    category: 'dining',
    hanzi: '请问这个里面有猪肉/花生吗？我对它过敏。',
    pinyin: 'Qǐng wèn zhè ge lǐ miàn yǒu zhū ròu / huā shēng ma? Wǒ duì tā guò mǐn.',
    english: 'Does this contain pork/peanuts? I am allergic to it.',
    situationTip: 'Important allergy & dietary phrase for food markets.',
  },
  {
    id: 'p16',
    category: 'dining',
    hanzi: '可以打包吗？',
    pinyin: 'Kě yǐ dǎ bāo ma?',
    english: 'Can I have this to go / take away?',
    situationTip: 'To pack leftover portions or snacks back to the hotel.',
  },

  // 3. 交通与出行 (Transit, Metro & Taxi)
  {
    id: 'p17',
    category: 'transit',
    hanzi: '师傅，请送我到静安区广中路809号。',
    pinyin: 'Shī fu, qǐng sòng wǒ dào Jìng\'ān Qū Guǎngzhōng Lù bābǎilíngjiǔ hào.',
    english: 'Driver, please take me to 809 Guangzhong Road, Jing\'An District (邮政编码: 200072).',
    situationTip: 'Show or read this to taxi/Didi drivers to return to our student basecamp at 809 Guangzhong Road!',
  },
  {
    id: 'p18',
    category: 'transit',
    hanzi: '阿里搭？',
    pinyin: 'Ǎ lǐ dā?',
    english: 'Where is it? (Shanghainese)',
    isShanghainese: true,
    shanghaineseTip: 'Shanghainese equivalent of "在哪儿" (Zài nǎr) - Where is it?',
  },
  {
    id: 'p19',
    category: 'transit',
    hanzi: '请问地铁1号线延长路站在哪个出口？',
    pinyin: 'Qǐng wèn dì tiě yī hào xiàn Yán cháng Lù zhàn zài nǎ ge chū kǒu?',
    english: 'Which exit for Metro Line 1 Yanchang Road Station, please?',
    situationTip: 'Asking metro station staff or street pedestrians near our hotel.',
  },
  {
    id: 'p20',
    category: 'transit',
    hanzi: '我要去外滩。请问往哪边走？',
    pinyin: 'Wǒ yào qù Wài tān. Qǐng wèn wǎng nǎ biān zǒu?',
    english: 'I want to go to The Bund. Which way should I walk?',
    situationTip: 'Navigating around East Nanjing Road to reach the iconic Huangpu riverfront.',
  },
  {
    id: 'p21',
    category: 'transit',
    hanzi: '请打表，谢谢。',
    pinyin: 'Qǐng dǎ biǎo, xiè xie.',
    english: 'Please run the meter, thank you.',
    situationTip: 'Ensure standard taxi meter fare when boarding a cab.',
  },
  {
    id: 'p22',
    category: 'transit',
    hanzi: '请问去浦东机场坐磁悬浮在哪里买票？',
    pinyin: 'Qǐng wèn qù Pǔ dōng Jī chǎng zuò Cí xuán fú zài nǎ lǐ mǎi piào?',
    english: 'Where can I buy tickets for the Maglev train to Pudong Airport?',
    situationTip: 'Useful at Longyang Road station when experiencing the 300 km/h Maglev.',
  },
  {
    id: 'p23',
    category: 'transit',
    hanzi: '在这里停一下，谢谢师傅。',
    pinyin: 'Zài zhè lǐ tíng yí xià, xiè xie shī fu.',
    english: 'Please stop right here, thank you driver.',
    situationTip: 'Telling a taxi/Didi driver to drop you off at a curb or intersection.',
  },
  {
    id: 'p24',
    category: 'transit',
    hanzi: '可以扫码进站吗？',
    pinyin: 'Kě yǐ sǎo mǎ jìn zhàn ma?',
    english: 'Can I scan a QR code to enter the station?',
    situationTip: 'Checking metro gantry scanning with Alipay/WeChat Transport QR.',
  },

  // 4. 购物与砍价 (Shopping & Payments)
  {
    id: 'p25',
    category: 'shopping',
    hanzi: '多少钱？',
    pinyin: 'Duō shao qián?',
    english: 'How much is it?',
    situationTip: 'Standard Mandarin price inquiry.',
  },
  {
    id: 'p26',
    category: 'shopping',
    hanzi: '多少钿？',
    pinyin: 'Duō shǎo tiē?',
    english: 'How much money? (Shanghainese)',
    isShanghainese: true,
    shanghaineseTip: 'Shanghai local dialect for asking price (Tiē = coin/money)!',
  },
  {
    id: 'p27',
    category: 'shopping',
    hanzi: '太贵了！便宜一点可以吗？',
    pinyin: 'Tài guì le! Pián yi yì diǎn kě yǐ ma?',
    english: 'Too expensive! Can you make it a bit cheaper?',
    situationTip: 'Classic bargaining line at AP Plaza market or souvenir stalls.',
  },
  {
    id: 'p28',
    category: 'shopping',
    hanzi: '可以微信或者支付宝付款吗？',
    pinyin: 'Kě yǐ Wēi xìn huò zhě Zhī fù bǎo fù kuǎn ma?',
    english: 'Can I pay with WeChat Pay or Alipay?',
    situationTip: 'Digital payment is the primary accepted currency in Shanghai.',
  },
  {
    id: 'p29',
    category: 'shopping',
    hanzi: '我再看看，谢谢。',
    pinyin: 'Wǒ zài kàn kan, xiè xie.',
    english: 'I will look around a bit more, thank you.',
    situationTip: 'Polite way to walk away when a seller is pushing a sale.',
  },
  {
    id: 'p30',
    category: 'shopping',
    hanzi: '可以给我开发票或者收据吗？',
    pinyin: 'Kě yǐ gěi wǒ kāi fā piào huò zhě shōu jù ma?',
    english: 'Could you give me an official tax invoice (fapiao) or receipt?',
    situationTip: 'Essential for Treasurer Chua Yu Zhe\'s meal fund and module expense claims!',
  },
  {
    id: 'p31',
    category: 'shopping',
    hanzi: '如果我买两个，能打折吗？',
    pinyin: 'Rú guǒ wǒ mǎi liǎng ge, néng dǎ zhé ma?',
    english: 'If I buy two, can I get a discount?',
    situationTip: 'Great technique for group souvenir shopping with teammates.',
  },

  // 5. 紧急求助与健康 (Emergency, Help & Health)
  {
    id: 'p32',
    category: 'emergency',
    hanzi: '救命！请帮帮我！',
    pinyin: 'Jiù mìng! Qǐng bāng bang wǒ!',
    english: 'Help! Please help me!',
    situationTip: 'Urgent distress shout for immediate danger or emergency.',
  },
  {
    id: 'p33',
    category: 'emergency',
    hanzi: '我迷路了，我和团队走散了。',
    pinyin: 'Wǒ mí lù le, wǒ hé tuán duì zǒu sàn le.',
    english: 'I am lost, I got separated from my school group.',
    situationTip: 'Tell police or mall security if separated during site visits.',
  },
  {
    id: 'p34',
    category: 'emergency',
    hanzi: '请帮我叫救护车，有人受伤了。',
    pinyin: 'Qǐng bāng wǒ jiào jiù hù chē, yǒu rén shòu shāng le.',
    english: 'Please call an ambulance for me, someone is injured.',
    situationTip: 'Emergency medical call (Dial 120 in China).',
  },
  {
    id: 'p35',
    category: 'emergency',
    hanzi: '请问附近有药店吗？我头痛/胃痛。',
    pinyin: 'Qǐng wèn fù jìn yǒu yào diàn ma? Wǒ tóu tòng / wèi tòng.',
    english: 'Is there a pharmacy nearby? I have a headache / stomachache.',
    situationTip: 'Locating over-the-counter medicine for travel discomfort.',
  },
  {
    id: 'p36',
    category: 'emergency',
    hanzi: '这是我的学生领队电话，可以借手机打个电话吗？',
    pinyin: 'Zhè shì wǒ de xué sheng lǐng duì diàn huà, kě yǐ jiè shǒu jī dǎ ge diàn huà ma?',
    english: 'This is my student leader\'s number, could I borrow your phone to call?',
    situationTip: 'If your battery runs flat or SIM loses roaming connection.',
  },
  {
    id: 'p37',
    category: 'emergency',
    hanzi: '我听不太懂，您能说慢一点吗？',
    pinyin: 'Wǒ tīng bú tài dǒng, nín néng shuō màn yì diǎn ma?',
    english: 'I don\'t understand well, could you speak a little slower?',
    situationTip: 'Helpful when locals speak rapid native Mandarin or Shanghainese.',
  },
  {
    id: 'p38',
    category: 'emergency',
    hanzi: '请问这里有会说英语的人吗？',
    pinyin: 'Qǐng wèn zhè lǐ yǒu huì shuō Yīng yǔ de rén ma?',
    english: 'Excuse me, is there someone here who can speak English?',
    situationTip: 'Useful in international hotels, airports, or academic campus offices.',
  },
];

// Interactive Quiz Questions Pool
export interface QuizQuestion {
  id: string;
  type: 'en_to_pinyin' | 'pinyin_to_hanzi' | 'scenario';
  prompt: string;
  subPrompt?: string;
  audioText: string;
  options: {
    text: string;
    subText?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'en_to_pinyin',
    prompt: 'How do you say "Thank you" in standard Mandarin?',
    subPrompt: 'Choose the correct Hanzi & Pinyin:',
    audioText: '谢谢！',
    options: [
      { text: '谢谢！', subText: 'Xiè xie!', isCorrect: true },
      { text: '你好！', subText: 'Nǐ hǎo!', isCorrect: false },
      { text: '再见！', subText: 'Zài jiàn!', isCorrect: false },
      { text: '没搞头。', subText: 'Mè gǎo tóu.', isCorrect: false },
    ],
    explanation: '“谢谢 (Xiè xie)” is standard Mandarin for "Thank you". In Shanghainese, locals say “谢谢侬 (Xiè xie nóng)”!',
  },
  {
    id: 'q2',
    type: 'scenario',
    prompt: 'You are at a local restaurant and finished eating. How do you ask for the check?',
    subPrompt: 'Choose the natural dining expression:',
    audioText: '服务员，买单！',
    options: [
      { text: '服务员，买单！', subText: 'Fú wù yuán, mǎi dān!', isCorrect: true },
      { text: '阿里搭？', subText: 'Ǎ lǐ dā?', isCorrect: false },
      { text: '多少钿？', subText: 'Duō shǎo tiē?', isCorrect: false },
      { text: '不要辣！', subText: 'Bú yào là!', isCorrect: false },
    ],
    explanation: '“服务员，买单！ (Fú wù yuán, mǎi dān!)” means "Waiter, check please!".',
  },
  {
    id: 'q3',
    type: 'pinyin_to_hanzi',
    prompt: 'Which Shanghai dialect phrase means "Awesome / Very strong"?',
    subPrompt: 'Pinyin: "Jié gùn!"',
    audioText: '结棍！',
    options: [
      { text: '结棍！', subText: 'Awesome / Impressive (Shanghainese)', isCorrect: true },
      { text: '侬好！', subText: 'Hello', isCorrect: false },
      { text: '救命！', subText: 'Help!', isCorrect: false },
      { text: '阿里搭！', subText: 'Where is it?', isCorrect: false },
    ],
    explanation: '“结棍 (Jié gùn)” is famous Shanghainese slang praising someone for being awesome or doing a super job!',
  },
  {
    id: 'q4',
    type: 'scenario',
    prompt: 'You are shopping at AP Plaza market and want to ask "Too expensive! Can you make it cheaper?"',
    subPrompt: 'Select the best bargaining phrase:',
    audioText: '太贵了！便宜一点可以吗？',
    options: [
      { text: '太贵了！便宜一点可以吗？', subText: 'Tài guì le! Pián yi yì diǎn kě yǐ ma?', isCorrect: true },
      { text: '可以微信付款吗？', subText: 'Can I pay with WeChat?', isCorrect: false },
      { text: '我要去外滩。', subText: 'I want to go to The Bund.', isCorrect: false },
      { text: '请问有热水吗？', subText: 'Do you have hot water?', isCorrect: false },
    ],
    explanation: '“太贵了！便宜一点可以吗？ (Tài guì le! Pián yi yì diǎn kě yǐ ma?)” is the polite but effective bargaining staple.',
  },
  {
    id: 'q5',
    type: 'scenario',
    prompt: 'You need to return to DE Group 2 Basecamp hotel. Which address do you tell your taxi driver?',
    subPrompt: 'Choose the correct hotel address:',
    audioText: '静安区广中路809号',
    options: [
      { text: '静安区广中路809号 (邮编: 200072)', subText: '809 Guangzhong Rd, Jing\'An District', isCorrect: true },
      { text: '万航渡路829号', subText: 'Old location', isCorrect: false },
      { text: '浦东机场磁悬浮站', subText: 'PVG Airport Maglev Station', isCorrect: false },
      { text: '上海交通大学闵行校区', subText: 'SJTU Campus', isCorrect: false },
    ],
    explanation: 'Our hotel basecamp is at 809 Guangzhong Road, Jing\'An District, Shanghai (上海市静安区广中路809号 邮政编码: 200072)!',
  },
  {
    id: 'q6',
    type: 'en_to_pinyin',
    prompt: 'How do locals ask "How much money?" in Shanghainese?',
    subPrompt: 'Select the authentic local dialect question:',
    audioText: '多少钿？',
    options: [
      { text: '多少钿？', subText: 'Duō shǎo tiē?', isCorrect: true },
      { text: '多少钱？', subText: 'Duō shao qián? (Standard Mandarin)', isCorrect: false },
      { text: '打扰一下。', subText: 'Excuse me.', isCorrect: false },
      { text: '可以打包吗？', subText: 'Can I take it away?', isCorrect: false },
    ],
    explanation: '“多少钿 (Duō shǎo tiē)” uses the traditional character “钿” (money/coin) in Shanghainese!',
  },
  {
    id: 'q7',
    type: 'scenario',
    prompt: 'You cannot eat spicy food and need less oil and salt. What should you tell the chef?',
    subPrompt: 'Choose the healthy dietary request:',
    audioText: '不要辣，少油少盐。',
    options: [
      { text: '不要辣，少油少盐。', subText: 'Bú yào là, shǎo yóu shǎo yán.', isCorrect: true },
      { text: '可以给我开发票吗？', subText: 'Can you give me an invoice?', isCorrect: false },
      { text: '鲜得来眉毛掉下来！', subText: 'So tasty eyebrows fall off!', isCorrect: false },
      { text: '我要去外滩。', subText: 'I want to go to The Bund.', isCorrect: false },
    ],
    explanation: '“不要辣，少油少盐 (Bú yào là, shǎo yóu shǎo yán)” is universally respected by chefs across Shanghai.',
  },
  {
    id: 'q8',
    type: 'scenario',
    prompt: 'You accidentally get separated from your group at a crowded attraction. What do you say to police/staff?',
    subPrompt: 'Select the emergency explanation:',
    audioText: '我迷路了，我和团队走散了。',
    options: [
      { text: '我迷路了，我和团队走散了。', subText: 'Wǒ mí lù le, wǒ hé tuán duì zǒu sàn le.', isCorrect: true },
      { text: '救命！请帮帮我！', subText: 'Help! Please help me! (Extreme danger shout)', isCorrect: false },
      { text: '再见！明天见。', subText: 'Goodbye, see you tomorrow.', isCorrect: false },
      { text: '请打表，谢谢。', subText: 'Please run the meter.', isCorrect: false },
    ],
    explanation: '“我迷路了，我和团队走散了” clearly communicates that you need reunion with your school immersion tour group.',
  },
];
