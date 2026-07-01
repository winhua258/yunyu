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
  isAcceptingMatches: { type: Boolean, default: true },
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
  code: { type: String, required: true, unique: true },
  name: { type: String, default: "未命名麗人" },
  isVerified: { type: Boolean, default: true },
  photoUrl: { type: String, default: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" },
  pendingPhotoUrl: { type: String, default: "" }, // 待審核頭像 URL（麗人提交，主控批准後才替換）
  notes: { type: String, default: "" }, // 主控備注
  quizTaken: { type: Boolean, default: false },
  matchedGentlemanCode: { type: String, default: null },
  quizMetrics: { type: MetricsSchema, default: {} },
  membershipLevel: { type: String, default: "free" },
  assetVerified: { type: String, default: "none" },
  unlockedGentlemanCodes: { type: [String], default: [] },
  quizAnswers: { type: [Number], default: [] }, // 各題作答選項索引 (0-3)
  deviceId: { type: String, default: "" },
  ipAddress: { type: String, default: "" },
  userAgent: { type: String, default: "" }, // 裝置 User-Agent
  deviceModel: { type: String, default: "" }, // 裝置精確型號名稱 (如 iPhone 11)
  canvasFingerprint: { type: String, default: "" }, // 帆布硬體指紋
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

// 獲取客戶端 IP 的輔助函式
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip;
}

// 記憶體中的 IP 註冊追蹤 (IP -> timestamps array)
const ipRegistrationLimits = new Map();
const LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 分鐘
const MAX_REGISTRATIONS_PER_WINDOW = 3; // 最多 3 次註冊

// 定期自動清理 Map 釋放記憶體，避免 Memory Leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRegistrationLimits.entries()) {
    const active = timestamps.filter(t => now - t < LIMIT_WINDOW_MS);
    if (active.length === 0) {
      ipRegistrationLimits.delete(ip);
    } else {
      ipRegistrationLimits.set(ip, active);
    }
  }
}, 15 * 60 * 1000).unref();

// POST /api/lady/register: 模擬女性用戶註冊
app.post("/api/lady/register", async (req, res) => {
  try {
    const { name, photoUrl, deviceId, deviceModel, canvasFingerprint } = req.body;
    const clientIp = getClientIp(req);

    // 1. IP 註冊頻率限制 (Rate Limiting)
    if (clientIp) {
      const now = Date.now();
      let timestamps = ipRegistrationLimits.get(clientIp) || [];
      timestamps = timestamps.filter(t => now - t < LIMIT_WINDOW_MS);
      if (timestamps.length >= MAX_REGISTRATIONS_PER_WINDOW) {
        return res.status(429).json({ 
          message: "偵測到您的網路連線近期已註冊多個帳號，為防範異常洗版，請稍後（10分鐘）再試。或聯繫客服人員人工排程。" 
        });
      }
      timestamps.push(now);
      ipRegistrationLimits.set(clientIp, timestamps);
    }

    // 2. 設備指紋與帆布硬體指紋雙重攔截機制：防止重複註冊多個帳號
    let existingLady = null;
    if (deviceId) {
      existingLady = await LadyProfile.findOne({ deviceId });
    }
    if (!existingLady && canvasFingerprint) {
      // 就算用戶清空了 localStorage (deviceId 變新)，只要硬體帆布指紋相同，依然能進行加載/攔截！
      existingLady = await LadyProfile.findOne({ canvasFingerprint });
    }

    if (existingLady) {
      // 順便同步設備型號與 UA
      let changed = false;
      if (deviceModel && existingLady.deviceModel !== deviceModel) {
        existingLady.deviceModel = deviceModel;
        changed = true;
      }
      if (canvasFingerprint && existingLady.canvasFingerprint !== canvasFingerprint) {
        existingLady.canvasFingerprint = canvasFingerprint;
        changed = true;
      }
      const userAgent = req.headers["user-agent"] || "";
      if (userAgent && existingLady.userAgent !== userAgent) {
        existingLady.userAgent = userAgent;
        changed = true;
      }
      if (clientIp && existingLady.ipAddress !== clientIp) {
        existingLady.ipAddress = clientIp;
        changed = true;
      }
      if (changed) {
        existingLady.updatedAt = new Date();
        await existingLady.save();
      }

      console.log(`[Scan Match] Auto-login for duplicate visitor (IP: ${clientIp}, DeviceId: ${deviceId}, Canvas: ${canvasFingerprint}) to code: ${existingLady.code}`);
      return res.status(200).json({ 
        message: "偵測到您的設備已有註冊記錄，已自動為您載入原有帳戶。", 
        lady: existingLady 
      });
    }

    const newLadyCode = uuidv4(); // 生成唯一的女性用戶編號
    const newLady = new LadyProfile({
      code: newLadyCode,
      name: name || "未命名麗人", // 允許傳入名稱，否則使用預設
      isVerified: true, // 模擬已驗證
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
      deviceId: deviceId || "",
      canvasFingerprint: canvasFingerprint || "",
      ipAddress: clientIp || "",
      userAgent: req.headers["user-agent"] || "",
      deviceModel: deviceModel || ""
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
    const { code, deviceModel } = req.body;
    const clientIp = getClientIp(req);
    const lady = await LadyProfile.findOne({ code });
    if (!lady) {
      return res.status(404).json({ message: "查無此女性用戶編號。" });
    }
    if (!lady.isVerified) {
      return res.status(403).json({ message: "此女性用戶尚未通過驗證。" });
    }

    // 更新最新連線資訊與精確設備型號
    let changed = false;
    if (deviceModel && lady.deviceModel !== deviceModel) {
      lady.deviceModel = deviceModel;
      changed = true;
    }
    const userAgent = req.headers["user-agent"] || "";
    if (userAgent && lady.userAgent !== userAgent) {
      lady.userAgent = userAgent;
      changed = true;
    }
    if (clientIp && lady.ipAddress !== clientIp) {
      lady.ipAddress = clientIp;
      changed = true;
    }
    if (changed) {
      lady.updatedAt = new Date();
      await lady.save();
    }

    res.json({ message: "女性用戶登入成功！", lady });
  } catch (error) {
    console.error("Error logging in lady:", error);
    res.status(500).json({ message: "女性用戶登入失敗。" });
  }
});

// POST /api/lady/:code/photo-request: 申請變更麗人頭像（待主控核驗）
app.post("/api/lady/:code/photo-request", async (req, res) => {
  try {
    const { code } = req.params;
    const { pendingPhotoUrl } = req.body;
    
    if (!pendingPhotoUrl) {
      return res.status(400).json({ message: "未提供頭像圖片資料。" });
    }

    const lady = await LadyProfile.findOne({ code });
    if (!lady) {
      return res.status(404).json({ message: "查無此麗人帳號。" });
    }

    lady.pendingPhotoUrl = pendingPhotoUrl;
    lady.updatedAt = new Date();
    await lady.save();

    res.json({ message: "已提交頭像變更申請，等待主控核驗。", lady });
  } catch (error) {
    console.error("Error requesting photo change:", error);
    res.status(500).json({ message: "提交變更申請失敗。" });
  }
});

// POST /api/lady/:code/update-name: 修改麗人名稱
app.post("/api/lady/:code/update-name", async (req, res) => {
  try {
    const { code } = req.params;
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "名字不可為空。" });
    }

    const lady = await LadyProfile.findOne({ code });
    if (!lady) {
      return res.status(404).json({ message: "查無此麗人帳號。" });
    }

    lady.name = name.trim();
    lady.updatedAt = new Date();
    await lady.save();

    res.json({ message: "名稱修改成功。", lady });
  } catch (error) {
    console.error("Error updating lady name:", error);
    res.status(500).json({ message: "名稱修改失敗。" });
  }
});


// POST /api/lady/:code/quiz-result: 儲存女性用戶測驗結果
app.post("/api/lady/:code/quiz-result", async (req, res) => {
  try {
    const { code } = req.params;
    const { matchedGentlemanCode, quizMetrics, quizAnswers } = req.body;

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
    if (quizAnswers) {
      lady.quizAnswers = quizAnswers;
    }
    
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
// --- Admin Lady Management API ---

// GET /api/admin/ladies: 獲取所有已註冊麗人列表（管理員專用）
app.get("/api/admin/ladies", adminAuth, async (req, res) => {
  try {
    const ladies = await LadyProfile.find({}).sort({ createdAt: -1 }).lean();
    res.json({ ladies });
  } catch (error) {
    console.error("Error fetching ladies:", error);
    res.status(500).json({ message: "獲取麗人列表失敗。" });
  }
});

// POST /api/admin/lady/:code/update: 管理員直接修改麗人帳號資料
app.post("/api/admin/lady/:code/update", adminAuth, async (req, res) => {
  try {
    const { code } = req.params;
    const { membershipLevel, assetVerified, unlockedGentlemanCodes, quizTaken, matchedGentlemanCode, notes, photoUrl, pendingPhotoUrl, name } = req.body;

    const lady = await LadyProfile.findOne({ code });
    if (!lady) {
      return res.status(404).json({ message: "查無此女性用戶編號。" });
    }

    if (membershipLevel !== undefined) lady.membershipLevel = membershipLevel;
    if (assetVerified !== undefined) lady.assetVerified = assetVerified;
    if (unlockedGentlemanCodes !== undefined) lady.unlockedGentlemanCodes = unlockedGentlemanCodes;
    if (quizTaken !== undefined) lady.quizTaken = quizTaken;
    if (matchedGentlemanCode !== undefined) lady.matchedGentlemanCode = matchedGentlemanCode;
    if (notes !== undefined) lady.notes = notes;
    if (name !== undefined) lady.name = name;
    // 管理員批准頭像：直接更新 photoUrl 並清空 pendingPhotoUrl
    if (photoUrl !== undefined) { lady.photoUrl = photoUrl; lady.pendingPhotoUrl = ""; }
    // 管理員拒絕頭像或手動清空 pending
    if (pendingPhotoUrl !== undefined) lady.pendingPhotoUrl = pendingPhotoUrl;

    lady.updatedAt = new Date();
    await lady.save();
    res.json({ message: "麗人帳號已由管理員更新。", lady });
  } catch (error) {
    console.error("Error updating lady by admin:", error);
    res.status(500).json({ message: "更新失敗。" });
  }
});

// DELETE /api/admin/lady/:code: 管理員永久刪除麗人帳號
app.delete("/api/admin/lady/:code", adminAuth, async (req, res) => {
  try {
    const { code } = req.params;
    const result = await LadyProfile.deleteOne({ code });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "查無此女性用戶編號。" });
    }
    res.json({ message: "麗人帳號已永久刪除。" });
  } catch (error) {
    console.error("Error deleting lady by admin:", error);
    res.status(500).json({ message: "刪除失敗。" });
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
