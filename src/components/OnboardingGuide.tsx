import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Fingerprint,
  PlayCircle,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

interface OnboardingGuideProps {
  onClose: () => void;
}

const steps = [
  {
    title: "歡迎來到緣友",
    body: "這裡是台灣頂級私密會員制社交平台。我們為您準備了一個簡短的入門導覽，帶您認識這趟尊榮之旅的起點。",
    icon: <Sparkles className="w-5 h-5 text-brand-olive" />,
    targetSelector: "#prelude-gateway-btn",
    cta: "了解更多",
  },
  {
    title: "第一步：啟動身份校驗",
    body: "請長按頁面中央的指紋圖案 3 秒。這是我們保護每位會員隱私的第一道防線，確認您是受邀進入的尊榮貴賓。",
    icon: <Fingerprint className="w-5 h-5 text-brand-olive" />,
    targetSelector: "#prelude-gateway-btn",
    cta: "下一步",
  },
  {
    title: "第二步：欣賞真實生活特寫",
    body: "在這裡，您可以瀏覽精選紳士的真實生活影像——私人客機、豪華遊艇、高爾夫球場。感受與您頻率相近的靈魂。",
    icon: <PlayCircle className="w-5 h-5 text-brand-olive" />,
    targetSelector: "#cinema-vlog-slider",
    cta: "下一步",
  },
  {
    title: "第三步：認識會所的隱私承諾",
    body: "每一位紳士都已通過嚴格的實名審核與 NT$8,000 萬資產查核。您的隱私由 NDA 全程保護，讓您放心探索。",
    icon: <ShieldCheck className="w-5 h-5 text-brand-olive" />,
    targetSelector: "#club-positioning-pillars",
    cta: "下一步",
  },
  {
    title: "第四步：輸入邀請碼，開啟旅程",
    body: "準備好了嗎？輸入您的專屬邀請碼即可進入。體驗期的朋友可輸入「GUEST」一探究竟，期待與您的美好相遇。",
    icon: <KeyRound className="w-5 h-5 text-brand-olive" />,
    targetSelector: "#verify-login-card",
    cta: "開始體驗",
  },
];

export default function OnboardingGuide({ onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  // Scroll to target and add highlight glow
  useEffect(() => {
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.classList.remove("tour-highlight");
    });

    const target = document.querySelector(step.targetSelector);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("tour-highlight");
      }, 200);
    }
    return () => {
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        el.classList.remove("tour-highlight");
      });
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.classList.remove("tour-highlight");
    });
    onClose();
  };

  return (
    <>
      {/* Global highlight CSS — pulsing gold glow, no overflow clipping */}
      <style>{`
        @keyframes tourGlow {
          0%   { box-shadow: 0 0 0 0 rgba(212,175,55,0.7); }
          70%  { box-shadow: 0 0 0 14px rgba(212,175,55,0); }
          100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
        }
        .tour-highlight {
          position: relative;
          z-index: 40 !important;
          outline: 2px solid #d4af37 !important;
          outline-offset: 6px !important;
          animation: tourGlow 2s ease-out infinite !important;
          border-radius: 4px;
        }
      `}</style>

      {/* Compact floating card — bottom-right, fixed size, never full-screen */}
      <div
        id="onboarding-guide-overlay"
        className="fixed bottom-4 right-4 z-[200] pointer-events-none"
        style={{ width: "min(288px, calc(100vw - 32px))" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            id="onboarding-modal-card"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#FDFBF7] border border-[#e8dfc8] rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.22)] overflow-hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#ede8da]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-olive animate-pulse" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.18em] text-brand-olive">
                  YUAN-YU · 入門導覽
                </span>
              </div>
              <button
                id="btn-onboarding-skip"
                onClick={handleClose}
                className="text-[#aaa] hover:text-[#555] transition-colors cursor-pointer p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-brand-accent/20 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <h3 className="text-sm font-serif font-bold text-brand-dark leading-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-[11px] text-[#7a6e5f] leading-relaxed">
                {step.body}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 pb-3">
              {/* Step dots */}
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    id={`btn-onboarding-dot-${i}`}
                    onClick={() => setCurrentStep(i)}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentStep
                        ? "w-4 bg-brand-olive"
                        : "w-1 bg-[#ddd] hover:bg-[#bbb]"
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-1.5">
                {currentStep > 0 && (
                  <button
                    id="btn-onboarding-prev"
                    onClick={handlePrev}
                    className="flex items-center gap-0.5 text-[10px] text-[#888] hover:text-brand-dark font-bold px-2 py-1 rounded-full border border-[#ddd] hover:border-[#bbb] transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    上一步
                  </button>
                )}
                <button
                  id="btn-onboarding-next"
                  onClick={handleNext}
                  className="flex items-center gap-0.5 text-[10px] font-bold px-3 py-1.5 rounded-full bg-brand-olive hover:bg-[#4d4d36] text-white transition-all cursor-pointer shadow-sm"
                >
                  {step.cta}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
