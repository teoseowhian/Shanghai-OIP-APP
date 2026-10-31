import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  BookOpen,
  Trophy,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Info,
  Flame,
  Turtle,
  Play,
  HelpCircle,
  Award,
} from 'lucide-react';
import {
  SHANGHAI_PHRASES,
  PHRASE_CATEGORIES,
  Phrase,
  QUIZ_QUESTIONS,
  QuizQuestion,
} from '../data/phrasesData';
import { Student } from '../data/tripData';

interface PhrasebookViewProps {
  currentStudent: Student;
  onModifyCoins: (studentId: string, delta: number, reason: string) => void;
}

export const PhrasebookView: React.FC<PhrasebookViewProps> = ({
  currentStudent,
  onModifyCoins,
}) => {
  // Navigation between Phrasebook and Quiz
  const [activeMode, setActiveMode] = useState<'phrasebook' | 'quiz'>('phrasebook');

  // Search & Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showShanghaineseOnly, setShowShanghaineseOnly] = useState<boolean>(false);

  // Audio Speech Synthesis state
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // 1.0 or 0.75 for slow
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Daily Challenge State (3 phrases to practice)
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`daily_phrase_claimed_${currentStudent.id}`);
      return saved === new Date().toISOString().slice(0, 10);
    } catch {
      return false;
    }
  });

  // Featured 3 Daily Challenge Phrases
  const dailyChallengePhrases = [
    SHANGHAI_PHRASES.find((p) => p.id === 'p2') || SHANGHAI_PHRASES[1], // 侬好
    SHANGHAI_PHRASES.find((p) => p.id === 'p10') || SHANGHAI_PHRASES[9], // 小笼包
    SHANGHAI_PHRASES.find((p) => p.id === 'p17') || SHANGHAI_PHRASES[16], // 延长中路302号酒店
  ];

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizCoinsClaimed, setQuizCoinsClaimed] = useState<boolean>(false);

  // Sync daily claimed status when current student changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`daily_phrase_claimed_${currentStudent.id}`);
      setDailyClaimed(saved === new Date().toISOString().slice(0, 10));
    } catch {
      setDailyClaimed(false);
    }
  }, [currentStudent.id]);

  // Web Speech API Pronunciation Handler
  const speakText = (text: string, phraseId?: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support Web Speech API audio playback.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any currently playing audio

    // Clean text of punctuation for cleaner pronunciation
    const cleanText = text.replace(/[!?,.，。！？]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-CN';
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick Chinese voice if available
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(
      (v) => v.lang.includes('zh') || v.lang.includes('cmn') || v.name.includes('Chinese')
    );
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    if (phraseId) {
      setIsSpeakingId(phraseId);
      // Mark as practiced for daily challenge
      setPracticedIds((prev) => new Set(prev).add(phraseId));
    }

    utterance.onend = () => {
      setIsSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyPhrase = (phrase: Phrase) => {
    const textToCopy = `${phrase.hanzi} (${phrase.pinyin}) - ${phrase.english}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Complete Daily Challenge & Award Coins
  const handleClaimDailyChallenge = () => {
    if (dailyClaimed) return;
    onModifyCoins(currentStudent.id, 5, 'Daily Phrase Challenge Completed (3 Phrases)');
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(`daily_phrase_claimed_${currentStudent.id}`, todayStr);
    } catch {}
    setDailyClaimed(true);
  };

  // Initialize Quiz
  const startQuiz = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuizQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setQuizCoinsClaimed(false);
    setActiveMode('quiz');
  };

  // Submit Answer
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIndex(idx);
    setIsAnswerSubmitted(true);

    const q = quizQuestions[currentQuestionIndex];
    if (q.options[idx].isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  // Next Question or Finish Quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // Claim Quiz Coins
  const handleClaimQuizCoins = () => {
    if (quizCoinsClaimed) return;
    // Award 2 coins per correct answer (up to +10 coins)
    const earnedCoins = Math.max(2, quizScore * 2);
    onModifyCoins(
      currentStudent.id,
      earnedCoins,
      `Survival Chinese Quiz Mastered (${quizScore}/5 correct)`
    );
    setQuizCoinsClaimed(true);
  };

  // Filtered Phrases
  const filteredPhrases = SHANGHAI_PHRASES.filter((phrase) => {
    const matchesCategory =
      selectedCategory === 'all' || phrase.category === selectedCategory;
    const matchesShanghainese =
      !showShanghaineseOnly || phrase.isShanghainese;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      phrase.hanzi.toLowerCase().includes(query) ||
      phrase.pinyin.toLowerCase().includes(query) ||
      phrase.english.toLowerCase().includes(query) ||
      (phrase.situationTip && phrase.situationTip.toLowerCase().includes(query));

    return matchesCategory && matchesShanghainese && matchesQuery;
  });

  const dailyProgress = dailyChallengePhrases.filter((p) =>
    practicedIds.has(p.id)
  ).length;

  return (
    <div className="space-y-6">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <span className="text-9xl select-none font-serif">侬</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Shanghai Immersion • Practical Chinese
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                🗣️ Web Speech Native Audio
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
                🪙 Earn 100 Coins = 5% Grade
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              生存短语手册 <span className="text-amber-400">Survival Phrasebook</span>
            </h2>

            <p className="text-sm text-slate-200 leading-relaxed">
              Master essential Shanghai street phrases, taxi addresses to Homeinn Plus Hotel, dining orders, and authentic Shanghainese (沪语) slang. Tap any card to hear standard audio pronunciation!
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveMode('phrasebook')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeMode === 'phrasebook'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 ring-2 ring-white/50 font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>短语手册 Phrasebook</span>
            </button>

            <button
              onClick={startQuiz}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeMode === 'quiz'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30 ring-2 ring-white/50 font-black'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md'
              }`}
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              <span>小测验挑战 Quiz (+10c)</span>
            </button>
          </div>
        </div>

        {/* Audio Controls Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="font-semibold text-white">Playback Speed:</span>
            <button
              onClick={() => setSpeechRate(1.0)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                speechRate === 1.0
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              1.0x Normal
            </button>
            <button
              onClick={() => setSpeechRate(0.7)}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                speechRate === 0.7
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
              title="Slower speech rate for clear tone distinction"
            >
              <Turtle className="w-3.5 h-3.5" />
              <span>0.7x Slow</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span>Learning as:</span>
            <span className="font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
              {currentStudent.avatar} {currentStudent.name} ({currentStudent.coins} Coins)
            </span>
          </div>
        </div>
      </div>

      {/* Daily Challenge Card (3 Phrases = +5 Coins) */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-3xl p-5 border-2 border-amber-200 shadow-md text-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                每日一句挑战 Daily Mission
              </span>
              <span className="text-xs font-bold text-slate-800">
                Reward: <strong className="text-emerald-900">+5 Quest Coins</strong>
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight">
              Practice Today's 3 Key Phrases to Earn Coins!
            </h3>
            <p className="text-xs text-slate-800">
              Listen to the 3 immersion phrases below. Once you've practiced, hit Claim to boost your ranking!
            </p>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3 shrink-0">
            {dailyClaimed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 text-white font-bold text-xs shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>今日打卡成功 (+5 Coins Claimed) 🎉</span>
              </div>
            ) : (
              <button
                onClick={handleClaimDailyChallenge}
                disabled={dailyProgress < 3}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md ${
                  dailyProgress >= 3
                    ? 'bg-slate-950 text-amber-300 hover:bg-slate-900 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-slate-950'
                    : 'bg-white/60 text-slate-500 cursor-not-allowed border border-amber-300'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>
                  {dailyProgress >= 3
                    ? '打卡领取 +5 金币 (Claim +5 Coins)'
                    : `Listen to 3 Phrases (${dailyProgress}/3)`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Featured Phrases Pills */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-amber-600/20">
          {dailyChallengePhrases.map((phrase) => {
            const hasListened = practicedIds.has(phrase.id);
            const isPlaying = isSpeakingId === phrase.id;

            return (
              <div
                key={phrase.id}
                onClick={() => speakText(phrase.hanzi, phrase.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                  isPlaying
                    ? 'bg-white text-slate-950 shadow-md border-slate-900 ring-2 ring-slate-950'
                    : hasListened
                    ? 'bg-amber-100/90 hover:bg-white text-slate-900 border-amber-300'
                    : 'bg-white/80 hover:bg-white text-slate-900 border-amber-200'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm truncate">{phrase.hanzi}</span>
                    {hasListened && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 truncate">{phrase.pinyin}</div>
                  <div className="text-[10px] text-slate-600 truncate">{phrase.english}</div>
                </div>

                <button
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isPlaying ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-amber-200 text-slate-800'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUIZ MODE COMPONENT */}
      {activeMode === 'quiz' ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          {!quizCompleted ? (
            <>
              {/* Quiz Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Score: <strong className="text-emerald-600">{quizScore}</strong> Correct
                  </span>
                </div>

                <button
                  onClick={() => setActiveMode('phrasebook')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Back to Phrasebook ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Current Question */}
              {quizQuestions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      {quizQuestions[currentQuestionIndex].subPrompt || 'Scenario Question'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                      {quizQuestions[currentQuestionIndex].prompt}
                    </h3>

                    {/* Audio Playback for question */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() =>
                          speakText(quizQuestions[currentQuestionIndex].audioText)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Listen to audio hint ({quizQuestions[currentQuestionIndex].audioText})</span>
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';

                      if (isAnswerSubmitted) {
                        if (opt.isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500';
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500';
                        } else {
                          btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`p-4 rounded-2xl border-2 text-left transition-all relative ${btnStyle} cursor-pointer`}
                        >
                          <div className="font-black text-base">{opt.text}</div>
                          {opt.subText && (
                            <div className="text-xs font-medium text-slate-600 mt-1">
                              {opt.subText}
                            </div>
                          )}

                          {isAnswerSubmitted && opt.isCorrect && (
                            <span className="absolute top-3 right-3 text-emerald-600 font-bold text-sm">
                              ✓ Correct
                            </span>
                          )}
                          {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                            <span className="absolute top-3 right-3 text-rose-600 font-bold text-sm">
                              ✕ Wrong
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation & Next Button */}
                  {isAnswerSubmitted && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 animate-in fade-in">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl">🐲</span>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">
                            Bao's Shanghai Tip:
                          </span>
                          <p className="text-xs text-slate-700 mt-0.5">
                            {quizQuestions[currentQuestionIndex].explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextQuestion}
                          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <span>
                            {currentQuestionIndex < quizQuestions.length - 1
                              ? 'Next Question'
                              : 'See Quiz Results'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 mx-auto flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300">
                🏆
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Quiz Completed!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  You scored <strong className="text-emerald-600 text-base">{quizScore} / {quizQuestions.length}</strong> on Shanghai Survival Chinese!
                </p>
              </div>

              {/* Coin Reward Banner */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-800">
                <span className="font-bold text-emerald-900 block text-sm">
                  Earned Quest Coins: +{Math.max(2, quizScore * 2)} Coins
                </span>
                <p className="text-xs text-emerald-700 mt-1">
                  Adds directly to {currentStudent.name}'s balance towards the 100 Coin (5.0%) module grade milestone!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                {!quizCoinsClaimed ? (
                  <button
                    onClick={handleClaimQuizCoins}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
                  >
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>Claim +{Math.max(2, quizScore * 2)} Coins</span>
                  </button>
                ) : (
                  <div className="px-6 py-3 rounded-2xl bg-slate-100 text-emerald-800 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Coins Claimed Successfully!</span>
                  </div>
                )}

                <button
                  onClick={startQuiz}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PHRASEBOOK MAIN VIEW */
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search phrases (e.g., 'hotel', 'dumpling', 'metro', 'nong hao', 'bill')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Shanghainese Filter Button */}
              <button
                onClick={() => setShowShanghaineseOnly((prev) => !prev)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  showShanghaineseOnly
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 ring-2 ring-rose-400'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <span>🥟 沪语彩蛋</span>
                <span>Shanghainese Only</span>
              </button>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PHRASE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">({cat.labelZh})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phrases Grid (Card Style with 3 Elements: Hanzi + Pinyin + English) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhrases.map((phrase) => {
              const isPlaying = isSpeakingId === phrase.id;
              const isCopied = copiedId === phrase.id;

              return (
                <div
                  key={phrase.id}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between group ${
                    isPlaying
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg scale-[1.01]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Header: Category Badge & Easter Egg indicator */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {phrase.category}
                      </span>

                      {phrase.isShanghainese && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <span>🥟 沪语彩蛋</span>
                        </span>
                      )}
                    </div>

                    {/* 3 Core Elements: 汉字 + 拼音（带声调）+ 英文 */}
                    {/* 1. 汉字 */}
                    <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-wide leading-snug">
                      {phrase.hanzi}
                    </div>

                    {/* 2. 拼音 (带声调) */}
                    <div className="text-sm font-mono font-bold text-emerald-700 mt-1">
                      {phrase.pinyin}
                    </div>

                    {/* 3. 英文 */}
                    <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-2">
                      {phrase.english}
                    </div>

                    {/* Shanghainese / Cultural Tip */}
                    {phrase.shanghaineseTip && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-1.5">
                        <span className="shrink-0 text-sm">🐲</span>
                        <span>{phrase.shanghaineseTip}</span>
                      </div>
                    )}

                    {/* Situation Usage Tip */}
                    {phrase.situationTip && !phrase.shanghaineseTip && (
                      <p className="mt-2 text-[11px] text-slate-500 italic">
                        💡 {phrase.situationTip}
                      </p>
                    )}
                  </div>

                  {/* Actions Footer: Click to Listen & Copy */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => speakText(phrase.hanzi, phrase.id)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-emerald-600 text-white shadow-md animate-pulse'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                      title="Listen with native browser Web Speech audio"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isPlaying ? 'Playing...' : '听发音 Listen'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyPhrase(phrase)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors"
                      title="Copy Chinese & Pinyin"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPhrases.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <span className="text-4xl">🔍</span>
              <h4 className="text-base font-bold text-slate-800 mt-2">
                No phrases found matching "{searchQuery}"
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for 'hotel', 'Metro', 'dumpling', or reset the category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowShanghaineseOnly(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
