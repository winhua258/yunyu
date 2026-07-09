import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  CreditCard, 
  Upload, 
  UserCheck, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight,
  Sparkle,
  CheckCircle,
  MapPin,
  HelpCircle
} from "lucide-react";
import { Profile } from "../types";

interface LadiesDashboardProps {
  profiles: Record<string, Profile>;
  matchCounts: number;
  setMatchCounts: (counts: number | ((prev: number) => number)) => void;
  unlockedCodes: string[];
  setUnlockedCodes: (codes: string[] | ((prev: string[]) => string[])) => void;
  isLadyVerified: boolean;
  setIsLadyVerified: (verified: boolean) => void;
  onViewProfile: (code: string) => void;
  onStartQuiz: () => void;
  onExit?: () => void;
}

export default function LadiesDashboard({
  profiles,
  matchCounts,
  setMatchCounts,
  unlockedCodes,
  setUnlockedCodes,
  isLadyVerified,
  setIsLadyVerified,
  onViewProfile,
  onStartQuiz,
  onExit
}: LadiesDashboardProps) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; price: string; counts: number } | null>(null);

  // Verification Form states
  const [verifyStep, setVerifyStep] = useState<"idle" | "uploading" | "success">("idle");
  const [verifyType, setVerifyType] = useState<"id" | "occupation">("id");
  const [verifyFileName, setVerifyFileName] = useState("");
  const [verifyOccupation, setVerifyOccupation] = useState("");

  // AI Matching animation states
  const [matchingCode, setMatchingCode] = useState<string | null>(null);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchingMessage, setMatchingMessage] = useState("");

  // LINE Private Channel modal states
  const [showLineModal, setShowLineModal] = useState(false);
  const [selectedGentName, setSelectedGentName] = useState("");
  const [selectedGentCode, setSelectedGentCode] = useState("");
  const [selectedGentLineUrl, setSelectedGentLineUrl] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [copiedToken, setCopiedToken] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const openLineModal = (gentName: string, gentCode: string, gentLineUrl: string) => {
    const ladyCode = localStorage.getItem("yuanyu_lady_code") || "GUEST";
    const rand = Math.floor(Math.random() * 90000 + 10000);
    const token = `YY-LADY-${ladyCode}-GENT-${gentCode}-KEY-${rand}`;
    setGeneratedToken(token);
    setSelectedGentName(gentName);
    setSelectedGentCode(gentCode);
    setSelectedGentLineUrl(gentLineUrl || "https://line.me/ti/p/your-default-line-id");
    setCopiedToken(false);
    setShowLineModal(true);
  };

  const handleUnlockClick = (gent: any) => {
    if (gent.isAcceptingMatches === false) {
      showToast("此紳士目前關閉配對功能，暫不接受新配對", "info");
      return;
    }
    startMatchingUnlock(gent.code, gent.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setVerifyFileName(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVerifyFileName(e.target.files[0].name);
    }
  };

  // Run mock high-end verification scan
  const submitVerification = () => {
    if (!verifyFileName) return;
    setVerifyStep("uploading");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setVerifyStep("success");
        setIsLadyVerified(true);
        setMatchCounts((prev) => prev + 3);
        // Persist
        localStorage.setItem("yuanyu_lady_verified", "true");
        localStorage.setItem("yuanyu_match_counts", String(matchCounts + 3));
      }
    }, 200);
  };

  // Run high-tech matching algorithm to unlock a gentleman
  const startMatchingUnlock = (code: string, name: string) => {
    if (matchCounts < 1) {
      setSelectedPackage({ name: "雅緻銀弦套餐", price: "2,999", counts: 5 });
      setShowPackageModal(true);
      return;
    }

    setMatchingCode(code);
    setMatchingProgress(0);
    setMatchingMessage("啟動量子靈魂共鳴算法...");

    const interval = setInterval(() => {
      setMatchingProgress((prev) => {
        const next = prev + 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setMatchCounts((c) => {
              const updated = Math.max(0, c - 1);
              localStorage.setItem("yuanyu_match_counts", String(updated));
              return updated;
            });
            setUnlockedCodes((prevList) => {
              const updated = [...prevList, code];
              localStorage.setItem("yuanyu_unlocked_codes", JSON.stringify(updated));
              return updated;
            });
            setMatchingCode(null);
          }, 600);
          return 100;
        }

        if (next < 25) {
          setMatchingMessage("分析您的 20 維生活美學指標...");
        } else if (next < 50) {
          setMatchingMessage(`比對與紳士 *${name} 的心靈向量差...`);
        } else if (next < 75) {
          setMatchingMessage("計算生活習慣、理財成熟度與情緒相容性...");
        } else {
          setMatchingMessage(`相似度高達 ${88 + Math.floor(Math.random() * 11)}%！安全認證解鎖中...`);
        }
        return next;
      });
    }, 150);
  };

  // Checkout Package simulated gateway
  const triggerPackagePurchase = (pkg: { name: string; price: string; counts: number }) => {
    setSelectedPackage(pkg);
    setShowPackageModal(false);
    setShowPaymentModal(true);
  };

  const executePayment = () => {
    if (!selectedPackage) return;
    
    // Process payments elegantly
    setTimeout(() => {
      setMatchCounts((prev) => {
        const updated = prev + selectedPackage.counts;
        localStorage.setItem("yuanyu_match_counts", String(updated));
        return updated;
      });
      setShowPaymentModal(false);
      setSelectedPackage(null);
    }, 1500);
  };

  // Categorize gentlemen profiles: filter out template profiles
  const TEMPLATE_EXCLUDED_CODES = ["monkeyB-template", "daiC-template", "deerD-template", "huaA-template"];
  const gentlemenList = Object.values(profiles).filter(
    (p) => !TEMPLATE_EXCLUDED_CODES.includes(p.code)
  );

  // Dialog progress for each unlocked gentleman: msgCount per code
  const [dialogProgress, setDialogProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (unlockedCodes.length === 0) return;
    const ladyCode = localStorage.getItem("yuanyu_lady_code") || "";
    if (!ladyCode) return;

    const fetchProgress = async () => {
      const result: Record<string, number> = {};
      await Promise.all(
        unlockedCodes.map(async (gentCode) => {
          try {
            const res = await fetch(`/api/chat/history?user1=${ladyCode}&user2=${gentCode}`);
            if (res.ok) {
              const data = await res.json();
              result[gentCode] = Array.isArray(data) ? data.length : 0;
            } else {
              result[gentCode] = 0;
            }
          } catch {
            result[gentCode] = 0;
          }
        })
      );
      setDialogProgress(result);
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 8000);
    return () => clearInterval(interval);
  }, [unlockedCodes]);

  return (
    <div className="w-full bg-[#0D0D0B] text-[#E5E5E3] min-h-screen py-10 px-4 md:px-12 font-sans relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-brand-olive/5 blur-[150px] pointer-events-none" />

      {/* Ticker for real-time match events */}
      <div className="max-w-6xl mx-auto mb-10 bg-white/5 border border-white/10 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
            <Sparkle className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-serif font-bold text-brand-accent tracking-widest uppercase">緣友 YUAN-YU · 麗人專屬推薦特區</h4>
            <p className="text-[10px] text-white/60">實行男女實名雙向認證，保障本交友圈最高規格之交往誠意與資產實力。</p>
          </div>
        </div>

        {/* Counter Widget */}
        <div className="flex items-center gap-4 shrink-0 bg-black/40 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
          <div className="text-left">
            <span className="text-[8px] uppercase tracking-widest text-brand-light block font-mono">Available Matches // 剩餘配對次數</span>
            <span className="text-lg md:text-xl font-mono font-bold text-brand-accent">{matchCounts} 次</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <button
            id="btn-add-counts-trigger"
            onClick={() => setShowPackageModal(true)}
            className="text-[10px] bg-brand-olive text-white px-3 py-1.5 rounded-full font-bold hover:bg-[#4d4d36] transition-all cursor-pointer flex items-center gap-1 shadow-md hover:shadow-brand-accent/20"
          >
            <CreditCard className="w-3 h-3" />
            <span>增加配對次數</span>
          </button>

          {onExit && (
            <button
              id="btn-exit-ladies-dashboard"
              onClick={onExit}
              className="text-[10px] bg-transparent border border-white/20 hover:border-white/40 text-white/80 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>返回大廳</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Gentlemen grid (Spans 8 columns on desktop) */}
        <div className="lg:col-span-8 space-y-8 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-brand-accent">Elite Match Recommendation</span>
              <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-white">本週推薦資產認證紳士</h2>
            <p className="text-xs text-white/50">已通過資產查核與實名認證，信譽良好，擁有高度社會責任與審美生活之頂尖紳士。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {gentlemenList.map((gent) => {
              const isUnlocked = unlockedCodes.includes(gent.code);
              const msgCount = isUnlocked ? (dialogProgress[gent.code] ?? 0) : 0;
              // Tier: 0=locked, 1=partial (1-19 msgs, show bio/tagline no LINE), 2=full (>=20 msgs)
              const unlockTier = !isUnlocked ? 0 : msgCount >= 20 ? 2 : 1;

              return (
                <div 
                  key={gent.code}
                  className={`rounded-[2rem] border overflow-hidden shadow-xl transition-all duration-300 relative group flex flex-col justify-between min-h-[380px] ${
                    unlockTier === 0
                      ? "bg-[#141412]/70 border-white/5 opacity-80 hover:opacity-90"
                      : "bg-[#141412] border-white/5 hover:border-brand-accent/30"
                  }`}
                >
                  {/* Photo Section */}
                  <div className="relative h-56 w-full overflow-hidden bg-black/40">
                    <img 
                      src={gent.imageUrl} 
                      alt="" 
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        unlockTier === 2 ? "blur-0 scale-100 group-hover:scale-105" : "blur-xl saturate-50 scale-105"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                    {/* Left top verify badge */}
                    <div className="absolute top-4 left-4 z-20 bg-brand-olive/80 backdrop-blur-md text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/10 flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-brand-accent" />
                      <span>實名資產已驗證</span>
                    </div>

                    {/* Right top compatibility */}
                    <div className="absolute top-4 right-4 z-20 bg-brand-accent text-brand-dark text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm font-mono">
                      ● AI 契合 98%
                    </div>

                    {/* Identity Details when partially or fully unlocked */}
                    {unlockTier >= 1 && (
                      <div className="absolute bottom-4 left-6 right-6 z-20 text-white">
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-serif text-lg font-bold">{gent.name}</h3>
                          <span className="text-xs text-white/70">{gent.age}歲 // {gent.location}</span>
                        </div>
                        <p className="text-[10px] text-brand-accent font-serif truncate mt-0.5">「 {gent.tagline} 」</p>
                      </div>
                    )}
                  </div>

                  {/* Info / Interaction Section */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    {unlockTier === 2 ? (
                      // TIER 2: Fully unlocked (≥20 msgs) — show all including LINE
                      <>
                        <p className="text-xs text-white/70 line-clamp-3 leading-relaxed text-left">
                          {gent.bio}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 pb-1">
                          {gent.lifestyle.slice(0, 3).map((tag, i) => (
                            <span key={i} className="bg-white/5 text-white/60 text-[9px] font-bold px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <button
                            id={`btn-establish-channel-${gent.code}`}
                            onClick={() => openLineModal(gent.name, gent.code, gent.contactLineUrl)}
                            className="w-full py-3 bg-[#06C755] hover:bg-[#05b04b] text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkle className="w-3.5 h-3.5 text-brand-accent fill-current animate-pulse" />
                            <span>一鍵建立 專屬通道</span>
                          </button>
                          
                          <button
                            id={`btn-view-profile-unlocked-${gent.code}`}
                            onClick={() => onViewProfile(gent.code)}
                            className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>瀏覽詳細資料</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : unlockTier === 1 ? (
                      // TIER 1: Partial unlock (1-19 msgs) — show bio/tagline, progress bar, no LINE
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed text-left mb-3">
                          {gent.bio}
                        </p>

                        {/* Conversation progress bar */}
                        <div className="mb-3 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-white/50 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-brand-accent" />
                              對話解鎖進度
                            </span>
                            <span className="text-brand-accent font-mono font-bold">{msgCount}/20</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-olive to-brand-accent rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((msgCount / 20) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-white/40 text-center">再聊 {20 - msgCount} 句即可完全解鎖 LINE 聯絡方式</p>
                        </div>

                        <button
                          id={`btn-view-profile-partial-${gent.code}`}
                          onClick={() => onViewProfile(gent.code)}
                          className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>繼續對話解鎖</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      // TIER 0: Locked — ghost card with unlock button
                      <div className="flex-1 flex flex-col justify-between py-2 text-center relative z-10">
                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                              <Lock className="w-4 h-4 text-brand-accent fill-current animate-pulse" />
                            </div>
                          </div>
                          <p className="text-[11px] font-bold text-brand-accent tracking-widest uppercase">
                            【 檔案加密保護中 】
                          </p>
                          <p className="text-[10px] text-white/50 max-w-xs mx-auto leading-normal">
                            為守護紳士實質資產隱私，此檔案已受高強度保密。
                            請使用 1 次配對進行 AI 性格共鳴運算解鎖。
                          </p>
                        </div>

                        <button
                          id={`btn-unlock-gent-${gent.code}`}
                          onClick={() => handleUnlockClick(gent)}
                          className="w-full py-3.5 bg-brand-olive text-white hover:bg-[#4d4d36] rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:scale-101 active:scale-99 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Unlock className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                          <span>消耗 1 次配對額度解鎖</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Verification/Package tasks (Spans 4 columns on desktop) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Identity Verification Promotion */}
          <div className="bg-[#141412] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-brand-accent">
              <UserCheck className="w-5 h-5 animate-pulse" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider">麗人實名驗核專區</h3>
            </div>
            
            <p className="text-xs text-white/60 leading-relaxed">
              上傳您的實名證明文件或高端職業認證（例如：執業執照、模特卡、外商企業高階經理人等），通過 AI 安全審核可直接<strong>免費獲得 3 次配對次數</strong>！
            </p>

            {isLadyVerified ? (
              <div className="bg-brand-accent/10 border border-brand-accent/20 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div className="text-xs text-brand-accent font-bold">
                  <span>您已完成實名麗人認證</span>
                  <p className="text-[10px] font-normal text-white/50 mt-1">系統已對發放過 3 次特許配對特權。</p>
                </div>
              </div>
            ) : (
              <button
                id="btn-show-lady-verify"
                onClick={() => {
                  setVerifyStep("idle");
                  setVerifyFileName("");
                  setShowVerifyModal(true);
                }}
                className="w-full py-3 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer text-center block shadow-md"
              >
                立即提交認證 (+3 次配對)
              </button>
            )}
          </div>

          {/* Premium Quiz Promotion */}
          <div className="bg-gradient-to-br from-brand-olive/10 to-[#141412] p-6 rounded-[2rem] border border-brand-olive/20 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-brand-accent">
              <Heart className="w-5 h-5 text-brand-accent fill-current animate-pulse" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider">開啟 AI 靈魂共鳴探索</h3>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              如果您不確定挑選哪位紳士，可以直接執行 2 分鐘的 20D 聊天特質採集！
              系統將自動計算最適合您的推薦，並<strong>扣除 1 次配對額度自動解鎖最契合紳士</strong>。
            </p>

            <button
              id="btn-quiz-lady-trigger"
              onClick={onStartQuiz}
              className="w-full py-3 bg-brand-accent hover:bg-[#b5c29d] text-brand-dark text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer text-center block shadow-md hover:scale-102 active:scale-98"
            >
              進入 AI 靈魂共鳴測驗
            </button>
          </div>

          {/* Luxury Ethos Quote */}
          <div className="bg-[#141412] p-6 rounded-[2rem] border border-white/5 shadow-xl text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-light font-bold mb-2">YUAN-YU PRIVACY STATEMENT</p>
            <p className="text-[11px] text-white/40 leading-relaxed italic">
              "緣友深知真誠與隱私的無價。我們對每位紳士採取法律級的資產隱私防護，對每位麗人給予高度的自主決策權，杜絕無意義的垃圾干擾，只為在頂峰遇見共鳴。"
            </p>
          </div>

        </div>
      </div>

      {/* 1. LADY VERIFICATION MODAL */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVerifyModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#141412] rounded-[2.5rem] border border-white/10 w-full max-w-md overflow-hidden z-10 text-left relative"
            >
              {/* Header */}
              <div className="p-6 bg-[#1a1a17] border-b border-white/5 text-center">
                <h3 className="font-serif text-lg text-white font-bold tracking-wide">尊榮麗人資格實名認證</h3>
                <p className="text-[10px] text-brand-accent uppercase tracking-widest mt-1">Identity & Occupation Validation</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {verifyStep === "idle" && (
                  <>
                    <p className="text-xs text-white/60 leading-relaxed text-center mb-4">
                      為維持本圈子高質社交，請上傳您的實名身份證件、工作職照、或名片影本。我們保證上傳後檔案直接存入加密沙盒，人工查核後完全刪除不留痕跡。
                    </p>

                    <div className="flex gap-4 mb-4 justify-center">
                      <button
                        type="button"
                        onClick={() => setVerifyType("id")}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                          verifyType === "id" ? "bg-brand-olive text-white border border-brand-accent/20" : "bg-white/5 text-white/50 border border-transparent"
                        }`}
                      >
                        身分認證 (ID Photo)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerifyType("occupation")}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                          verifyType === "occupation" ? "bg-brand-olive text-white border border-brand-accent/20" : "bg-white/5 text-white/50 border border-transparent"
                        }`}
                      >
                        高階職業認證 (Occupation)
                      </button>
                    </div>

                    {verifyType === "occupation" && (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-brand-light">請輸入您的專業身分 / 職業</label>
                        <input
                          type="text"
                          value={verifyOccupation}
                          onChange={(e) => setVerifyOccupation(e.target.value)}
                          placeholder="例如：主治醫師、合夥律師、獨立設計師"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-accent"
                        />
                      </div>
                    )}

                    {/* Drag-and-drop Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-brand-accent/40 transition-colors relative cursor-pointer group bg-white/2"
                    >
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*,.pdf"
                      />
                      <div className="space-y-2 flex flex-col items-center">
                        <Upload className="w-8 h-8 text-white/40 group-hover:text-brand-accent transition-all" />
                        <span className="text-xs text-white/80 font-bold">
                          {verifyFileName ? verifyFileName : "點擊或拖曳檔案至此上傳"}
                        </span>
                        <span className="text-[9px] text-white/40">支援 JPG, PNG, PDF，限 10MB</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!verifyFileName}
                      onClick={submitVerification}
                      className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                        verifyFileName ? "bg-brand-accent text-brand-dark hover:scale-101 active:scale-99 cursor-pointer" : "bg-white/5 text-white/30 cursor-default"
                      }`}
                    >
                      送出驗核申請
                    </button>
                  </>
                )}

                {verifyStep === "uploading" && (
                  <div className="text-center py-8 space-y-6">
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-accent"
                      />
                      <ShieldCheck className="w-6 h-6 text-brand-accent animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">AI 核對資歷真偽中</p>
                      <p className="text-[10px] text-white/40 animate-pulse">正在掃描圖片特徵、對比第三方授權憑證資料庫...</p>
                    </div>
                  </div>
                )}

                {verifyStep === "success" && (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-500 animate-[bounce_1s_ease]">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif text-lg font-bold text-white">認證核准！獲得特許配對特權</h4>
                      <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                        恭喜您成功開通「尊榮麗人實名標章」！
                        系統已額外為您增加 <strong className="text-brand-accent">3 次配對次數</strong>，祝您在緣友收穫美好情誼。
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVerifyModal(false)}
                      className="w-full py-3 bg-brand-olive text-white rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                      開始配對
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. VIP PACKAGES STORE MODAL */}
      <AnimatePresence>
        {showPackageModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPackageModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#141412] rounded-[2.5rem] border border-white/10 w-full max-w-lg overflow-hidden z-10 text-left relative"
            >
              {/* Header */}
              <div className="p-6 bg-[#1a1a17] border-b border-white/5 text-center">
                <h3 className="font-serif text-lg text-white font-bold tracking-wide">開通 VIP 配對特許套餐</h3>
                <p className="text-[10px] text-brand-accent uppercase tracking-widest mt-1">Unlock Premium Match Plans</p>
              </div>

              {/* Body: Package Options */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-white/60 leading-relaxed text-center mb-2">
                  為維持雙向真誠，我們採用微付費次數解鎖機制，保障交友圈無機關垃圾、無騷擾。解鎖次數永久有效：
                </p>

                <div className="space-y-3">
                  {[
                    { name: "雅緻銀弦套餐 (Silver Plan)", counts: 5, price: "2,999", perk: "小試身手，適合初探生活契合度之麗人" },
                    { name: "極致金尊套餐 (Gold Plan)", counts: 12, price: "5,999", perk: "最具人氣！加贈高達 2 次配對機會" },
                    { name: "奢華鑽冕套餐 (Diamond Plan)", counts: 25, price: "9,999", perk: "尊頂臻享，贈送 5 次配對、享專人 LINE 1對1 優先引導" }
                  ].map((pkg, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-white/2 hover:bg-white/5 rounded-2xl border border-white/5 hover:border-brand-accent/30 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{pkg.name}</span>
                          {idx === 1 && <span className="bg-brand-accent text-brand-dark text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">熱門首選</span>}
                        </div>
                        <p className="text-[10px] text-white/50">{pkg.perk}</p>
                        <p className="text-[9px] font-mono text-brand-accent font-semibold flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>解鎖 {pkg.counts} 位紳士資料卡</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-mono font-bold text-brand-accent block">NT$ {pkg.price}</span>
                        <button
                          type="button"
                          onClick={() => triggerPackagePurchase(pkg)}
                          className="mt-1 text-[9px] bg-brand-olive text-white px-3 py-1.5 rounded-full font-bold hover:bg-[#4d4d36] transition-all cursor-pointer"
                        >
                          立即開通
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. SIMULATED CHECKOUT GATEWAY */}
      <AnimatePresence>
        {showPaymentModal && selectedPackage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141412] rounded-[2.5rem] border border-white/10 w-full max-w-sm overflow-hidden z-10 p-6 text-center space-y-6 relative"
            >
              <div className="space-y-1">
                <CreditCard className="w-8 h-8 text-brand-accent mx-auto animate-bounce" />
                <h3 className="font-serif text-base text-white font-bold uppercase tracking-wider">尊榮會員金流安全通道</h3>
                <p className="text-[10px] text-brand-light font-mono">Secured by SSL 256-Bit Encryption</p>
              </div>

              <div className="bg-[#1a1a17] p-4 rounded-2xl border border-white/5 text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">開通品項:</span>
                  <span className="text-white font-bold">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">配對額度:</span>
                  <span className="text-brand-accent font-mono font-bold">+{selectedPackage.counts} 次配對</span>
                </div>
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-white/80 font-bold">支付金額:</span>
                  <span className="text-brand-accent font-bold">NT$ {selectedPackage.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  id="btn-execute-simulated-payment"
                  onClick={executePayment}
                  className="w-full py-3.5 bg-brand-accent text-brand-dark rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#b5c29d] transition-all cursor-pointer shadow-md hover:scale-102 active:scale-98"
                >
                  確認支付並獲取次數 (Simulated Pay)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPackage(null);
                  }}
                  className="w-full py-2 bg-transparent text-white/40 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  取消
                </button>
              </div>

              <p className="text-[8px] text-white/30 leading-normal max-w-xs mx-auto">
                * 本平台金流串接為沙盒模擬環境，不收取任何實質費用。點擊按鈕後次數將立即儲存到本地瀏覽器快取。
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. AI MATCHING LOADER OVERLAY */}
      <AnimatePresence>
        {matchingCode && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0d0d0b]/90 backdrop-blur-xl"
            />

            <div className="z-10 text-center space-y-6 max-w-xs">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-accent border-r-brand-olive"
                />
                <Heart className="w-8 h-8 text-brand-accent fill-current animate-pulse" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-lg font-bold text-white tracking-wider">AI 向量共鳴比對中</h4>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-accent transition-all duration-100" 
                    style={{ width: `${matchingProgress}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono font-semibold text-brand-accent tracking-widest">{matchingProgress}%</p>
              </div>

              <p className="text-xs text-white/60 italic leading-relaxed animate-pulse min-h-[3em]">
                {matchingMessage}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. LINE PRIVATE CHANNEL MODAL */}
      <AnimatePresence>
        {showLineModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLineModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#141412] rounded-[2.5rem] border border-white/10 w-full max-w-md overflow-hidden z-10 text-left relative shadow-2xl"
            >
              {/* Glowing decorative corners */}
              <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-accent/40 rounded-tl-lg" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-accent/40 rounded-tr-lg" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-accent/40 rounded-bl-lg" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-accent/40 rounded-br-lg" />

              {/* Header */}
              <div className="p-6 bg-[#1a1a17] border-b border-white/5 text-center">
                <div className="w-10 h-10 bg-[#06C755]/20 rounded-full flex items-center justify-center mx-auto mb-2 text-[#06C755]">
                  <Sparkle className="w-5 h-5 fill-current animate-pulse" />
                </div>
                <h3 className="font-serif text-base text-white font-bold tracking-wide">與 {selectedGentName} 建立專屬通道</h3>
                <p className="text-[9px] text-brand-accent uppercase tracking-widest mt-1">Establish Private Match Channel</p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <p className="text-xs text-white/70 leading-relaxed text-center">
                  系統已成功為您生成加密的 <strong className="text-brand-accent">加密戀人序號</strong>。<br />
                  此序號受 NDA 保密條約保護，可防止外界非法枚舉與隱私關聯。
                </p>

                {/* Token Box */}
                <div className="bg-black/50 p-4.5 rounded-2xl border border-white/5 flex flex-col items-center gap-3">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">🔒 專屬加密戀人序號</span>
                  <div className="font-mono text-xs font-bold text-brand-accent text-center bg-white/5 py-2 px-4 rounded-xl border border-white/10 w-full select-all break-all">
                    {generatedToken}
                  </div>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedToken);
                      setCopiedToken(true);
                      showToast("加密序號複製成功！", "success");
                    }}
                    className="py-1.5 px-4 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{copiedToken ? "✓ 已複製序號" : "複製加密序號"}</span>
                  </button>
                </div>

                <div className="bg-[#1a1a17] p-4 rounded-2xl border border-white/5 text-xs text-white/60 leading-relaxed space-y-2">
                  <div className="flex gap-1.5">
                    <span className="text-brand-accent shrink-0">1.</span>
                    <span>請點擊下方按鈕複製序號並進入 LINE 聯絡專屬客服。</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-brand-accent shrink-0">2.</span>
                    <span>在對話視窗貼上此加密序號，顧問將在雙向授權的情況下為您安排後續引導。</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={selectedGentLineUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedToken);
                      setShowLineModal(false);
                    }}
                    className="w-full py-3.5 bg-[#06C755] hover:bg-[#05b04b] text-white rounded-full text-xs font-bold uppercase tracking-widest text-center block transition-all shadow-md cursor-pointer"
                  >
                    <span>複製序號並開啟 LINE 專屬代表</span>
                  </a>
                  
                  <button
                    type="button"
                    onClick={() => setShowLineModal(false)}
                    className="w-full py-2 text-white/40 hover:text-white text-xs transition-colors cursor-pointer text-center block"
                  >
                    返回
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 flex justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-bold tracking-wide flex items-center justify-center gap-2 w-full text-center pointer-events-auto ${
                toast.type === "success"
                  ? "bg-[#4d4d36]/95 border-brand-accent/20 text-white"
                  : toast.type === "error"
                    ? "bg-red-950/95 border-red-500/20 text-white"
                    : "bg-brand-dark/95 border-brand-border/20 text-white"
              }`}
            >
              {toast.type === "success" && <Sparkles className="w-3.5 h-3.5 text-brand-accent fill-current shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
