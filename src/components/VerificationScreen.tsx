import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowRight, ShieldCheck, Mail, Phone, MessageSquare, AlertCircle, Heart } from "lucide-react";
import { PROFILES, getAdminCodes } from "../data";

interface VerificationScreenProps {
  onVerifySuccess: (code: string) => void;
  onSoulMatchClick?: () => void;
}

export default function VerificationScreen({ onVerifySuccess, onSoulMatchClick }: VerificationScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // List of valid codes based on requirement
  const validCodes = [...Object.keys(PROFILES), ...getAdminCodes()];

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sanitizedCode = code.trim();

    if (!sanitizedCode) {
      setError("請輸入專屬戀人編號");
      return;
    }

    if (validCodes.includes(sanitizedCode)) {
      setError("");
      setIsSuccess(true);
      // Brief delay to allow success animation to play elegantly
      setTimeout(() => {
        onVerifySuccess(sanitizedCode);
      }, 900);
    } else {
      setError("查無此編號，請確認您的專屬戀人編號是否正確");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative py-12 px-4 md:px-12 bg-brand-beige overflow-hidden">
      {/* Decorative Organic Elements mimicking the Natural Tones Style */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-brand-border/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-brand-border/50 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle floating abstract shape in the background */}
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, 15, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[10%] top-[15%] w-[180px] h-[260px] bg-brand-border/40 rounded-[100px] border border-brand-border/60 pointer-events-none hidden lg:block"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Intro Tagline */}
        <div className="text-center mb-10 space-y-3">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-light font-bold">
            Private Elite Matchmaking // 會員制尊榮媒合
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-brand-dark font-semibold leading-tight tracking-widest">
            緣友 YUAN-YU
          </h1>
          <p className="text-xs md:text-sm text-brand-muted max-w-2xl mx-auto leading-relaxed px-4">
            為維護極致安全與互信的尊榮交友生態，本平台實施專屬通道：<br className="hidden md:inline" />
            紳士須通過資產實力與實名驗核，麗人限時享有免審查配對之推廣福利。
          </p>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-brand-border/60 relative overflow-hidden backdrop-blur-md">
          {/* Decorative center divider for desktop */}
          <div className="hidden md:block absolute inset-y-12 left-1/2 w-px bg-gradient-to-b from-brand-border/10 via-brand-border/80 to-brand-border/10" />

          {/* LEFT PANEL: GENTLEMEN (紳士驗資通道) */}
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
                為確保交友生態之真實性與傑出素質，紳士會員須提交實名審核與年收、資產實力驗證，通過後由專屬媒合代表人工發放<strong>「戀人編號」</strong>登入。
              </p>
            </div>

            {/* Code Input Form */}
            <form id="form-verification" onSubmit={handleVerify} className="space-y-4 pt-2">
              <div className="relative">
                <input
                  id="input-verification-code"
                  type="text"
                  maxLength={12}
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

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                id="btn-verify-submit"
                type="submit"
                disabled={isSuccess}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
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

          {/* Mobile Divider */}
          <div className="block md:hidden h-px bg-gradient-to-r from-transparent via-brand-border to-transparent my-4" />

          {/* RIGHT PANEL: LADIES (麗人限時特許) */}
          <div className="flex flex-col justify-between p-2 md:p-4 bg-brand-border/10 rounded-2xl md:bg-transparent md:rounded-none space-y-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-brand-accent text-brand-olive text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
              PROMO 限時福利
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-olive border border-brand-accent/30 shadow-inner shrink-0">
                  <Heart className="w-5 h-5 text-brand-olive fill-current animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-brand-dark tracking-wide">
                    麗人限時免驗通道
                  </h3>
                  <span className="text-[9px] md:text-[10px] text-brand-light font-bold uppercase tracking-widest font-mono">
                    Ladies Campaign
                  </span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                目前正值 <strong>緣友 YUAN-YU</strong> 麗人特許福利推廣期，麗人會員限時<strong>免除資產審核</strong>！可直接進行 2 分鐘 AI 靈魂特質探索，自動過濾並發掘與您靈魂高度共鳴的頂級紳士。
              </p>
            </div>

            {/* Ladies Campaign Action Button */}
            {onSoulMatchClick && (
              <div className="space-y-4 pt-4 md:pt-0">
                <button
                  type="button"
                  id="btn-soul-match-main"
                  onClick={onSoulMatchClick}
                  className="w-full py-3.5 px-6 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-md cursor-pointer hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-brand-accent fill-current animate-pulse" />
                  <span>免費開啟「AI 靈魂共鳴測驗」</span>
                </button>

                <p className="text-[10px] text-brand-light leading-relaxed text-center italic">
                  * 測試完全匿名，系統將直接為您解鎖高度契合的尊榮推薦對象。
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contact Agent Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl border border-brand-border w-full max-w-sm overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-6 bg-brand-border/30 border-b border-brand-border text-center">
                <h3 className="font-serif text-lg text-brand-dark font-bold tracking-wide">
                  洽詢您的專屬媒合專員
                </h3>
                <p className="text-[11px] text-brand-light uppercase tracking-wider mt-1">
                  Private Client Matching Service
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-brand-muted leading-relaxed text-center mb-2">
                  為維護極致高端且安全的會員制交友生態，編號均採人工發放與單次查核機制。若您尚未獲得專屬戀人編號，請聯絡您的顧問：
                </p>

                <div className="space-y-3">
                  {/* Option 1: LINE */}
                  <div className="flex items-center justify-between p-3 bg-brand-beige/40 rounded-2xl border border-brand-border/40 hover:bg-brand-beige/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#06C755]/10 flex items-center justify-center text-[#06C755]">
                        <MessageSquare className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-brand-dark">LINE 專屬客服</p>
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

                  {/* Option 2: Phone */}
                  <div className="flex items-center justify-between p-3 bg-brand-beige/40 rounded-2xl border border-brand-border/40 hover:bg-brand-beige/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-brand-dark">台北總部專線</p>
                        <p className="text-[10px] text-brand-light font-mono">02-2736-8888</p>
                      </div>
                    </div>
                    <a
                      id="link-contact-phone"
                      href="tel:0227368888"
                      className="text-[10px] bg-brand-olive text-white px-3 py-1.5 rounded-full font-bold hover:opacity-90 transition-all"
                    >
                      撥打電話
                    </a>
                  </div>

                  {/* Option 3: Email */}
                  <div className="flex items-center justify-between p-3 bg-brand-beige/40 rounded-2xl border border-brand-border/40 hover:bg-brand-beige/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-brand-dark">客服信箱</p>
                        <p className="text-[10px] text-brand-light font-mono">vip@yuanyu.net</p>
                      </div>
                    </div>
                    <a
                      id="link-contact-email"
                      href="mailto:vip@yuanyu.net"
                      className="text-[10px] bg-brand-olive text-white px-3 py-1.5 rounded-full font-bold hover:opacity-90 transition-all"
                    >
                      寄送郵件
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-brand-border/20 border-t border-brand-border/50 text-center">
                <button
                  id="btn-contact-modal-close"
                  onClick={() => setShowContactModal(false)}
                  className="text-xs font-bold text-brand-olive uppercase tracking-wider hover:opacity-80 transition-opacity"
                >
                  返回驗證
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
