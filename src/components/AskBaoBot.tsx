import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle, Compass, Train, Utensils, Shield } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bao';
  text: string;
  timestamp: string;
}

export const AskBaoBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bao',
      text: "🐲 Nong Hao (侬好)! I'm Bao (小龙宝), your Shanghai Immersion AI Trip Bot! Staying with DE Group 2 at 809 Guangzhong Road, Jing'An District (上海市静安区广中路809号)? Ask me anything about Metro Line 1, delicious dumplings, quest coin secrets, or student leaders Latasha, Ren ZhuoJing (Assis) & Chua Yu Zhe!",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender === 'user' ? 'Student' : 'Bao',
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const baoReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bao',
        text: data.reply || "Bao is recharging! Let me know if you need help with the itinerary.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, baoReply]);
    } catch (err) {
      console.error(err);
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bao',
        text: "🐲 Bao says: You are based at 809 Guangzhong Road (near Metro Line 1 Circus World / Yanchang Rd stations)! Take Metro Line 1 directly to People's Square or transfer to East Nanjing Road for The Bund. Remember: 100 Coins = 5.0% Module Grade!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: '🎓 1 LU Deliverables', text: 'What are the required deliverables for 1 LU PLP-Global Readiness and the NYC AEP grant under Brightspace DE_OIP (Shanghai)_NOV26?' },
    { label: '🧳 What to pack in Nov?', text: 'What should I pack for our 7-day Shanghai immersion in November? What clothes and PT gear do I need?' },
    { label: '🚇 Metro to The Bund', text: 'How do I take the Metro from our hotel at 809 Guangzhong Road to The Bund?' },
    { label: '🥟 Food Spots Nearby', text: 'What are the top Xiaolongbao and Shengjianbao places within walking distance of our hotel at 809 Guangzhong Road?' },
    { label: '🗣️ Shanghainese Phrases', text: 'Teach me 3 essential Shanghainese phrases to complete the slang quest!' },
    { label: '🚨 Emergency Contacts', text: 'Who do I call in an emergency? Show Latasha, Ren ZhuoJing, and Chua Yu Zhe\'s contacts.' },
  ];

  return (
    <>
      {/* Floating Trigger Button (Matches the golden pill button in prototype) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black shadow-xl shadow-amber-500/30 border-2 border-white hover:scale-105 active:scale-95 transition-all group"
          >
            {/* Dragon Avatar in White Circle */}
            <div className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center text-xl shadow-xs">
              <span>🐲</span>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="text-left pr-1">
              <div className="text-sm font-black tracking-tight leading-tight">Ask Bao!</div>
              <div className="text-[10px] font-bold text-amber-950/80 uppercase tracking-wider">Your Trip Bot</div>
            </div>
          </button>
        )}
      </div>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] z-50 flex flex-col bg-white sm:rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-between border-b border-amber-300 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs">
                <span>🐲</span>
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-950">Bao (小龙宝)</h3>
                  <span className="text-[10px] font-bold bg-amber-200/90 text-amber-900 px-1.5 py-0.2 rounded-md">
                    AI Guide
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-amber-950/80">Quest Shanghai Immersion Bot</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-slate-900 flex items-center justify-center font-bold text-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-amber-50/20 text-xs">
            {messages.map((m) => {
              const isBao = m.sender === 'bao';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${isBao ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBao && (
                    <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                      🐲
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                      isBao
                        ? 'bg-white text-slate-800 border border-amber-200/80 shadow-2xs rounded-tl-xs'
                        : 'bg-emerald-600 text-white rounded-tr-xs shadow-xs font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${isBao ? 'text-slate-400' : 'text-emerald-200'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 italic text-[11px] pl-9">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Bao is thinking & checking Shanghai guides...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp.text)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-medium transition-colors"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Bao about metro, food, or quests..."
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
