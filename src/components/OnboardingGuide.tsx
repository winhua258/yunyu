import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  MessageSquare,
  Users,
  Eye
} from "lucide-react";

interface OnboardingGuideProps {
  onClose: () => void;
}

export default function OnboardingGuide({ onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "第一步：儀式開場 · 啟動指紋",
      subtitle: "長按指紋啟動身份檢索與憑證校驗",
      description: "請長按中央的指紋校驗按鈕 3 秒鐘。系統將啟動高科技身份檢索，引導您進入沉浸式高端美學邂逅。",
      icon: <UserCheck className="w-8 h-8 text-brand-olive" />,
      highlights: ["長按指紋鍵 3 秒啟動", "高科技防偽校驗動畫"],
      targetSelector: "#prelude-gateway-btn",
      bgClass: "from-[#FDFBF7] to-[#FAF8F5]"
    },
    {
      title: "第二步：頂奢特寫 · 觀賞 Vlog",
      subtitle: "本週精選尊榮會員實境生活特寫",
      description: "在此瀏覽精選紳士的生活方式輪播故事（包含私人客機、奢華遊艇、高爾夫綠茵等寫實大圖），尋找頻率一致的靈魂。",
      icon: <Eye className="w-8 h-8 text-brand-olive" />,
      highlights: ["商務飛機/私人遊艇寫實大圖", "21:9 電影寬螢幕美學特寫"],
      targetSelector: "#cinema-vlog-slider",
      bgClass: "from-[#FAF8F5] to-[#F5EFE6]"
    },
    {
      title: "第三步：會所定位 · 沙龍話題",
      subtitle: "會所三大定位支柱與限定線下沙龍",
      description: "了解會所 strict NDA 隱私合約與 NT$ 8,000萬資產審查定位，並可瀏覽「風馳海境」私人遊艇品酒會等奢華話題。",
      icon: <Users className="w-8 h-8 text-brand-olive" />,
      highlights: ["NT$ 8000萬資產審核", "限定線下私密沙龍卡片"],
      targetSelector: "#club-positioning-pillars",
      bgClass: "from-[#F5EFE6] to-[#FAF8F5]"
    },
    {
      title: "第四步：會籍登入 · 輸入代碼",
      subtitle: "輸入專屬戀人編號進入大廳",
      description: "在此卡片輸入您的會籍代碼解鎖。推廣期麗人可輸入「GUEST」進入麗人大廳，管理員可輸入「ADMIN」進入主控台。",
      icon: <MessageSquare className="w-8 h-8 text-brand-olive" />,
      highlights: ["麗人免認證直連入口", "體驗期輸入「GUEST」解鎖"],
      targetSelector: "#verify-login-card",
      bgClass: "from-[#FAF8F5] to-[#FCFAF2]"
    }
  ];

  // 核心功能：切換步驟時自動平滑捲動至目標元素並加上高亮外框
  useEffect(() => {
    // 移除之前的高亮
    document.querySelectorAll(".tour-target-highlight").forEach((el) => {
      el.classList.remove("tour-target-highlight");
    });

    const activeStep = steps[currentStep];
    if (activeStep && activeStep.targetSelector) {
      const timer = setTimeout(() => {
        const targetEl = document.querySelector(activeStep.targetSelector);
        if (targetEl) {
          // 平滑捲動至視窗正中
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          // 添加高亮類別
          targetEl.classList.add("tour-target-highlight");
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // 移除所有高亮外框
    document.querySelectorAll(".tour-target-highlight").forEach((el) => {
      el.classList.remove("tour-target-highlight");
    });
    localStorage.setItem("yuanyu_onboarding_completed", "true");
    onClose();
  };

  const activeStep = steps[currentStep];

  return (
    <div 
      id="onboarding-guide-overlay"
      className="fixed inset-0 z-[100] pointer-events-none flex items-end justify-center md:justify-end p-4 md:p-10"
    >
      {/* 注入全域高亮動畫 CSS，防範 overflow 裁切並採用金黃呼吸燈 */}
      <style>{`
        @keyframes tourHighlightPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.75);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(212, 175, 55, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
          }
        }
        .tour-target-highlight {
          position: relative;
          z-index: 40 !important;
          outline: 3px solid #d4af37 !important;
          outline-offset: 8px !important;
          box-shadow: 0 0 35px rgba(212, 175, 55, 0.5) !important;
          animation: tourHighlightPulse 2s infinite !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
      `}</style>

      <motion.div
        id="onboarding-modal-card"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto w-full max-w-[94%] md:max-w-md rounded-[2.5rem] bg-gradient-to-b ${activeStep.bgClass} text-brand-text shadow-[0_15px_50px_-15px_rgba(0,0,0,0.35)] border border-[#e8dfc8] flex flex-col overflow-hidden relative transition-all duration-500`}
      >
        {/* Floating Topbar info */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-brand-border/30 bg-white/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-olive" />
            <span className="text-[9.5px] font-serif uppercase tracking-[0.25em] text-brand-olive font-extrabold">
              YUAN-YU GUIDE // 緣友會籍導引
            </span>
          </div>

          <button
            id="btn-onboarding-skip"
            onClick={handleComplete}
            className="flex items-center gap-0.5 px-2.5 py-1 bg-white hover:bg-brand-border/20 border border-brand-border rounded-full text-brand-muted hover:text-brand-dark text-[10px] font-semibold transition-all duration-200 cursor-pointer shadow-sm"
          >
            <span>跳過</span>
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 md:p-7 space-y-5 text-left">
          {/* Header Title & Subtitle */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-brand-border flex items-center justify-center shadow-md relative shrink-0">
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-accent/25 flex items-center justify-center border border-brand-accent/40 animate-pulse">
                <Sparkles className="w-2.5 h-2.5 text-brand-olive fill-current" />
              </div>
              {activeStep.icon}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono tracking-[0.15em] text-brand-olive font-extrabold uppercase bg-brand-accent/15 px-2 py-0.5 rounded">
                  STEP {currentStep + 1} OF {steps.length}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-serif text-brand-dark font-extrabold tracking-wide">
                {activeStep.title}
              </h3>
              <p className="text-[10px] md:text-xs font-serif italic text-brand-olive/80 font-bold leading-normal">
                {activeStep.subtitle}
              </p>
            </div>
          </div>

          {/* Body Description */}
          <p className="text-[11px] md:text-xs text-brand-muted leading-relaxed font-light tracking-wide bg-white/50 p-3.5 rounded-2xl border border-brand-border/20">
            {activeStep.description}
          </p>

          {/* Highlight features */}
          <div className="space-y-2 pt-2 border-t border-brand-border/40">
            <span className="text-[9px] font-mono font-bold tracking-[0.1em] text-brand-light uppercase block">
              引導提示焦點
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {activeStep.highlights.map((hl, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                  <span className="text-[10.5px] font-bold text-brand-dark/85 tracking-wide">
                    {hl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer Bar */}
        <div className="px-6 py-4 bg-white/40 border-t border-brand-border/40 flex items-center justify-between">
          {/* Progress Dot pills */}
          <div className="flex gap-1.5 select-none">
            {steps.map((_, i) => (
              <button
                key={i}
                id={`btn-onboarding-dot-${i}`}
                onClick={() => setCurrentStep(i)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentStep ? "w-5 bg-brand-olive" : "w-1 bg-brand-border hover:bg-brand-light"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-2 select-none">
            {currentStep > 0 && (
              <button
                id="btn-onboarding-prev"
                onClick={handlePrev}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-brand-border hover:border-brand-olive rounded-full text-brand-muted hover:text-brand-dark text-[10px] font-bold transition-all duration-200 shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>上一步</span>
              </button>
            )}

            <button
              id="btn-onboarding-next"
              onClick={handleNext}
              className="flex items-center justify-center gap-1 px-4.5 py-1.5 bg-brand-olive hover:bg-[#4d4d36] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 shadow-md cursor-pointer hover:scale-103 active:scale-97"
            >
              <span>{currentStep === steps.length - 1 ? "開始體驗" : "下一步"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
