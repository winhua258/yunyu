import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  Heart, 
  UserPlus, 
  Sparkles, 
  LogOut, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Gem, 
  UploadCloud, 
  Search, 
  RefreshCw,
  Edit2
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useData } from "./DataContext";
import { verifyAuthCode, TEMPLATE_EXCLUDED_CODES, requestPhotoChange, updateLadyName } from "../data";
import { Profile } from "../types";


// 僅在開發環境顯示調試工具（生產環境自動隱藏）
const IS_DEV = (import.meta as any).env?.DEV === true || (import.meta as any).env?.MODE === "development";

const PLACEHOLDER_PROFILES = [
  {
    code: "Y-8201",
    name: "張*維",
    age: 39,
    location: "臺北市",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  },
  {
    code: "Y-3914",
    name: "林*廷",
    age: 43,
    location: "新竹市",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  },
  {
    code: "Y-1082",
    name: "陳*翔",
    age: 36,
    location: "臺中市",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  },
  {
    code: "Y-7482",
    name: "黃*華",
    age: 45,
    location: "桃園市",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  },
  {
    code: "Y-5529",
    name: "李*誠",
    age: 41,
    location: "臺南市",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  },
  {
    code: "Y-6691",
    name: "王*澤",
    age: 38,
    location: "高雄市",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  },
  {
    code: "Y-2810",
    name: "謝*宇",
    age: 44,
    location: "臺北市",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  },
  {
    code: "Y-9034",
    name: "周*豪",
    age: 37,
    location: "宜蘭縣",
    tagline: "...",
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300",
    isPlaceholder: true,
  }
];

interface VerificationScreenProps {
  onVerifySuccess: (code: string, role?: string) => void;
  onSoulMatchClick?: () => void;
}

export default function VerificationScreen({ onVerifySuccess, onSoulMatchClick }: VerificationScreenProps) {
  const { profiles, isDataLoading, refreshData } = useData();
  const { loggedInLadyCode, login, register, ladyProfiles, logout, simulateAssets, updateLadyProfile } = useAuth();
  
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [ladyCodeInput, setLadyCodeInput] = useState("");
  const [ladyError, setLadyError] = useState("");
  const [showLadyLoginInput, setShowLadyLoginInput] = useState(false);
  
  // Dashboard & Unlock states
  const [gentlemanCodeInput, setGentlemanCodeInput] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTargetProfile, setUpgradeTargetProfile] = useState<any>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [showLadyAlertModal, setShowLadyAlertModal] = useState(false);
  const [ladyAlertTitle, setLadyAlertTitle] = useState("");
  const [ladyAlertMessage, setLadyAlertMessage] = useState("");
  const [ladyAlertCode, setLadyAlertCode] = useState("");
  const [ladyAlertCopied, setLadyAlertCopied] = useState(false);

  const lady = loggedInLadyCode ? ladyProfiles[loggedInLadyCode] : null;

  // 自動同步最新的麗人資料，並持久化備份 UUID 至 history 緩存中（登出時不清除）
  React.useEffect(() => {
    if (loggedInLadyCode) {
      login(loggedInLadyCode).catch((e) => console.error("Sync lady error:", e));
      localStorage.setItem("yuanyu_lady_code_history", loggedInLadyCode);
    }
  }, [loggedInLadyCode]);

  // 初始化時，如果登入輸入框為空，自動讀取 history 緩存預填入輸入框中
  React.useEffect(() => {
    const historyCode = localStorage.getItem("yuanyu_lady_code_history");
    if (historyCode && !ladyCodeInput) {
      setLadyCodeInput(historyCode);
    }
  }, []);

  const handleAvatarClick = () => {
    if (!lady) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    // 限制自拍 (開通前置攝像頭)
    input.setAttribute("capture", "user");
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("⚠️ 上傳失敗：請選擇正確的圖片檔案（例如 JPG、PNG 格式的自拍照）！");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("⚠️ 上傳失敗：自拍照檔案大小不能超過 2MB，請壓縮或更換小於 2MB 的圖片！");
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        setPhotoUploading(true);
        try {
          const updatedLady = await requestPhotoChange(lady.code, reader.result as string);
          updateLadyProfile(updatedLady);
          alert("🎉 自拍頭像已成功提交審核！請靜候主控核驗，核驗通過後您的頭像將會自動更換。");
        } catch (err: any) {
          alert("⚠️ 頭像提交審核失敗！請確保圖片格式正確且網絡連線正常，或請稍後再試。");
        } finally {
          setPhotoUploading(false);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleSaveName = async () => {
    if (!lady) return;
    const trimmed = editNameInput.trim();
    if (!trimmed) {
      alert("名稱不可為空！");
      return;
    }
    try {
      const updatedLady = await updateLadyName(lady.code, trimmed);
      updateLadyProfile(updatedLady);
      setIsEditingName(false);
    } catch (err: any) {
      alert(err.message || "修改名稱失敗，請重試。");
    }
  };

  // 統一驗證接口
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sanitizedCode = code.trim();

    if (!sanitizedCode) {
      setError("請輸入專屬戀人編號");
      return;
    }

    try {
      setError("");
      const response = await verifyAuthCode(sanitizedCode);
      
      // 如果是管理員角色，背景刷新後台資料（不阻塞流程）
      if (response.role === "admin") {
        void refreshData(sanitizedCode);
      }
      
      setIsSuccess(true);
      // 直接把 server 回傳的 role 傳給父層，不依賴非同步 adminCodes 狀態
      setTimeout(() => {
        onVerifySuccess(sanitizedCode, response.role);
      }, 900);
    } catch (err: any) {
      setError(err.message || "查無此編號，請確認您的編號是否正確");
    }
  };

  const handleLadyRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLadyError("");
    try {
      const { lady, isNew } = await register();
      setLadyAlertCode(lady.code);
      setLadyAlertCopied(false);
      if (isNew) {
        setLadyAlertTitle("🌸 歡迎加入緣友！");
        setLadyAlertMessage("您的專屬麗人編號已成功建立。請截圖或複製保存此編號，以便日後更換設備時恢復帳戶。系統已為您自動登入，祝您找到心儀的另一半 ✨");
      } else {
        setLadyAlertTitle("✅ 歡迎回來！");
        setLadyAlertMessage("我們偵測到您的設備已有註冊記錄，已自動為您載入原有帳戶。如需查看配對結果，請繼續完成靈魂測驗 💫");
      }
      setShowLadyAlertModal(true);
    } catch (err: any) {
      setLadyError(err.message || "註冊失敗，請稍後再試。");
    }
  };

  const handleLadyLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLadyError("");
    const sanitizedCode = ladyCodeInput.trim();
    if (!sanitizedCode) {
      setLadyError("請輸入您的麗人編號。");
      return;
    }
    try {
      await login(sanitizedCode);
      setLadyCodeInput("");
    } catch (err: any) {
      setLadyError(err.message || "登入失敗，請檢查編號是否正確。");
    }
  };

  // 處理自定義輸入紳士代號解鎖
  const handleUnlockCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError("");
    const inputCode = gentlemanCodeInput.trim();
    if (!inputCode) {
      setUnlockError("請輸入男生編號");
      return;
    }

    const targetProfile = profiles[inputCode];
    if (!targetProfile) {
      setUnlockError("查無此編號的紳士資料卡");
      return;
    }

    // 排除模板
    if (TEMPLATE_EXCLUDED_CODES.includes(inputCode)) {
      setUnlockError("此編號為範本用戶，不可用於匹配");
      return;
    }

    executeUnlockFlow(targetProfile);
  };

  // 執行解鎖判斷與請求
  const executeUnlockFlow = async (targetProfile: any) => {
    if (targetProfile.isPlaceholder) {
      // 特約隱私男賓：顯示升級面板，三個選項均為暫不支持
      setUpgradeTargetProfile(targetProfile);
      setShowUpgradeModal(true);
      return;
    }
    const inputCode = targetProfile.code;
    const unlockedList = lady?.unlockedGentlemanCodes || [];
    const isUnlocked = unlockedList.includes(inputCode) || lady?.matchedGentlemanCode === inputCode;

    if (isUnlocked) {
      onVerifySuccess(inputCode);
      return;
    }

    const level = lady?.membershipLevel || "free";
    const verified = lady?.assetVerified || "none";

    // 1. VIP 或已驗資成功：直接解鎖
    if (level === "vip" || verified === "approved") {
      try {
        const updatedUnlocked = [...unlockedList, inputCode];
        await simulateAssets(level, verified, updatedUnlocked);
        onVerifySuccess(inputCode);
      } catch (err: any) {
        setUnlockError("解鎖資料卡失敗，請重試");
      }
    } 
    // 2. 體驗會員：限制解鎖最多 2 位
    else if (level === "experience") {
      if (unlockedList.length < 2) {
        try {
          const updatedUnlocked = [...unlockedList, inputCode];
          await simulateAssets(level, verified, updatedUnlocked);
          onVerifySuccess(inputCode);
        } catch (err: any) {
          setUnlockError("解鎖資料卡失敗，請重試");
        }
      } else {
        setUpgradeTargetProfile(targetProfile);
        setShowUpgradeModal(true);
      }
    } 
    // 3. 免費方案：禁止解鎖配對以外的紳士
    else {
      setUpgradeTargetProfile(targetProfile);
      setShowUpgradeModal(true);
    }
  };

  // 測試模擬器接口
  const handleSimulateChange = async (level: string, verified: string) => {
    if (!lady) return;
    setSimulating(true);
    try {
      await simulateAssets(level, verified, lady.unlockedGentlemanCodes);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  // 重置 AI 靈魂測試與已解鎖列表用於測試
  const handleResetLadyState = async () => {
    if (!lady) return;
    setSimulating(true);
    try {
      await simulateAssets("experience", "none", [], false, null);
      alert("已重置該麗人帳戶至初始狀態（免費、未測驗、零解鎖）！");
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  // 檢查某男生代號是否解鎖
  const checkIsUnlocked = (gentCode: string) => {
    if (!lady) return false;
    if (lady.matchedGentlemanCode === gentCode) return true;
    if (lady.unlockedGentlemanCodes?.includes(gentCode)) return true;
    return false;
  };

  // 過濾用：列出全體可配對紳士（排除模板、排除已關閉配對的紳士）
  const gentlemanList = [
    ...(Object.values(profiles) as Profile[]).filter(
      (p) => !TEMPLATE_EXCLUDED_CODES.includes(p.code) && (p.isAcceptingMatches !== false)
    ),
    ...PLACEHOLDER_PROFILES
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative py-12 px-4 md:px-12 bg-brand-beige overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-brand-border/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-brand-border/50 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Intro Header */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-light font-bold">
            Private Elite Matchmaking // 會員制尊榮媒合
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-brand-dark font-semibold leading-tight tracking-widest">
            緣友 YUAN-YU
          </h1>
          <p className="text-xs md:text-sm text-brand-muted max-w-2xl mx-auto leading-relaxed px-4">
            為維護極致高端與互信的交友生態，本平台實施尊享隱私通道：<br className="hidden md:inline" />
            紳士須通過實名驗資，麗人通過 AI 靈魂測驗即可解鎖首位契合伴侶，並依套餐解鎖更多紳士。
          </p>
        </div>

        {isSuccess ? (
          // Success login animation overlay
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-brand-border/60 text-center space-y-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-16 h-16 bg-brand-accent/30 text-brand-olive rounded-full flex items-center justify-center mx-auto border border-brand-accent/50"
            >
              <ShieldCheck className="w-8 h-8 fill-current" />
            </motion.div>
            <h3 className="font-serif text-2xl font-bold text-brand-dark">驗證成功</h3>
            <p className="text-sm text-brand-muted">正在啟用您專屬的安全媒合通道，請稍後...</p>
          </div>
        ) : lady ? (
          /* ========================================================================= */
          /* LADY LOGGED IN DASHBOARD (麗人尊榮交友面板) */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-brand-border/60 backdrop-blur-md space-y-6">
              {/* Lady Card Summary */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-brand-border/10 rounded-2xl border border-brand-border/40 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative cursor-pointer group" onClick={handleAvatarClick} title="點擊上傳新頭像">
                    <img 
                      src={lady.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                      alt={lady.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-brand-olive/40 group-hover:opacity-85 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-brand-accent text-brand-olive p-0.5 rounded-full border border-white">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                    </div>
                    {photoUploading && (
                      <div className="absolute inset-0 bg-brand-dark/50 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {isEditingName ? (
                        <div className="flex items-center gap-1.5 bg-white border border-brand-border rounded-xl px-2 py-1 shadow-inner">
                          <input
                            type="text"
                            value={editNameInput}
                            onChange={(e) => setEditNameInput(e.target.value)}
                            className="bg-transparent text-xs font-bold text-brand-dark focus:outline-none w-28 md:w-36 font-sans"
                            placeholder="輸入麗人名稱"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveName();
                              if (e.key === "Escape") setIsEditingName(false);
                            }}
                          />
                          <button
                            onClick={handleSaveName}
                            className="px-2 py-0.5 bg-brand-olive hover:bg-[#4d4d36] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            儲存
                          </button>
                          <button
                            onClick={() => setIsEditingName(false)}
                            className="px-2 py-0.5 border border-brand-border hover:bg-brand-border/10 text-brand-muted text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <h3 className="font-serif text-lg font-bold text-brand-dark">{lady.name}</h3>
                          <button
                            onClick={() => {
                              setEditNameInput(lady.name);
                              setIsEditingName(true);
                            }}
                            className="p-1 text-brand-light hover:text-brand-olive hover:bg-brand-border/20 rounded transition-all cursor-pointer"
                            title="修改名稱"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] text-brand-light font-mono font-bold bg-white px-2 py-0.5 rounded">
                        編號: {lady.code.slice(0, 8)}...
                      </span>
                      {lady.pendingPhotoUrl && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                          頭像審核中
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {/* Subscription package badge */}
                      {lady.membershipLevel === "vip" ? (
                        <span className="text-[9px] bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Gem className="w-2.5 h-2.5" /> 尊榮 VIP 會員
                        </span>
                      ) : lady.membershipLevel === "experience" ? (
                        <span className="text-[9px] bg-brand-olive text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> 體驗方案會員
                        </span>
                      ) : (
                        <span className="text-[9px] bg-brand-muted/20 text-brand-light font-bold px-2 py-0.5 rounded-full">
                          免費體驗方案
                        </span>
                      )}

                      {/* Wealth verification badge */}
                      {lady.assetVerified === "approved" ? (
                        <span className="text-[9px] bg-[#06C755]/15 text-[#05b04b] border border-[#06C755]/30 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 已通過官方驗資
                        </span>
                      ) : lady.assetVerified === "pending" ? (
                        <span className="text-[9px] bg-amber-500/15 text-amber-700 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full animate-pulse">
                          驗資審核中
                        </span>
                      ) : (
                        <span className="text-[9px] bg-brand-light/10 text-brand-light font-bold px-2 py-0.5 rounded-full border border-brand-border/40">
                          未驗資
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!lady) return;
                      try {
                        await login(lady.code);
                        alert("🔄 帳號狀態已更新！");
                      } catch (e) {
                        alert("重新整理失敗，請重試。");
                      }
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-3 border border-brand-border hover:bg-brand-border/20 text-brand-olive rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>重新整理</span>
                  </button>

                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 py-1.5 px-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>登出麗人</span>
                  </button>
                </div>
              </div>

              {/* Upper Section: Match and Lookup grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Action 1: AI Soul Match */}
                <div className="p-5 bg-brand-beige/30 rounded-2xl border border-brand-border/40 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-dark flex items-center gap-2">
                      <Heart className="w-4.5 h-4.5 text-brand-olive fill-current" />
                      <span>AI 靈魂共鳴配對</span>
                    </h4>
                    <p className="text-xs text-brand-muted leading-relaxed mt-2">
                      透過 20 維度的契合度運算法，獲取最切合您的靈魂伴侶。活動期間完全免費解鎖首張名片。
                    </p>
                  </div>

                  {lady.quizTaken && lady.matchedGentlemanCode ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => onVerifySuccess(lady.matchedGentlemanCode!)}
                        className="w-full py-3 px-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-brand-accent fill-current" />
                        <span>查看契合紳士 ({lady.matchedGentlemanCode})</span>
                      </button>
                      <p className="text-[10px] text-center text-brand-light leading-relaxed italic">
                        * 每人限測配對一次。重複點擊將直接進入該優質男性資料卡。
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={onSoulMatchClick}
                      className="w-full py-3 px-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-brand-accent fill-current animate-pulse" />
                      <span>開啟「AI 靈魂特質探索」</span>
                    </button>
                  )}
                </div>

                {/* Action 2: Unlock Card by Code */}
                <form 
                  onSubmit={handleUnlockCodeSubmit}
                  className="p-5 bg-brand-beige/30 rounded-2xl border border-brand-border/40 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-dark flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand-olive" />
                      <span>輸入編號解鎖資料卡</span>
                    </h4>
                    <p className="text-xs text-brand-muted leading-relaxed mt-2">
                      搭配推薦信或付費方案，輸入其他紳士唯一的推薦編號，即可解鎖看對方的全量資料及 LINE。
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gentlemanCodeInput}
                        onChange={(e) => {
                          setGentlemanCodeInput(e.target.value);
                          setUnlockError("");
                        }}
                        placeholder="請輸入男生編號 (如 gent001)"
                        className="flex-1 bg-white border border-brand-border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20"
                      />
                      <button
                        type="submit"
                        className="py-2.5 px-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>解鎖</span>
                      </button>
                    </div>
                    
                    {unlockError ? (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{unlockError}</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-brand-light leading-relaxed">
                        {lady.membershipLevel === "vip" || lady.assetVerified === "approved"
                          ? "提示：您當前擁有全站解鎖特權，隨意輸入皆可點擊瀏覽。"
                          : lady.membershipLevel === "experience"
                          ? `體驗會員解鎖上限為 2 位 (目前已使用 ${lady.unlockedGentlemanCodes?.length || 0} / 2)。`
                          : "免費方案僅限查閱 AI 配對對象，解鎖全量請升級或驗資。"}
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* Lower Section: Gentleman catalog list */}
              <div className="space-y-4 pt-2">
                <div className="border-t border-brand-border/40 pt-6">
                  <h4 className="font-serif text-lg font-bold text-brand-dark tracking-wide flex items-center gap-2">
                    <Gem className="w-5 h-5 text-brand-olive" />
                    <span>緣友高端男賓庫 (GENTLEMAN LIST)</span>
                  </h4>
                  <p className="text-xs text-brand-muted leading-relaxed mt-1">
                    全平台男賓皆已通過實名與千萬級線下資產核對。點擊已解鎖卡片以直接查看或聯絡！
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gentlemanList.map((p) => {
                    const isUnlocked = checkIsUnlocked(p.code);
                    return (
                      <div
                        key={p.code}
                        onClick={() => executeUnlockFlow(p)}
                        className={`group relative rounded-2xl overflow-hidden border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                          isUnlocked
                            ? "bg-brand-beige/20 hover:bg-brand-beige/50 border-brand-border hover:shadow-md"
                            : "bg-brand-light/5 border-dashed border-brand-border/60 hover:border-brand-olive/40"
                        }`}
                      >
                        {/* Status Label Overlay */}
                        <div className="absolute top-2 right-2 z-20 flex gap-1">
                          {lady.matchedGentlemanCode === p.code && (
                            <span className="text-[8px] bg-brand-accent text-brand-olive font-bold px-1.5 py-0.5 rounded shadow-sm">
                              AI 配對
                            </span>
                          )}
                          {isUnlocked ? (
                            <span className="text-[8px] bg-[#06C755]/10 text-[#05b04b] font-bold px-1.5 py-0.5 rounded">
                              已解鎖
                            </span>
                          ) : (
                            <span className="text-[8px] bg-brand-light/10 text-brand-light font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Lock className="w-2 h-2" /> 鎖定
                            </span>
                          )}
                        </div>

                        {/* Image area */}
                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-2.5">
                          <img
                            src={p.imageUrl}
                            alt=""
                            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                              isUnlocked ? "" : "blur-md opacity-40"
                            }`}
                          />
                          {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Lock className="w-6 h-6 text-brand-olive/60" />
                            </div>
                          )}
                        </div>

                        {/* Detail text */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-brand-light font-mono font-bold">
                              {isUnlocked ? p.code : "編號: ****"}
                            </span>
                            <span className="text-[10px] text-brand-muted font-bold">{p.age} 歲 · {p.location}</span>
                          </div>
                          <h5 className={`font-serif text-sm font-bold ${isUnlocked ? "text-brand-dark" : "text-brand-muted"}`}>
                            {isUnlocked ? p.name : "未解鎖優質男賓"}
                          </h5>
                          <p className="text-[10px] text-brand-light truncate">
                            {isUnlocked ? p.tagline : "點擊此卡片申請解鎖預覽"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LADY DEV TEST CONTROLLER - DEV ONLY */}
            {IS_DEV && (
              <div className="bg-brand-dark/10 p-5 rounded-3xl border border-brand-border/40">
                <button
                  onClick={() => setShowSimulator(!showSimulator)}
                  className="w-full flex items-center justify-between text-xs font-bold text-brand-dark hover:text-brand-olive transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${simulating ? "animate-spin" : ""}`} />
                    <span>🧪 [DEV] 測試調試器：快速切換女方套餐或驗資狀態</span>
                  </div>
                  <span>{showSimulator ? "收合 [-]" : "展開 [+]"}</span>
                </button>

                <AnimatePresence>
                  {showSimulator && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-4 pt-4 mt-2 border-t border-brand-border/40 text-xs"
                    >
                      <p className="text-[11px] text-brand-light">
                        您可以切換女方的付費套餐與資產驗證，即可體驗「不同套餐對應解鎖多個卡片預覽數」的判定邏輯。
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Subscription simulation selector */}
                        <div className="space-y-1.5">
                          <label className="font-bold text-brand-dark">套餐等級 (Membership Grade)：</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSimulateChange("free", lady.assetVerified || "none")}
                              disabled={simulating}
                              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                                lady.membershipLevel === "free" || !lady.membershipLevel
                                  ? "bg-white border-brand-olive text-brand-olive shadow-sm"
                                  : "bg-transparent border-brand-border hover:bg-white text-brand-light"
                              }`}
                            >
                              免費體驗 (Free)
                            </button>
                            <button
                              onClick={() => handleSimulateChange("experience", lady.assetVerified || "none")}
                              disabled={simulating}
                              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                                lady.membershipLevel === "experience"
                                  ? "bg-white border-brand-olive text-brand-olive shadow-sm"
                                  : "bg-transparent border-brand-border hover:bg-white text-brand-light"
                              }`}
                            >
                              體驗方案 (Limit 2)
                            </button>
                            <button
                              onClick={() => handleSimulateChange("vip", lady.assetVerified || "none")}
                              disabled={simulating}
                              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                                lady.membershipLevel === "vip"
                                  ? "bg-white border-brand-olive text-brand-olive shadow-sm"
                                  : "bg-transparent border-brand-border hover:bg-white text-brand-light"
                              }`}
                            >
                              尊榮 VIP
                            </button>
                          </div>
                        </div>

                        {/* Wealth verification status selector */}
                        <div className="space-y-1.5">
                          <label className="font-bold text-brand-dark">驗資審核狀態 (Asset Verified)：</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSimulateChange(lady.membershipLevel || "free", "none")}
                              disabled={simulating}
                              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                                lady.assetVerified === "none" || !lady.assetVerified
                                  ? "bg-white border-brand-olive text-brand-olive shadow-sm"
                                  : "bg-transparent border-brand-border hover:bg-white text-brand-light"
                              }`}
                            >
                              未驗資 (none)
                            </button>
                            <button
                              onClick={() => handleSimulateChange(lady.membershipLevel || "free", "pending")}
                              disabled={simulating}
                              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                                lady.assetVerified === "pending"
                                  ? "bg-white border-brand-olive text-brand-olive shadow-sm"
                                  : "bg-transparent border-brand-border hover:bg-white text-brand-light"
                              }`}
                            >
                              審核中 (pending)
                            </button>
                            <button
                              onClick={() => handleSimulateChange(lady.membershipLevel || "free", "approved")}
                              disabled={simulating}
                              className={`flex-1 py-1.5 px-3 rounded-lg border text-[11px] font-bold transition-all ${
                                lady.assetVerified === "approved"
                                  ? "bg-white border-brand-olive text-brand-olive shadow-sm"
                                  : "bg-transparent border-brand-border hover:bg-white text-brand-light"
                              }`}
                            >
                              驗資成功 (approved)
                            </button>
                          </div>
                        </div>

                      </div>

                      <div className="flex items-center justify-between border-t border-brand-border/30 pt-3">
                        <span>已手動解鎖編號數：<strong>{lady.unlockedGentlemanCodes?.length || 0}</strong></span>
                        <button
                          onClick={handleResetLadyState}
                          disabled={simulating}
                          className="py-1 px-3 bg-red-600 hover:bg-red-750 text-white rounded text-[10px] font-bold transition-all"
                        >
                          重置該麗人 AI 測驗與解鎖 (重頭測試)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          // GUEST VIEW: Split verification for Gentlemen + Ladies
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-brand-border/60 relative overflow-hidden backdrop-blur-md">
            
            {/* Center vertical line */}
            <div className="hidden md:block absolute inset-y-12 left-1/2 w-px bg-gradient-to-b from-brand-border/10 via-brand-border/80 to-brand-border/10" />

            {/* LEFT COLUMN: GENTLEMEN (紳士通道) */}
            <div className="flex flex-col justify-between p-2 md:p-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-olive/10 flex items-center justify-center text-brand-olive border border-brand-olive/20 shadow-inner shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-brand-dark tracking-wide">
                      紳士專屬驗資通道
                    </h3>
                    <span className="text-[9px] md:text-[10px] text-brand-light font-bold uppercase tracking-widest font-mono">
                      Gentlemen Verification
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                  為確保交友生態之安全防範與傑出素質，紳士會員須提交實名核驗與資產審核，經理財顧問核准後由專屬專員人工發放<strong>「戀人編號」</strong>登入。
                </p>
              </div>

              {/* Secure verification code input */}
              <form id="form-verification" onSubmit={handleVerify} className="space-y-4 pt-2">
                <div className="relative">
                  <input
                    id="input-verification-code"
                    type="text"
                    maxLength={36}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isSuccess}
                    placeholder="請輸入專屬戀人編號"
                    className={`w-full bg-brand-beige/50 text-center tracking-[0.25em] font-mono text-base font-bold placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-xs placeholder:text-brand-light/70 text-brand-dark py-3.5 px-6 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-olive/20 ${
                      error 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-brand-border focus:border-brand-olive focus:bg-white"
                    }`}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-center gap-1.5 text-xs text-red-650 font-bold"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </motion.p>
                )}

                <button
                  id="btn-verify-submit"
                  type="submit"
                  disabled={isSuccess}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
                    isSuccess
                      ? "bg-brand-accent text-brand-dark shadow-sm cursor-default"
                      : "bg-brand-olive text-white hover:bg-[#4d4d36] hover:shadow-lg active:scale-98"
                  }`}
                >
                  <span>{isSuccess ? "驗證成功，正在載入" : "認證並進入系統"}</span>
                  {!isSuccess && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  id="btn-show-contact-modal"
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  className="text-[11px] text-brand-light hover:text-brand-olive font-bold tracking-wider uppercase transition-colors duration-200 underline underline-offset-4 decoration-brand-border hover:decoration-brand-olive"
                >
                  無專屬編號？洽詢專屬客服進行驗資
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: LADIES (麗人免資產驗證通道) */}
            <div className="flex flex-col justify-between p-2 md:p-4 bg-brand-border/10 rounded-2xl md:bg-transparent md:rounded-none space-y-6 relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-brand-accent text-brand-olive text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                PROMO 限時特許
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-olive border border-brand-accent/30 shadow-inner shrink-0">
                    <Heart className="w-5 h-5 text-brand-olive fill-current" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-brand-dark tracking-wide">
                      麗人限時推廣通道
                    </h3>
                    <span className="text-[9px] md:text-[10px] text-brand-light font-bold uppercase tracking-widest font-mono">
                      Ladies Campaign
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                  適逢推廣期間，麗人免除年收驗資！即可直接登入或註冊，完成 2 分鐘 AI 測試後以分配解鎖一位頂級高品質契合紳士。
                </p>
              </div>

              {/* Login/Registration logic */}
              <div className="space-y-4 pt-2">
                {/* 1. Primary Action: AI test (Highest Weight) */}
                <div className="space-y-2">
                  <button
                    id="btn-guest-soul-match-direct"
                    type="button"
                    onClick={onSoulMatchClick}
                    className="w-full py-3.5 px-6 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
                  >
                    <Heart className="w-4 h-4 text-brand-accent fill-current animate-pulse animate-duration-1000 animate-infinite" />
                    <span>免費開始 AI 靈魂配對測試</span>
                  </button>
                  <p className="text-[9.5px] text-center text-brand-muted font-medium leading-relaxed">
                    🎯 首次訪問推薦：直接開始測驗，免除資產審核並在配對成功後自動建檔
                  </p>
                </div>

                {/* 2. Secondary Action: Create Code */}
                <button
                  type="button"
                  onClick={handleLadyRegister}
                  className="w-full py-2.5 px-6 bg-white border border-brand-border hover:bg-brand-border/10 text-brand-olive text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-sm cursor-pointer hover:scale-101 active:scale-99 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-brand-olive shrink-0" />
                  <span>註冊新麗人帳戶編號</span>
                </button>

                {/* 3. Folded Lower Weight Action: Transfer/Login (Toggled) */}
                <div className="pt-3 border-t border-brand-border/30">
                  <button
                    type="button"
                    onClick={() => setShowLadyLoginInput(!showLadyLoginInput)}
                    className="w-full text-center text-[10px] text-brand-light hover:text-brand-olive font-bold tracking-wider flex items-center justify-center gap-1.5 py-1 cursor-pointer transition-colors"
                  >
                    <span>已有麗人帳號？點此進行「設備轉移與登入」</span>
                    <ChevronDown className={`w-3.5 h-3.5 transform transition-transform duration-300 ${showLadyLoginInput ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showLadyLoginInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-3 pt-3"
                      >
                        <p className="text-[9px] text-brand-light leading-relaxed bg-brand-border/5 p-2.5 rounded-xl border border-brand-border/20">
                          ℹ️ <strong>帳號轉移提示：</strong> 當您在不同手機/電腦，或清除快取後需要恢復資料時，請輸入原有的麗人編號進行載入。
                        </p>
                        
                        {ladyError && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1 text-[10px] text-red-650 font-bold"
                          >
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{ladyError}</span>
                          </motion.p>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={ladyCodeInput}
                            onChange={(e) => {
                              setLadyCodeInput(e.target.value);
                              setLadyError("");
                            }}
                            placeholder="請輸入麗人編號 (UUID)"
                            className="flex-1 min-w-0 bg-white border border-brand-border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleLadyLogin}
                            className="py-2 px-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
                          >
                            確認登入
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        )}
      </motion.div>

      {/* ========================================================================= */}
      {/* CONTACT AGENT MODAL (洽詢客服彈窗) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl border border-brand-border w-full max-w-sm overflow-hidden z-10"
            >
              <div className="p-6 bg-brand-border/30 border-b border-brand-border text-center">
                <h3 className="font-serif text-lg text-brand-dark font-bold tracking-wide">
                  洽詢您的專屬媒合專員
                </h3>
                <p className="text-[11px] text-brand-light uppercase tracking-wider mt-1">
                  Private Client Matching Service
                </p>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-brand-muted leading-relaxed text-center mb-2">
                  閣下尚未獲發編號？為維理安全防波，緣友採全程代表發碼制。請撥打總部電話或加入客服進行資產實力認證登記：
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-brand-beige/40 rounded-2xl border border-brand-border/40 hover:bg-brand-beige/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#06C755]/10 flex items-center justify-center text-[#06C755]">
                        <MessageSquare className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-brand-dark">LINE 專屬客服專員</p>
                        <p className="text-[10px] text-brand-light font-mono">ID: @yuanyu</p>
                      </div>
                    </div>
                    <a
                      id="link-contact-line"
                      href="https://line.me/R/ti/p/@yuanyu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-[#06C755] text-white px-3 py-1.5 rounded-full font-bold hover:bg-[#05b04b] transition-all"
                    >
                      立即加入
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-brand-beige/40 rounded-2xl border border-brand-border/40 hover:bg-brand-beige/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-brand-dark">台北總部秘書專線</p>
                        <p className="text-[10px] text-brand-light font-mono">02-2736-8888</p>
                      </div>
                    </div>
                    <a
                      id="link-contact-phone"
                      href="tel:0227368888"
                      className="text-[10px] bg-brand-olive text-white px-3 py-1.5 rounded-full font-bold hover:opacity-90 transition-all font-mono"
                    >
                      撥打電話
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-border/20 border-t border-brand-border/50 text-center">
                <button
                  id="btn-contact-modal-close"
                  onClick={() => setShowContactModal(false)}
                  className="text-xs font-bold text-brand-olive uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer"
                >
                  返回驗證
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREMIUM UPGRADE + MOCK WEALTH VERIFICATION DIALOG */}
      <AnimatePresence>
        {showUpgradeModal && lady && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowUpgradeModal(false);
                setUpgradeTargetProfile(null);
              }}
              className="absolute inset-0 bg-brand-dark/50 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-brand-border w-full max-w-md overflow-hidden z-10 flex flex-col"
            >
              {/* Header with gradient theme */}
              <div className="bg-brand-olive p-6 text-center text-white space-y-1">
                <Gem className="w-8 h-8 text-brand-accent mx-auto fill-current animate-bounce" />
                <h3 className="font-serif text-lg font-bold tracking-wide">升級解鎖高端男賓預覽</h3>
                <p className="text-[10px] text-brand-accent uppercase tracking-widest font-mono">
                  Upgrade & Unlock Elite Access
                </p>
              </div>

              {/* Body details */}
              <div className="p-6 space-y-4 flex-1">
                {upgradeTargetProfile && (
                  <div className="flex items-center gap-3 p-3 bg-brand-beige/50 rounded-2xl border border-brand-border/40">
                    <img 
                      src={upgradeTargetProfile.imageUrl} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover blur-[4px] opacity-70"
                    />
                    <div>
                      <p className="text-[10px] text-brand-light font-bold">申請解鎖對象：</p>
                      <h4 className="font-serif text-sm font-bold text-brand-dark">
                        **** · {upgradeTargetProfile.age} 歲 · {upgradeTargetProfile.location}
                      </h4>
                    </div>
                  </div>
                )}

                <p className="text-xs text-brand-muted leading-relaxed">
                  很抱歉！根據 <strong>緣友 YUAN-YU</strong> 的安全媒合規範，您的麗人帳戶當前受限，無法查閱此位紳士的卡片。<br/>
                  請上傳資產證明（或點擊下方模擬動作）進行有感解鎖。
                </p>

                {/* Option Action Grid */}
                <div className="space-y-2.5 pt-2">
                  
                  {/* Option 1: Mock upload asset validation */}
                  <button
                    onClick={() => {
                      alert("⏳ 此功能暫不開放，敬請期待。");
                    }}
                    className="w-full flex items-center justify-between p-3 border border-[#06C755]/30 bg-[#06C755]/5 hover:bg-[#06C755]/10 rounded-2xl transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#06C755]/10 flex items-center justify-center text-[#06C755]">
                        <UploadCloud className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-brand-dark">免費進行「百萬資產驗證」</h5>
                        <p className="text-[9px] text-[#05b04b]">驗資成功將自動等同 VIP 權限 (永久解鎖)</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-light" />
                  </button>

                  {/* Option 2: Upgrade to Experience Package */}
                  <button
                    onClick={() => {
                      alert("⏳ 此功能暫不開放，敬請期待。");
                    }}
                    className="w-full flex items-center justify-between p-3 border border-brand-olive/30 bg-brand-olive/5 hover:bg-brand-olive/10 rounded-2xl transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive">
                        <Sparkles className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-brand-dark">購買「體驗媒合套餐」</h5>
                        <p className="text-[9px] text-brand-muted">解鎖包含靈魂匹配伴侶在內的 2 位名額</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-light" />
                  </button>

                  {/* Option 3: Upgrade to Full VIP */}
                  <button
                    onClick={() => {
                      alert("⏳ 此功能暫不開放，敬請期待。");
                    }}
                    className="w-full flex items-center justify-between p-3 border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 rounded-2xl transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Gem className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-brand-dark">升級「尊榮 VIP 奢華套餐」</h5>
                        <p className="text-[9px] text-brand-muted">全平台男賓無限查看、無限跳聯絡資訊</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-light" />
                  </button>

                </div>
              </div>

              {/* Close footer */}
              <div className="p-4 bg-brand-border/20 border-t border-brand-border/50 text-center">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    setUpgradeTargetProfile(null);
                  }}
                  className="text-xs font-bold text-brand-light hover:text-brand-dark transition-colors cursor-pointer"
                >
                  暫不升級，返回面板
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* LADY REGISTRATION / AUTO-LOGIN ALERT DIALOG */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showLadyAlertModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLadyAlertModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-brand-beige rounded-3xl shadow-2xl border border-brand-border w-full max-w-sm overflow-hidden z-10 flex flex-col p-6 text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-olive border border-brand-accent/30 shadow-inner">
                  <Sparkles className="w-6 h-6 text-brand-olive fill-current" />
                </div>
              </div>

              <h3 className="font-serif text-lg text-brand-dark font-bold tracking-wide">
                {ladyAlertTitle}
              </h3>

              <p className="text-xs text-brand-muted leading-relaxed">
                {ladyAlertMessage}
              </p>

              {ladyAlertCode && (
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-brand-light uppercase tracking-wider block">您的專屬麗人編號</span>
                  <div className="bg-white p-3 rounded-2xl border border-brand-border/60 flex items-center justify-between gap-2 shadow-inner">
                    <span className="text-xs text-brand-dark font-mono font-bold break-all select-all">{ladyAlertCode}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(ladyAlertCode).catch(() => {});
                        setLadyAlertCopied(true);
                        setTimeout(() => setLadyAlertCopied(false), 2000);
                      }}
                      className="py-1 px-3 bg-brand-olive hover:bg-[#4d4d36] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      {ladyAlertCopied ? "已複製 ✓" : "複製"}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowLadyAlertModal(false)}
                className="w-full py-2.5 px-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow cursor-pointer"
              >
                開始探索
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
