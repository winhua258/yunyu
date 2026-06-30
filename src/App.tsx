import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VerificationScreen from "./components/VerificationScreen";
import ProfileScreen from "./components/ProfileScreen";
import SoulMatchQuiz from "./components/SoulMatchQuiz";
import AdminEditScreen from "./components/AdminEditScreen";
import { useAuth } from "./components/AuthContext";
import { useData } from "./components/DataContext";

export default function App() {
  const { loggedInLadyCode, ladyProfiles, login, logout } = useAuth();
  const { profiles, adminCodes, isDataLoading } = useData();
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // 這個 effect 專門處理「麗人」登入後的邏輯
    if (loggedInLadyCode && ladyProfiles[loggedInLadyCode]) {
      const lady = ladyProfiles[loggedInLadyCode];
      setVerifiedCode(null); // 確保沒有紳士檔案被顯示
      setShowAdmin(false); // 確保後台是關閉的
      if (lady.quizTaken && lady.matchedGentlemanCode) {
        // 如果已完成測驗，顯示配對的紳士
        setVerifiedCode(lady.matchedGentlemanCode);
        setShowQuiz(false);
      } else {
        // 如果未完成測驗，顯示測驗畫面
        setShowQuiz(true);
      }
    }
  }, [loggedInLadyCode, ladyProfiles]);

  const handleVerifySuccess = async (code: string) => {
    // 這個函式現在只處理紳士和管理員的驗證
    if (adminCodes.includes(code)) {
      setShowAdmin(true);
      setVerifiedCode(null); // 管理員登入不顯示個人檔案
      if (loggedInLadyCode) logout();
    } else {
      setVerifiedCode(code);
      if (loggedInLadyCode) logout();
    }
  };

  const handleBackToVerify = () => {
    setVerifiedCode(null);
  };

  const handleSoulMatchTrigger = () => {
    // 如果是已登入的女性用戶，檢查是否已完成測驗
    if (loggedInLadyCode && ladyProfiles && ladyProfiles[loggedInLadyCode]) {
      if (ladyProfiles[loggedInLadyCode].quizTaken && ladyProfiles[loggedInLadyCode].matchedGentlemanCode) {
        setVerifiedCode(ladyProfiles[loggedInLadyCode].matchedGentlemanCode); // 顯示已配對的紳士
        setShowQuiz(false);
      } else {
        setShowQuiz(true); // 尚未測驗，允許測驗
      }
    } else if (verifiedCode) { // 如果是紳士登入，則不允許觸發測驗
      // do nothing, or show an error
    } else {
      setShowQuiz(true);
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
      <main id="main-container" className="flex-1 flex flex-col relative">
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
              key="verification"
              id="view-verification"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex-1 flex flex-col"
            >
              <VerificationScreen 
                onVerifySuccess={handleVerifySuccess} 
                onSoulMatchClick={handleSoulMatchTrigger}
              />
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              id="view-profile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }} // 這裡的動畫應該是針對紳士檔案
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex-1 flex flex-col"
            >
              <ProfileScreen 
                profile={currentProfile} 
                onBack={handleBackToVerify} 
              />
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
              setVerifiedCode(code);
              setShowQuiz(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Footer component */}
      <Footer />
    </div>
  );
}
