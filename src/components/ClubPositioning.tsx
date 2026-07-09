import React from "react";
import { motion } from "motion/react";
import { Shield, Award, EyeOff, Sparkles, CheckCircle, ArrowRight, UserCheck, Calendar, MapPin } from "lucide-react";

interface ClubPositioningProps {
  scrollToSection: (sectionId: string, index: number) => void;
}

export default function ClubPositioning({ scrollToSection }: ClubPositioningProps) {
  const pillars = [
    {
      icon: <UserCheck className="w-6 h-6 text-brand-olive" />,
      title: "100% 實名真偽查核",
      english: "Identity Authenticity",
      description: "顧問真人面談與身分雙重比對，100% 杜絕虛假與假冒帳號，確保交友生態安全純粹。"
    },
    {
      icon: <Award className="w-6 h-6 text-brand-olive" />,
      title: "頂格高淨值資產審查",
      english: "Premium Asset Validation",
      description: "紳士會籍須通過 NT$ 8,000 萬以上淨資產核驗（房產/證券/股權），保證圈層實力對等。"
    },
    {
      icon: <EyeOff className="w-6 h-6 text-brand-olive" />,
      title: "國防級隱私與 NDA 保護",
      english: "Absolute Discretion & NDA",
      description: "全站實施專屬編號登入。嚴格簽署保密協定（NDA）與防拍照洩漏，全力守護社交聲譽。"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "線上會籍核驗",
      desc: "線上提交基本資料與資產證明，由顧問與 AI 進行多重真實度核查。"
    },
    {
      num: "02",
      title: "AI 靈魂特質採集",
      desc: "進行 2 分鐘心理測驗，從認知、美學等 20 個維度進行全息性格側寫。"
    },
    {
      num: "03",
      title: "雙向保密特區推薦",
      desc: "解鎖專屬數據庫，對比雙方性格雷達圖與真實生活特寫，精準篩選配對。"
    },
    {
      num: "04",
      title: "一鍵建立 專屬通道",
      desc: "一鍵直連 LINE 雙向保密通道，在顧問引導下展開安全、優雅的私密對談。"
    }
  ];

  return (
    <section
      id="club-positioning"
      className="w-full min-h-screen relative flex flex-col items-center justify-center py-24 px-4 md:px-12 bg-gradient-to-b from-[#161614] to-[#0D0D0B] text-white overflow-hidden scroll-mt-36 md:scroll-mt-32"
    >
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-[30%] right-[5%] w-96 h-96 rounded-full bg-brand-olive/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-brand-accent/10 blur-[130px] pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      <div className="relative z-10 max-w-7xl w-full space-y-20">
        
        {/* Section Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-brand-accent" />
            <span className="text-[10px] md:text-xs font-serif uppercase tracking-[0.25em] text-brand-accent font-bold">
              YUAN-YU ETHOS // 緣友會籍品位與定位
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-white font-bold tracking-widest leading-tight"
          >
            以美學為引 · 遇見靈魂對等
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs md:text-sm text-white/60 leading-relaxed font-light tracking-wider"
          >
            「緣友 YUAN-YU」專為傑出紳士與知性麗人打造。我們將「誠信、品味、隱私」融入極簡數字合約，開啟靈魂對等的深度頻率對話。
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div id="club-positioning-pillars" className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-accent/40 rounded-[2.5rem] p-8 space-y-6 transition-all duration-500 shadow-xl backdrop-blur-xl relative"
            >
              {/* Outer decorative light */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2.5rem] bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 flex items-center justify-center border border-brand-accent/25 shadow-sm">
                {pillar.icon}
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-brand-accent font-bold font-mono block">
                  {pillar.english}
                </span>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white tracking-wide">
                  {pillar.title}
                </h3>
              </div>

              <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Exclusive Matchmaking Flow (Visual Progress Blocks) */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-serif text-brand-accent font-bold tracking-widest uppercase block">
                MEMBERSHIP PROCESS // 私人定制尊榮服務流程
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-white font-bold tracking-wider">
                四步開啟 · 沉浸式高端美學邂逅
              </h3>
            </div>
            <div className="text-xs text-white/50 font-serif shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent fill-current animate-pulse" />
              <span>全流程安全加密：嚴密保護隱私</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="space-y-4 text-left relative group"
              >
                {/* Arrow connector for large screens */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-10 -right-4 translate-x-1/2 z-20 text-white/20 group-hover:text-brand-accent/50 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-extrabold text-brand-accent/40 group-hover:text-brand-accent transition-colors">
                    {step.num}
                  </span>
                  <div className="h-px flex-1 bg-white/10 group-hover:bg-brand-accent/30 transition-colors" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-serif font-bold text-white tracking-wide">
                    {step.title}
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Prompt action trigger button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => scrollToSection("access-portal", 3)}
              className="flex items-center gap-2 px-8 py-3.5 bg-brand-accent hover:bg-[#b5c29d] text-brand-dark hover:scale-103 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>立即開啟會籍驗證通道</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Curated Salon Events Section */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-serif text-brand-accent font-bold tracking-widest uppercase block">
              EXCLUSIVE OFF-LINE SALONS // 會所限定高端圈層沙龍
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-white font-bold tracking-wider">
              線下限定社交圈層 · 聯結智慧與品位
            </h3>
            <p className="text-xs text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
              「緣友」定期舉辦頂級私人沙龍，以茶會友、以球會商、以酒會心。
              在私密性與層級對等的線下對話中，拉近心靈的頻率。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/images/superyacht.png",
                tag: "私人遊艇品鑑",
                title: "「風馳海境」私人遊艇與波爾多名莊品酒沙龍",
                date: "2026.07.25",
                location: "基隆港私人遊艇俱樂部",
                desc: "約邀 8 位完成實名資產核驗會員，夕陽時分乘私人遊艇破浪出行，細品 5 款一等列級莊佳釀，在微風中探討產業與美學的未來。"
              },
              {
                image: "/images/private_jet.png",
                tag: "商務公務機晚宴",
                title: "「雲端對談」松山公務機專屬私密高空沙龍",
                date: "2026.08.08",
                location: "台北松山商務航空中心",
                desc: "專為高淨值會員定制的極致飛行與精緻晚宴。在頂級空域體驗與私人管家服務中，分享對生活溫度與事業廣度的深度感悟。"
              },
              {
                image: "/images/golf_club.png",
                tag: "果嶺菁英賽",
                title: "「綠茵揮桿」大屯山私人高爾夫菁英邀請賽",
                date: "2026.08.22",
                location: "陽明山私人高爾夫俱樂部",
                desc: "以球會友，在國家公園懷抱的頂級果嶺展開 18 洞對戰，晚間於會所專屬雪茄吧暢談人生故事與靈魂頻率的共鳴。"
              }
            ].map((evt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="group bg-white/5 border border-white/10 hover:border-brand-accent/40 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl backdrop-blur-md flex flex-col"
              >
                {/* Event Cover Photo */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-brand-accent/90 text-brand-dark text-[9px] font-bold tracking-widest uppercase rounded-full">
                    {evt.tag}
                  </span>
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <h4 className="text-sm font-serif font-bold text-white tracking-wide group-hover:text-brand-accent transition-colors leading-snug">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-white/60 leading-relaxed font-light">
                      {evt.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-1.5 text-left text-[10px] text-white/50 font-serif">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                      <span>沙龍時間：{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                      <span>活動地點：{evt.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
