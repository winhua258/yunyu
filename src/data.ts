import { Profile, PersonalityMetrics, LadyProfile } from "./types";

export const DEFAULT_PROFILES: Record<string, Profile> = {
  "monkeyB": {
    "code": "monkeyB",
    "name": "葉家銘",
    "age": 47,
    "location": "臺北市",
    "tagline": "是一位新能源企業創辦人，但私底下更喜歡在咖啡香、音樂與旅行中，感受生命細緻的溫度。",
    "bio": "身為得盛新能源企業創辦人，我的工作常與宏大的能源藍圖對話，但我認為，再強大的科技，終究是要服務於『生活』本身的。\n\n我不是那種只懂工作的事業狂。脫下西裝後，我是個熱愛生活的探險者——喜歡在週末透過鏡頭紀錄生活中的光影，或是在海邊浮潛時享受那片刻的寧靜。我也很享受親手為重要的人沖一杯咖啡，或是在吉他弦音中放鬆自我。\n\n對我來說，一段理想的關係，不是誰附屬在誰的世界裡，而是兩個獨立且充滿熱情的靈魂，能一起討論未來的壯闊，也能一起在廚房分享簡單的美味。期待遇見同樣對世界保有好奇心，並能在生活細微處發現快樂的妳。",
    "lifestyle": [
      "旅行",
      "美食",
      "閱讀",
      "音樂",
      "運動",
      "浮潛",
      "理性感性",
      "暖男特質"
    ],
    "imageUrl": "https://images.yuan-yu.vip/葉家銘/photo_1_2026-06-29_23-53-39.jpg",
    "imageUrls": [
      "https://images.yuan-yu.vip/葉家銘/photo_1_2026-06-29_23-53-39.jpg",
      "https://images.yuan-yu.vip/葉家銘/photo_2_2026-06-29_23-53-39.jpg",
      "https://images.yuan-yu.vip/葉家銘/photo_3_2026-06-29_23-53-39.jpg"
    ],
    "cardDetail": "希望能遇到：一個同樣熱愛美食、對世界保有好奇心，並且能在冬夜裡一起喝著熱可可、分享彼此故事的女孩。☕️",
    "idealMatch": "理想的另一半不需要完美，但希望我們能互相包容對方的脆弱，並在生活的細微處發現小確幸。",
    "contactLineUrl": "https://line.me/ti/p/ymptzTqyW4"
  },
  "daiC": {
    "code": "daiC",
    "name": "吴建铭",
    "age": 40,
    "location": "桃園市",
    "tagline": "專注技術與團隊發展的工程經理，擅長以系統思維優化生活節奏，在投資與運動中保持敏銳與活力。",
    "bio": "身為一名工程經理，我的核心價值在於透過結構化思考解決複雜難題。在工作上，我擅長將碎片化的需求整合為高效的系統架構，並透過團隊協作，將想法轉化為實際成果。我追求的不僅是技術的精進，更是在管理中建立『持續優化』的思維。\n\n工作之外，我是一個不折不扣的行動派。我居住在台北南港，平日喜愛透過跑步與健身挑戰自我極限，也熱衷於團隊運動中的球賽交流。如果不在運動場上，那我多半正沉浸在深度閱讀之中，或是分析最新的投資新聞，觀察這世界變動的節奏。熱愛旅遊的我，總認為每一次的未知旅程，都如同 debug 一樣，是為了發現世界更迷人的一面。對我而言，生活如同專案管理：要有明確的目標與節奏，但也需要適度的留白與品味。",
    "lifestyle": [
      "健身",
      "投資新聞",
      "跑步",
      "打球",
      "旅遊",
      "看書"
    ],
    "imageUrl": "https://images.yuan-yu.vip/吴建铭/photo_1_2026-06-30_00-01-59.jpg",
    "imageUrls": [
      "https://images.yuan-yu.vip/吴建铭/photo_1_2026-06-30_00-01-59.jpg",
      "https://images.yuan-yu.vip/吴建铭/photo_2_2026-06-30_00-01-59.jpg",
      "https://images.yuan-yu.vip/吴建铭/photo_3_2026-06-30_00-01-59.jpg"
    ],
    "cardDetail": "希望能遇見：一個同樣熱愛成長、對世界保有好奇心的妳。我們可以聊聊最新的投資觀點或工作上的挑戰，也能在週末找間舒適的餐廳，一起規劃下一趟未知的旅程。✈️",
    "idealMatch": "希望能遇見：一個知性優雅、對生活有想法的妳。我們能在各自的專業領域中閃閃發光，也能在閒暇時彼此陪伴，享受生活中的深度共鳴與質感對話。",
    "contactLineUrl": "https://line.me/ti/p/ANHfcD_w7X"
  },
  "deerD": {
    "code": "deerD",
    "name": "陳界衡",
    "age": 42,
    "location": "桃園市",
    "tagline": "經營新興科技公司的創辦人，在理性邏輯與生活美學間尋找平衡的質感紳士。",
    "bio": "你好，我是陳界衡。目前經營一家新興科技公司，日常多與創新的邏輯與決策為伍。但在高壓的商業節奏之外，我非常注重生活品質的淬煉。我是個熱愛生活的人，平時喜歡透過健身與跑步維持體能，也享受在運動後的微醺時光中細品紅酒。閒暇時，我習慣沉浸在書籍的世界裡，汲取不同的觀點與智慧；或者在廚房裡嘗試新的食譜，用香氣與料理療癒自己。音樂是我生活中不可或缺的節奏，我認為好的生活與好的事業一樣，都需要深厚的底蘊與細膩的經營。希望能遇見一個懂得生活品味、喜歡深度對話，並願意與我一起探索世界美好的人。",
    "lifestyle": [
      "健身",
      "跑步",
      "紅酒品鑑",
      "深度閱讀",
      "創意料理"
    ],
    "imageUrl": "https://images.yuan-yu.vip/陳界衡/photo_1_2026-06-30_00-01-49.jpg",
    "imageUrls": [
      "https://images.yuan-yu.vip/陳界衡/photo_1_2026-06-30_00-01-49.jpg",
      "https://images.yuan-yu.vip/陳界衡/photo_2_2026-06-30_00-01-49.jpg",
      "https://images.yuan-yu.vip/陳界衡/photo_3_2026-06-30_00-01-49.jpg",
      "https://images.yuan-yu.vip/陳界衡/photo_4_2026-06-30_00-01-49.jpg",
      "https://images.yuan-yu.vip/陳界衡/photo_5_2026-06-30_00-01-49.jpg"
    ],
    "cardDetail": "希望能遇見：一個充滿自信、對生活有想法的妳。我們可以在晨間一起跑步，晚上則挑選一家舒適的餐酒館，在爵士樂與紅酒香氣中，暢談彼此對於未來的想像與夢想。🍷",
    "idealMatch": "希望能遇見：一個同樣熱愛成長、對生活保有熱忱的靈魂。我們能在各自的專業領域努力，也能在共享的休閒時光中，享受高品質的對話與靈魂的共鳴。",
    "contactLineUrl": "https://line.me/ti/p/agX6WtT-z7"
  },
  "huaA": {
    "code": "huaA",
    "name": "鄭永昌",
    "age": 42,
    "location": "新北市",
    "tagline": "遊走於資本配置與極限戶外之間的策略操盤手，在專業精準與生活探險中追求極致的平衡。",
    "bio": "你好，我是鄭永昌。目前的職業是在家族辦公室負責痕量金屬（Trace Metals）領域的策略運營，這不僅是一份處理複雜資產與市場配置的工作，更是我對產業供應鏈與未來趨勢深度觀察的實踐。處理數據與策略讓我學會了在變動中保持冷靜與精準。\n\n工作之餘，我拒絕單調。我是一個熱愛「跨界」生活的冒險家——從山林間的徒步與越野，到深海下的自由潛水，每一場戶外探險都是我充電的方式；我也享受騎馬時的優雅與爆發力，以及在露營靜謐中體驗的自然純粹。除了大自然的探險，我也喜歡在城市中發掘隱藏版酒館，或是化身廚師在廚房中實驗新菜單。生活對我來說，就像策略運營一樣，需要在規劃與隨性之間找到完美的節奏。如果你也是一個對世界充滿好奇、且懂得享受生活質感的人，我很期待與妳交流。",
    "lifestyle": [
      "越野徒步",
      "深度潛水",
      "紅酒酒館",
      "創意料理",
      "策展探店"
    ],
    "imageUrl": "https://images.yuan-yu.vip/鄭永昌/photo_2026-06-29_20-27-28.jpg",
    "imageUrls": [
      "https://images.yuan-yu.vip/鄭永昌/photo_2026-06-29_20-27-28.jpg"
    ],
    "cardDetail": "希望能遇見：一個充滿生命力、同樣熱愛探索世界的妳。我們可以在午後一起去探訪一家有風格的設計酒館，聊聊對工作的願景，或者在某個週末一起規劃一場說走就走的徒步旅行。⛰️",
    "idealMatch": "希望能遇見：一個知性且充滿韌性的女性。不僅能在事業上與我激盪出火花，也能在生活中展現對未知的熱愛，我們能共同經營一段既有深厚默契、又不失生活情趣的關係。",
    "contactLineUrl": "https://line.me/ti/p/nS2p7962Q-"
  }
};

export const DEFAULT_METRICS: Record<string, PersonalityMetrics> = {
  "monkeyB": {
    "Rationality": 45,
    "Spontaneity": 60,
    "Adventure": 55,
    "Hedonism": 75,
    "Dominance": 35,
    "Extroversion": 85,
    "SecurityNeed": 70,
    "EmotionalDependency": 90,
    "GrowthMindset": 70,
    "FamilyOrientation": 75,
    "ConsumptionTendency": 65,
    "FinancialMaturity": 65,
    "CommunicationEfficiency": 65,
    "RitualNeed": 85,
    "QualityOfLife": 80,
    "FreedomNeed": 55,
    "Responsibility": 80,
    "DecisionSpeed": 55,
    "ConflictResolution": 75,
    "LongTermCommitment": 85
  },
  "daiC": {
    "Rationality": 40,
    "Spontaneity": 85,
    "Adventure": 95,
    "Hedonism": 70,
    "Dominance": 50,
    "Extroversion": 90,
    "SecurityNeed": 40,
    "EmotionalDependency": 45,
    "GrowthMindset": 75,
    "FamilyOrientation": 55,
    "ConsumptionTendency": 50,
    "FinancialMaturity": 55,
    "CommunicationEfficiency": 70,
    "RitualNeed": 50,
    "QualityOfLife": 75,
    "FreedomNeed": 95,
    "Responsibility": 70,
    "DecisionSpeed": 75,
    "ConflictResolution": 70,
    "LongTermCommitment": 75
  },
  "deerD": {
    "Rationality": 90,
    "Spontaneity": 30,
    "Adventure": 65,
    "Hedonism": 60,
    "Dominance": 95,
    "Extroversion": 75,
    "SecurityNeed": 45,
    "EmotionalDependency": 40,
    "GrowthMindset": 95,
    "FamilyOrientation": 70,
    "ConsumptionTendency": 45,
    "FinancialMaturity": 95,
    "CommunicationEfficiency": 95,
    "RitualNeed": 70,
    "QualityOfLife": 90,
    "FreedomNeed": 60,
    "Responsibility": 90,
    "DecisionSpeed": 95,
    "ConflictResolution": 85,
    "LongTermCommitment": 90
  },
  "huaA": {
    "Rationality": 85,
    "Spontaneity": 25,
    "Adventure": 30,
    "Hedonism": 40,
    "Dominance": 45,
    "Extroversion": 40,
    "SecurityNeed": 60,
    "EmotionalDependency": 50,
    "GrowthMindset": 80,
    "FamilyOrientation": 85,
    "ConsumptionTendency": 35,
    "FinancialMaturity": 85,
    "CommunicationEfficiency": 75,
    "RitualNeed": 90,
    "QualityOfLife": 95,
    "FreedomNeed": 40,
    "Responsibility": 95,
    "DecisionSpeed": 65,
    "ConflictResolution": 85,
    "LongTermCommitment": 95
  }
};

/**
 * Fetches all lady profiles from the server.
 * NOTE: This is a placeholder. A real implementation would need a backend endpoint.
 * For now, we manage lady profiles in AuthContext.
 * This function is kept for structural reference.
 */
export async function getAllLadyProfiles(): Promise<Record<string, LadyProfile>> {
  // In a real app, this would be:
  // const response = await fetch("/api/lady/all");
  // const data = await response.json();
  // return data.profiles;
  return Promise.resolve({});
}

// Profiles that should be excluded from SoulMatch pairing
export const TEMPLATE_EXCLUDED_CODES: string[] = [];

/**
 * Updates the entire application configuration on the server.
 * Requires an admin code for authorization.
 * @param config - The full configuration object { profiles, metrics, adminCodes }.
 * @param adminCode - The admin code for authorization.
 */
export async function syncSharedConfig(config: {
  profiles: Record<string, Profile>;
  metrics: Record<string, PersonalityMetrics>;
  adminCodes: string[];
  gentlemanEditCodes?: string[];
}, adminCode: string): Promise<{ success: boolean; message: string }> {
  try {
    const payloadToSend = {
      profiles: config.profiles,
      metrics: config.metrics,
      adminCode: config.adminCodes[0] || "admin",
      gentlemanEditCode: config.gentlemanEditCodes ? config.gentlemanEditCodes[0] : undefined
    };

    const response = await fetch("/api/profile-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Code": adminCode,
      },
      body: JSON.stringify(payloadToSend)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to sync config: ${response.status}`);
    }

    const payload = await response.json();
    return { success: true, message: payload.message || "同步成功！" };
  } catch (error) {
    console.error("Unable to sync shared config:", error);
    return { success: false, message: (error as Error).message };
  }
}

// --- Lady Profile API Interactions ---

// 偵測並判定精確的裝置型號與作業系統名稱
async function detectPreciseDeviceModel(): Promise<string> {
  // 1. 優先嘗試現代瀏覽器的高熵特徵 API
  if ((navigator as any).userAgentData) {
    try {
      const info = await (navigator as any).userAgentData.getHighEntropyValues(["model", "platform", "platformVersion"]);
      if (info.model) {
        return `${info.platform || "Android"} (${info.model})`;
      }
    } catch (e) {
      // 忽略錯誤，繼續使用常規檢測
    }
  }
  
  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();
  
  // 2. 針對 iOS 設備，通過螢幕解析度與倍率映射估計精確的 iPhone 型號
  if (/iphone|ipad|ipod/i.test(ua)) {
    const w = window.screen.width;
    const h = window.screen.height;
    const pr = window.devicePixelRatio;
    
    // 主流 iPhone 螢幕與像素比率數據映射
    if (w === 414 && h === 896 && pr === 2) return "iPhone 11 / XR";
    if (w === 414 && h === 896 && pr === 3) return "iPhone 11 Pro Max / XS Max";
    if (w === 375 && h === 812 && pr === 3) return "iPhone 11 Pro / X / XS";
    if (w === 390 && h === 844 && pr === 3) return "iPhone 12 / 13 / 14";
    if (w === 428 && h === 926 && pr === 3) return "iPhone 12 Pro Max / 13 Pro Max / 14 Plus";
    if (w === 393 && h === 852 && pr === 3) return "iPhone 14 Pro / 15";
    if (w === 430 && h === 932 && pr === 3) return "iPhone 14 Pro Max / 15 Pro Max";
    if (w === 375 && h === 667 && pr === 2) return "iPhone 6/7/8 / SE (2nd/3rd Gen)";
    if (w === 414 && h === 736 && pr === 3) return "iPhone 6+/7+/8+";
    return "iPhone / iPad (Apple)";
  }

  // 3. 常規 Android 裝置 UA 標識解析 (常含有 SM-G998B, CPH2307 等精確型號)
  const androidMatch = ua.match(/Android\s+([^;]+);\s+([^;)]+)/);
  if (androidMatch) {
    const model = androidMatch[2].trim();
    if (model.includes("Build/")) {
      return `Android (${model.split("Build/")[0].trim()})`;
    }
    return `Android (${model})`;
  }
  
  if (uaLower.includes("oppo") || uaLower.includes("cph") || uaLower.includes("pgj")) return "OPPO 手機";
  if (uaLower.includes("vivo") || uaLower.includes("v2")) return "vivo 手機";
  if (uaLower.includes("xiaomi") || uaLower.includes("mi ") || uaLower.includes("redmi")) return "小米手機";
  if (uaLower.includes("samsung") || uaLower.includes("sm-")) return "三星手機";
  if (uaLower.includes("huawei")) return "華為手機";

  if (uaLower.includes("macintosh")) return "Mac 電腦";
  if (uaLower.includes("windows")) return "Windows 電腦";
  if (uaLower.includes("linux")) return "Linux 電腦";

  return "未知行動裝置";
}

// 獲取或建立設備唯一識別碼以實施防刷機制
export function getOrCreateDeviceId(): string {
  let devId = localStorage.getItem("yuanyu_device_id");
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    localStorage.setItem("yuanyu_device_id", devId);
  }
  return devId;
}

// 獲取 Canvas 硬體帆布指紋 + 高熵特徵組合成設備指紋
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    canvas.width = 200;
    canvas.height = 50;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("yuanyu_soulmatch_fingerprint_😊", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("yuanyu_soulmatch_fingerprint_😊", 4, 17);
    
    const canvasData = canvas.toDataURL();
    // 結合螢幕解析度、時區差與 User-Agent 提高熵值，防止不同設備碰撞
    const extraInfo = [
      navigator.userAgent,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset()
    ].join('||');
    
    const combined = canvasData + "||" + extraInfo;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    return 'fp_' + Math.abs(hash).toString(36);
  } catch (e) {
    return '';
  }
}

/**
 * Registers a new lady profile.
 * @param name - Optional name for the lady.
 * @param photoUrl - Optional photo URL for the lady.
 * @returns { lady, isNew } — isNew=true 表示全新建號，isNew=false 表示偵測到已有帳號並自動載入。
 */
export async function registerLady(name?: string, photoUrl?: string): Promise<{ lady: LadyProfile; isNew: boolean }> {
  try {
    const deviceId = getOrCreateDeviceId();
    const canvasFingerprint = getCanvasFingerprint();
    const deviceModel = await detectPreciseDeviceModel();
    const response = await fetch("/api/lady/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, photoUrl, deviceId, deviceModel, canvasFingerprint }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "女性用戶註冊失敗。");
    }
    const isNew = response.status === 201;
    const { lady } = await response.json();
    return { lady, isNew };
  } catch (error) {
    console.error("Error registering lady:", error);
    throw error;
  }
}

/**
 * Resets the server's database to the hardcoded default values.
 * Requires an admin code for authorization.
 * @param adminCode The admin code for authorization
 * @param currentAdminCodes The list of current admin codes to preserve
 * @returns A promise that resolves to a success/failure object.
 */
export async function resetDatabaseToDefaults(
  adminCode: string,
  currentAdminCodes: string[],
  currentGentlemanEditCodes?: string[]
): Promise<{ success: boolean; message: string }> {
  if (!adminCode) {
    const message = "需要提供管理員代碼才能重置資料庫。";
    console.error(message);
    return { success: false, message };
  }

  console.log("正在使用預設資料重置資料庫...");

  const configToSync = {
    profiles: DEFAULT_PROFILES,
    metrics: DEFAULT_METRICS,
    adminCodes: currentAdminCodes, // Preserve existing admin codes
    gentlemanEditCodes: currentGentlemanEditCodes || [],
  };

  return await syncSharedConfig(configToSync, adminCode);
}

/**
 * Logs in a lady profile.
 * @param code - The lady's unique code.
 * @returns The LadyProfile if login is successful.
愛是 */
export async function loginLady(code: string): Promise<LadyProfile> {
  try {
    const deviceModel = await detectPreciseDeviceModel();
    const response = await fetch("/api/lady/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, deviceModel }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "女性用戶登入失敗。");
    }
    const { lady } = await response.json();
    return lady;
  } catch (error) {
    console.error("Error logging in lady:", error);
    throw error;
  }
}

/**
 * Saves the quiz result for a lady profile.
 * @param ladyCode - The lady's unique code.
 * @param matchedGentlemanCode - The code of the matched gentleman.
 * @param quizMetrics - The lady's personality metrics from the quiz.
 */
export async function saveLadyQuizResult(ladyCode: string, matchedGentlemanCode: string, quizMetrics: PersonalityMetrics, quizAnswers?: number[]): Promise<LadyProfile> {
  try {
    const response = await fetch(`/api/lady/${ladyCode}/quiz-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchedGentlemanCode, quizMetrics, quizAnswers }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "儲存測驗結果失敗。");
    }
    const { lady } = await response.json();
    return lady;
  } catch (error) {
    console.error("Error saving lady quiz result:", error);
    throw error;
  }
}

/**
 * Verifies any login code on the backend (Admin, Gentleman, or Lady).
 */
export async function verifyAuthCode(code: string): Promise<{
  role: "admin" | "gentleman" | "lady";
  code: string;
  profile?: Profile;
  lady?: LadyProfile;
}> {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "驗證編號失敗。");
  }
  return await response.json();
}

/**
 * Simulates updating membershipLevel/assetVerified/unlocked list for ladies.
 */
export async function simulateLadyAssets(
  ladyCode: string,
  membershipLevel?: string,
  assetVerified?: string,
  unlockedGentlemanCodes?: string[],
  quizTaken?: boolean,
  matchedGentlemanCode?: string | null,
  matchCounts?: number,
  extraFields?: any
): Promise<LadyProfile> {
  const response = await fetch(`/api/lady/${ladyCode}/simulate-assets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      membershipLevel, 
      assetVerified, 
      unlockedGentlemanCodes, 
      quizTaken, 
      matchedGentlemanCode, 
      matchCounts,
      ...extraFields
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "模擬變更狀態失敗。");
  }
  const { lady } = await response.json();
  return lady;
}

/**
 * Admin: Fetch all registered ladies.
 */
export async function fetchAllLadies(adminCode: string): Promise<LadyProfile[]> {
  const response = await fetch("/api/admin/ladies", {
    headers: { "x-admin-code": adminCode },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "獲取麗人列表失敗。");
  }
  const { ladies } = await response.json();
  return ladies;
}

/**
 * Admin: Update a lady's membership/quiz status directly.
 */
export async function updateLadyByAdmin(
  code: string,
  data: {
    membershipLevel?: string;
    assetVerified?: string;
    unlockedGentlemanCodes?: string[];
    quizTaken?: boolean;
    matchedGentlemanCode?: string | null;
    notes?: string;
    photoUrl?: string;
    pendingPhotoUrl?: string;
    name?: string;
    matchCounts?: number;
    isVerified?: boolean;
    idVerified?: string;
    idVerifyFileName?: string;
    occupationVerified?: string;
    occupationVerifyFileName?: string;
    verifyOccupation?: string;
  },
  adminCode: string
): Promise<LadyProfile> {
  const response = await fetch(`/api/admin/lady/${code}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "更新失敗。");
  }
  const { lady } = await response.json();
  return lady;
}

/**
 * Admin: Permanently delete a lady account.
 */
export async function deleteLadyByAdmin(code: string, adminCode: string): Promise<void> {
  const response = await fetch(`/api/admin/lady/${code}`, {
    method: "DELETE",
    headers: { "x-admin-code": adminCode },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "刪除失敗。");
  }
}

/**
 * Lady: Request changing avatar photo (requires admin approval).
 */
export async function requestPhotoChange(code: string, base64Photo: string): Promise<LadyProfile> {
  const response = await fetch(`/api/lady/${code}/photo-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pendingPhotoUrl: base64Photo }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "提交頭像變更申請失敗。");
  }
  const { lady } = await response.json();
  return lady;
}

/**
 * Lady: Update name directly.
 */
export async function updateLadyName(code: string, name: string): Promise<LadyProfile> {
  const response = await fetch(`/api/lady/${code}/update-name`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "更新名字失敗。");
  }
  const { lady } = await response.json();
  return lady;
}

/**
 * Guest/User: Track visitor page entry.
 */
export async function trackVisit(deviceId: string): Promise<void> {
  try {
    await fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    });
  } catch (e) {
    console.error("Failed to track visit", e);
  }
}

/**
 * Admin: Fetch visit stats and IP logs summary.
 */
export async function fetchAdminVisits(adminCode: string): Promise<{
  summary: Array<{
    ipAddress: string;
    totalVisits: number;
    uniqueDevicesCount: number;
    lastVisit: string;
    userAgent: string;
  }>;
  totalLogs: number;
}> {
  const response = await fetch("/api/admin/visits", {
    headers: { "x-admin-code": adminCode },
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch admin visits");
  }
  return response.json();
}

export interface IpMetadataItem {
  ipAddress: string;
  note: string;
  isExcluded: boolean;
}

export async function fetchIpMetadata(adminCode: string): Promise<IpMetadataItem[]> {
  const response = await fetch("/api/admin/ip-metadata", {
    headers: { "x-admin-code": adminCode },
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch IP metadata");
  }
  return response.json();
}

export async function updateIpMetadata(
  adminCode: string,
  ipAddress: string,
  updates: { note?: string; isExcluded?: boolean }
): Promise<IpMetadataItem> {
  const response = await fetch("/api/admin/ip-metadata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-code": adminCode,
    },
    body: JSON.stringify({ ipAddress, ...updates }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update IP metadata");
  }
  return response.json();
}
