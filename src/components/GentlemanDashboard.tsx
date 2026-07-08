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
  ChevronRight,
  ArrowLeft,
  Settings,
  Save,
  CheckCircle2
} from "lucide-react";
import { useData } from "./DataContext";

interface GentlemanDashboardProps {
  gentlemanCode: string;
  onLogout: () => void;
  onBackToProfile: () => void;
  adminCode: string;
}

interface LadyChatListItem {
  ladyCode: string;
  ladyName: string;
  ladyPhoto: string;
  lastMessage: string;
  lastMessageAt: string | null;
}

export default function GentlemanDashboard({ 
  gentlemanCode, 
  onLogout, 
  onBackToProfile, 
  adminCode 
}: GentlemanDashboardProps) {
  const { profiles, metrics, adminCodes, refreshData } = useData();
  const currentProfile = profiles[gentlemanCode];

  // 選單 Tab 狀態
  const [activeTab, setActiveTab] = useState<"chat" | "edit">("chat");

  // 聊天狀態
  const [chats, setChats] = useState<LadyChatListItem[]>([]);
  const [selectedLadyCode, setSelectedLadyCode] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ senderCode: string; text: string; createdAt: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 編輯資料狀態
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState(30);
  const [editLocation, setEditLocation] = useState("");
  const [editTagline, setEditTagline] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLifestyleStr, setEditLifestyleStr] = useState("");
  const [editLineUrl, setEditLineUrl] = useState("");
  
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 當載入成功時，初始化編輯資料
  useEffect(() => {
    if (currentProfile) {
      setEditName(currentProfile.name);
      setEditAge(currentProfile.age || 35);
      setEditLocation(currentProfile.location || "");
      setEditTagline(currentProfile.tagline || "");
      setEditBio(currentProfile.bio || "");
      setEditLifestyleStr(currentProfile.lifestyle ? currentProfile.lifestyle.join(", ") : "");
      setEditLineUrl(currentProfile.contactLineUrl || "");
    }
  }, [currentProfile]);

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
    if (!selectedLadyCode || activeTab !== "chat") return;
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
  }, [gentlemanCode, selectedLadyCode, activeTab]);

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

  // 儲存修改後的個人資料
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;
    setSaveError("");
    setSaveSuccess("");

    if (!editName.trim()) {
      setSaveError("姓名不可為空");
      return;
    }

    setIsSaving(true);
    try {
      const cleanLifestyle = editLifestyleStr
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const updatedProfile = {
        ...currentProfile,
        name: editName.trim(),
        age: Number(editAge) || 30,
        location: editLocation.trim(),
        tagline: editTagline.trim(),
        bio: editBio.trim(),
        lifestyle: cleanLifestyle,
        contactLineUrl: editLineUrl.trim()
      };

      const newProfiles = {
        ...profiles,
        [gentlemanCode]: updatedProfile
      };

      const res = await fetch("/api/profile-config", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-admin-code": adminCode
        },
        body: JSON.stringify({
          profiles: newProfiles,
          metrics,
          adminCodes
        })
      });

      if (!res.ok) {
        throw new Error("伺服器更新失敗");
      }

      setSaveSuccess("✨ 個人資料已成功保存！");
      await refreshData(); // 重新拉取同步前台
      setTimeout(() => setSaveSuccess(""), 4000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "保存失敗，請重試");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedChat = chats.find(c => c.ladyCode === selectedLadyCode);
  const totalLadyMsgs = messages.length;
  const progressPct = Math.min((totalLadyMsgs / 20) * 100, 100);

  return (
    <div className="flex-1 flex flex-col md:flex-row md:h-[calc(100vh-60px)] md:max-h-[calc(100vh-60px)] overflow-hidden bg-brand-beige/30 font-sans">
      
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

        {/* Action Quick Navigation */}
        <div className="p-3 bg-brand-beige/10 border-b border-brand-border/30 flex gap-2 flex-shrink-0">
          <button
            onClick={onBackToProfile}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-brand-beige hover:bg-brand-border/30 border border-brand-border/50 text-brand-olive rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回個人卡片
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-brand-border/30 bg-white">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "chat"
                ? "text-brand-olive border-b-2 border-brand-olive bg-brand-beige/10"
                : "text-brand-muted hover:text-brand-dark"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            對話回覆
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex-1 py-3 text-xs font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "edit"
                ? "text-brand-olive border-b-2 border-brand-olive bg-brand-beige/10"
                : "text-brand-muted hover:text-brand-dark"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            修改資料
          </button>
        </div>

        {/* Lady Chats List - Render ONLY on chat tab */}
        {activeTab === "chat" && (
          <div className="flex-grow overflow-y-auto divide-y divide-brand-border/20">
            <div className="px-5 py-2.5 bg-brand-beige/5 border-b border-brand-border/20 text-[9px] font-bold text-brand-light uppercase tracking-wider">
              名媛來信清單 ({chats.length})
            </div>
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
        )}
      </div>

      {/* RIGHT MAIN WINDOW */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "chat" ? (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col h-full overflow-hidden"
            >
              {selectedLadyCode && selectedChat ? (
                <>
                  {/* Chat header: Lady short profile */}
                  <div className="p-4 border-b border-brand-border/40 bg-brand-beige/10 flex items-center justify-between flex-shrink-0">
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
                  <div className="flex-grow overflow-y-auto p-5 bg-brand-beige/5 space-y-4">
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
                  <div className="p-4 border-t border-brand-border/30 bg-white flex-shrink-0">
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
                        className="bg-brand-olive hover:bg-[#4d4d36] disabled:bg-brand-muted text-white px-4 rounded-2xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center shrink-0 animate-fade-in"
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
                    左側列表為您列出了所有與您建立了聊天連結的名媛麗人。
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="edit-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow overflow-y-auto p-6 md:p-10 max-w-2xl mx-auto w-full space-y-6"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-1">編輯個人檔案</h3>
                <p className="text-xs text-brand-muted">在這裡修改您的尊榮個人名片。保存後將即時同步更新。</p>
              </div>

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-bold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-bold animate-fade-in">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-brand-light uppercase tracking-wider">姓名 / 暱稱</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-brand-beige/50 border border-brand-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-brand-light uppercase tracking-wider">年齡 (歲)</label>
                    <input 
                      type="number" 
                      value={editAge}
                      onChange={(e) => setEditAge(Number(e.target.value))}
                      className="w-full bg-brand-beige/50 border border-brand-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-light uppercase tracking-wider">城市地區</label>
                  <input 
                    type="text" 
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full bg-brand-beige/50 border border-brand-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive"
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-light uppercase tracking-wider">一句話宣告 (Slogan)</label>
                  <input 
                    type="text" 
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                    className="w-full bg-brand-beige/50 border border-brand-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-light uppercase tracking-wider">完整個人簡介</label>
                  <textarea 
                    rows={6}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-brand-beige/50 border border-brand-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive resize-none leading-relaxed"
                  />
                </div>

                {/* Lifestyle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-light uppercase tracking-wider">生活風格標籤 (逗號分隔)</label>
                  <input 
                    type="text" 
                    value={editLifestyleStr}
                    onChange={(e) => setEditLifestyleStr(e.target.value)}
                    placeholder="例: 高端收藏, 科技投資, 美學品味..."
                    className="w-full bg-brand-beige/50 border border-brand-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive"
                  />
                </div>

                {/* LINE URL */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-brand-light uppercase tracking-wider">LINE 客服/聯絡網址</label>
                  <input 
                    type="text" 
                    value={editLineUrl}
                    onChange={(e) => setEditLineUrl(e.target.value)}
                    placeholder="例: https://line.me/ti/p/..."
                    className="w-full bg-brand-beige/50 border border-brand-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3.5 bg-brand-olive hover:bg-[#4d4d36] disabled:bg-brand-muted text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "正在保存設定..." : "立即保存修改"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
