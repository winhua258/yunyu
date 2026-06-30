import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
// import { GoogleGenerativeAI } from "@google/genai"; // 暫時停用，新版SDK API不相容
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { DEFAULT_PROFILES, DEFAULT_METRICS } from "./src/data.ts";

// --- 初始化與設定 ---
dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" })); // 提高請求大小限制以容納所有設定
app.use(cors());

const { MONGODB_URI, ADMIN_CODES, GENAI_API_KEY } = process.env;
const rootAdminCodes = ADMIN_CODES ? ADMIN_CODES.split(",").map(c => c.trim()) : [];

// --- 資料庫模型 (Mongoose) ---
const ProfileSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: Number,
  location: String,
  tagline: String,
  bio: String,
  lifestyle: [String],
  imageUrl: String,
  imageUrls: [String],
  cardDetail: String,
  idealMatch: String,
  contactLineUrl: String,
}, { _id: false });

const MetricsSchema = new mongoose.Schema({
  Rationality: Number, Spontaneity: Number, Adventure: Number, Hedonism: Number,
  Dominance: Number, Extroversion: Number, SecurityNeed: Number, EmotionalDependency: Number,
  GrowthMindset: Number, FamilyOrientation: Number, ConsumptionTendency: Number,
  FinancialMaturity: Number, CommunicationEfficiency: Number, RitualNeed: Number,
  QualityOfLife: Number, FreedomNeed: Number, Responsibility: Number, DecisionSpeed: Number,
  ConflictResolution: Number, LongTermCommitment: Number,
}, { _id: false });

const ConfigSchema = new mongoose.Schema({
  // 使用一個固定的 ID 來確保我們總是更新同一個文件
  singletonId: { type: String, default: "YUANYU_CONFIG", unique: true },
  profiles: { type: Map, of: ProfileSchema },
  metrics: { type: Map, of: MetricsSchema },
  adminCodes: { type: [String], default: [] }
});

const LadyProfileSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // 女性用戶的唯一編號
  name: { type: String, default: "未命名麗人" }, // 實名資訊 (模擬)
  isVerified: { type: Boolean, default: true }, // 模擬已驗證
  photoUrl: { type: String, default: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" }, // 模擬照片
  quizTaken: { type: Boolean, default: false }, // 是否已完成測驗
  matchedGentlemanCode: { type: String, default: null }, // 配對到的紳士編號
  quizMetrics: { type: MetricsSchema, default: {} }, // 測驗時的女性用戶指標
  membershipLevel: { type: String, default: "free" }, // 新增：付費套餐等級 (free, experience, vip)
  assetVerified: { type: String, default: "none" }, // 新增：驗資審查狀態 (none, pending, approved)
  unlockedGentlemanCodes: { type: [String], default: [] }, // 新增：已解鎖的男方編號名單
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Config = mongoose.model("Config", ConfigSchema);
const LadyProfile = mongoose.model("LadyProfile", LadyProfileSchema);

// --- 自動同步預設資料 ---
async function synchronizeDefaultData() {
  try {
    let config = await Config.findOne({ singletonId: "YUANYU_CONFIG" });
    let needsSave = false;

    if (!config) {
      // Case 1: 資料庫是空的，執行首次初始化 (Seeding)
      console.log("No config found in DB, seeding with default data...");
      config = new Config({
        profiles: DEFAULT_PROFILES,
        metrics: DEFAULT_METRICS,
        adminCodes: []
      });
      needsSave = true;
    } else {
      // Case 2: 設定已存在，檢查並智慧同步預設角色
      // 這能確保程式碼中的變更可以反映到資料庫，同時不影響手動新增的角色
      for (const code of Object.keys(DEFAULT_PROFILES)) {
        const profileFromDB = config.profiles.get(code);
        const metricsFromDB = config.metrics.get(code);
        const profileFromCode = DEFAULT_PROFILES[code];
        const metricsFromCode = DEFAULT_METRICS[code];

        // 使用 JSON.stringify 進行簡單的比對，判斷資料是否需要更新
        if (JSON.stringify(profileFromDB) !== JSON.stringify(profileFromCode) || JSON.stringify(metricsFromDB) !== JSON.stringify(metricsFromCode)) {
          config.profiles.set(code, profileFromCode);
          config.metrics.set(code, metricsFromCode);
          needsSave = true;
          console.log(`🔄 Synchronizing default profile: ${code}`);
        }
      }
    }

    if (needsSave) {
      await config.save();
      console.log("✅ Default data synchronization complete.");
    } else {
      console.log("👍 Default data is already up-to-date.");
    }
  } catch (error) {
    console.error("❌ Error during default data synchronization:", error);
  }
}

// --- 連接 MongoDB ---
if (MONGODB_URI) {
  // 增加更強健的 URI 驗證，防止格式錯誤的字串
  let isValidURI = true;
  if (!MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
    isValidURI = false;
  }
  try {
    new URL(MONGODB_URI); // 嘗試用 Node.js 內建的 URL 解析器進行解析
  } catch (e) {
    isValidURI = false;
  }
  if (!isValidURI) {
    console.error("❌ .env 檔案中的 MONGODB_URI 格式無效。");
    console.error(`   無效的字串: "${MONGODB_URI}"`);
    console.error("   請確保它是一個合法的連線字串，例如: 'mongodb://localhost:27017/yuanyu'");
    process.exit(1); // 如果 URI 無效，則終止伺服器啟動
  }
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log("✅ MongoDB connected successfully.");
      // 連接成功後，執行智慧同步
      await synchronizeDefaultData();
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));
} else {
  console.warn("⚠️ MONGODB_URI not set in .env file. Database features will be unavailable.");
}

// --- 中介軟體 (Middleware) ---
const adminAuth = async (req, res, next) => {
  const authCode = req.headers["x-admin-code"];
  if (!authCode) {
    return res.status(403).json({ message: "未提供管理員代號。" });
  }
  // 檢查 .env 中的 root 密碼
  if (rootAdminCodes.includes(authCode)) {
    return next();
  }
  // 檢查資料庫中由 UI 管理的密碼
  try {
    const config = await Config.findOne({ singletonId: "YUANYU_CONFIG" });
    if (config && config.adminCodes && config.adminCodes.includes(authCode)) {
      return next();
    }
  } catch (e) { /* 忽略資料庫錯誤，下方會統一拒絕 */ }
  
  return res.status(403).json({ message: "權限不足或管理員代號錯誤。" });
};

// --- API Endpoints ---

// GET /api/profile-config: 獲取所有設定 (不包含敏感的管理員密碼)
app.get("/api/profile-config", async (req, res) => {
  try {
    let config = await Config.findOne({ singletonId: "YUANYU_CONFIG" });
    if (!config) {
      return res.status(404).json({ message: "設定尚未初始化，請稍後再試。" });
    }
    res.json({
      profiles: config.profiles ? Object.fromEntries(config.profiles) : {},
      metrics: config.metrics ? Object.fromEntries(config.metrics) : {},
      adminCodes: [], // 👈 安全性修補：移除實際的管理密鑰，只回傳空陣列
    });
  } catch (error) {
    console.error("Error fetching config:", error);
    res.status(500).json({ message: "讀取設定時發生伺服器錯誤。" });
  }
});

// GET /api/admin/config: 獲取包含管理密碼的安全設定 (需要管理員權限)
app.get("/api/admin/config", adminAuth, async (req, res) => {
  try {
    let config = await Config.findOne({ singletonId: "YUANYU_CONFIG" });
    if (!config) {
      return res.status(404).json({ message: "設定尚未初始化，請稍後再試。" });
    }
    res.json({
      profiles: config.profiles ? Object.fromEntries(config.profiles) : {},
      metrics: config.metrics ? Object.fromEntries(config.metrics) : {},
      adminCodes: config.adminCodes || [], // 只在已授權的管理帳號下回傳
    });
  } catch (error) {
    console.error("Error fetching config:", error);
    res.status(500).json({ message: "讀取後台設定時發生錯誤。" });
  }
});

// POST /api/auth/verify: 統一多角色登入驗證端點
app.post("/api/auth/verify", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "請輸入登入編號。" });
    }

    const sanitizedCode = code.trim();

    // 1. 檢查是否為管理員
    if (rootAdminCodes.includes(sanitizedCode)) {
      return res.json({ role: "admin", code: sanitizedCode });
    }

    let config = await Config.findOne({ singletonId: "YUANYU_CONFIG" });
    if (config && config.adminCodes && config.adminCodes.includes(sanitizedCode)) {
      return res.json({ role: "admin", code: sanitizedCode });
    }

    // 2. 檢查是否為紳士 (profiles 中的 key)
    if (config && config.profiles && config.profiles.has(sanitizedCode)) {
      const gentleman = config.profiles.get(sanitizedCode);
      return res.json({ role: "gentleman", code: sanitizedCode, profile: gentleman });
    }

    // 3. 檢查是否為麗人 (LadyProfile 中的 code)
    const lady = await LadyProfile.findOne({ code: sanitizedCode });
    if (lady) {
      return res.json({ role: "lady", code: sanitizedCode, lady });
    }

    return res.status(404).json({ message: "查無此編號，請確認您的專屬編號是否正確。" });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "驗證登入編號時發生伺服器錯誤。" });
  }
});

// POST /api/profile-config: 更新所有設定 (需要管理員權限)
app.post("/api/profile-config", adminAuth, async (req, res) => {
  try {
    const { profiles, metrics, adminCodes } = req.body;
    const updatedConfig = await Config.findOneAndUpdate(
      { singletonId: "YUANYU_CONFIG" },
      { profiles, metrics, adminCodes: adminCodes || [] },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({
      message: "設定已成功同步至資料庫！",
      profiles: updatedConfig.profiles ? Object.fromEntries(updatedConfig.profiles) : {},
      metrics: updatedConfig.metrics ? Object.fromEntries(updatedConfig.metrics) : {},
      adminCodes: updatedConfig.adminCodes || [],
    });
  } catch (error) {
    console.error("Error saving config:", error);
    res.status(500).json({ message: "儲存設定時發生伺服器錯誤。" });
  }
});

// --- Lady Profile API Endpoints ---

// POST /api/lady/register: 模擬女性用戶註冊
app.post("/api/lady/register", async (req, res) => {
  try {
    const newLadyCode = uuidv4(); // 生成唯一的女性用戶編號
    const newLady = new LadyProfile({
      code: newLadyCode,
      name: req.body.name || "未命名麗人", // 允許傳入名稱，否則使用預設
      isVerified: true, // 模擬已驗證
      photoUrl: req.body.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    });
    await newLady.save();
    res.status(201).json({ message: "女性用戶註冊成功！", lady: newLady });
  } catch (error) {
    console.error("Error registering lady:", error);
    res.status(500).json({ message: "女性用戶註冊失敗。" });
  }
});

// POST /api/lady/login: 模擬女性用戶登入
app.post("/api/lady/login", async (req, res) => {
  try {
    const { code } = req.body;
    const lady = await LadyProfile.findOne({ code });
    if (!lady) {
      return res.status(404).json({ message: "查無此女性用戶編號。" });
    }
    if (!lady.isVerified) {
      return res.status(403).json({ message: "此女性用戶尚未通過驗證。" });
    }
    res.json({ message: "女性用戶登入成功！", lady });
  } catch (error) {
    console.error("Error logging in lady:", error);
    res.status(500).json({ message: "女性用戶登入失敗。" });
  }
});

// POST /api/lady/:code/quiz-result: 儲存女性用戶測驗結果
app.post("/api/lady/:code/quiz-result", async (req, res) => {
  try {
    const { code } = req.params;
    const { matchedGentlemanCode, quizMetrics } = req.body;

    const lady = await LadyProfile.findOne({ code });
    if (!lady) {
      return res.status(404).json({ message: "查無此女性用戶編號。" });
    }
    if (lady.quizTaken) {
      return res.status(400).json({ message: "此女性用戶已完成測驗，無法重複提交。" });
    }

    lady.quizTaken = true;
    lady.matchedGentlemanCode = matchedGentlemanCode;
    lady.quizMetrics = quizMetrics;
    
    // 將配對到的男生代碼自動加入已解鎖列表
    if (matchedGentlemanCode && !lady.unlockedGentlemanCodes.includes(matchedGentlemanCode)) {
      lady.unlockedGentlemanCodes.push(matchedGentlemanCode);
    }
    
    lady.updatedAt = new Date();
    await lady.save();
    res.json({ message: "測驗結果儲存成功！", lady });
  } catch (error) {
    console.error("Error saving lady quiz result:", error);
    res.status(500).json({ message: "儲存測驗結果失敗。" });
  }
});

// POST /api/lady/:code/simulate-assets: 模擬女性用戶套餐等級與驗資狀態變更
app.post("/api/lady/:code/simulate-assets", async (req, res) => {
  try {
    const { code } = req.params;
    const { membershipLevel, assetVerified, unlockedGentlemanCodes } = req.body;

    const lady = await LadyProfile.findOne({ code });
    if (!lady) {
      return res.status(404).json({ message: "查無此女性用戶編號。" });
    }

    if (membershipLevel !== undefined) {
      lady.membershipLevel = membershipLevel;
    }
    if (assetVerified !== undefined) {
      lady.assetVerified = assetVerified;
    }
    if (unlockedGentlemanCodes !== undefined) {
      lady.unlockedGentlemanCodes = unlockedGentlemanCodes;
    }
    if (req.body.quizTaken !== undefined) {
      lady.quizTaken = req.body.quizTaken;
    }
    if (req.body.matchedGentlemanCode !== undefined) {
      lady.matchedGentlemanCode = req.body.matchedGentlemanCode;
    }

    lady.updatedAt = new Date();
    await lady.save();
    res.json({ message: "模擬角色套餐與驗資狀態變更成功！", lady });
  } catch (error) {
    console.error("Error updating simulated lady assets:", error);
    res.status(500).json({ message: "模擬變更失敗。" });
  }
});
// POST /api/generate: Google GenAI API (暫時停用，待適配新版SDK)
app.post("/api/generate", async (req, res) => {
  return res.status(503).json({ message: "AI 生成功能暫時維護中。" });
});

// --- 啟動伺服器 ---
const port = process.env.PORT || 3000;
ViteExpress.listen(app, port, () =>
  console.log(`✅ Server is listening on http://localhost:${port}`)
);
