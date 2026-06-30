import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ArrowRight, ArrowLeft, RefreshCw, X, ShieldCheck, Heart, User } from "lucide-react";
import { Profile, PersonalityMetrics } from "../types";
import { TEMPLATE_EXCLUDED_CODES, saveLadyQuizResult } from "../data";
import { useAuth } from "./AuthContext";
import { useData } from "./DataContext";

interface SoulMatchQuizProps {
  onClose: () => void;
  onMatchComplete: (code: string) => void;
}

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    desc: string;
    modifiers: Partial<PersonalityMetrics>;
  }[];
}


// 20 Metric Chinese labels for beautiful display on result page
const METRIC_LABELS: Record<keyof PersonalityMetrics, string> = {
  Rationality: "理性思考",
  Spontaneity: "隨性生活",
  Adventure: "冒險精神",
  Hedonism: "生活享樂",
  Dominance: "主導意識",
  Extroversion: "社交外向",
  SecurityNeed: "安全感需求",
  EmotionalDependency: "情緒依賴",
  GrowthMindset: "成長型思維",
  FamilyOrientation: "家庭導向",
  ConsumptionTendency: "享樂型消費",
  FinancialMaturity: "理財成熟度",
  CommunicationEfficiency: "高效溝通",
  RitualNeed: "生活儀式感",
  QualityOfLife: "美學生活品質",
  FreedomNeed: "個人自由需求",
  Responsibility: "擔當與責任感",
  DecisionSpeed: "果斷決策速度",
  ConflictResolution: "衝突處理能力",
  LongTermCommitment: "長期關係投入"
};

// Codes to be excluded from matching
const RESERVED_MATCH_CODES = ['888', '999', '666', '520'];

const QUIZ_PROGRESS_KEY = "yuanyu_quiz_progress";

const defaultUserMetrics: PersonalityMetrics = {
  Rationality: 50,
  Spontaneity: 50,
  Adventure: 50,
  Hedonism: 50,
  Dominance: 50,
  Extroversion: 50,
  SecurityNeed: 50,
  EmotionalDependency: 50,
  GrowthMindset: 50,
  FamilyOrientation: 50,
  ConsumptionTendency: 50,
  FinancialMaturity: 50,
  CommunicationEfficiency: 50,
  RitualNeed: 50,
  QualityOfLife: 50,
  FreedomNeed: 50,
  Responsibility: 50,
  DecisionSpeed: 50,
  ConflictResolution: 50,
  LongTermCommitment: 50
};

export default function SoulMatchQuiz({ onClose, onMatchComplete }: SoulMatchQuizProps) {
  const { profiles, metrics } = useData();
  const { loggedInLadyCode: ladyCode, ladyProfiles, updateLadyProfile } = useAuth(); // 從 Context 獲取用戶編號
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "calculating" | "result">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userMetrics, setUserMetrics] = useState<PersonalityMetrics>(() => ({ ...defaultUserMetrics }));
  
  // History stack of metric changes for the Back button
  const [metricHistory, setMetricHistory] = useState<PersonalityMetrics[]>([]);
  const firstNonTemplate = Object.keys(profiles).find(c => !TEMPLATE_EXCLUDED_CODES.includes(c)) || Object.keys(profiles)[0] || "monkeyB";
  const [matchedCode, setMatchedCode] = useState<string>(() => firstNonTemplate);
  const [matchPercentage, setMatchPercentage] = useState<number>(93);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [calculationMessage, setCalculationMessage] = useState("初始化人格採集器...");

  // Top 3 personality tags highlighted for the user
  const [topTags, setTopTags] = useState<{ label: string; val: number }[]>([]);

  // 檢查女性用戶是否已完成測驗
  useEffect(() => {
    if (ladyCode && ladyProfiles[ladyCode]?.quizTaken) {
      onMatchComplete(ladyProfiles[ladyCode].matchedGentlemanCode || firstNonTemplate);
      return;
    }

    // 自動恢復上次的測驗進度
    const savedProgressRaw = localStorage.getItem(QUIZ_PROGRESS_KEY);
    if (savedProgressRaw) {
      try {
        const savedProgress = JSON.parse(savedProgressRaw);
        if (savedProgress.userMetrics && typeof savedProgress.currentQuestionIndex === 'number' && savedProgress.currentQuestionIndex < questions.length) {
          setUserMetrics(savedProgress.userMetrics);
          setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
          setMetricHistory(savedProgress.metricHistory || []);
          setCurrentStep("quiz"); // 直接跳到測驗畫面
        }
      } catch (e) {
        console.error("無法解析測驗進度，將重新開始。", e);
        localStorage.removeItem(QUIZ_PROGRESS_KEY);
      }
    }

  }, [ladyCode, onMatchComplete, firstNonTemplate, profiles, ladyProfiles]); // Add profiles & ladyProfiles to dependency

  const questions: Question[] = [
    {
      id: 1,
      text: "如果可以隨心所欲選擇，妳最希望生活在怎樣的城市氛圍裡呢？這能讓我感覺到妳對生活環境與步調的偏好喔。",
      options: [
        {
          label: "A. 北歐精緻都會",
          desc: "治安極佳、規劃井然有序，一切都高度安全、高效且優雅。",
          modifiers: { Rationality: 15, Spontaneity: -15, SecurityNeed: 15, FinancialMaturity: 10, QualityOfLife: 15, RitualNeed: 10 }
        },
        {
          label: "B. 南法藝術小鎮",
          desc: "充滿藝術氣息與街頭咖啡香，轉角處處是浪漫、自由與驚喜。",
          modifiers: { Spontaneity: 15, Hedonism: 15, EmotionalDependency: 10, RitualNeed: 20, QualityOfLife: 10 }
        },
        {
          label: "C. 紐西蘭自然露營區",
          desc: "緊鄰森林與壯麗海岸線，親身擁抱大自然，享受極致開闊與平靜。",
          modifiers: { Adventure: 20, FreedomNeed: 20, Extroversion: -10, QualityOfLife: -5, Spontaneity: 10 }
        },
        {
          label: "D. 紐約金融核心區",
          desc: "繁華、高效、匯聚全球頂尖資源、商務活力與自我實現機會。",
          modifiers: { GrowthMindset: 20, FinancialMaturity: 15, DecisionSpeed: 15, Dominance: 15, ConsumptionTendency: 10 }
        }
      ]
    },
    {
      id: 2,
      text: "假設今天突然多了一筆十萬元的特別獎金，且有三天臨時假期，妳直覺最想怎麼規劃呢？",
      options: [
        {
          label: "A. 穩定累積與精緻享受",
          desc: "存入理財帳戶，只撥出一小部分去預訂一間精緻的高級餐廳，其餘作為長線投資基金。",
          modifiers: { FinancialMaturity: 25, ConsumptionTendency: -25, Rationality: 20, Responsibility: 15, SecurityNeed: 15, LongTermCommitment: 10 }
        },
        {
          label: "B. 當下行樂，說走就走",
          desc: "立刻預訂機票，飛到熱帶海島度假村住奢華套房享受 Spa，把獎金完全花在當下的幸福體驗上！",
          modifiers: { ConsumptionTendency: 30, Hedonism: 25, Spontaneity: 20, DecisionSpeed: 15, EmotionalDependency: 10 }
        },
        {
          label: "C. 投入熱愛，升級裝備",
          desc: "買一套心儀已久的頂級戶外露營裝備或高端單眼相機，隨時背上背包去探尋未知的風景。",
          modifiers: { FreedomNeed: 20, Adventure: 25, Spontaneity: 15, ConsumptionTendency: 10, QualityOfLife: 10 }
        },
        {
          label: "D. 自我增值，謀劃未來",
          desc: "報名一個高階的自我成長或大師班課程，順便添置高效能的科技配備來全面升級自我生產力。",
          modifiers: { GrowthMindset: 30, FinancialMaturity: 15, Rationality: 15, Dominance: 15, Responsibility: 15 }
        }
      ]
    },
    {
      id: 3,
      text: "跟伴侶出門小旅行，妳最嚮往以下哪種移動時的相處氛圍呢？",
      options: [
        {
          label: "A. 乾淨平穩，井然有序",
          desc: "坐在他洗得一塵不染、導航精確的德系轎車裡，聽著輕爵士樂聊聊長期的生活規劃。",
          modifiers: { Rationality: 15, SecurityNeed: 20, FamilyOrientation: 15, RitualNeed: 10, Responsibility: 15 }
        },
        {
          label: "B. 感性陪伴，溫馨分享",
          desc: "在火車或高鐵上靠著肩膀看窗外風景，一邊分食點心、一邊聽著獨立樂團音樂分享彼此的心情故事。",
          modifiers: { EmotionalDependency: 25, Extroversion: -10, RitualNeed: 15, FamilyOrientation: 10, ConflictResolution: 10 }
        },
        {
          label: "C. 越野探險，隨性流浪",
          desc: "坐著他的四輪驅動越野車，副駕駛座塞滿了野餐籃，開著車窗吹海風，隨性決定下一個停靠的秘境。",
          modifiers: { Adventure: 20, FreedomNeed: 20, Spontaneity: 20, Extroversion: 10, Hedonism: 10 }
        },
        {
          label: "D. 奢華尊崇，由他掌控",
          desc: "坐在他低調奢華、加速感極強的進口座駕副駕駛，全程不需要動腦，由他打理並帶妳直奔預約制私廚。",
          modifiers: { Dominance: -25, SecurityNeed: 20, QualityOfLife: 25, DecisionSpeed: 15, ConsumptionTendency: 15 }
        }
      ]
    },
    {
      id: 4,
      text: "當兩人一起挑選未來要攜手搬進的新家，但在裝潢風格上有了不同意見時，妳直覺會怎麼處理呢？",
      options: [
        {
          label: "A. 理性數據，折衷最優",
          desc: "列出雙方風格的優缺點比較表與精細預算，透過客觀理性的分析找出最具美學與性價比的平衡點。",
          modifiers: { ConflictResolution: 25, CommunicationEfficiency: 20, Rationality: 25, FinancialMaturity: 15, Spontaneity: -15 }
        },
        {
          label: "B. 情緒和緩，以愛退讓",
          desc: "先帶他吃頓精緻大餐放鬆心情，撒個嬌表達想法，相信溫和體貼的互動能感性地包容彼此的差異。",
          modifiers: { EmotionalDependency: 20, RitualNeed: 15, ConflictResolution: 15, Extroversion: 15, CommunicationEfficiency: -10 }
        },
        {
          label: "C. 輕鬆自在，隨心混搭",
          desc: "裝潢只是形式，各退一步混搭就好。家是人在住的，相處輕鬆自在最重要，不拘泥於完美對稱。",
          modifiers: { FreedomNeed: 15, Spontaneity: 20, ConflictResolution: 20, Responsibility: -5, Rationality: -10 }
        },
        {
          label: "D. 信任全權，果斷跟隨",
          desc: "我極其信任他的品味。如果他能直接全權負責，拿出一套果斷且高質感的整體提案，我會很樂意配合。",
          modifiers: { Dominance: -30, DecisionSpeed: 20, Responsibility: -10, SecurityNeed: 15, LongTermCommitment: 15 }
        }
      ]
    },
    {
      id: 5,
      text: "妳如何看待工作與生活的平衡關係呢？這能讓我了解妳對成長與未來的展望。",
      options: [
        {
          label: "A. 按部就班，構築安穩",
          desc: "工作是為了構築堅實的財務安全。有計劃地存錢與投資，期望未來能過上有底氣且安穩的生活。",
          modifiers: { FinancialMaturity: 20, SecurityNeed: 20, LongTermCommitment: 20, FamilyOrientation: 20, ConsumptionTendency: -15 }
        },
        {
          label: "B. 下班萬歲，豐富體驗",
          desc: "工作之餘必須有飽滿的休閒。手作、藝術課或朋友聚餐是生活核心，錢是用來極大化當下體驗的。",
          modifiers: { Extroversion: 20, Hedonism: 20, ConsumptionTendency: 20, RitualNeed: 15, EmotionalDependency: 10 }
        },
        {
          label: "C. 彈性自由，無拘無束",
          desc: "反對朝九晚五的框架，追求靈魂自由。就算工作也希望極致靈活，能隨時說走就走、走入大自然。",
          modifiers: { FreedomNeed: 30, Adventure: 20, Spontaneity: 20, Extroversion: -5, FinancialMaturity: -10 }
        },
        {
          label: "D. 追求卓越，成就不凡",
          desc: "工作是自我價值的舞台。我渴望不斷晉升與成就，願意投入高強度努力，也希望伴侶有成長型心態。",
          modifiers: { GrowthMindset: 30, Dominance: 15, CommunicationEfficiency: 15, Responsibility: 15, Rationality: 15 }
        }
      ]
    },
    {
      id: 6,
      text: "在挑選日常晚餐或是生活隨身器物時，妳更傾向以下哪一種品味哲學呢？",
      options: [
        {
          label: "A. 高質簡約，注重本質",
          desc: "講求實用與健康。研究成分與評價，挑選耐用、簡約、有品質信譽的品牌，餐點注重營養與純淨衛生。",
          modifiers: { Rationality: 20, QualityOfLife: 15, FinancialMaturity: 15, ConsumptionTendency: -15, Responsibility: 15 }
        },
        {
          label: "B. 視覺美感，氛圍拉滿",
          desc: "注重高顏值設計、網紅限定款。吃飯必須講究精緻擺盤與燈光音樂氣氛，生活用品要能取悅心情。",
          modifiers: { RitualNeed: 25, Hedonism: 20, ConsumptionTendency: 20, QualityOfLife: 15, EmotionalDependency: 10 }
        },
        {
          label: "C. 在地煙火，自在舒服",
          desc: "偏愛在地街頭美食、熱鬧夜市。比起正經八百的法式餐廳，更愛跟契合的人在隨意的小店暢所欲言。",
          modifiers: { Spontaneity: 20, Extroversion: 20, FreedomNeed: 15, ConsumptionTendency: -10, QualityOfLife: -10 }
        },
        {
          label: "D. 尊榮極致，高效到位",
          desc: "看重時間成本，願意為頂級服務、精緻私廚或尊榮會員制買單。不花時間貨比三家，一步到位買最好的。",
          modifiers: { DecisionSpeed: 20, FinancialMaturity: 20, QualityOfLife: 25, GrowthMindset: 15, Dominance: 10 }
        }
      ]
    },
    {
      id: 7,
      text: "當兩人關係走到穩定階段，妳覺得最能帶給妳「這輩子就是他了」的那種極致安全感瞬間是？",
      options: [
        {
          label: "A. 規劃清晰，重諾踐行",
          desc: "他答應的每件事都有誠信落地；他的長遠理財與未來規劃中有我，且一步一腳印朝買房結婚邁進。",
          modifiers: { LongTermCommitment: 25, SecurityNeed: 20, FamilyOrientation: 25, FinancialMaturity: 15, Responsibility: 20 }
        },
        {
          label: "B. 情緒依託，無比溫馨",
          desc: "在我受挫大哭時，他會推掉工作第一時間抱緊我、細緻陪伴我，用無限的溫暖與幽默融化我的焦慮。",
          modifiers: { EmotionalDependency: 30, SecurityNeed: 20, RitualNeed: 15, FamilyOrientation: 10, ConflictResolution: 15 }
        },
        {
          label: "C. 絕對信任，自由無壓",
          desc: "我們即使在同一個空間一整天不說話也無比自然；他給予我絕對自由，從不追問查崗或情緒勒索。",
          modifiers: { FreedomNeed: 30, Spontaneity: 15, Rationality: 15, ConflictResolution: 15, Extroversion: -10 }
        },
        {
          label: "D. 指點迷津，強大避風",
          desc: "在我面臨重大抉擇或生活低潮時，他能用卓越的實力與閱歷為我指引方向，甚至直接幫我妥善打理好一切。",
          modifiers: { Dominance: -25, SecurityNeed: 25, GrowthMindset: 20, Responsibility: 15, DecisionSpeed: 15 }
        }
      ]
    }
  ];

  const handleStartQuiz = async () => {
    // This function is now just for transitioning from intro to quiz.
    // The actual reset logic is in handleRestartQuiz.

    // 檢查女性用戶是否已完成測驗
    if (ladyCode && ladyProfiles[ladyCode]?.quizTaken) {
      alert("您已完成測驗，無法重複作答。將為您顯示上次的配對結果。");
      onMatchComplete(ladyProfiles[ladyCode].matchedGentlemanCode || firstNonTemplate);
      onClose(); // 關閉測驗畫面
    } else {
      setCurrentStep("quiz");
    }
  };

  const handleRestartQuiz = () => {
    if (window.confirm("您確定要放棄目前進度，重新開始測驗嗎？")) {
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
      setUserMetrics({ ...defaultUserMetrics });
      setMetricHistory([]);
      setCurrentQuestionIndex(0);
      // We stay on the 'quiz' step, just resetting the content.
      // If called from another step, we might want to setCurrentStep('quiz')
    }
  };

  const handleSelectOption = async (modifiers: Partial<PersonalityMetrics>) => {
    // Keep record of current metrics for backtracking
    setMetricHistory((prev) => [...prev, { ...userMetrics }]);

    // Update user metrics dynamically based on choice, bounding values between 10 and 100
    const updatedMetrics = { ...userMetrics };
    Object.entries(modifiers).forEach(([key, val]) => {
      const field = key as keyof PersonalityMetrics;
      updatedMetrics[field] = Math.max(10, Math.min(100, updatedMetrics[field] + (val || 0)));
    });

    setUserMetrics(updatedMetrics);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // 自動儲存進度
      const progressToSave = {
        currentQuestionIndex: currentQuestionIndex + 1,
        userMetrics: updatedMetrics,
        metricHistory: [...metricHistory, { ...userMetrics }],
      };
      localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progressToSave));
    } else {
      // 測驗完成，清除進度
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
      // Completed all 7 questions! Calculate vector math matching
      const finalMatchedCode = calculateVectorMatch(updatedMetrics);
      setMatchedCode(finalMatchedCode);
      
      // Calculate top 3 metrics to highlight as her "Personality Labels"
      const tags = Object.entries(updatedMetrics)
        .map(([key, value]) => ({
          label: METRIC_LABELS[key as keyof PersonalityMetrics],
          val: Math.round(value as number)
        }))
        // Filter out those that aren't remarkably higher or just sort desc
        .sort((a, b) => b.val - a.val)
        .slice(0, 3);
      setTopTags(tags);

      // Ensure we never persist a template code as the matched result
      const codeToPersist = TEMPLATE_EXCLUDED_CODES.includes(finalMatchedCode) ? firstNonTemplate : finalMatchedCode;
      if (codeToPersist !== finalMatchedCode) {
        setMatchedCode(codeToPersist);
      }

      // 如果是女性用戶，將測驗結果儲存到後端
      if (ladyCode) {
        const updatedLady = await saveLadyQuizResult(ladyCode, codeToPersist, updatedMetrics);
        updateLadyProfile(updatedLady);
      }

      setCurrentStep("calculating");
      setCalculationProgress(0);
    }
  };

  // COSINE SIMILARITY MATCHING ENGINE
  // Mathematically matches the 20-dimensional user vector against all male vectors!
  const calculateVectorMatch = (userVec: PersonalityMetrics): string => {
    let bestCode = firstNonTemplate || Object.keys(metrics)[0] || "monkeyB";
    let maxSimilarity = -Infinity;

    // Convert to arrays of numbers
    const uKeys = Object.keys(userVec) as (keyof PersonalityMetrics)[];
    
    // Filter for gentlemen who are available for matching
    const availableGentlemenCodes = Object.keys(profiles).filter(code => 
      !TEMPLATE_EXCLUDED_CODES.includes(code) && 
      !RESERVED_MATCH_CODES.includes(code) &&
      (profiles[code]?.isAcceptingMatches ?? true) // Default to true if undefined
    );

    // If no one is available, fall back to all non-template, non-reserved profiles as a safety measure
    const targetCodes = availableGentlemenCodes.length > 0 
      ? availableGentlemenCodes 
      : Object.keys(profiles).filter(code => 
          !TEMPLATE_EXCLUDED_CODES.includes(code) && !RESERVED_MATCH_CODES.includes(code)
        );

    targetCodes.forEach(code => {
      const maleVec = metrics[code];
      if (!maleVec) return; // Safety check if metrics for a profile don't exist

      // Cosine similarity formula: (U . M) / (||U|| * ||M||)
      let dotProduct = 0;
      let normU = 0;
      let normM = 0;

      uKeys.forEach((key) => {
        const uVal = userVec[key];
        const mVal = maleVec[key];
        dotProduct += uVal * mVal;
        normU += uVal * uVal;
        normM += mVal * mVal;
      });

      const similarity = dotProduct / (Math.sqrt(normU) * Math.sqrt(normM));
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestCode = code;
      }
    });

    // If no non-template profiles were compared, fall back safely
    if (maxSimilarity === -Infinity) {
      setMatchPercentage(86);
      return bestCode;
    }

    // Calculate dynamic matching compatibility percentage based on similarity score
    // Map cosine similarity (usually ~0.8 to 0.99 for these vector configs) to 85% - 99% range
    const basePct = 70 + Math.round(maxSimilarity * 28);
    setMatchPercentage(Math.min(99, Math.max(86, basePct)));

    return bestCode;
  };

  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0 && metricHistory.length > 0) {
      const lastMetrics = metricHistory[metricHistory.length - 1];
      const newHistory = metricHistory.slice(0, -1);
      const newQuestionIndex = currentQuestionIndex - 1;

      // 更新 React 狀態
      setUserMetrics(lastMetrics);
      setMetricHistory(newHistory);
      setCurrentQuestionIndex(newQuestionIndex);

      // 自動儲存返回後的新進度
      const progressToSave = {
        currentQuestionIndex: newQuestionIndex,
        userMetrics: lastMetrics,
        metricHistory: newHistory,
      };
      localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progressToSave));
    }
  };

  // Loading simulator
  useEffect(() => {
    if (currentStep !== "calculating") return;

    const timer = setInterval(() => {
      setCalculationProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 12) + 6;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setCurrentStep("result");
          }, 500);
          return 100;
        }

        // Professional chat-style matching text
        if (next < 20) {
          setCalculationMessage("正在深度解析您的 20 維生活美學指標...");
        } else if (next < 40) {
          setCalculationMessage("已過濾出敏感與不實偏好，建立獨立特質標籤...");
        } else if (next < 60) {
          setCalculationMessage("比對高階會員資料庫，建立與 D級, C級, B級, A級 男性相容性權重...");
        } else if (next < 80) {
          setCalculationMessage("分析大腦對『財務成熟度』與『情緒價值』之極致共鳴...");
        } else {
          setCalculationMessage("成功尋獲相符度高達 " + matchPercentage + "% 的頂級紳士，開通安全通道...");
        }

        return next;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [currentStep, matchPercentage]);

  const handleRevealProfile = () => {
    onMatchComplete(matchedCode);
  };

  const matchedProfile: Profile = profiles[matchedCode] || profiles[Object.keys(profiles)[0]] || profiles["monkeyB"];

  return (
    <div id="soul-match-overlay" className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/50 backdrop-blur-md"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.55 }}
        className="bg-brand-beige w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-brand-border/80 overflow-hidden relative z-10 flex flex-col max-h-[94vh] md:max-h-[88vh]"
      >
        {/* Top Header Decorative Stripe */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-olive via-brand-accent to-brand-olive" />

        {/* Close Button */}
        <button
          id="btn-soul-quiz-close"
          onClick={onClose}
          className="absolute top-4 right-4 md:top-5 md:right-5 p-2 rounded-full text-brand-light hover:bg-brand-border/40 hover:text-brand-dark transition-all duration-200 z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 md:p-10 overflow-y-auto flex-1 flex flex-col justify-start md:justify-center">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Intro View */}
            {currentStep === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-center space-y-4 md:space-y-6 py-2 md:py-4"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-brand-olive/10 flex items-center justify-center text-brand-olive shadow-inner">
                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-brand-olive fill-current animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <h3 className="font-serif text-xl md:text-3xl font-bold text-brand-dark tracking-wider">
                    緣友 靈魂共鳴測驗
                  </h3>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-brand-light font-bold">
                    Yuan-Yu AI Personality Gathering
                  </p>
                </div>

                <div className="text-xs md:text-sm text-brand-muted leading-relaxed max-w-sm mx-auto space-y-2 md:space-y-3">
                  <p className="font-medium">
                    「想更了解妳一點，這樣才能推薦真正適合的人。」
                  </p>
                  <p className="text-[11px] md:text-xs font-normal text-brand-light leading-relaxed">
                    這是一套為尊榮女性設計的聊天式特質探索，而非枯燥的心理測驗。
                    我們將透過 7 道輕巧的生活美學對話，默默解析您的<b>金錢觀、愛情觀、財務成熟度與情緒需求</b>等 20 維指標，並精準配對最契合的紳士。
                  </p>
                </div>

                <div className="pt-2 md:pt-4 flex flex-col gap-2.5 md:gap-3">
                  <button
                    id="btn-quiz-start-trigger"
                    onClick={handleStartQuiz}
                    className="w-full py-3 md:py-4 bg-brand-olive text-white rounded-full text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-[#4d4d36] transition-all duration-300 shadow-md cursor-pointer hover:scale-103 active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>開啟對話特質採集</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] text-brand-light font-medium uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-accent" />
                    <span>測試完全匿名，每人限配對一次</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Quiz Process */}
            {currentStep === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3.5 md:space-y-5 py-1 md:py-2"
              >
                {/* Progress Indicators */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-brand-light font-bold uppercase tracking-widest">
                    特質探索對話 // 第 {currentQuestionIndex + 1} / {questions.length} 題
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button onClick={handleRestartQuiz} className="flex items-center gap-1 text-[10px] text-brand-light hover:text-brand-olive font-semibold transition-colors" title="重新開始測驗">
                      <RefreshCw className="w-3 h-3" />
                      <span>重來</span>
                    </button>
                    <div className="flex items-center gap-1 text-[11px] md:text-xs text-brand-olive font-serif">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>AI 聆聽分析中</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-brand-border/40 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-accent to-brand-olive"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Question Text */}
                <h4 className="font-serif text-sm md:text-lg font-bold text-brand-dark leading-relaxed tracking-wide text-left pt-1 md:pt-2">
                  {questions[currentQuestionIndex].text}
                </h4>

                {/* Options List */}
                <div className="space-y-2 md:space-y-3 pt-1">
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      id={`btn-quiz-option-${idx}`}
                      onClick={() => handleSelectOption(option.modifiers)}
                      className="w-full text-left p-2.5 md:p-4 bg-white border border-brand-border hover:border-brand-olive rounded-xl md:rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group active:scale-98"
                    >
                      <div className="flex flex-col gap-0.5 md:gap-1">
                        <span className="text-[10px] md:text-xs font-bold text-brand-olive uppercase tracking-wider group-hover:text-brand-dark transition-colors">
                          {option.label}
                        </span>
                        <span className="text-[10px] md:text-xs text-brand-muted leading-relaxed group-hover:text-brand-text transition-colors">
                          {option.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Back Button */}
                {currentQuestionIndex > 0 && (
                  <button
                    id="btn-quiz-back-question"
                    onClick={handleBackQuestion}
                    className="flex items-center gap-1.5 text-xs text-brand-light hover:text-brand-olive font-semibold tracking-wider uppercase transition-colors pt-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>返回上一題</span>
                  </button>
                )}
              </motion.div>
            )}

            {/* Step 3: Calculating Matched Profile */}
            {currentStep === "calculating" && (
              <motion.div
                key="calculating"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 md:py-8 space-y-4 md:space-y-8"
              >
                <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-border/40" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-olive border-r-brand-accent"
                  />
                  <Heart className="w-8 h-8 md:w-10 md:h-10 text-brand-olive fill-current animate-pulse" />
                </div>

                <div className="space-y-2 md:space-y-3">
                  <h4 className="font-serif text-xl md:text-2xl font-bold text-brand-dark">
                    心靈共鳴向量配對中
                  </h4>
                  <p className="text-xs text-brand-light uppercase tracking-widest font-mono font-medium">
                    20D Resonance Score: {calculationProgress}%
                  </p>
                </div>

                <p className="text-xs italic text-brand-muted font-medium min-h-[1.5rem] tracking-wide animate-pulse">
                  {calculationMessage}
                </p>
              </motion.div>
            )}

            {/* Step 4: Result Revealed with Personality tag analytics! */}
            {currentStep === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-3.5 md:space-y-5 py-1 md:py-2"
              >
                <div className="flex justify-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-olive border border-brand-accent shadow-sm">
                    <Heart className="w-5 h-5 md:w-7 md:h-7 text-brand-olive fill-current animate-pulse" />
                  </div>
                </div>

                <div className="space-y-0.5 md:space-y-1">
                  <span className="text-[9px] md:text-[10px] text-brand-light font-bold uppercase tracking-[0.25em]">
                    MATCH ANALYSIS // 專屬心靈印記解鎖
                  </span>
                  <h3 className="font-serif text-base md:text-2xl font-bold text-brand-dark tracking-wide">
                    分析完成！契合度高達 {matchPercentage}%
                  </h3>
                </div>

                {/* Parsed personality tags visual display */}
                <div className="bg-white/70 p-3 md:p-4 rounded-xl md:rounded-2xl border border-brand-border/60 text-left space-y-2 md:space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-brand-olive font-bold uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-accent" />
                    <span>您的核心人格美學印記 :</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-1.5 md:gap-2.5 pt-0.5 md:pt-1">
                    {topTags.map((tag, idx) => (
                      <div key={idx} className="space-y-0.5 md:space-y-1">
                        <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                          <span className="font-bold text-brand-dark">{tag.label}</span>
                          <span className="font-mono text-brand-olive font-bold">{tag.val} / 100</span>
                        </div>
                        <div className="w-full h-1 bg-brand-border/40 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-olive rounded-full" 
                            style={{ width: `${tag.val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] md:text-[10px] text-brand-light leading-relaxed pt-0.5 italic">
                    * AI 根據您的理財品味、消費型態、情緒反饋等指標，在 100 位男性模組庫中為您過濾出最懂您的優質紳士。
                  </p>
                </div>

                {/* Brief preview of matched male */}
                <div className="bg-white p-2.5 md:p-4.5 rounded-xl md:rounded-2xl border border-brand-border shadow-sm flex items-center gap-3 md:gap-4 text-left">
                  <img
                    src={matchedProfile.imageUrl}
                    alt={matchedProfile.name}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-xl object-cover border-2 border-white shadow-md shrink-0"
                  />
                  <div className="space-y-0.5 md:space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm md:text-base font-bold text-brand-dark truncate">
                        {matchedProfile.name}
                      </span>
                      <span className="text-[10px] md:text-[11px] text-brand-muted font-medium shrink-0">
                        {matchedProfile.age} 歲 // {matchedProfile.location}
                      </span>
                    </div>
                    <p className="text-[11px] md:text-xs italic font-serif text-brand-olive line-clamp-1">
                      「 {matchedProfile.tagline} 」
                    </p>
                    <p className="text-[10px] md:text-[11px] text-brand-muted line-clamp-1 leading-relaxed">
                      {matchedProfile.bio}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 md:space-y-2 pt-1 md:pt-2">
                  <button
                    id="btn-quiz-reveal-trigger"
                    onClick={handleRevealProfile}
                    className="w-full py-2.5 md:py-3.5 bg-[#06C755] text-white rounded-full text-[11px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#05b04b] transition-all duration-300 shadow-md cursor-pointer hover:scale-103 active:scale-98 flex items-center justify-center gap-1.5 md:gap-2"
                  >
                    <span>立即解鎖並前往專屬推薦檔案</span>
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <div className="text-[9px] md:text-[10px] text-brand-light uppercase tracking-widest font-semibold pt-0.5">
                    🔒 配對結果已安全鎖定，每人僅限測試一次
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
