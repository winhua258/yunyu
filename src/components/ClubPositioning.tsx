import React from "react";
import { motion } from "motion/react";
import { Shield, Award, EyeOff, Sparkles, CheckCircle, ArrowRight, UserCheck } from "lucide-react";

interface ClubPositioningProps {
  scrollToSection: (sectionId: string, index: number) => void;
}

export default function ClubPositioning({ scrollToSection }: ClubPositioningProps) {
  const pillars = [
    {
      icon: <UserCheck className="w-6 h-6 text-brand-olive" />,
      title: "100% 實名真偽查核",
      english: "Identity Authenticity",
      description: "本會所實行嚴格的實名審核機制。所有會員均須經由專屬顧問進行真人身分比對與電話面談，杜絕一切虛假帳號與假冒身分，確保交友生態的最高安全性與純粹性。"
    },
    {
      icon: <Award className="w-6 h-6 text-brand-olive" />,
      title: "頂格高淨值資產審查",
      english: "Premium Asset Validation",
      description: "紳士會籍要求極高之資產实力核驗，包含房產地契、有價證券信託證明或高淨值企業持股等（資產門檻需達 NT$ 8,000 萬以上），官方簽章驗證，保證推薦對象的傑出階層與誠信實力。"
    },
    {
      icon: <EyeOff className="w-6 h-6 text-brand-olive" />,
      title: "國防級隱私與 NDA 保護",
      english: "Absolute Discretion & NDA",
      description: "採用「專屬戀人編號」登入制，全站不公開任何個人隱私、目錄與社群。所有聯絡資訊均受端對端加密保護，並严格簽署高端會員保密協定（NDA），守護您的社交聲譽與穩私安全。"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "線上會籍核驗",
      desc: "開啟會籍認證金鑰，提交基本名片與實名資產認證證明，由 AI 與專屬顧問進行多重真偽核算。"
    },
    {
      num: "02",
      title: "AI 靈魂共鳴採集",
      desc: "參與 2 分鐘 AI 靈魂特質測驗，從認知、生活美學、金錢成熟度、衝突應對等 20 個維度進行全息側寫。"
    },
    {
      num: "03",
      title: "雙向保密特區推薦",
      desc: "解鎖專屬麗人推薦特區或紳士資料庫，精確對比雙方性格雷達圖與生活特寫，篩選最心靈共鳴的伴侶。"
    },
    {
      num: "04",
      title: "一鍵建立 專屬通道",
      desc: "一鍵直連 LINE 專屬保密通道。無騷擾、不外洩，在專業顧問的引導下，開啟一場優雅且私密的對談。"
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
            「緣友 YUAN-YU」非大眾娛樂化的快餐式交友，而是一座專為傑出紳士與知性麗人打造的私人實名社交會所。我們將「誠信、品味、隱私」封裝於精緻的數字合約中，實現靈魂深處的頻率對話。
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
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

      </div>
    </section>
  );
}
