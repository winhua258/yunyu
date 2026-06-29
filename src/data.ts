import { Profile, PersonalityMetrics } from "./types";

export const DEFAULT_PROFILES: Record<string, Profile> = {
  "520": {
    code: "520",
    name: "彥廷",
    age: 27,
    location: "台北市",
    tagline: "溫柔沉穩、追求空間與生活美學的室內設計師",
    bio: "嗨！我是彥廷。平日裡是一名室內設計師，生活對我而言是一場永不停止的美學探索。閒暇時，我喜歡在午後走入安靜的美術館尋找靈感，或是在黑膠唱片的微風中為自己沖一杯手沖咖啡。我的性格溫柔、心思細膩，相信生活需要儀式感，更需要兩顆溫暖的心相互扶持。希望能遇見一個同樣懂得欣賞生活微小美好、願意真誠交流的你。",
    lifestyle: ["室內設計", "黑膠唱片", "古典音樂", "咖啡美學", "旅行攝影"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
    ],
    cardDetail: "希望能遇見：一個溫柔幽默、同樣熱愛空間與藝術的靈魂，一起在陽光灑落的客廳聊一整個下午的設計與夢想。🎨",
    idealMatch: "我理想中的關係是彼此獨立卻又緊密相連。我們能陪伴對方做喜歡的事，也能在安靜的深夜分享彼此的故事。",
    contactLineUrl: "https://line.me/R/ti/p/@auraconnect_v520"
  },
  "888": {
    code: "888",
    name: "冠宇",
    age: 26,
    location: "新竹市",
    tagline: "在理性代碼世界中編織感性生活的工程師",
    bio: "我是冠宇，目前在科技公司擔任軟體工程師。雖然每天與理性的邏輯與代碼為伴，但在私底下，我其實是一個非常感性、熱愛烘焙的暖男。看著烤箱裡的甜點慢慢膨脹、散發香氣，能讓我洗去一整天的疲憊。平時我也喜歡擼貓、彈吉他，和朋友去戶外野餐。希望能遇見一個能一起分享美味甜點、用心感受生活溫度的另一半。",
    lifestyle: ["軟體開發", "甜點烘焙", "貓咪日常", "理性感性", "暖男特質"],
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
    ],
    cardDetail: "希望能遇到：一個同樣熱愛美食、對世界保有好奇心，並且能在冬夜裡一起喝著熱可可、分享彼此故事的女孩。☕️",
    idealMatch: "理想的另一半不需要完美，但希望我們能互相包容對方的脆弱，並在生活的細微處發現小確幸。",
    contactLineUrl: "https://line.me/R/ti/p/@auraconnect_v888"
  },
  "666": {
    code: "666",
    name: "柏翰",
    age: 24,
    location: "台中市",
    tagline: "熱愛攝影與大自然、永遠充滿陽光朝氣的探險家",
    bio: "哈囉！我是柏翰。我是一個活潑開朗、熱愛大自然的相機愛好者。我喜歡背著相機走入山林、迎著海風，去捕捉生活中微小而溫暖的美好瞬間，不管是山間繚繞的晨霧，還是街角灑落的夕陽。對我來說，世界是一場未完待續的冒險！我喜歡露營、慢跑與瑜伽，希望在這裡能遇見一個同樣熱愛自然、擁有陽光心態的你，一起記錄未來的每一刻。",
    lifestyle: ["攝影記錄", "戶外露營", "登山健行", "健康瑜伽", "活潑開朗"],
    imageUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800"
    ],
    cardDetail: "我的理想關係：彼此支持對方的熱情、一起探索未知的露營秘境，並在清晨的山頂迎著第一縷朝陽按下快門。📸",
    idealMatch: "希望能遇見：一個喜歡戶外、熱愛生命、充滿正能量的你。我們能在大自然中放鬆靈魂，也能在日常中真誠擁抱。",
    contactLineUrl: "https://line.me/R/ti/p/@auraconnect_v666"
  },
  "999": {
    code: "999",
    name: "若謙",
    age: 29,
    location: "台北市",
    tagline: "以溫暖筆觸觀察世界的知性專欄作家",
    bio: "你好，我是若謙。目前在財經與文化雜誌擔任專欄作家。平時的我喜歡閱讀、寫作，在手沖咖啡的香氣中享受靜謐的獨處時光。然而，我也極度熱愛城市旅行，渴望在未知的巷弄中發現隱藏的故事。知性、獨立與隨和是我的代名詞，但我心中同樣期盼一份深刻、溫暖而真摯的連結。如果你也熱愛深入的對話和靈魂的碰撞，歡迎與我分享你的世界。",
    lifestyle: ["閱讀寫作", "手沖咖啡", "深度對話", "城市漫遊", "知性獨立"],
    imageUrl: "https://images.unsplash.com/photo-1504257404104-fa2565366a41?auto=format&fit=crop&q=80&w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1504257404104-fa2565366a41?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511551203524-9a24350a5e83?auto=format&fit=crop&q=80&w=800"
    ],
    cardDetail: "理想生活狀態：在慵懶清晨的咖啡香氣中醒來，讀一本好書，並在周五晚上來一場說走就走的微旅行。☕️",
    idealMatch: "希望能遇見：一個心智成熟、熱愛思考、靈魂深邃的你。我們可以聊哲學、聊生活，也可以在安靜中感受默契。",
    contactLineUrl: "https://line.me/R/ti/p/@auraconnect_v999"
  }
};

// Initialize or load profiles from local storage
export function getStoredProfiles(): Record<string, Profile> {
  if (typeof window === "undefined") return DEFAULT_PROFILES;
  const stored = localStorage.getItem("yuanyu_custom_profiles");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Record<string, Profile>;
      // Ensure every profile has imageUrls array
      Object.keys(parsed).forEach(key => {
        if (!parsed[key].imageUrls || !Array.isArray(parsed[key].imageUrls) || parsed[key].imageUrls.length === 0) {
          parsed[key].imageUrls = [parsed[key].imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"];
        }
      });
      return parsed;
    } catch (e) {
      console.error("Failed to parse custom profiles, using default profiles", e);
    }
  }
  return DEFAULT_PROFILES;
}

export function saveStoredProfiles(profiles: Record<string, Profile>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("yuanyu_custom_profiles", JSON.stringify(profiles));
    // Clear and copy keys in place so existing imports get the live updates immediately
    Object.keys(PROFILES).forEach(key => delete PROFILES[key]);
    Object.assign(PROFILES, profiles);
  }
}

// Fallback static export for compatibility
export const PROFILES = getStoredProfiles();

export const DEFAULT_METRICS: Record<string, PersonalityMetrics> = {
  "520": {
    Rationality: 85,
    Spontaneity: 25,
    Adventure: 30,
    Hedonism: 40,
    Dominance: 45,
    Extroversion: 40,
    SecurityNeed: 60,
    EmotionalDependency: 50,
    GrowthMindset: 80,
    FamilyOrientation: 85,
    ConsumptionTendency: 35,
    FinancialMaturity: 85,
    CommunicationEfficiency: 75,
    RitualNeed: 90,
    QualityOfLife: 95,
    FreedomNeed: 40,
    Responsibility: 95,
    DecisionSpeed: 65,
    ConflictResolution: 85,
    LongTermCommitment: 95
  },
  "888": {
    Rationality: 45,
    Spontaneity: 60,
    Adventure: 55,
    Hedonism: 75,
    Dominance: 35,
    Extroversion: 85,
    SecurityNeed: 70,
    EmotionalDependency: 90,
    GrowthMindset: 70,
    FamilyOrientation: 75,
    ConsumptionTendency: 65,
    FinancialMaturity: 65,
    CommunicationEfficiency: 65,
    RitualNeed: 85,
    QualityOfLife: 80,
    FreedomNeed: 55,
    Responsibility: 80,
    DecisionSpeed: 55,
    ConflictResolution: 75,
    LongTermCommitment: 85
  },
  "666": {
    Rationality: 40,
    Spontaneity: 85,
    Adventure: 95,
    Hedonism: 70,
    Dominance: 50,
    Extroversion: 90,
    SecurityNeed: 40,
    EmotionalDependency: 45,
    GrowthMindset: 75,
    FamilyOrientation: 55,
    ConsumptionTendency: 50,
    FinancialMaturity: 55,
    CommunicationEfficiency: 70,
    RitualNeed: 50,
    QualityOfLife: 75,
    FreedomNeed: 95,
    Responsibility: 70,
    DecisionSpeed: 75,
    ConflictResolution: 70,
    LongTermCommitment: 75
  },
  "999": {
    Rationality: 90,
    Spontaneity: 30,
    Adventure: 65,
    Hedonism: 60,
    Dominance: 95,
    Extroversion: 75,
    SecurityNeed: 45,
    EmotionalDependency: 40,
    GrowthMindset: 95,
    FamilyOrientation: 70,
    ConsumptionTendency: 45,
    FinancialMaturity: 95,
    CommunicationEfficiency: 95,
    RitualNeed: 70,
    QualityOfLife: 90,
    FreedomNeed: 60,
    Responsibility: 90,
    DecisionSpeed: 95,
    ConflictResolution: 85,
    LongTermCommitment: 90
  }
};

export function getStoredMetrics(): Record<string, PersonalityMetrics> {
  if (typeof window === "undefined") return DEFAULT_METRICS;
  const stored = localStorage.getItem("yuanyu_custom_metrics");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse custom metrics, using default metrics", e);
    }
  }
  return DEFAULT_METRICS;
}

export function saveStoredMetrics(metrics: Record<string, PersonalityMetrics>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("yuanyu_custom_metrics", JSON.stringify(metrics));
    Object.keys(METRICS).forEach(key => delete METRICS[key]);
    Object.assign(METRICS, metrics);
  }
}

export const METRICS = getStoredMetrics();

export function getAdminCodes(): string[] {
  if (typeof window === "undefined") return ["admin", "8888", "9999"];
  const custom = localStorage.getItem("yuanyu_admin_code");
  if (custom) {
    const trimmed = custom.trim();
    if (trimmed) {
      return [trimmed, "admin", "8888", "9999"];
    }
  }
  return ["admin", "8888", "9999"];
}

export function saveAdminCode(code: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("yuanyu_admin_code", code.trim());
  }
}
