import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MessageCircle,
  Send,
  Lock,
  Unlock,
  Heart,
  MapPin,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Profile } from "../types";
import { useAuth } from "./AuthContext";

interface UnlockProfileModalProps {
  profile: Profile;
  onClose: () => void;
  onViewFull: () => void;
}

const UNLOCK_MILESTONES = [
  { count: 10, label: "完整個人介紹" },
  { count: 20, label: "LINE 聯絡方式" },
];

export default function UnlockProfileModal({
  profile,
  onClose,
  onViewFull,
}: UnlockProfileModalProps) {
  const { loggedInLadyCode, ladyProfiles } = useAuth();
  const lady = loggedInLadyCode ? ladyProfiles[loggedInLadyCode] : null;
  const isUnlocked = lady
    ? lady.matchedGentlemanCode === profile.code || lady.unlockedGentlemanCodes?.includes(profile.code)
    : false;

  const [messages, setMessages] = useState<{ role: "user" | "gentleman"; text: string }[]>([
    {
      role: "gentleman",
      text: `你好，很高興透過緣友與妳相遇。我是${isUnlocked ? profile.name : profile.name.slice(0, 1) + "先生"}，期待我們能有更深入的交流。`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"profile" | "chat">("profile");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const unlockedBio = msgCount >= 10;
  const unlockedLine = msgCount >= 20;

  // 定時獲取對話歷史記錄
  useEffect(() => {
    if (!loggedInLadyCode) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history?user1=${loggedInLadyCode}&user2=${profile.code}`);
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((msg: any) => ({
            role: msg.senderCode === loggedInLadyCode ? "user" : "gentleman",
            text: msg.text,
          }));

          if (formatted.length === 0) {
            setMessages([
              {
                role: "gentleman",
                text: `你好，很高興透過緣友與妳相遇。我是${isUnlocked ? profile.name : profile.name.slice(0, 1) + "先生"}，期待我們能有更深入的交流。`,
              }
            ]);
            setMsgCount(0);
          } else {
            setMessages(formatted);
            setMsgCount(formatted.length);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, [loggedInLadyCode, profile.code]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !loggedInLadyCode) return;
    setInput("");

    // 樂觀更新前端介面
    const userMsg = { role: "user" as const, text };
    setMessages((prev) => [...prev, userMsg]);
    setMsgCount((prev) => prev + 1);

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderCode: loggedInLadyCode,
          receiverCode: profile.code,
          text,
        }),
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const progressPct = Math.min((msgCount / 20) * 100, 100);

  const maskedName =
    profile.name.length >= 2
      ? profile.name[0] + "○" + (profile.name.length >= 3 ? profile.name.slice(2).replace(/./g, "○") : "")
      : profile.name;

  const avatarSrc =
    (profile.imageUrls && profile.imageUrls.length > 0 ? profile.imageUrls[0] : profile.imageUrl) ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
  const fallbackSrc =
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";

  return (
    <AnimatePresence>
      <motion.div
        key="unlock-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          key="unlock-modal-card"
          className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden z-10"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          {/* Header with avatar */}
          <div className="relative flex-shrink-0">
            <div className="relative h-52 overflow-hidden rounded-t-[2rem]">
              <img
                src={avatarSrc}
                alt=""
                className="w-full h-full object-cover object-top"
                onError={(e) => { (e.target as HTMLImageElement).src = fallbackSrc; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-accent/90 text-brand-olive text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>AI 靈魂媒合</span>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="text-white font-serif text-xl font-bold drop-shadow-lg">
                  {isUnlocked ? profile.name : maskedName} <span className="text-base text-white/80 font-normal">· {profile.age} 歲</span>
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-white/70" />
                  <span className="text-white/70 text-xs">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-brand-border/40 flex-shrink-0 bg-white">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-3 text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "profile"
                    ? "text-brand-olive border-b-2 border-brand-olive"
                    : "text-brand-muted hover:text-brand-dark"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                資料預覽
              </button>
              <button
                onClick={() => { setActiveTab("chat"); setTimeout(() => inputRef.current?.focus(), 100); }}
                className={`flex-1 py-3 text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "chat"
                    ? "text-brand-olive border-b-2 border-brand-olive"
                    : "text-brand-muted hover:text-brand-dark"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                開始對話
                {msgCount > 0 && (
                  <span className="bg-brand-accent text-brand-olive text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                    {msgCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {activeTab === "profile" ? (
                <motion.div
                  key="tab-profile"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 overflow-y-auto p-5 space-y-4"
                >
                  {/* Progress bar */}
                  <div className="bg-brand-beige/50 rounded-2xl p-4 border border-brand-border/40 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-dark flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-brand-olive" />
                        對話解鎖進度
                      </span>
                      <span className="text-brand-muted font-mono">{msgCount}/20 條對話</span>
                    </div>
                    <div className="w-full h-2 bg-brand-border/40 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-olive to-brand-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex gap-2">
                      {UNLOCK_MILESTONES.map((m) => (
                        <div
                          key={m.count}
                          className={`flex-1 flex items-center gap-1 text-[10px] font-bold px-2 py-1.5 rounded-lg border transition-colors ${
                            msgCount >= m.count
                              ? "bg-brand-olive/10 text-brand-olive border-brand-olive/30"
                              : "bg-white text-brand-muted border-brand-border/40"
                          }`}
                        >
                          {msgCount >= m.count
                            ? <Unlock className="w-3 h-3 shrink-0" />
                            : <Lock className="w-3 h-3 shrink-0" />}
                          <span>{m.count} 條解鎖{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-brand-light font-bold uppercase tracking-wider">自我介紹</p>
                    <p className="text-sm text-brand-muted italic leading-relaxed">&ldquo;{profile.tagline}&rdquo;</p>
                  </div>

                  {/* Full bio (unlocked at 10) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-brand-light font-bold uppercase tracking-wider">詳細介紹</p>
                      {!unlockedBio && (
                        <span className="text-[10px] text-brand-muted flex items-center gap-1">
                          <Lock className="w-3 h-3" /> 對話 10 條後解鎖
                        </span>
                      )}
                    </div>
                    {unlockedBio ? (
                      <p className="text-sm text-brand-dark leading-relaxed whitespace-pre-line">{profile.bio}</p>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden">
                        <p className="text-sm text-brand-dark leading-relaxed blur-sm select-none line-clamp-4">{profile.bio}</p>
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                          <div className="flex items-center gap-1.5 bg-white/90 text-brand-olive text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-brand-border/40">
                            <Lock className="w-3 h-3" />
                            <span>再對話 {Math.max(0, 10 - msgCount)} 條即可解鎖</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lifestyle tags */}
                  {profile.lifestyle && profile.lifestyle.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-brand-light font-bold uppercase tracking-wider">生活風格</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.lifestyle.map((tag, i) => (
                          <span key={i} className="bg-brand-beige border border-brand-border text-[10px] font-bold text-brand-olive px-2.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="border-t border-brand-border/30 pt-4">
                    {unlockedLine ? (
                      <button
                        onClick={onViewFull}
                        className="w-full py-3.5 px-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>查看完整資料與聯絡方式</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-brand-beige/50 rounded-2xl border border-brand-border/40">
                        <Lock className="w-5 h-5 text-brand-muted shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-brand-dark">聯絡方式尚未解鎖</p>
                          <p className="text-[10px] text-brand-muted mt-0.5">
                            累積對話達 20 條後，即可查看完整資料與 LINE 聯絡方式
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tab-chat"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Hint banner */}
                  <div className="px-4 pt-3 pb-2 flex-shrink-0">
                    <div className="bg-brand-beige/60 border border-brand-border/40 rounded-xl px-3 py-2 text-[10px] text-brand-muted text-center leading-relaxed">
                      💬 對話 <span className="font-bold text-brand-olive">10 條</span> 解鎖個人介紹 ·
                      {" "}<span className="font-bold text-brand-olive">20 條</span> 解鎖 LINE 聯絡
                      {msgCount > 0 && <span className="ml-1 font-bold text-brand-olive">（已對話 {msgCount} 條）</span>}
                    </div>
                  </div>

                  {/* Message list */}
                  <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-0">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "gentleman" && (
                          <div className="w-7 h-7 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1 border border-brand-border/40">
                            <img src={avatarSrc} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = fallbackSrc; }} />
                          </div>
                        )}
                        <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-brand-olive text-white rounded-br-sm"
                            : "bg-brand-beige/70 text-brand-dark border border-brand-border/40 rounded-bl-sm"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="w-7 h-7 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1 border border-brand-border/40">
                          <img src={avatarSrc} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = fallbackSrc; }} />
                        </div>
                        <div className="bg-brand-beige/70 border border-brand-border/40 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="px-4 py-3 border-t border-brand-border/30 flex-shrink-0 bg-white">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="輸入訊息..."
                        className="flex-1 bg-brand-beige/60 border border-brand-border rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="bg-brand-olive hover:bg-[#4d4d36] disabled:bg-brand-muted text-white p-2.5 rounded-2xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
