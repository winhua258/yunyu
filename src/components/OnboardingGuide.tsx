import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  MessageSquare,
  Users
} from "lucide-react";

interface OnboardingGuideProps {
  onClose: () => void;
}

export default function OnboardingGuide({ onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "第一步：會籍註冊與驗證",
      subtitle: "如何獲得會籍 / 輸入專屬驗證碼解鎖",
      description: "向下滑動至「會籍核驗入口」，點選麗人或紳士認證，輸入會籍代碼即可解鎖。測試期可輸入體驗碼「GUEST」或「ADMIN」快速體驗。",
      icon: <UserCheck className="w-16 h-16 text-brand-olive" />,
      highlights: ["麗人與紳士獨立驗證", "支援專屬配對金鑰", "快速測試可用「GUEST」"],
      bgClass: "from-[#FDFBF7] to-[#FAF8F5]"
    },
    {
      title: "第二步：AI 靈魂共鳴測驗",
      subtitle: "2 分鐘全息答題特質描繪 · 讓推薦更懂你",
      description: "點擊「AI 靈魂共鳴」開啟 2 分鐘性格答題。系統將多維度剖析並生成您的專屬性格雷達圖，做為高契合度精準匹配的核心依據。",
      icon: <Sparkles className="w-16 h-16 text-brand-olive fill-current animate-pulse" />,
      highlights: ["20個核心特質答題", "生成專屬個性雷達圖", "智慧契合度加分機制"],
      bgClass: "from-[#FAF8F5] to-[#F5EFE6]"
    },
    {
      title: "第三步：瀏覽心儀會員",
      subtitle: "去哪裡看男生？尊享高淨值紳士名錄",
      description: "驗證後開啟專屬會籍大廳。您可以瀏覽「精選紳士資料庫」，直觀查看男士年齡、身高、生活相冊、背景標籤及 AI 契合度百分比。",
      icon: <Users className="w-16 h-16 text-brand-olive" />,
      highlights: ["精選紳士資料庫", "實時百分比契合度", "深度標籤與實名背景"],
      bgClass: "from-[#F5EFE6] to-[#FAF8F5]"
    },
    {
      title: "第四步：開啟專屬私密聊天",
      subtitle: "去哪裡聊天？一鍵建立 LINE 專屬保密通道",
      description: "點擊心儀卡片下的「一鍵建立 專屬通道」，系統會自動生成連線序號與連結，點擊直連專屬 LINE 顧問，在嚴密隱私防護下開啟對談。",
      icon: <MessageSquare className="w-16 h-16 text-brand-olive" />,
      highlights: ["一鍵直連 LINE 專屬通道", "專屬戀人編號安全連線", "全程 NDA 隱私防線保護"],
      bgClass: "from-[#FAF8F5] to-[#FCFAF2]"
    }
  ];

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
    localStorage.setItem("yuanyu_onboarding_completed", "true");
    onClose();
  };

  const activeStep = steps[currentStep];

  return (
    <div 
      id="onboarding-guide-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-xl"
    >
      <motion.div
        id="onboarding-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-4xl min-h-[550px] md:min-h-[600px] rounded-[3rem] bg-gradient-to-b ${activeStep.bgClass} text-brand-text shadow-2xl border border-brand-border flex flex-col md:flex-row overflow-hidden relative transition-all duration-700`}
      >
        {/* Dynamic decorative visual element depending on step */}
        <div className="absolute top-8 left-8 flex items-center gap-2 pointer-events-none z-10">
          <ShieldCheck className="w-5 h-5 text-brand-olive" />
          <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-brand-olive font-bold">
            YUAN-YU PRIVACY SAFEGUARD // 緣友會籍指引
          </span>
        </div>

        {/* Skip button top right */}
        <button
          id="btn-onboarding-skip"
          onClick={handleComplete}
          className="absolute top-6 right-6 z-20 flex items-center gap-1 px-4 py-2 bg-white/60 hover:bg-white/90 border border-brand-border rounded-full text-brand-muted hover:text-brand-dark text-xs font-serif transition-all duration-300 shadow-sm cursor-pointer"
        >
          <span>跳過引導</span>
          <X className="w-3.5 h-3.5" />
        </button>

        {/* LEFT COLUMN - Visual/Aesthetic Stage */}
        <div className="w-full md:w-2/5 bg-brand-olive/5 border-b md:border-b-0 md:border-r border-brand-border flex flex-col items-center justify-center p-8 pt-16 md:p-12 relative overflow-hidden select-none">
          {/* Cyber-grid background overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(90,90,64,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(90,90,64,0.02)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center justify-center"
            >
              {/* Central glowing background circle */}
              <div className="absolute w-32 h-32 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none" />
              
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] bg-white border border-brand-border/60 flex items-center justify-center shadow-lg relative">
                {/* Floating active visual sparkles */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-brand-accent/20 flex items-center justify-center border border-brand-accent/30 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-brand-olive fill-current" />
                </div>
                {activeStep.icon}
              </div>

              {/* Step counter */}
              <div className="mt-6 text-center">
                <span className="text-[10px] font-mono tracking-[0.2em] text-brand-olive font-extrabold uppercase block mb-1">
                  STAGE {currentStep + 1} OF {steps.length}
                </span>
                <span className="text-3xl font-serif font-extrabold text-brand-dark/40">
                  {`0${currentStep + 1}`}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN - Text Content & Actions */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-between relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-6 text-left"
            >
              {/* Header Texts */}
              <div className="space-y-2 mt-4 md:mt-8">
                <h3 className="text-2xl md:text-3xl font-serif text-brand-dark font-extrabold tracking-wide leading-snug">
                  {activeStep.title}
                </h3>
                <p className="text-xs md:text-sm font-serif italic text-brand-olive/80 font-semibold tracking-wide">
                  {activeStep.subtitle}
                </p>
              </div>

              {/* Main Body Description */}
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-light tracking-wide">
                {activeStep.description}
              </p>

              {/* Highlight bullet points */}
              <div className="space-y-2.5 pt-2 border-t border-brand-border/40">
                <span className="text-[10px] font-mono font-bold tracking-[0.1em] text-brand-light uppercase block">
                  緣友操作指南
                </span>
                <div className="space-y-1.5">
                  {activeStep.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                      <span className="text-xs font-semibold text-brand-dark/90 tracking-wide">
                        {hl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border/50">
            {/* Step indicator dot pills */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  id={`btn-onboarding-dot-${i}`}
                  onClick={() => setCurrentStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentStep ? "w-6 bg-brand-olive" : "w-1.5 bg-brand-border hover:bg-brand-light"
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  id="btn-onboarding-prev"
                  onClick={handlePrev}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-brand-border hover:border-brand-olive rounded-full text-brand-muted hover:text-brand-dark text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>上一步</span>
                </button>
              )}

              <button
                id="btn-onboarding-next"
                onClick={handleNext}
                className="flex items-center justify-center gap-1.5 px-6 py-2.5 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 shadow-md cursor-pointer hover:scale-103 active:scale-97"
              >
                <span>{currentStep === steps.length - 1 ? "開始體驗" : "下一步"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
