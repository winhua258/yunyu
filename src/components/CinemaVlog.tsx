import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Volume2, VolumeX, Eye, Sparkles, MessageSquare, ChevronDown } from "lucide-react";

export interface VlogStory {
  id: string;
  name: string;
  age: number;
  role: string;
  avatar: string;
  vlogCover: string;
  title: string;
  match: string;
  views: string;
  duration: string;
  location: string;
  tags: string[];
  subtitles: string[];
  comments: { user: string; avatar: string; text: string }[];
}

interface CinemaVlogProps {
  activeVlog: VlogStory;
  setActiveVlog: (vlog: VlogStory) => void;
  vlogProgress: number;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  bgSubtitleIndex: number;
  vlogStories: VlogStory[];
  getSubtitleIndex: (vlog: VlogStory, progressVal: number) => number;
  scrollToSection: (sectionId: string, index: number) => void;
}

export default function CinemaVlog({
  activeVlog,
  setActiveVlog,
  vlogProgress,
  isMuted,
  setIsMuted,
  bgSubtitleIndex,
  vlogStories,
  getSubtitleIndex,
  scrollToSection,
}: CinemaVlogProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 32000), 50);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.5 + 1,
          alpha: Math.random() * 0.4 + 0.15,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(163, 177, 138, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = `rgba(163, 177, 138, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (p.radius > 2) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(163, 177, 138, 0.35)";
        } else {
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section 
      id="cinema-vlog"
      className="w-full min-h-screen relative flex flex-col justify-between py-24 px-4 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-b from-[#161614] via-[#161614] via-80% to-brand-beige text-white scroll-mt-36 md:scroll-mt-32"
    >
      {/* Immersive background - Active Vlog Cover projecting directly */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeVlog.id}
            src={activeVlog.vlogCover} 
            alt="Cinematic Background" 
            referrerPolicy="no-referrer"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ 
              scale: [1.02, 1.08, 1.02],
              opacity: 0.38,
            }}
            exit={{ opacity: 0 }}
            transition={{
              scale: { duration: 25, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1.2 }
            }}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        </AnimatePresence>
        
        {/* Deep cinematic gradient and vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#161614] via-black/85 via-80% to-brand-beige mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#161614_90%)] opacity-85" />
        
        {/* Interactive Google Labs style soul particles */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-70"
        />
      </div>

      {/* Header Title */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pb-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-serif text-brand-accent tracking-[0.3em] font-bold uppercase block">
            YUAN-YU VIP LIFESTYLE SHOWCASE // 沉浸式高端實境生活特寫
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-white font-bold tracking-widest">
            在藝術與品味間 · 邂逅精緻生活
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-white/50 font-serif bg-white/5 backdrop-blur-md py-1.5 px-3.5 rounded-full border border-white/10">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          <span>100% 麗人與紳士完成實名審核</span>
        </div>
      </div>

      {/* Main Grid Layout without bounded video player card */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-6">
        
        {/* LEFT COLUMN: Premium Candidate Selector Drawer (Glassmorphic) */}
        <div className="lg:col-span-3 flex flex-col space-y-4 h-full justify-center">
          <div id="cinema-vlog-slider" className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 space-y-4 shadow-2xl text-left">
            <h4 className="text-[10px] font-serif font-bold tracking-[0.2em] text-brand-accent uppercase border-b border-white/5 pb-2.5">
              ELITE MEMBERS // 本週精選尊榮會員
            </h4>
            
            <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
              {vlogStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => {
                    setActiveVlog(story);
                  }}
                  className={`flex items-center gap-3.5 p-2 rounded-2xl border text-left transition-all duration-300 focus:outline-none ${
                    activeVlog.id === story.id
                      ? "bg-brand-accent/20 border-brand-accent text-white shadow-lg shadow-brand-accent/5 scale-102"
                      : "bg-transparent border-white/5 hover:bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  <div className="relative shrink-0 mx-auto lg:mx-0">
                    <img 
                      src={story.avatar} 
                      alt={story.name} 
                      className={`w-9 h-9 lg:w-11 lg:h-11 rounded-full object-cover border-2 transition-transform duration-300 ${
                        activeVlog.id === story.id ? "border-brand-accent scale-105" : "border-transparent"
                      }`}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#161614]" />
                  </div>
                  <div className="hidden lg:block space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs">{story.name}</span>
                      <span className="text-[9px] font-bold text-brand-accent bg-brand-accent/10 px-1.5 rounded-md">{story.match}</span>
                    </div>
                    <p className="text-[10px] text-brand-light truncate max-w-[140px]">{story.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER STAGE: Floating Holographic Subtitles and Voice Wave (6 Columns) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-8 py-6 md:py-0">
          
          {/* Candidate Floating Identity */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={activeVlog.id}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              {/* Pulsing Aura Ring */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-brand-accent/30 to-brand-olive/30 blur-xl animate-[pulse_3s_infinite]" />
              <img 
                src={activeVlog.avatar} 
                alt={activeVlog.name} 
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-white/20 shadow-2xl"
              />
              <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-3 border-[#161614]" />
            </motion.div>

            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-white text-xl md:text-2xl tracking-wider flex items-center justify-center gap-2">
                {activeVlog.name} 
                <span className="text-xs bg-brand-accent/25 text-brand-accent px-2.5 py-0.5 rounded-full font-sans font-semibold border border-brand-accent/20">
                  {activeVlog.age}歲 / {activeVlog.location}
                </span>
              </h3>
              <p className="text-xs md:text-sm text-brand-accent/90 font-medium font-serif tracking-widest">{activeVlog.role}</p>
            </div>

            {/* Candidate Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
              {activeVlog.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-medium bg-white/5 border border-white/10 text-white/80 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Floating Subtitle Hologram Card */}
          <div className="w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeVlog.id}-${getSubtitleIndex(activeVlog, vlogProgress)}`}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-black/35 hover:bg-black/45 backdrop-blur-xl px-8 py-6 rounded-[2rem] border border-white/10 shadow-2xl text-center max-w-[90%] relative transition-all duration-300"
              >
                {/* Glowing decorative corners */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-accent/40 rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-accent/40 rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-accent/40 rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-accent/40 rounded-br-lg" />

                <p className="text-sm md:text-base text-white font-serif font-medium tracking-wide leading-relaxed">
                  「 {activeVlog.subtitles[getSubtitleIndex(activeVlog, vlogProgress)]} 」
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dedicated voice wave controller panel */}
          <div className="w-full max-w-sm space-y-4">
            {/* Pulsing Audio Soundwave Bar */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[...Array(13)].map((_, i) => (
                <span 
                  key={i}
                  className={`w-0.75 bg-brand-accent rounded-full transition-all duration-300 ${
                    isMuted ? "h-1 bg-white/20" : "animate-pulse"
                  }`}
                  style={{
                    height: isMuted ? "4px" : `${Math.sin(vlogProgress * 0.45 + i * 0.7) * 12 + 16}px`,
                    animationDelay: `${i * 65}ms`,
                    animationDuration: "0.5s"
                  }}
                />
              ))}
            </div>

            {/* Micro Player Console */}
            <div className="flex items-center gap-3.5 bg-black/30 backdrop-blur-xl py-2 px-4 rounded-full border border-white/10 shadow-lg justify-between text-[10px] font-mono">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-brand-accent transition-colors focus:outline-none shrink-0"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-brand-accent animate-pulse" />}
              </button>

              <div className="flex-1 mx-2.5 h-1 bg-white/10 rounded-full relative overflow-hidden">
                <div 
                  className="h-full bg-brand-accent shadow-[0_0_8px_#A3B18A] transition-all duration-300"
                  style={{ width: `${vlogProgress}%` }}
                />
              </div>

              <div className="text-white/60 flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-brand-accent/80" /> {activeVlog.views}
                </span>
                <span>•</span>
                <span>{activeVlog.duration}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Realtime Matching Comments Feed (Glassmorphic) */}
        <div className="lg:col-span-3 flex flex-col space-y-4 h-full justify-center">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 space-y-4 shadow-2xl text-left flex flex-col justify-between min-h-[300px] lg:min-h-[380px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-[10px] font-serif text-brand-accent font-bold tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> ELEGANT DIALOGUES // 雅緻生活對談
                </span>
                <span className="text-[9px] text-white/40 font-serif">Member reflections</span>
              </div>

              {/* Comments scroll container */}
              <div className="space-y-3.5 max-h-[180px] lg:max-h-[220px] overflow-hidden py-1">
                {activeVlog.comments.map((comment, index) => (
                  <motion.div 
                    key={`${activeVlog.id}-${index}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-2.5 items-start text-xs text-white/95 leading-normal"
                  >
                    <img 
                      src={comment.avatar} 
                      alt={comment.user} 
                      className="w-5.5 h-5.5 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="bg-white/5 hover:bg-white/10 border border-white/5 p-2 rounded-2xl rounded-tl-none flex-1 transition-colors">
                      <p className="text-[10px] font-serif text-brand-accent font-bold">{comment.user}</p>
                      <p className="text-[10px] text-white/80 mt-0.5 leading-relaxed">{comment.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom active engagement card */}
            <div className="bg-brand-accent/15 border border-brand-accent/20 p-3 rounded-2xl shadow-inner mt-4">
              <p className="text-[10px] text-brand-accent font-serif font-bold tracking-wider leading-relaxed flex items-center gap-1.5 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent fill-current shrink-0 animate-pulse" />
                <span>麗人與頂格紳士對話配對成功率 96%</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll indicator for Section 3 */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center pt-2">
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => scrollToSection("club-positioning", 2)}
          className="flex flex-col items-center gap-1 mx-auto cursor-pointer focus:outline-none"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-brand-accent/85 font-bold font-serif">
            SCROLL TO CLUB ETHOS // 向下滑動開啟尊榮會籍格調
          </span>
          <ChevronDown className="w-5 h-5 text-brand-accent" />
        </motion.button>
      </div>
    </section>
  );
}
