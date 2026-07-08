import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  User, 
  Lock, 
  Unlock, 
  LogOut, 
  MapPin, 
  Sparkles,
  Heart,
  ChevronRight
} from "lucide-react";
import { useData } from "./DataContext";

interface GentlemanDashboardProps {
  gentlemanCode: string;
  onLogout: () => void;
}

interface LadyChatListItem {
  ladyCode: string;
  ladyName: string;
  ladyPhoto: string;
  lastMessage: string;
  lastMessageAt: string | null;
}

export default function GentlemanDashboard({ gentlemanCode, onLogout }: GentlemanDashboardProps) {
  const { profiles } = useData();
  const currentProfile = profiles[gentlemanCode];

  const [chats, setChats] = useState<LadyChatListItem[]>([]);
  const [selectedLadyCode, setSelectedLadyCode] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ senderCode: string; text: string; createdAt: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 定時拉取有過對話的名媛列表
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`/api/gentleman/chats?gentlemanCode=${gentlemanCode}`);
        if (res.ok) {
          const data = await res.json();
          setChats(data);
          // 預設選取第一個有對話的名媛
          if (data.length > 0 && !selectedLadyCode) {
            setSelectedLadyCode(data[0].ladyCode);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chats list:", err);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 4000);
    return () => clearInterval(interval);
  }, [gentlemanCode, selectedLadyCode]);

  // 定時拉取選中名媛的歷史消息
  useEffect(() => {
    if (!selectedLadyCode) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history?user1=${gentlemanCode}&user2=${selectedLadyCode}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [gentlemanCode, selectedLadyCode]);

  // 滾動到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !selectedLadyCode) return;

    setInput("");
    try {
      // 樂觀更新
      setMessages(prev => [...prev, { senderCode: gentlemanCode, text, createdAt: new Date().toISOString() }]);

      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderCode: gentlemanCode,
          receiverCode: selectedLadyCode,
          text
        })
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const selectedChat = chats.find(c => c.ladyCode === selectedLadyCode);
  const totalLadyMsgs = messages.length;
  const progressPct = Math.min((totalLadyMsgs / 20) * 100, 100);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-brand-beige/30 font-sans">
      
      {/* LEFT SIDEBAR: Chats List */}
      <div className="w-full md:w-80 border-r border-brand-border/40 bg-white flex flex-col shrink-0">
        
        {/* Gentleman Header Info */}
        <div className="p-5 border-b border-brand-border/40 bg-brand-olive text-white relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full border-2 border-brand-accent overflow-hidden shrink-0">
              <img 
                src={currentProfile?.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"} 
                alt="" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-sm truncate">{currentProfile?.name || "尊榮紳士"}</h3>
              <p className="text-[10px] text-brand-accent font-bold tracking-wider uppercase mt-0.5">紳士帳號 · {gentlemanCode}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-white/80 hover:text-white"
              title="登出紳士帳戶"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lady Chats Title */}
        <div className="px-5 py-3.5 bg-brand-beige/10 border-b border-brand-border/30 text-[10px] font-bold text-brand-light uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-brand-olive" />
          <span>名媛來信清單 ({chats.length})</span>
        </div>

        {/* Chats scroll area */}
        <div className="flex-grow overflow-y-auto divide-y divide-brand-border/20">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-xs text-brand-light italic space-y-2">
              <p>目前尚無名媛發送訊息。</p>
              <p className="text-[10px] opacity-80">系統媒合成功或名媛主動輸入您的編號並發送訊息後，會在此處顯示。</p>
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected = chat.ladyCode === selectedLadyCode;
              return (
                <button
                  key={chat.ladyCode}
                  onClick={() => setSelectedLadyCode(chat.ladyCode)}
                  className={`w-full p-4 flex gap-3 text-left transition-all duration-300 border-l-4 cursor-pointer ${
                    isSelected 
                      ? "bg-brand-beige/25 border-brand-olive shadow-inner" 
                      : "bg-transparent border-transparent hover:bg-brand-beige/10"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full border border-brand-border bg-brand-beige/50 overflow-hidden shrink-0 relative">
                    <img 
                      src={chat.ladyPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-brand-dark">{chat.ladyName}</span>
                      <span className="text-[9px] text-brand-light">
                        {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-light truncate">{chat.lastMessage || "發送了新配對問候..."}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN WINDOW: Chat Panel */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedLadyCode && selectedChat ? (
          <>
            {/* Chat header: Lady short profile */}
            <div className="p-4 border-b border-brand-border/40 bg-brand-beige/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-brand-border">
                  <img 
                    src={selectedChat.ladyPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-dark flex items-center gap-1.5">
                    <span>{selectedChat.ladyName}</span>
                    <span className="bg-brand-accent/30 text-brand-olive text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">配對者</span>
                  </h4>
                  <p className="text-[10px] text-brand-light mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-olive" />
                    名媛編號: {selectedLadyCode}
                  </p>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="hidden md:flex flex-col items-end gap-1.5 max-w-[240px]">
                <div className="flex items-center justify-between w-full text-[10px]">
                  <span className="font-bold text-brand-dark flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-brand-olive" />
                    解鎖進度
                  </span>
                  <span className="text-brand-light font-bold font-mono">{totalLadyMsgs}/20 條對話</span>
                </div>
                <div className="w-40 h-1.5 bg-brand-border/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-olive to-brand-accent rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[8px] text-brand-light text-right">
                  {totalLadyMsgs >= 20 
                    ? "🎉 已向該名媛解鎖您的 LINE 聯繫方式！" 
                    : `再聊 ${Math.max(0, 20 - totalLadyMsgs)} 條，名媛即可查看您的 LINE`}
                </span>
              </div>
            </div>

            {/* Chat Messages flow area */}
            <div className="flex-1 overflow-y-auto p-5 bg-brand-beige/5 space-y-4">
              <div className="flex justify-center my-2">
                <div className="bg-brand-beige/50 border border-brand-border/40 text-brand-light text-[9px] font-bold px-3 py-1.5 rounded-full tracking-wider flex items-center gap-1.5">
                  <Unlock className="w-3 h-3 text-brand-olive" />
                  <span>緣友加密通道 · 對話內容實時安全儲存</span>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-brand-light italic">
                  請發送訊息開啟本次互動。
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.senderCode === gentlemanCode;
                  return (
                    <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1 border border-brand-border/40">
                          <img src={selectedChat.ladyPhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="max-w-[75%] space-y-1">
                        <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe 
                            ? "bg-brand-olive text-white rounded-br-sm shadow-sm" 
                            : "bg-white text-brand-dark border border-brand-border/40 rounded-bl-sm shadow-sm"
                        }`}>
                          {msg.text}
                        </div>
                        {msg.createdAt && (
                          <p className={`text-[8px] text-brand-light/70 ${isMe ? "text-right" : "text-left"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input field area */}
            <div className="p-4 border-t border-brand-border/30 bg-white">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`輸入訊息回覆給 ${selectedChat.ladyName}...`}
                  className="flex-1 bg-brand-beige/40 border border-brand-border rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-brand-olive hover:bg-[#4d4d36] disabled:bg-brand-muted text-white px-4 rounded-2xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  <span className="text-xs font-bold">送出</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-brand-beige/5 space-y-3">
            <MessageSquare className="w-12 h-12 text-brand-olive opacity-40 animate-pulse" />
            <h4 className="font-serif font-bold text-sm text-brand-dark">請選擇一個名媛對話開始聊天</h4>
            <p className="text-xs text-brand-light max-w-sm leading-relaxed">
              左側列表為您列出了所有向您發起「AI 靈魂共鳴」或手動查詢聊天過的名媛。
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
