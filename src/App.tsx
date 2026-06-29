import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VerificationScreen from "./components/VerificationScreen";
import ProfileScreen from "./components/ProfileScreen";
import SoulMatchQuiz from "./components/SoulMatchQuiz";
import AdminEditScreen from "./components/AdminEditScreen";
import { PROFILES, getAdminCodes } from "./data";

export default function App() {
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleVerifySuccess = (code: string) => {
    if (getAdminCodes().includes(code)) {
      setShowAdmin(true);
    } else {
      setVerifiedCode(code);
    }
  };

  const handleBackToVerify = () => {
    setVerifiedCode(null);
  };

  const handleSoulMatchTrigger = () => {
    // Check if they have already matched once before to enforce single quiz limitation
    const previouslyMatched = localStorage.getItem("aura_soul_matched_code");
    if (previouslyMatched && PROFILES[previouslyMatched]) {
      setVerifiedCode(previouslyMatched);
    } else {
      setShowQuiz(true);
    }
  };

  const currentProfile = verifiedCode ? PROFILES[verifiedCode] : null;

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
              animate={{ opacity: 1, scale: 1 }}
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
