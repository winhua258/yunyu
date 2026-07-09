import React from "react";
import { motion } from "motion/react";
import { Compass, ShieldCheck, Fingerprint, Sparkles, ChevronDown } from "lucide-react";

interface PreludeGatewayProps {
  scanState: "idle" | "scanning" | "complete";
  setScanState: (state: "idle" | "scanning" | "complete") => void;
  scanProgress: number;
  scrollToSection: (sectionId: string, index: number) => void;
}

export default function PreludeGateway({
  scanState,
  setScanState,
  scanProgress,
  scrollToSection,
}: PreludeGatewayProps) {
  return (
    <section
      id="prelude-gateway"
      className="select-none w-full h-screen min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-brand-beige via-brand-beige via-80% to-[#161614] text-brand-text scroll-mt-36 md:scroll-mt-32"
    >
      {/* Ambient Glowing Spheres */}
      <div className="absolute top-[20%] left-[15%] w-96 h-96 rounded-full bg-brand-accent/20 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-brand-olive/10 blur-[140px] pointer-events-none" />

      {/* Matrix cyber grid in the background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(90,90,64,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(90,90,64,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full text-center space-y-10">
        
        {/* Header metadata tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/85 border border-brand-border/80 rounded-full backdrop-blur-md shadow-sm"
        >
          <Compass className="w-3.5 h-3.5 text-brand-olive animate-[spin_12s_linear_infinite]" />
          <span className="text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] text-brand-olive font-bold">
            緣友 YUAN-YU · 頂格實名資產核驗會所
          </span>
        </motion.div>

        {/* Staggered Letter Reveal Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-[0.25em] leading-tight">
            {"緣友".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.2, delay: index * 0.3, ease: "easeOut" }}
                className="inline-block relative"
              >
                <span className="bg-gradient-to-r from-brand-dark via-brand-dark to-brand-olive bg-clip-text text-transparent">
                  {char}
                </span>
              </motion.span>
            ))}
            <span className="inline-block mx-2 text-2xl md:text-4xl align-middle font-sans font-extralight text-brand-olive/50 tracking-[0.1em]">
              ·
            </span>
            {"YUAN-YU".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.2, delay: 0.6 + index * 0.08, ease: "easeOut" }}
                className="inline-block bg-gradient-to-r from-brand-olive to-brand-light bg-clip-text text-transparent font-sans tracking-[0.15em] text-3xl md:text-5xl"
              >
                {char}
              </motion.span>
            ))}
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-xs md:text-sm text-brand-muted max-w-2xl mx-auto leading-relaxed tracking-[0.12em] px-4 font-serif"
          >
            本會所專為高淨值會員打造，實行嚴格實名身份與資產核驗。
            <br className="hidden md:inline" />
            請長按下方「會籍金鑰」啟動專屬校驗，開啟私密美學邂逅。
          </motion.p>
        </div>

        {/* Huge Labs.google Portal Container */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
          
          {/* Outer Spinning Cyber Rings */}
          <div className="absolute inset-0 border border-brand-olive/20 rounded-full animate-[spin_25s_linear_infinite]" />
          <div className="absolute inset-2 border border-dashed border-brand-border rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute inset-6 border border-brand-olive/30 rounded-full animate-[spin_15s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 50%)' }} />
          <div className="absolute inset-10 border border-brand-border/60 rounded-full animate-[spin_20s_linear_infinite_reverse]" style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%)' }} />

          {/* Pulsing Backlight Glow */}
          <div className={`absolute inset-16 rounded-full blur-2xl transition-all duration-700 ${
            scanState === "scanning" 
              ? "bg-brand-accent/30 scale-110 shadow-[0_0_50px_rgba(163,177,138,0.3)]" 
              : "bg-brand-accent/5 scale-100"
          }`} />

          {/* Scanner Button Core */}
          <motion.button
            id="prelude-gateway-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={() => {
              if (scanState === "idle") setScanState("scanning");
            }}
            onTouchStart={() => {
              if (scanState === "idle") setScanState("scanning");
            }}
            onMouseUp={() => {
              if (scanState === "scanning") setScanState("idle");
            }}
            onTouchEnd={() => {
              if (scanState === "scanning") setScanState("idle");
            }}
            className={`select-none relative z-20 w-44 h-44 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 border backdrop-blur-xl ${
              scanState === "scanning"
                ? "bg-brand-accent/20 border-brand-olive shadow-[0_0_30px_rgba(90,90,64,0.15)]"
                : scanState === "complete"
                  ? "bg-emerald-500/20 border-emerald-600"
                  : "bg-white/80 hover:bg-white border-brand-border hover:border-brand-accent/50 shadow-sm text-brand-dark"
            }`}
          >
            {/* Spinning Scan Progress Ring */}
            {scanState === "scanning" && (
              <svg className="absolute inset-0 w-full h-full -rotate-95">
                <circle
                  cx="88"
                  cy="88"
                  r="84"
                  fill="transparent"
                  stroke="#5A5A40"
                  strokeWidth="3"
                  strokeDasharray={String(2 * Math.PI * 84)}
                  strokeDashoffset={String(2 * Math.PI * 84 * (1 - scanProgress / 100))}
                  className="transition-all duration-75"
                />
              </svg>
            )}

            {/* Laser Scanning Line Bar */}
            {scanState === "scanning" && (
              <div className="absolute left-6 right-6 h-0.5 bg-brand-olive/80 shadow-[0_0_10px_#5A5A40] rounded-full animate-[bounce_2s_infinite] z-20" />
            )}

            {/* Fingerprint / Scanner Icon */}
            <div className="space-y-2 flex flex-col items-center">
              <div className="relative">
                {scanState === "complete" ? (
                  <ShieldCheck className="w-12 h-12 text-emerald-600 animate-pulse" />
                ) : (
                  <Fingerprint className={`w-12 h-12 transition-all duration-300 ${
                    scanState === "scanning" ? "text-brand-olive scale-110" : "text-brand-olive/60 group-hover:text-brand-olive"
                  }`} />
                )}
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] font-serif font-bold text-brand-muted text-center max-w-[120px] leading-tight">
                {scanState === "scanning" 
                  ? `核驗中 ${scanProgress}%` 
                  : scanState === "complete"
                    ? "解鎖成功"
                    : "開啟核驗金鑰"}
              </span>
            </div>
          </motion.button>

          {/* Diagnostic side log screen (Desktop absolute, hidden on mobile) */}
          <div className="absolute -right-36 md:-right-48 w-44 md:w-52 h-28 bg-white/80 border border-brand-border rounded-2xl p-2.5 text-left hidden lg:block overflow-hidden backdrop-blur-sm shadow-md font-serif text-[8.5px] leading-normal text-brand-olive">
            <div className="text-[9px] font-bold border-b border-brand-border pb-1 mb-1.5 text-brand-dark tracking-wider">
              會籍安全核驗進度
            </div>
            <div className="space-y-1 font-sans">
              {(scanState === "scanning" && scanProgress > 10) ? (
                <>
                  <p className="truncate text-brand-olive">● 建立安全雙重核驗通道...</p>
                  {scanProgress >= 30 && <p className="truncate text-brand-olive">● 身分聯徵誠信等級檢索中</p>}
                  {scanProgress >= 55 && <p className="truncate text-brand-olive">● 資產憑證簽章真偽核對</p>}
                  {scanProgress >= 80 && <p className="truncate text-brand-olive">● 正在載入高端推薦名單...</p>}
                </>
              ) : (
                <>
                  <p className="animate-pulse">● 等待金鑰核驗指令...</p>
                  <p className="text-brand-light/60">● 安全加密：國防級 AES-256</p>
                  <p className="text-brand-light/60">● 隱私權保護：嚴格 NDA</p>
                </>
              )}
            </div>
          </div>

          {/* Live activity side display (Desktop absolute, hidden on mobile) */}
          <div className="absolute -left-36 md:-left-48 w-44 md:w-52 h-28 bg-white/80 border border-brand-border rounded-2xl p-2.5 text-left hidden lg:block overflow-hidden backdrop-blur-sm shadow-md font-serif text-[8.5px] text-brand-text">
            <div className="text-[9px] border-b border-brand-border pb-1 mb-1.5 font-bold text-brand-dark tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-olive fill-current" /> 緣友會所大數據
            </div>
            <div className="space-y-1 pt-0.5 font-sans">
              <p>會員男女比例: <span className="text-brand-olive font-bold">45% 紳士 : 55% 麗人</span></p>
              <p>紳士資產門檻: <span className="text-brand-olive font-bold">NT$ 8,000萬+</span></p>
              <p>實名資產認證率: <span className="text-brand-olive font-bold">100% 官方核驗</span></p>
              <p className="flex items-center gap-1 mt-1 text-[8px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-brand-olive font-semibold">尊榮核驗通道：就緒</span>
              </p>
            </div>
          </div>

        </div>

        {/* Mobile-only responsive diagnostic & data boards row */}
        <div className="flex lg:hidden flex-col sm:flex-row gap-4 w-full max-w-sm px-4">
          <div className="flex-1 bg-white/85 border border-brand-border rounded-2xl p-3 text-left shadow-sm backdrop-blur-sm text-[9px] leading-relaxed text-brand-olive">
            <div className="font-bold border-b border-brand-border pb-1 mb-1 text-brand-dark tracking-wide">
              會籍安全核驗進度
            </div>
            <div className="space-y-0.5">
              {(scanState === "scanning" && scanProgress > 10) ? (
                <>
                  <p className="truncate text-brand-olive">● 建立核驗通道...</p>
                  {scanProgress >= 40 && <p className="truncate text-brand-olive">● 檢索誠信等級</p>}
                  {scanProgress >= 70 && <p className="truncate text-brand-olive">● 認證資產簽章</p>}
                </>
              ) : (
                <>
                  <p className="animate-pulse">● 等待金鑰指令...</p>
                  <p className="text-brand-light/60">● 加密: AES-256 | NDA</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 bg-white/85 border border-brand-border rounded-2xl p-3 text-left shadow-sm backdrop-blur-sm text-[9px] leading-relaxed text-brand-text">
            <div className="font-bold border-b border-brand-border pb-1 mb-1 text-brand-dark tracking-wide flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-brand-olive fill-current" /> 緣友大數據
            </div>
            <div className="space-y-0.5">
              <p>門檻: <span className="text-brand-olive font-bold">NT$ 8,000萬+</span></p>
              <p>男女比例: <span className="text-brand-olive font-bold">45% 紳士 : 55% 麗人</span></p>
            </div>
          </div>
        </div>

        {/* Interactive chevron scroll down action */}
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => scrollToSection("cinema-vlog", 1)}
          className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-brand-accent/85 font-bold font-serif">
            SCROLL TO LIFESTYLES // 向下滑動開啟尊榮生活特寫
          </span>
          <ChevronDown className="w-5 h-5 text-brand-accent" />
        </motion.button>

      </div>
    </section>
  );
}
