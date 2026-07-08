import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VerificationScreen from "./components/VerificationScreen";
import ProfileScreen from "./components/ProfileScreen";
import SoulMatchQuiz from "./components/SoulMatchQuiz";
import AdminEditScreen from "./components/AdminEditScreen";
import UnlockProfileModal from "./components/UnlockProfileModal";
import GentlemanDashboard from "./components/GentlemanDashboard";
import { useAuth } from "./components/AuthContext";
import { useData } from "./components/DataContext";
import { getOrCreateDeviceId, trackVisit } from "./data";
import LadiesDashboard from "./components/LadiesDashboard";
import OnboardingGuide from "./components/OnboardingGuide";

export default function App() {
  const { loggedInLadyCode, ladyProfiles, login, logout, register, simulateAssets } = useAuth();
  const { profiles, adminCodes, isDataLoading } = useData();
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [unlockedGentlemanCodes, setUnlockedGentlemanCodes] = useState<Record<string, boolean>>({});
  const [gentlemanAuthCode, setGentlemanAuthCode] = useState<string | null>(null);
  const [hasInitializedLady, setHasInitializedLady] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockModalCode, setUnlockModalCode] = useState<string | null>(null);

  // New lady lobby states
  const [ladyMatchCounts, setLadyMatchCounts] = useState(3);
  const [ladyUnlockedCodes, setLadyUnlockedCodes] = useState<string[]>([]);
  const [ladyVerifiedStatus, setLadyVerifiedStatus] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Synchronize local states with active LadyProfile from AuthContext
  useEffect(() => {
    if (loggedInLadyCode && ladyProfiles[loggedInLadyCode]) {
      const lady = ladyProfiles[loggedInLadyCode];
      
      // Initialize/Sync unlocked codes list
      setLadyUnlockedCodes(lady.unlockedGentlemanCodes || []);
      
      // Initialize/Sync verification status
      setLadyVerifiedStatus(lady.assetVerified === "approved");
      
      // Initialize/Sync match counts (sync with localStorage isolated by lady code)
      const localCounts = localStorage.getItem(`yuanyu_match_counts_${loggedInLadyCode}`);
      if (localCounts !== null) {
        setLadyMatchCounts(Number(localCounts));
      } else {
        // Fallback default based on membership level
        const defaultCounts = lady.membershipLevel === "vip" 
          ? 999 
          : lady.membershipLevel === "experience" 
            ? 2 
            : 3;
        setLadyMatchCounts(defaultCounts);
        localStorage.setItem(`yuanyu_match_counts_${loggedInLadyCode}`, String(defaultCounts));
      }
    }
  }, [loggedInLadyCode, ladyProfiles]);

  // Handle Onboarding Guide trigger
  useEffect(() => {
    if (loggedInLadyCode) {
      const hasCompletedOnboarding = localStorage.getItem(`yuanyu_onboarding_completed_${loggedInLadyCode}`);
      if (hasCompletedOnboarding !== "true") {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(false);
    }
  }, [loggedInLadyCode]);

  const handleSetLadyUnlockedCodes = async (codesOrFn: string[] | ((prev: string[]) => string[])) => {
    if (!loggedInLadyCode) return;
    const lady = ladyProfiles[loggedInLadyCode];
    if (!lady) return;

    let nextCodes: string[];
    if (typeof codesOrFn === "function") {
      nextCodes = codesOrFn(ladyUnlockedCodes);
    } else {
      nextCodes = codesOrFn;
    }

    setLadyUnlockedCodes(nextCodes);
    localStorage.setItem(`yuanyu_unlocked_codes_${loggedInLadyCode}`, JSON.stringify(nextCodes));

    // Persist to backend database via AuthContext
    try {
      await simulateAssets(
        lady.membershipLevel || "free",
        lady.assetVerified || "none",
        nextCodes,
        lady.quizTaken,
        lady.matchedGentlemanCode
      );
    } catch (err) {
      console.error("Failed to sync unlocked codes to backend:", err);
    }
  };

  const handleSetLadyVerifiedStatus = async (verified: boolean) => {
    if (!loggedInLadyCode) return;
    const lady = ladyProfiles[loggedInLadyCode];
    if (!lady) return;

    setLadyVerifiedStatus(verified);
    // Persist to backend database via AuthContext
    try {
      await simulateAssets(
        lady.membershipLevel || "free",
        verified ? "approved" : "none",
        ladyUnlockedCodes,
        lady.quizTaken,
        lady.matchedGentlemanCode
      );
    } catch (err) {
      console.error("Failed to sync verification status to backend:", err);
    }
  };

  const handleSetLadyMatchCounts = (countsOrFn: number | ((prev: number) => number)) => {
    if (!loggedInLadyCode) return;
    setLadyMatchCounts(prev => {
      let nextCounts: number;
      if (typeof countsOrFn === "function") {
        nextCounts = countsOrFn(prev);
      } else {
        nextCounts = countsOrFn;
      }
      localStorage.setItem(`yuanyu_match_counts_${loggedInLadyCode}`, String(nextCounts));
      return nextCounts;
    });
  };

  useEffect(() => {
    // 記錄每次進入網站的訪客軌跡
    const devId = getOrCreateDeviceId();
    void trackVisit(devId);

    // 獲取 Crisp 設定並動態載入線上客服
    fetch("/api/crisp-config")
      .then(res => res.json())
      .then(data => {
        if (data.crispWebsiteId) {
          (window as any).$crisp = [];
          (window as any).CRISP_WEBSITE_ID = data.crispWebsiteId;
          const d = document;
          const s = d.createElement("script");
          s.src = "https://client.crisp.chat/l.js";
          s.async = true;
          d.getElementsByTagName("head")[0].appendChild(s);
        }
      })
      .catch(err => console.error("Failed to load Crisp configuration:", err));
  }, []);

  useEffect(() => {
    // 這個 effect 專門處理「麗人」登入後的邏輯，僅在剛登入且尚未初始化時執行一次，防止更新 profiles 導致重複導向
    if (loggedInLadyCode) {
      const lady = ladyProfiles[loggedInLadyCode];
      if (lady && !hasInitializedLady) {
        setHasInitializedLady(true);
        setVerifiedCode(null); // 確保沒有紳士檔案被顯示
        setShowAdmin(false); // 確保後台是關閉的
        if (!lady.quizTaken) {
          // 如果未完成測驗，自動彈出測驗畫面
          setShowQuiz(true);
        } else {
          // 已完成測驗的麗人登入，預設留在麗人首頁 Dashboard (不強行導向紳士卡片)
          setVerifiedCode(null);
          setShowQuiz(false);
        }
      }
    } else {
      if (hasInitializedLady) {
        setVerifiedCode(null);
      }
      setHasInitializedLady(false);
    }
  }, [loggedInLadyCode, ladyProfiles, hasInitializedLady]);

  const handleVerifySuccess = async (code: string, role?: string) => {
    // 優先使用 server 直接回傳的 role，避免依賴非同步更新的 adminCodes 狀態造成競爭條件
    const isAdmin = role === "admin" || adminCodes.includes(code);
    if (isAdmin) {
      setShowAdmin(true);
      setVerifiedCode(null); // 管理員登入不顯示個人檔案
      if (loggedInLadyCode) logout();
    } else {
      // 如果是已登入的麗人查看配對的紳士，彈出對話解鎖彈窗以進行互動解鎖
      if (loggedInLadyCode && ladyProfiles[loggedInLadyCode]?.matchedGentlemanCode === code) {
        setUnlockModalCode(code);
        setShowUnlockModal(true);
      } else {
        setVerifiedCode(code);
      }
      // 麗人查看或解鎖紳士時，不執行自動登出，保留其麗人登入狀態
    }
  };

  const handleBackToVerify = () => {
    setVerifiedCode(null);
  };

  const handleSoulMatchTrigger = async () => {
    // 如果是已登入的女性用戶，檢查是否已完成測驗
    if (loggedInLadyCode && ladyProfiles && ladyProfiles[loggedInLadyCode]) {
      const lady = ladyProfiles[loggedInLadyCode];
      if (lady.quizTaken && lady.matchedGentlemanCode) {
        setVerifiedCode(lady.matchedGentlemanCode); // 顯示已配對的紳士
        setShowQuiz(false);
      } else {
        setShowQuiz(true); // 尚未測驗，允許測驗
      }
    } else if (verifiedCode) { // 如果是紳士登入，則不允許觸發測驗
      // do nothing, or show an error
    } else {
      // 訪客點擊 AI 測試時，自動為其註冊麗人帳號，以確保「每人只能測驗一次」
      try {
        await register();
        // 註冊成功後，上方 useEffect 偵測到登入狀態，會自動開啟 Quiz 測驗
      } catch (e) {
        console.error("自動註冊麗人失敗:", e);
        setShowQuiz(true);
      }
    }
  };

  const currentProfile = verifiedCode ? profiles[verifiedCode] : null;

  if (isDataLoading) {
    return <div className="min-h-screen bg-brand-beige flex items-center justify-center font-serif text-brand-olive">正在初始化緣友系統...</div>;
  }

  return (
    <div 
      id="app-root" 
      className="min-h-screen bg-brand-beige text-brand-text flex flex-col font-sans selection:bg-brand-olive/10 selection:text-brand-olive"
    >
      {/* Header component */}
      <Header 
        showBack={verifiedCode !== null} 
        onBackToVerify={handleBackToVerify} 
        onSoulMatchClick={verifiedCode === null ? handleSoulMatchTrigger : undefined}
      />

      {/* Main Content Area with elegant fade transitions */}
      <main id="main-container" className="flex-1 flex flex-col relative min-h-0">
        <AnimatePresence mode="wait">
          {showAdmin ? (
            <motion.div
              key="admin"
              id="view-admin"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex-1 flex flex-col"
            >
              <AdminEditScreen onExit={() => setShowAdmin(false)} />
            </motion.div>
          ) : verifiedCode === null || !currentProfile ? (
            <motion.div
              key={loggedInLadyCode ? "ladies-dashboard" : "verification"}
              id={loggedInLadyCode ? "view-ladies-dashboard" : "view-verification"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex-1 flex flex-col min-h-0"
            >
              {loggedInLadyCode ? (
                <LadiesDashboard
                  profiles={profiles}
                  matchCounts={ladyMatchCounts}
                  setMatchCounts={handleSetLadyMatchCounts}
                  unlockedCodes={ladyUnlockedCodes}
                  setUnlockedCodes={handleSetLadyUnlockedCodes}
                  isLadyVerified={ladyVerifiedStatus}
                  setIsLadyVerified={handleSetLadyVerifiedStatus}
                  onViewProfile={(code) => setVerifiedCode(code)}
                  onStartQuiz={handleSoulMatchTrigger}
                  onExit={logout}
                />
              ) : (
                <VerificationScreen 
                  onVerifySuccess={handleVerifySuccess} 
                  onSoulMatchClick={handleSoulMatchTrigger}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={loggedInLadyCode ? "profile" : "gentleman-dashboard"}
              id={loggedInLadyCode ? "view-profile" : "view-gentleman-dashboard"}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex-1 flex flex-col min-h-0"
            >
              {loggedInLadyCode ? (
                <ProfileScreen 
                  profile={currentProfile} 
                  onBack={handleBackToVerify} 
                  onOpenChat={(code) => {
                    setUnlockModalCode(code);
                    setShowUnlockModal(true);
                  }}
                />
              ) : unlockedGentlemanCodes[verifiedCode!] ? (
                <GentlemanDashboard
                  gentlemanCode={verifiedCode!}
                  onLogout={handleBackToVerify}
                  onBackToProfile={() => {
                    setUnlockedGentlemanCodes(prev => ({ ...prev, [verifiedCode!]: false }));
                  }}
                  adminCode={gentlemanAuthCode!}
                />
              ) : (
                <ProfileScreen 
                  profile={currentProfile} 
                  onBack={handleBackToVerify}
                  onEnterEditMode={(password) => {
                    setGentlemanAuthCode(password);
                    setUnlockedGentlemanCodes(prev => ({ ...prev, [verifiedCode!]: true }));
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Soul Matching Quiz Modal Overlay */}
      <AnimatePresence>
        {showQuiz && (
          <SoulMatchQuiz 
            onClose={() => setShowQuiz(false)} 
            onMatchComplete={(code) => {
              setShowQuiz(false);
              // AI 測驗完成後先顯示解鎖資料卡彈窗，而非直接跳轉
              setUnlockModalCode(code);
              setShowUnlockModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Unlock Profile Modal — 顯示在 Quiz 完成後 */}
      <AnimatePresence>
        {showUnlockModal && unlockModalCode && profiles[unlockModalCode] && (
          <UnlockProfileModal
            profile={profiles[unlockModalCode]}
            onClose={() => {
              setShowUnlockModal(false);
              setUnlockModalCode(null);
            }}
            onViewFull={() => {
              setShowUnlockModal(false);
              setVerifiedCode(unlockModalCode);
              setUnlockModalCode(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Onboarding Guide Modal Overlay */}
      <AnimatePresence>
        {showOnboarding && loggedInLadyCode && (
          <OnboardingGuide 
            onClose={() => {
              setShowOnboarding(false);
              localStorage.setItem(`yuanyu_onboarding_completed_${loggedInLadyCode}`, "true");
            }}
          />
        )}
      </AnimatePresence>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
