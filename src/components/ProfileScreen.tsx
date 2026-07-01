import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  ArrowLeft, 
  ExternalLink, 
  Camera, 
  Compass, 
  Palette, 
  Music, 
  ChefHat, 
  Film, 
  Coffee, 
  Disc, 
  Cpu, 
  Heart, 
  Dumbbell, 
  Sun, 
  BookOpen, 
  MessageCircle, 
  Smile,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Profile } from "../types";

interface ProfileScreenProps {
  profile: Profile;
  onBack: () => void;
}

export default function ProfileScreen({ profile, onBack }: ProfileScreenProps) {
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const images = (profile.imageUrls && profile.imageUrls.length > 0
    ? profile.imageUrls
    : [profile.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"]
  ).map(url => encodeURI(url));

  React.useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoaded(false);
    setIsDetailsExpanded(false); // Reset to collapsed when switching profiles
  }, [profile]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Helper to map interest tags to beautiful Lucide icons
  const getInterestIcon = (interest: string) => {
    const lowercaseInterest = interest.toLowerCase();
    if (lowercaseInterest.includes("攝影") || lowercaseInterest.includes("照相")) return <Camera className="w-4 h-4" />;
    if (lowercaseInterest.includes("露營") || lowercaseInterest.includes("戶外") || lowercaseInterest.includes("登山")) return <Compass className="w-4 h-4" />;
    if (lowercaseInterest.includes("設計") || lowercaseInterest.includes("美學")) return <Palette className="w-4 h-4" />;
    if (lowercaseInterest.includes("畫") || lowercaseInterest.includes("藝術")) return <Palette className="w-4 h-4" />;
    if (lowercaseInterest.includes("音樂") || lowercaseInterest.includes("古典")) return <Music className="w-4 h-4" />;
    if (lowercaseInterest.includes("烘焙") || lowercaseInterest.includes("烘培") || lowercaseInterest.includes("蛋糕")) return <ChefHat className="w-4 h-4" />;
    if (lowercaseInterest.includes("電影") || lowercaseInterest.includes("影集") || lowercaseInterest.includes("追劇")) return <Film className="w-4 h-4" />;
    if (lowercaseInterest.includes("咖啡") || lowercaseInterest.includes("手沖")) return <Coffee className="w-4 h-4" />;
    if (lowercaseInterest.includes("樂團") || lowercaseInterest.includes("獨立")) return <Disc className="w-4 h-4" />;
    if (lowercaseInterest.includes("科技") || lowercaseInterest.includes("軟體") || lowercaseInterest.includes("工程")) return <Cpu className="w-4 h-4" />;
    if (lowercaseInterest.includes("貓") || lowercaseInterest.includes("寵物")) return <Heart className="w-4 h-4" />;
    if (lowercaseInterest.includes("運動") || lowercaseInterest.includes("瑜伽") || lowercaseInterest.includes("健身")) return <Dumbbell className="w-4 h-4" />;
    if (lowercaseInterest.includes("活潑") || lowercaseInterest.includes("陽光") || lowercaseInterest.includes("開朗")) return <Sun className="w-4 h-4" />;
    if (lowercaseInterest.includes("閱讀") || lowercaseInterest.includes("書") || lowercaseInterest.includes("寫作")) return <BookOpen className="w-4 h-4" />;
    if (lowercaseInterest.includes("對話") || lowercaseInterest.includes("溝通")) return <MessageCircle className="w-4 h-4" />;
    return <Smile className="w-4 h-4" />;
  };

  const handleLineClick = () => {
    setShowRedirectModal(true);
  };

  const confirmRedirect = () => {
    setShowRedirectModal(false);
    const greetingMsg = "Hello 我來自緣友通過靈魂配對，你是最契合我的異性";

    // 嘗試從 contactLineUrl 中提取 LINE ID，構建帶入問候語的 URL
    // LINE URL Scheme: https://line.me/R/oaMessage/{LINE_ID}/?{encodedMessage}
    // 適用於 LINE Official Account；個人帳號 line://msg/text/{msg} 可作為備用
    let targetUrl = profile.contactLineUrl;
    try {
      // 如果是 line.me/ti/p/ 格式的個人帳號連結，嘗試附加訊息
      if (targetUrl.includes("line.me/ti/p/") || targetUrl.includes("line.me/R/ti/p/")) {
        // 個人 LINE 無法直接預填訊息，但可嘗試 line://msg/text/ scheme
        const encodedMsg = encodeURIComponent(greetingMsg);
        // 備用：複製到剪貼簿並提示用戶貼上
        navigator.clipboard.writeText(greetingMsg).catch(() => {});
      } else if (targetUrl.includes("@")) {
        // 如果是官方帳號格式 (@xxxx)，使用 oaMessage 帶入訊息
        const lineId = targetUrl.match(/@[\w.-]+/)?.[0]?.replace("@", "");
        if (lineId) {
          const encodedMsg = encodeURIComponent(greetingMsg);
          targetUrl = `https://line.me/R/oaMessage/${lineId}/?${encodedMsg}`;
        }
      } else {
        // 其他格式，直接使用原始 URL，並複製到剪貼簿
        navigator.clipboard.writeText(greetingMsg).catch(() => {});
      }
    } catch (e) {
      // 解析失敗時，保留原始 URL 並複製到剪貼簿
      navigator.clipboard.writeText(greetingMsg).catch(() => {});
      console.warn("LINE URL parse failed, using original URL", e);
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex-1 bg-brand-beige flex flex-col justify-center px-4 md:px-12 py-8 md:py-12 overflow-hidden relative">
      
      {/* Decorative Organic Backdrop Gradients */}
      <div className="absolute top-1/2 left-[-150px] w-[350px] h-[350px] bg-brand-border/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-[-100px] w-[300px] h-[300px] bg-brand-border/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center relative z-10">
        
        {/* Left Column: Info & Bio Details (Spans 7 columns on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          {/* VIP Label Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-brand-light uppercase tracking-[0.25em] text-[10px] md:text-xs font-bold">
              VIP Exclusive Match // 專屬尊榮推薦
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
          </div>

          {/* Profile Name, Age & Slogan */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-dark font-bold leading-tight">
                {profile.name}
              </h1>
              <span className="text-xl md:text-2xl font-sans text-brand-muted font-light">
                {profile.age} 歲
              </span>
              
              {/* Location Badge */}
              <div className="flex items-center gap-1.5 bg-brand-border/50 px-3.5 py-1 rounded-full border border-brand-border/80 text-brand-olive text-xs font-semibold shadow-sm ml-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
            </div>
            
            <p className="italic text-lg md:text-xl text-brand-olive font-serif pl-1 md:pl-2">
              「 {profile.tagline} 」
            </p>
          </div>

          {/* Bio Description Box */}
          <div className="text-brand-muted text-sm md:text-base leading-relaxed bg-white/40 border border-brand-border/30 p-6 rounded-3xl backdrop-blur-sm shadow-sm space-y-4">
            <p>{profile.bio}</p>
            {profile.idealMatch && (
              <p className="text-brand-olive text-xs md:text-sm font-serif italic pt-2 border-t border-brand-border/40">
                <span className="font-bold font-sans not-italic text-[10px] uppercase tracking-wider block text-brand-light mb-1">關於對方的理想期待：</span>
                {profile.idealMatch}
              </p>
            )}
          </div>

          {/* Interest Badges Grid */}
          <div className="space-y-2.5">
            <span className="text-[10px] md:text-xs text-brand-light uppercase tracking-widest font-bold">
              Lifestyle & Interests // 生活風格與興趣
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.lifestyle.map((interest, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  key={interest}
                  className="flex items-center gap-1.5 bg-white border border-brand-border/60 hover:border-brand-olive px-4 py-2 rounded-xl text-xs font-medium text-brand-muted shadow-sm transition-all duration-300"
                >
                  <span className="text-brand-olive">{getInterestIcon(interest)}</span>
                  <span>{interest}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action LINE button */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-4">
            <button
              id="btn-line-contact-trigger"
              onClick={handleLineClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-[#06C755] text-white px-10 py-4.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-md hover:bg-[#05b04b] hover:shadow-xl transition-all duration-300 transform active:scale-98"
            >
              <Heart className="w-4 h-4 shrink-0 fill-current" />
              <span>一鍵 LINE 聯絡與對談</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </button>
            
            <p className="text-[10px] md:text-xs text-brand-light text-center sm:text-left leading-normal sm:max-w-xs pl-1">
              ※ 點擊後將跳轉至第三方通訊軟體。本平台保證安全加密與隱私不外洩。
            </p>
          </div>
        </motion.div>

        {/* Right Column: Visual Component (Spans 5 columns on desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 relative flex items-center justify-center py-8 md:py-0"
        >
          {/* Organic Rounded Picture Container */}
          <div 
            className="w-[280px] sm:w-[340px] md:w-[380px] h-[400px] sm:h-[480px] md:h-[520px] bg-brand-border rounded-[200px] overflow-hidden shadow-2xl border-4 border-white relative group"
            style={{
              isolation: 'isolate',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)',
              WebkitBackfaceVisibility: 'hidden',
              WebkitTransform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            
            {/* Shimmer/Skeleton placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-border to-brand-beige animate-pulse" />
            )}
            
            {/* Dark/Warm ambient gradient covering the bottom for better typography readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500 z-10" />

            <img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={profile.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-105 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{
                willChange: 'transform, opacity',
                WebkitBackfaceVisibility: 'hidden',
                WebkitTransform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                transform: 'translate3d(0, 0, 0)'
              }}
            />

            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  id="btn-profile-img-prev"
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/75 hover:bg-white text-brand-dark shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-105 active:scale-95"
                  title="上一張照片"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  id="btn-profile-img-next"
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/75 hover:bg-white text-brand-dark shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-105 active:scale-95"
                  title="下一張照片"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-24 inset-x-0 z-20 flex justify-center gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageLoaded(false);
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentImageIndex 
                          ? "bg-brand-accent w-4" 
                          : "bg-white/50 hover:bg-white"
                      }`}
                      title={`切換至第 ${idx + 1} 張`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Profile Overlay Label */}
            <div className="absolute bottom-12 inset-x-0 flex flex-col text-center z-10 text-white drop-shadow-md px-6 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-beige">
                Yuan-Yu Member
              </span>
              <span className="text-xl md:text-2xl font-serif font-semibold">
                {profile.name} // {profile.location}
              </span>
            </div>
          </div>

          {/* Floating Detail Card over the photo */}
          <motion.div
            layout
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`absolute bottom-[-10px] left-[-10px] sm:left-[-30px] bg-white rounded-3xl shadow-xl border border-brand-border/60 backdrop-blur-sm z-20 cursor-pointer transition-all duration-300 select-none ${
              isDetailsExpanded ? "p-6 w-64" : "p-3.5 w-40 flex items-center justify-center hover:scale-105"
            }`}
          >
            {isDetailsExpanded ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-olive font-serif">
                      理想的生活細節
                    </span>
                  </div>
                  <span className="text-[9px] text-brand-light font-bold hover:text-brand-olive">收合</span>
                </div>
                <p className="text-xs leading-relaxed text-brand-muted">
                  {profile.cardDetail}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center w-full">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0" />
                <span className="text-xs font-bold text-brand-olive tracking-wider whitespace-nowrap font-serif">
                  理想生活細節
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Redirect Confirmation Dialog Modal */}
      <AnimatePresence>
        {showRedirectModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRedirectModal(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl border border-brand-border w-full max-w-md overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-6 bg-brand-border/30 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-brand-olive fill-current animate-pulse" />
                  <h3 className="font-serif text-lg text-brand-dark font-bold tracking-wide">
                    開通與 {profile.name} 的對話通道
                  </h3>
                </div>
                <button 
                  id="btn-redirect-close"
                  onClick={() => setShowRedirectModal(false)}
                  className="p-1 rounded-full text-brand-light hover:bg-brand-border/40 hover:text-brand-dark transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="flex justify-center my-2">
                  <div className="relative w-16 h-16">
                    <img 
                      src={encodeURI(profile.imageUrl || "")} 
                      alt="" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-brand-olive shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#06C755] rounded-full border-2 border-white flex items-center justify-center text-white">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-brand-muted leading-relaxed text-center">
                  您即將離開 <strong className="text-brand-dark">緣友 YUAN-YU</strong> 並開啟外部 <strong className="text-[#06C755]">LINE</strong> 應用程式以與 <strong className="text-brand-dark">{profile.name}</strong> 的專屬代表建立連線。
                </p>

                <p className="text-[11px] text-brand-light leading-relaxed bg-brand-beige/50 p-3 rounded-xl border border-brand-border/40">
                  🎁 <strong>專屬提示：</strong> 點擊跳轉後，系統將自動開啟與對方的 LINE 對話，並<strong>預填入專屬問候語</strong>（個人帳號將自動複製至剪貼簿）：<br/>
                  <strong className="text-brand-dark italic block mt-1 text-center font-serif">「Hello 我來自緣友通過靈魂配對，你是最契合我的異性」</strong>
                </p>
              </div>

              {/* Actions Footer */}
              <div className="px-6 py-4 bg-brand-border/20 border-t border-brand-border/50 flex flex-col sm:flex-row gap-3">
                <button
                  id="btn-redirect-cancel"
                  onClick={() => setShowRedirectModal(false)}
                  className="flex-1 py-3 border border-brand-border text-brand-muted rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-border/40 transition-all duration-200"
                >
                  取消返回
                </button>
                <button
                  id="btn-redirect-confirm"
                  onClick={confirmRedirect}
                  className="flex-1 py-3 bg-[#06C755] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#05b04b] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  確認並跳轉
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
