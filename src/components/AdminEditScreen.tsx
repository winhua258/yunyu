import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Save, 
  RotateCcw, 
  LogOut, 
  User, 
  Image as ImageIcon, 
  Tag, 
  MapPin, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  Check, 
  AlertCircle,
  Sliders,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  RefreshCw,
  Users,
  BarChart2,
  Crown,
  ShieldCheck,
  Smartphone,
  Globe,
  Edit2,
  Wand2
} from "lucide-react";
import { Profile, PersonalityMetrics, LadyProfile } from "../types";
import { 
  DEFAULT_PROFILES, 
  DEFAULT_METRICS,
  syncSharedConfig,
  resetDatabaseToDefaults,
  fetchAllLadies,
  updateLadyByAdmin,
  deleteLadyByAdmin,
  fetchAdminVisits,
  fetchIpMetadata,
  updateIpMetadata,
  IpMetadataItem,
} from "../data";
import { useData } from "./DataContext";

// 解析 User Agent 獲取友善的設備文字名稱
function getFriendlyDevice(ua: string | undefined): string {
  if (!ua) return "未知裝置";
  const lower = ua.toLowerCase();
  
  // 檢測 Line 內置瀏覽器
  const isLine = lower.includes("line/");
  let browserLabel = "";
  if (isLine) browserLabel = " (LINE)";

  if (lower.includes("iphone")) return `iPhone${browserLabel}`;
  if (lower.includes("ipad")) return `iPad${browserLabel}`;
  if (lower.includes("android")) {
    if (lower.includes("mobile")) return `Android 手機${browserLabel}`;
    return `Android 平板${browserLabel}`;
  }
  if (lower.includes("macintosh") || lower.includes("mac os x")) return `Mac 電腦${browserLabel}`;
  if (lower.includes("windows")) return `Windows 電腦${browserLabel}`;
  if (lower.includes("linux")) return `Linux 電腦${browserLabel}`;
  return `其他裝置${browserLabel}`;
}

// 根據 IP 回傳結合文字描述的字串
function getIpDescription(ip: string | undefined): string {
  if (!ip) return "—";
  const regionMap: Record<string, string> = {
    "202.160": "台灣（中華電信）", "61.": "台灣（台灣大哥大）", "114.": "台灣（遠傳）",
    "218.": "台灣（亞太）", "223.": "台灣（台灣之星）", "1.": "台灣（台灣固網）",
    "211.": "香港", "210.": "香港", "103.": "香港/東南亞",
    "65.181": "美國/VPN", "192.168": "本地（開發）", "127.": "本地（開發）",
  };
  const region = Object.entries(regionMap).find(([prefix]) => ip.startsWith(prefix))?.[1] ?? "其他地區";
  return `${ip} [${region}]`;
}

function getIpRegion(ip: string | undefined): string {
  if (!ip) return "未知地區";
  const regionMap: Record<string, string> = {
    // IPv4 Taiwan Prefixes
    "202.160": "台灣（中華電信）", "61.": "台灣（台灣大哥大）", "114.": "台灣（遠傳）",
    "218.": "台灣（亞太）", "223.": "台灣（台灣之星）", "1.": "台灣（台灣固網）",
    // IPv4 Other
    "211.": "香港", "210.": "香港", "103.": "香港/東南亞",
    "65.181": "美國/VPN", "192.168": "本地（開發）", "127.": "本地（開發）",
    
    // IPv6 Taiwan
    "2001:b0": "台灣（中華電信 IPv6）",
    "2001:b4": "台灣（遠傳電信 IPv6）",
    "2001:b02": "台灣（台灣大哥大 IPv6）",
    "2001:288": "台灣（學術網路 TANet IPv6）",
    "2404:0": "台灣 IPv6",
    
    // IPv6 Local & Dev
    "::1": "本地開發 (localhost IPv6)",
    "fe80:": "本地開發 (Link-Local IPv6)",
    "fc00:": "本地開發 (Unique-Local IPv6)",
    "fd00:": "本地開發 (Unique-Local IPv6)"
  };
  return Object.entries(regionMap).find(([prefix]) => ip.startsWith(prefix))?.[1] ?? "其他地區";
}

// 台灣高端男賓資料自動生成器（37-48 歲，符合台灣地區風格）
function generateTaiwanGentlemanData(): { profile: Omit<Profile, "code" | "contactLineUrl" | "imageUrl" | "imageUrls">; metrics: PersonalityMetrics } {
  const pick = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];
  const pickN = (arr: any[], n: number): any[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const surnames = ["陳", "林", "黃", "張", "李", "王", "吳", "劉", "蔡", "楊", "許", "鄭", "謝", "洪", "曾"];
  const givenNames = ["家銘", "建廷", "永昌", "界衡", "俊宏", "志偉", "明哲", "博文", "啟峰", "國豪",
                      "育仁", "政翰", "世傑", "宗翰", "冠宇", "文豪", "浩然", "彥廷", "承翰", "振宇"];
  const cities = ["臺北市", "新北市", "桃園市", "新竹市", "臺中市", "臺南市", "高雄市"];

  type Profession = { title: string; company: string; taglineTemplate: string; bioTemplate: string };
  const professions: Profession[] = [
    {
      title: "科技公司創辦人",
      company: "智鴻科技",
      taglineTemplate: (n: string, c: string) => `${c}${n}創辦人，以技術驅動創新，在商業藍圖與生活品味之間，追求最完整的人生平衡。`,
      bioTemplate: (n: string) => `你好，我是${n}。目前擔任科技新創公司的創辦人，日常在雲端架構與商業策略中穿梭。高壓的工作節奏讓我更懂得珍惜生活的留白。\n\n工作之外，我喜歡透過健身恢復精力，也對精品咖啡有著極度的熱忱，週末常流連各大獨立咖啡館。偶爾安排一趟說走就走的海島旅行，在藍天與海風中重新充電。\n\n我相信，好的伴侶不是彼此束縛，而是能互相激發，讓彼此都成為更好的自己。如果妳也喜歡享受生活的質感、對未來有所期待，我很期待與妳共同書寫屬於我們的故事。`,
    },
    {
      title: "投資總監",
      company: "鼎盛資本",
      taglineTemplate: (n: string, c: string) => `${c}${n}投資總監，以數字讀懂市場，以熱忱感受生活，在理性與感性之間尋找最美的平衡點。`,
      bioTemplate: (n: string) => `你好，我是${n}。在資本市場工作多年，看過許多繁榮與起伏，也因此更加珍惜眼前真實的溫暖。\n\n除了工作，我是個非常熱愛生活的人——閱讀讓我保持思維的深度，紅酒讓我學會細品時間的厚度，旅行讓我不斷重新定義何謂美好。\n\n我期待遇見一個知性又有生命力的妳，能在工作上各自閃耀，也能在生活中互相陪伴，一起在全球最美的角落留下我們的足跡。`,
    },
    {
      title: "建設公司董事",
      company: "永昌建設",
      taglineTemplate: (n: string, c: string) => `${c}${n}建設公司董事，深耕不動產與城市建築，以匠人精神對待工作，以紳士品味對待生活。`,
      bioTemplate: (n: string) => `你好，我是${n}。長期投身不動產與建設行業，每一棟建築對我來說不只是磚瓦，而是承載著無數家庭夢想的空間。\n\n我喜歡收藏當代藝術、品鑑各國精選紅酒，也熱衷於探索城市中的創意餐廳與精品酒店。旅行是我調劑身心的方式，也是我觀察世界建築美學的窗口。\n\n我希望能遇見一個溫柔而獨立、懂得生活美學的妳，讓我們一起打造一個充滿品味與溫度的家。`,
    },
    {
      title: "醫療集團院長",
      company: "昱誠醫療",
      taglineTemplate: (n: string, c: string) => `${c}${n}院長，以醫者的嚴謹對待生命，以藝術家的眼光欣賞世界，在忙碌與安靜中都能找到自己的節奏。`,
      bioTemplate: (n: string) => `你好，我是${n}。投入醫療領域近二十年，見過生命的脆弱，也深刻理解陪伴的珍貴。\n\n工作之餘，我熱愛古典音樂與室內樂演奏，也喜歡騎自行車探索城市的各個角落。我的廚藝其實不差，喜歡在假日親手為重要的人料理一頓精心的晚餐。\n\n我期待遇見一個能讓我靜下來、令我感到安心的妳。不需要多麼轟轟烈烈，我更嚮往那種每天都想見到彼此、平淡而幸福的相處方式。`,
    },
    {
      title: "企業策略顧問",
      company: "宏遠顧問",
      taglineTemplate: (n: string, c: string) => `${c}${n}企業策略顧問，協助各大企業制定長遠布局，私底下是個熱愛生活藝術與人文旅行的深度探索者。`,
      bioTemplate: (n: string) => `你好，我是${n}。長期擔任企業策略顧問，常常需要在複雜的商業環境中快速找到核心問題並提出解方，這讓我培養出敏銳的洞察力與溝通能力。\n\n我熱愛旅行，不是那種走馬看花的觀光客，而是會提前鑽研當地文化、歷史與美食的深度旅人。業餘時間我也在學習攝影，透過鏡頭記錄生活中那些被人遺忘的美麗瞬間。\n\n我希望能遇見一個有自己想法、懂得享受人生的妳，讓我們的對話永遠有新的火花，讓我們的生活永遠有新的驚喜。`,
    },
  ] as any;

  const lifestyleTags = [
    "精品咖啡", "品酒", "健身", "高爾夫", "深度旅行", "閱讀", "藝術收藏", "美食探店",
    "古典音樂", "戶外登山", "水上運動", "攝影", "自行車", "料理", "室內設計", "跑步",
  ];

  const name = pick(surnames) + pick(givenNames);
  const city = pick(cities);
  const age = rand(37, 48);
  const prof = pick(professions);
  const lifestyle = pickN(lifestyleTags, rand(4, 6));

  const tagline = (prof.taglineTemplate as any)(name, prof.company);
  const bio = (prof.bioTemplate as any)(name);
  const cardDetail = `希望能遇見：一個對生活充滿熱忱、知性優雅、讓我忍不住想多了解的妳。`;
  const idealMatch = `期待遇見一個有自己的人生規劃，同時也願意和我共同創造美好回憶的伴侶。`;

  const metrics: PersonalityMetrics = {
    Rationality: rand(45, 85),
    Spontaneity: rand(40, 75),
    Adventure: rand(45, 80),
    Hedonism: rand(55, 90),
    Dominance: rand(40, 70),
    Extroversion: rand(50, 85),
    SecurityNeed: rand(45, 75),
    EmotionalDependency: rand(40, 70),
    GrowthMindset: rand(60, 90),
    FamilyOrientation: rand(55, 85),
    ConsumptionTendency: rand(60, 90),
    FinancialMaturity: rand(65, 95),
    CommunicationEfficiency: rand(55, 85),
    RitualNeed: rand(50, 80),
    QualityOfLife: rand(65, 95),
    FreedomNeed: rand(45, 75),
    Responsibility: rand(60, 90),
    DecisionSpeed: rand(55, 85),
    ConflictResolution: rand(50, 80),
    LongTermCommitment: rand(60, 90),
  };

  return {
    profile: { name, age, location: city, tagline, bio, lifestyle, cardDetail, idealMatch },
    metrics,
  };
}

interface AdminEditScreenProps {
  onExit: () => void;
}

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

// Codes to be excluded from matching, also reserved in admin panel
const RESERVED_MATCH_CODES = ['888', '999', '666', '520'];

const METRIC_CATEGORIES = [
  {
    title: "🧠 心智與決策偏好",
    keys: ["Rationality", "Spontaneity", "DecisionSpeed", "GrowthMindset"] as (keyof PersonalityMetrics)[]
  },
  {
    title: "❤️ 情感與家庭社交",
    keys: ["Extroversion", "EmotionalDependency", "SecurityNeed", "FamilyOrientation"] as (keyof PersonalityMetrics)[]
  },
  {
    title: "☕ 生活美學與理財",
    keys: ["Hedonism", "ConsumptionTendency", "FinancialMaturity", "QualityOfLife"] as (keyof PersonalityMetrics)[]
  },
  {
    title: "🏔️ 探索、自由與儀式",
    keys: ["Adventure", "FreedomNeed", "RitualNeed"] as (keyof PersonalityMetrics)[]
  },
  {
    title: "🤝 擔當、溝通與維繫",
    keys: ["Dominance", "Responsibility", "CommunicationEfficiency", "ConflictResolution", "LongTermCommitment"] as (keyof PersonalityMetrics)[]
  }
];

type AdminTab = "gentlemen" | "ladies" | "analytics";

interface IpNoteCellProps {
  ip: string;
  initialNote: string;
  onSave: (ip: string, newNote: string) => void;
}

function IpNoteCell({ ip, initialNote, onSave }: IpNoteCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote);

  React.useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  const handleSave = () => {
    setIsEditing(false);
    if (note !== initialNote) {
      onSave(ip, note);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setNote(initialNote);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={note}
        onChange={e => setNote(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full bg-white border border-brand-border rounded px-2 py-0.5 text-[11px] font-semibold text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-olive"
        placeholder="輸入備註 (Enter 儲存)"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-brand-beige/30 hover:text-brand-dark px-2 py-1 rounded transition-all min-h-[22px] flex items-center text-brand-muted italic"
      title="點擊以編輯備註"
    >
      {note ? (
        <span className="font-sans not-italic text-brand-dark font-medium">{note}</span>
      ) : (
        <span className="text-[10px] text-brand-light font-normal">+ 新增備註</span>
      )}
    </div>
  );
}

export default function AdminEditScreen({ onExit }: AdminEditScreenProps) {
  // Load global data from context
  const { profiles, metrics: allMetrics, adminCodes, gentlemanEditCodes, refreshData, isDataLoading, setOptimisticData } = useData();

  // Main tab state
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

  // --- Ladies Panel State ---
  const [ladies, setLadies] = useState<LadyProfile[]>([]);
  const [ladiesLoading, setLadiesLoading] = useState(false);
  const [ladiesError, setLadiesError] = useState("");
  const [editLady, setEditLady] = useState<LadyProfile | null>(null);
  const [ladyEditMembership, setLadyEditMembership] = useState("");
  const [ladyEditAsset, setLadyEditAsset] = useState("");
  const [ladyEditNotes, setLadyEditNotes] = useState("");
  const [ladyEditName, setLadyEditName] = useState("");
  const [ladyEditMatchedCode, setLadyEditMatchedCode] = useState("");
  const [ladyEditUnlockedCodes, setLadyEditUnlockedCodes] = useState<string[]>([]);
  const [clearUnlockedOnDowngrade, setClearUnlockedOnDowngrade] = useState(true);
  const [ladyEditSaving, setLadyEditSaving] = useState(false);
  const [ladyEditMsg, setLadyEditMsg] = useState("");
  const [ladySearchQuery, setLadySearchQuery] = useState("");
  const [ladyFilterMembership, setLadyFilterMembership] = useState("all");
  const [ladyFilterAsset, setLadyFilterAsset] = useState("all");
  const [ladyFilterQuiz, setLadyFilterQuiz] = useState("all");
  const [ladySortField, setLadySortField] = useState<string>("createdAt");
  const [ladySortDirection, setLadySortDirection] = useState<"asc" | "desc">("desc");
  const [colFilterName, setColFilterName] = useState("");
  const [colFilterMatch, setColFilterMatch] = useState("");
  const [colFilterIp, setColFilterIp] = useState("");
  const [colFilterDevice, setColFilterDevice] = useState("");
  const [colFilterNotes, setColFilterNotes] = useState("");

  // --- Visits/Analytics State ---
  interface VisitSummaryItem {
    ipAddress: string;
    totalVisits: number;
    uniqueDevicesCount: number;
    deviceIds?: string[];
    lastVisit: string;
    userAgent: string;
  }
  const [visitsData, setVisitsData] = useState<{ summary: VisitSummaryItem[]; totalLogs: number } | null>(null);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [ipMetadataList, setIpMetadataList] = useState<IpMetadataItem[]>([]);
  const [visitFilter, setVisitFilter] = useState<"all" | "quiz_completed" | "quiz_not_completed">("all");

  const loadLadies = React.useCallback(async () => {
    if (!adminCodes[0]) return;
    setLadiesLoading(true);
    setLadiesError("");
    try {
      const data = await fetchAllLadies(adminCodes[0]);
      setLadies(data);
    } catch (e: unknown) {
      setLadiesError(e instanceof Error ? e.message : "獲取失敗");
    } finally {
      setLadiesLoading(false);
    }
  }, [adminCodes]);

  const loadVisits = React.useCallback(async () => {
    if (!adminCodes[0]) return;
    setVisitsLoading(true);
    try {
      const [data, metadata] = await Promise.all([
        fetchAdminVisits(adminCodes[0]),
        fetchIpMetadata(adminCodes[0])
      ]);
      setVisitsData(data);
      setIpMetadataList(metadata);
    } catch (e) {
      console.error("Failed to load visits or IP metadata", e);
    } finally {
      setVisitsLoading(false);
    }
  }, [adminCodes]);

  const handleSaveIpMetadata = async (ipAddress: string, updates: { note?: string; isExcluded?: boolean }) => {
    if (!adminCodes[0]) return;
    try {
      const updated = await updateIpMetadata(adminCodes[0], ipAddress, updates);
      setIpMetadataList(prev => {
        const idx = prev.findIndex(item => item.ipAddress === ipAddress);
        if (idx >= 0) {
          const newMetadataList = [...prev];
          newMetadataList[idx] = updated;
          return newMetadataList;
        } else {
          return [...prev, updated];
        }
      });
    } catch (e) {
      console.error("Failed to update IP metadata", e);
    }
  };

  const handleSort = (field: string) => {
    if (ladySortField === field) {
      setLadySortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setLadySortField(field);
      setLadySortDirection("asc");
    }
  };

  React.useEffect(() => {
    if (activeTab === "ladies") {
      void loadLadies();
    } else if (activeTab === "analytics") {
      void loadLadies();
      void loadVisits();
    }
  }, [activeTab, loadLadies, loadVisits]);

  const handleOpenEditLady = (lady: LadyProfile) => {
    setEditLady(lady);
    setLadyEditMembership(lady.membershipLevel || "free");
    setLadyEditAsset(lady.assetVerified || "none");
    setLadyEditNotes(lady.notes || "");
    setLadyEditName(lady.name || "");
    setLadyEditMatchedCode(lady.matchedGentlemanCode || "");
    setLadyEditUnlockedCodes(lady.unlockedGentlemanCodes || []);
    setClearUnlockedOnDowngrade(true);
    setLadyEditMsg("");
  };

  const handleSaveLady = async () => {
    if (!editLady || !adminCodes[0]) return;
    setLadyEditSaving(true);
    try {
      let unlockedGentlemanCodes = ladyEditUnlockedCodes;
      const shouldClearUnlocked = clearUnlockedOnDowngrade && (ladyEditAsset === "none" || ladyEditAsset === "pending");
      if (shouldClearUnlocked) {
        unlockedGentlemanCodes = [];
      }

      const updated = await updateLadyByAdmin(
        editLady.code,
        { 
          membershipLevel: ladyEditMembership, 
          assetVerified: ladyEditAsset, 
          notes: ladyEditNotes,
          name: ladyEditName,
          matchedGentlemanCode: ladyEditMatchedCode || null,
          unlockedGentlemanCodes
        },
        adminCodes[0]
      );
      setLadies(prev => prev.map(l => l.code === updated.code ? updated : l));
      setLadyEditMsg("已儲存！");
      setTimeout(() => { setEditLady(null); setLadyEditMsg(""); }, 1200);
    } catch (e: unknown) {
      setLadyEditMsg(e instanceof Error ? e.message : "儲存失敗");
    } finally {
      setLadyEditSaving(false);
    }
  };

  const handleApprovePhoto = async () => {
    if (!editLady || !adminCodes[0] || !editLady.pendingPhotoUrl) return;
    setLadyEditSaving(true);
    try {
      const updated = await updateLadyByAdmin(
        editLady.code,
        { photoUrl: editLady.pendingPhotoUrl },
        adminCodes[0]
      );
      setEditLady(updated);
      setLadies(prev => prev.map(l => l.code === updated.code ? updated : l));
      setLadyEditMsg("頭像申請已批准！");
    } catch (e: unknown) {
      setLadyEditMsg(e instanceof Error ? e.message : "批准失敗");
    } finally {
      setLadyEditSaving(false);
    }
  };

  const handleRejectPhoto = async () => {
    if (!editLady || !adminCodes[0]) return;
    setLadyEditSaving(true);
    try {
      const updated = await updateLadyByAdmin(
        editLady.code,
        { pendingPhotoUrl: "" },
        adminCodes[0]
      );
      setEditLady(updated);
      setLadies(prev => prev.map(l => l.code === updated.code ? updated : l));
      setLadyEditMsg("已拒絕頭像更換申請");
    } catch (e: unknown) {
      setLadyEditMsg(e instanceof Error ? e.message : "拒絕失敗");
    } finally {
      setLadyEditSaving(false);
    }
  };

  const handleDeleteLady = async (code: string, name: string) => {
    if (!adminCodes[0]) return;
    setConfirmModal({
      show: true,
      title: "永久刪除麗人帳號",
      message: `確定要永久刪除麗人「${name}」的帳號嗎？此動作無法復原。`,
      onConfirm: async () => {
        try {
          await deleteLadyByAdmin(code, adminCodes[0]);
          setLadies(prev => prev.filter(l => l.code !== code));
          setSuccessMessage(`麗人「${name}」的帳號已永久刪除。`);
          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (e: unknown) {
          setErrorMessage(e instanceof Error ? e.message : "刪除失敗");
          setTimeout(() => setErrorMessage(""), 4000);
        }
      }
    });
  };

  // --- Gentlemen Panel State ---
  // Currently selected profile to edit
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Consolidated form state for the selected profile
  const [editData, setEditData] = useState(() => {
    if (!profiles || Object.keys(profiles).length === 0) {
      return { ...Object.values(DEFAULT_PROFILES)[0], lifestyleStr: "" };
    }
    const prof = profiles[selectedCode] || DEFAULT_PROFILES[selectedCode] || Object.values(DEFAULT_PROFILES)[0];
    return {
      ...prof,
      lifestyleStr: prof.lifestyle.join(", "),
      isAcceptingMatches: prof.isAcceptingMatches ?? true, // Default to true
    };
  });

  // Admin slider preview index
  const [adminPreviewIndex, setAdminPreviewIndex] = useState(0);

  // Add Member Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    needsInput?: boolean;
    inputPlaceholder?: string;
    onConfirm: (inputText?: string) => void;
  }>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [confirmInputText, setConfirmInputText] = useState("");
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");

  // Admin Custom Login Code states
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [adminCodeSuccess, setAdminCodeSuccess] = useState("");

  // Gentleman Card Edit Password states
  const [gentlemanCodeInput, setGentlemanCodeInput] = useState("");
  const [gentlemanCodeSuccess, setGentlemanCodeSuccess] = useState("");

  // Local state for editing metrics of the selected profile
  const [currentMetrics, setCurrentMetrics] = useState<PersonalityMetrics>({});

  // Set initial selected code once data is loaded
  React.useEffect(() => {
    if (!isDataLoading && Object.keys(profiles).length > 0 && !selectedCode) {
      setSelectedCode(Object.keys(profiles)[0] || "monkeyB");
    }
  }, [isDataLoading, profiles, selectedCode]);

  // Update form data when selected profile changes
  React.useEffect(() => {
    const prof = profiles[selectedCode] || Object.values(profiles)[0] || DEFAULT_PROFILES[selectedCode] || Object.values(DEFAULT_PROFILES)[0];
    setEditData({
      ...prof,
      lifestyleStr: prof.lifestyle.join(", "),
      isAcceptingMatches: prof.isAcceptingMatches ?? true,
    });
    
    const metr = allMetrics[selectedCode] || DEFAULT_METRICS[selectedCode] || Object.values(DEFAULT_METRICS)[0];
    setCurrentMetrics({ ...metr });
    
    setAdminPreviewIndex(0);
    setSuccessMessage("");
    setErrorMessage("");
  }, [selectedCode, profiles, allMetrics]); // Keep dependencies, as they trigger re-sync

  const handleSelectProfile = (code: string) => {
    setSelectedCode(code);
    // The useEffect hook will handle updating the form state
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleImageUrlsChange = (index: number, value: string) => {
    const updated = [...editData.imageUrls];
    updated[index] = value;
    setEditData(prev => ({ ...prev, imageUrls: updated }));
  };

  const addImageUrlField = () => {
    setEditData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const removeImageUrlField = (index: number) => {
    const updated = editData.imageUrls.filter((_, idx) => idx !== index);
    setEditData(prev => ({ ...prev, imageUrls: updated }));
    if (adminPreviewIndex >= updated.length) {
      setAdminPreviewIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    setSuccessMessage("正在從伺服器強制同步最新資料...");
    await refreshData();
    setIsRefreshing(false);
    setSuccessMessage("強制同步完成！");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  // Securely sync all changes with the backend
  const handleSync = async (
    updatedProfiles: Record<string, Profile>,
    updatedMetrics: Record<string, PersonalityMetrics>,
    updatedAdminCodes: string[],
    updatedGentlemanEditCodes?: string[]
  ): Promise<{ success: boolean; message: string }> => {
    // 管理員已登入，直接使用記憶體中的管理員編號，不再對用戶彈出輸入框
    const adminCode = adminCodes[0];
    if (!adminCode) {
      const msg = "未找到管理員編號，請重新登入。";
      setErrorMessage(msg);
      return { success: false, message: msg };
    }
    const { success, message } = await syncSharedConfig({
      profiles: updatedProfiles,
      metrics: updatedMetrics,
      adminCodes: updatedAdminCodes,
      gentlemanEditCodes: updatedGentlemanEditCodes ?? gentlemanEditCodes
    }, adminCode);
    return { success, message };
  };

  const [isSaving, setIsSaving] = React.useState(false);

  // 自動儲存：可不傳入強制覆寫的編輯資料
  // 自動儲存：可不傳入強制覆寫的編輯資料
  const handleAutoSave = async (overrideEditData?: typeof editData, overrideMetrics?: PersonalityMetrics) => {
    const data = overrideEditData ?? editData;
    const metricsToUse = overrideMetrics ?? currentMetrics;
    const finalCode = data.code.trim();
    if (!finalCode) { setErrorMessage("登入編號不可為空"); return; }
    if (!data.name.trim()) { setErrorMessage("姓名不可為空"); return; }
    if (adminCodes.includes(finalCode) || RESERVED_MATCH_CODES.includes(finalCode)) {
      setErrorMessage(`編號「${finalCode}」為管理員或系統保留編號，請使用其他編號`);
      return;
    }
    if (finalCode !== selectedCode && profiles[finalCode]) {
      setErrorMessage(`編號「${finalCode}」已被紳士「${profiles[finalCode].name}」使用，請更換其他編號`);
      return;
    }

    const cleanImageUrls = data.imageUrls.map(url => url.trim()).filter(url => url.length > 0);
    const mainImageUrl = cleanImageUrls[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";

    const updatedProfile: Profile = {
      code: finalCode,
      name: data.name.trim(),
      age: Number(data.age) || 25,
      location: data.location.trim(),
      tagline: data.tagline.trim(),
      bio: data.bio.trim(),
      lifestyle: data.lifestyleStr.split(",").map(t => t.trim()).filter(t => t.length > 0),
      imageUrl: mainImageUrl,
      imageUrls: cleanImageUrls.length > 0 ? cleanImageUrls : [mainImageUrl],
      cardDetail: data.cardDetail.trim(),
      idealMatch: data.idealMatch.trim(),
      contactLineUrl: data.contactLineUrl.trim(),
      isAcceptingMatches: data.isAcceptingMatches ?? true,
    };

    const newProfiles = { ...profiles };
    if (finalCode !== selectedCode) { delete newProfiles[selectedCode]; }
    newProfiles[finalCode] = updatedProfile;

    const newMetrics = { ...allMetrics };
    if (finalCode !== selectedCode) { delete newMetrics[selectedCode]; }
    newMetrics[finalCode] = { ...metricsToUse };

    setIsSaving(true);
    const result = await handleSync(newProfiles, newMetrics, adminCodes);
    setIsSaving(false);

    if (!result || !result.success) {
      setErrorMessage(result?.message || "儲存失敗，請檢查網路或管理員編號。");
      setSuccessMessage("");
      return;
    }

    // 立即更新本地 profiles 狀態（樂觀更新），防止 useEffect 用舊資料把 toggle 蓋回
    setOptimisticData({ profiles: newProfiles, metrics: newMetrics });
    // 背景同步 server 最新資料，不 await 避免再次觸發閃回
    void refreshData();

    if (finalCode !== selectedCode) {
      setSelectedCode(finalCode);
    }
    setErrorMessage("");
    setSuccessMessage(`「${data.name} (${finalCode})」已儲存。`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Reset current profile to default values
  const handleResetToDefault = async () => {
    const currentProfile = profiles[selectedCode];
    const originalDefaultCode = Object.keys(DEFAULT_PROFILES).find(
      key => DEFAULT_PROFILES[key].name === currentProfile.name
    ) || selectedCode;

    setConfirmModal({
      show: true,
      title: "重設紳士角色為預設值",
      message: `確定要將「${currentProfile?.name}」恢復為系統預設值與預設編號 (${originalDefaultCode}) 嗎？此動作將會替換您當前對該角色的修改。`,
      onConfirm: async () => {
        const defaultProf = DEFAULT_PROFILES[originalDefaultCode] || Object.values(DEFAULT_PROFILES)[0];
        const defaultMetr = DEFAULT_METRICS[originalDefaultCode] || Object.values(DEFAULT_METRICS)[0];
        
        const newProfiles = { ...profiles };
        const newMetrics = { ...allMetrics };

        // Delete active key
        delete newProfiles[selectedCode];
        delete newMetrics[selectedCode];

        // Restore default key
        newProfiles[originalDefaultCode] = defaultProf;
        newMetrics[originalDefaultCode] = defaultMetr;

        const result = await handleSync(newProfiles, newMetrics, adminCodes);
        if (!result || !result.success) {
          setErrorMessage(result?.message || "重設失敗！");
          setSuccessMessage("");
          return;
        }

        await refreshData();
        setSelectedCode(originalDefaultCode);
        setErrorMessage("");
        setSuccessMessage("已成功恢復該角色的預設檔案與特質設定。");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    });
  };

  // Reset ALL profiles to system defaults
  const handleResetAllToDefault = async () => {
    const confirmationMessage = "確定要將【所有紳士成員】的資料庫恢復為系統內建的預設值嗎？此動作將會清除所有您手動新增或修改的紳士資料，並將資料庫重設回 4 位內建角色，您設定的管理密碼將保留。此操作無法復原！";
    
    setConfirmModal({
      show: true,
      title: "系統重置與救援",
      message: confirmationMessage,
      needsInput: true,
      inputPlaceholder: "請輸入您的管理員密碼進行授權",
      onConfirm: async (adminCode) => {
        if (!adminCode || !adminCode.trim()) {
          setErrorMessage("未提供管理員密碼，操作已取消。");
          return;
        }

        const result = await resetDatabaseToDefaults(adminCode.trim(), adminCodes, gentlemanEditCodes);
        if (!result || !result.success) {
          setErrorMessage(result?.message || "全部重設失敗！");
          setSuccessMessage("");
          return;
        }

        await refreshData();
        const defaultCode = Object.keys(DEFAULT_PROFILES)[0];
        setSelectedCode(defaultCode);

        setErrorMessage("");
        setSuccessMessage("所有角色檔案與特質指標皆已成功重置為系統初始預設值！");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    });
  };

  const handleUpdateAdminCode = async () => {
    const code = adminCodeInput.trim();
    if (!code) {
      setAdminCodeSuccess("請輸入有效的編號");
      return;
    }
    
    // Check if code is already a gentleman's login code
    if (profiles[code]) {
      setAdminCodeSuccess(`錯誤：此編號「${code}」已被紳士「${profiles[code].name}」佔用！`);
      return;
    }

    const result = await handleSync(profiles, allMetrics, [code]);
    if (!result || !result.success) {
      setAdminCodeSuccess(`錯誤：${result?.message}`);
      return;
    }

    setAdminCodeSuccess(`管理員編號已更換為「${code}」！`);
    setTimeout(() => setAdminCodeSuccess(""), 4000);
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCode.trim();
    const nameVal = newName.trim();
    
    if (!code) {
      setAddError("編號不可為空");
      return;
    }
    if (!nameVal) {
      setAddError("姓名不可為空");
      return;
    }
    if (adminCodes.includes(code) || RESERVED_MATCH_CODES.includes(code)) {
      setAddError(`編號「${code}」為管理員或系統保留編號，請使用其他編號`);
      return;
    }
    if (profiles[code]) {
      setAddError(`編號 「${code}」 已被紳士 「${profiles[code].name}」 使用`);
      return;
    }

    // Create default profile skeleton for this new gentleman
    const newProfile: Profile = {
      code,
      name: nameVal,
      age: 28,
      location: "台北市",
      tagline: "新加入的尊榮紳士",
      bio: "熱愛生活，期待與妳來一場靈魂共鳴的深度對話。",
      lifestyle: ["美學生活", "深度對談"],
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
      imageUrls: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"],
      cardDetail: "品味生活與事業平衡的菁英紳士。",
      idealMatch: "知性優雅、注重精神共鳴的女性。",
      contactLineUrl: "https://line.me",
      isAcceptingMatches: true,
    };

    // Default metrics (balanced 50 for all fields)
    const newMetricSet: PersonalityMetrics = {
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

    const updatedProfiles = { ...profiles, [code]: newProfile };
    const updatedMetrics = { ...allMetrics, [code]: newMetricSet };

    const result = await handleSync(updatedProfiles, updatedMetrics, adminCodes);
    if (!result || !result.success) {
      setAddError(result?.message || "新增失敗！");
      return;
    }
    // Re-fetch to get the latest state including the new profile
    await refreshData();

    setShowAddModal(false);
    handleSelectProfile(code);
    setSuccessMessage(`成功新增紳士成員 「${nameVal} (${code})」！`);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleDeleteProfile = async (codeToDelete: string) => {
    if (Object.keys(DEFAULT_PROFILES).includes(codeToDelete)) {
      setErrorMessage("此為系統內建的預設紳士，不允許刪除。");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setConfirmModal({
      show: true,
      title: "永久刪除紳士檔案",
      message: `確定要永久刪除紳士成員 「${profiles[codeToDelete]?.name || codeToDelete}」 嗎？此動作無法復原。`,
      onConfirm: async () => {
        const updatedProfiles = { ...profiles };
        const updatedMetrics = { ...allMetrics };

        delete updatedProfiles[codeToDelete];
        delete updatedMetrics[codeToDelete];

        const result = await handleSync(updatedProfiles, updatedMetrics, adminCodes);
        if (!result || !result.success) {
          setErrorMessage(result?.message || "刪除失敗！");
          setSuccessMessage("");
          return;
        }

        await refreshData();

        // Select first remaining profile
        const fallbackCode = Object.keys(updatedProfiles)[0] || Object.keys(DEFAULT_PROFILES)[0] || "monkeyB";
        handleSelectProfile(fallbackCode);

        setSuccessMessage("該紳士成員已成功移除。");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    });
  };

  if (isDataLoading) {
    return <div className="text-center p-20 font-serif text-brand-olive">正在從伺服器同步主控台資料...</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-brand-beige py-12 px-4 md:px-12 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-brand-olive/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* Header Dashboard Banner */}
        <div className="bg-brand-dark text-brand-beige p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-brand-olive/20">
          <div className="space-y-1">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-accent font-bold">
              Yuan-Yu Administration // 緣友運營主控台
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-white">
              緣友全域運營主控台
            </h1>
            <p className="text-xs text-brand-light/90 max-w-xl leading-relaxed">
              管理紳士檔案、麗人帳號，並可視化查看平台訪問量、地區分佈與答題人數。
            </p>
          </div>

          <div className="flex flex-col gap-3 self-start md:self-center shrink-0">
            <button
              id="btn-admin-force-refresh"
              type="button"
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-brand-accent/50 rounded-full text-xs font-bold tracking-widest text-brand-accent hover:text-white hover:border-brand-accent hover:bg-brand-accent/80 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? '同步中...' : '強制同步資料'}</span>
            </button>
            <button
              id="btn-admin-exit"
              type="button"
              onClick={onExit}
              className="flex items-center justify-center gap-2 px-5 py-2.5 border border-brand-light/30 rounded-full text-xs font-bold tracking-widest text-brand-light hover:text-brand-accent hover:border-brand-accent hover:bg-brand-olive/20 transition-all duration-300 cursor-pointer hover:scale-103 active:scale-97"
            >
              <LogOut className="w-4 h-4" />
              <span>退出主控台</span>
            </button>
          </div>
        </div>

        {/* ===== MAIN TAB SWITCHER ===== */}
        <div className="bg-white p-2 rounded-2xl shadow-md border border-brand-border/60 flex gap-2">
          {([
            { id: "analytics" as AdminTab, icon: <BarChart2 className="w-4 h-4" />, label: "可視化儀表板" },
            { id: "ladies" as AdminTab, icon: <Users className="w-4 h-4" />, label: "名媛帳號管理" },
            { id: "gentlemen" as AdminTab, icon: <User className="w-4 h-4" />, label: "紳士檔案管理" },
          ] as { id: AdminTab; icon: React.ReactNode; label: string }[]).map(tab => (
            <button
              key={tab.id}
              id={`btn-admin-main-tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-brand-dark text-white shadow-md"
                  : "text-brand-olive hover:bg-brand-beige/60"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ===== GENTLEMEN TAB ===== */}
        {activeTab === "gentlemen" && (
        <div className="flex flex-col gap-8">

        {/* Profile Tabs Selector */}
        <div className="bg-white p-3 rounded-2xl md:rounded-full shadow-md border border-brand-border/60 flex flex-col md:flex-row gap-2">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-muted px-4 py-2 flex items-center shrink-0">
            選擇欲編輯的紳士：
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-row flex-wrap flex-1 gap-2">
            {Object.keys(profiles).map((code) => {
              const currentProfData = profiles[code] || DEFAULT_PROFILES[code];
              const isSelected = selectedCode === code;
              return (
                <button
                  key={code}
                  id={`btn-admin-tab-${code}`}
                  type="button"
                  onClick={() => handleSelectProfile(code)}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl md:rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-brand-olive text-white shadow-md scale-102"
                      : "bg-brand-beige/40 hover:bg-brand-beige/80 text-brand-olive border border-brand-border"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{currentProfData.name} ({code})</span>
                </button>
              );
            })}

            <button
              id="btn-admin-add-tab"
              type="button"
              onClick={() => {
                setNewCode("");
                setNewName("");
                setAddError("");
                setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl md:rounded-full text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer bg-brand-accent/20 hover:bg-brand-accent/40 text-brand-dark border border-brand-accent shadow-sm hover:scale-103 active:scale-97"
              title="新增一位尊榮紳士成員"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增紳士</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: LIVE PREVIEW & GENERAL OPERATIONS (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Live Profile Card Preview */}
            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-brand-border/60 flex flex-col gap-4 relative overflow-hidden">
              <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase border-b border-brand-border pb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-olive fill-current" />
                <span>實時卡片預覽</span>
              </h3>
              
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner border border-brand-border bg-brand-beige/50 group">
                {editData.imageUrls && editData.imageUrls.length > 0 ? (
                  <>
                    <img
                      src={editData.imageUrls[adminPreviewIndex] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"}
                      alt={editData.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
                      }}
                    />

                    {editData.imageUrls.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setAdminPreviewIndex(prev => prev === 0 ? editData.imageUrls.length - 1 : prev - 1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-dark p-1.5 rounded-full shadow cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminPreviewIndex(prev => prev === editData.imageUrls.length - 1 ? 0 : prev + 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-brand-dark p-1.5 rounded-full shadow cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                          {editData.imageUrls.map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === adminPreviewIndex ? "bg-brand-accent w-3" : "bg-white/50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-brand-light gap-2">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[10px] font-medium font-mono">未選擇圖片網址</span>
                  </div>
                )}
                
                <div className="absolute top-3 left-3 bg-brand-olive text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  編號: {selectedCode}
                </div>
              </div>

              <div className="space-y-1.5 text-center mt-1">
                <h4 className="font-serif text-lg font-bold text-brand-dark flex items-center justify-center gap-1.5">
                  <span>{editData.name || "未命名"}</span>
                  <span className="text-sm text-brand-muted">({editData.age || "—"}歲)</span>
                </h4>
                <div className="flex items-center justify-center gap-1 text-[11px] text-brand-light font-bold">
                  <MapPin className="w-3 h-3 text-brand-olive" />
                  <span>{editData.location || "未知"}</span>
                </div>
                <p className="text-xs text-brand-muted italic px-2 pt-1 line-clamp-2">
                  &ldquo;{editData.tagline || "尚未設定形象標籤..."}&rdquo;
                </p>
              </div>

              <div className="mt-2 bg-brand-border/20 p-3 rounded-xl border border-brand-border/40 space-y-1.5">
                <div className="text-[9px] text-brand-light font-bold uppercase tracking-wider">風格標籤：</div>
                <div className="flex flex-wrap gap-1">
                  {editData.lifestyleStr.split(",").map((t, idx) => {
                    const cleanTag = t.trim();
                    if (!cleanTag) return null;
                    return (
                      <span key={idx} className="bg-white border border-brand-border text-[9px] font-bold text-brand-olive px-2 py-0.5 rounded">
                        {cleanTag}
                      </span>
                    );
                  })}
                  {!editData.lifestyleStr.trim() && <span className="text-[9px] text-brand-light italic">無標籤</span>}
                </div>
              </div>

              {/* 自動生成按鈕 */}
              <button
                id="btn-admin-auto-generate"
                type="button"
                onClick={() => {
                  const { profile: genProfile, metrics: genMetrics } = generateTaiwanGentlemanData();
                  const updatedData = {
                    ...editData,
                    name: genProfile.name,
                    age: genProfile.age,
                    location: genProfile.location,
                    tagline: genProfile.tagline,
                    bio: genProfile.bio,
                    lifestyle: genProfile.lifestyle,
                    lifestyleStr: genProfile.lifestyle.join(", "),
                    cardDetail: genProfile.cardDetail,
                    idealMatch: genProfile.idealMatch,
                  };
                  setEditData(updatedData);
                  setCurrentMetrics(genMetrics);
                  void handleAutoSave(updatedData, genMetrics);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-olive to-[#5a5a3a] hover:from-[#4d4d36] hover:to-brand-olive text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-99 shadow-md"
              >
                <Wand2 className="w-4 h-4" />
                <span>✨ 自動生成台灣男賓資料</span>
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-brand-border/60 space-y-4">
              <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase border-b border-brand-border pb-3">
                系統重設與救援
              </h3>
              
              {!Object.keys(DEFAULT_PROFILES).includes(selectedCode) ? (
                <button
                  id="btn-admin-delete-current"
                  type="button"
                  onClick={() => handleDeleteProfile(selectedCode)}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-99 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>永久刪除此新增紳士</span>
                </button>
              ) : (
                <button
                  id="btn-admin-reset-current"
                  type="button"
                  onClick={handleResetToDefault}
                  className="w-full py-3 px-4 bg-brand-beige border border-brand-border/80 hover:bg-brand-border/30 text-brand-olive text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-99"
                >
                  <RotateCcw className="w-4 h-4 text-brand-olive" />
                  <span>重設當前紳士為預設值</span>
                </button>
              )}

              <button
                id="btn-admin-reset-all"
                type="button"
                onClick={handleResetAllToDefault}
                className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-99"
              >
                <RotateCcw className="w-4 h-4 text-red-700" />
                <span>重設所有為系統預設值</span>
              </button>
            </div>

            {/* 系統安全密碼管理（包含主控與紳士編輯密碼更換） */}
            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-brand-border/60 space-y-6">
              
              {/* Part 1: 主控安全登入密碼 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
                  <h3 className="font-serif text-xs font-bold text-brand-dark tracking-wider uppercase flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-brand-olive" />
                    <span>主控管理安全密碼</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-brand-olive bg-brand-beige border border-brand-border px-2.5 py-0.5 rounded-lg shadow-sm">
                    {adminCodes[0] || "admin"}
                  </span>
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed">
                  管理員登入本主控台所使用的授權密碼。
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminCodeInput}
                    onChange={(e) => {
                      setAdminCodeInput(e.target.value);
                      setAdminCodeSuccess("");
                    }}
                    placeholder="輸入新主控密碼..."
                    className="flex-1 min-w-0 bg-brand-beige/40 border border-brand-border rounded-xl px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const cleanInput = adminCodeInput.trim();
                      if (!cleanInput) {
                        setAdminCodeSuccess("請輸入有效的密碼");
                        return;
                      }
                      if (cleanInput === adminCodes[0]) {
                        setAdminCodeSuccess("新密碼與當前密碼相同");
                        return;
                      }
                      if (profiles[cleanInput]) {
                        setAdminCodeSuccess(`錯誤：此密碼「${cleanInput}」與紳士編號重複！`);
                        return;
                      }
                      // 直接更換（將陣列置換為僅含新密碼）
                      const result = await handleSync(profiles, allMetrics, [cleanInput]);
                      if (result && result.success) {
                        setAdminCodeInput("");
                        setAdminCodeSuccess(`主控密碼已變更為「${cleanInput}」！`);
                        setTimeout(() => setAdminCodeSuccess(""), 4000);
                      } else {
                        setAdminCodeSuccess(`錯誤：${result?.message}`);
                      }
                    }}
                    className="py-1.5 px-3 bg-brand-olive hover:bg-[#4d4d36] text-white text-[11px] font-bold rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    更換
                  </button>
                </div>
                {adminCodeSuccess && (
                  <p className="text-[10px] text-brand-olive font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                    <span>{adminCodeSuccess}</span>
                  </p>
                )}
              </div>

              {/* Part 2: 紳士編輯卡片密碼 */}
              <div className="space-y-3 pt-3 border-t border-brand-border">
                <div className="flex items-center justify-between pb-2.5">
                  <h3 className="font-serif text-xs font-bold text-brand-dark tracking-wider uppercase flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-brand-olive" />
                    <span>紳士編輯與對話密碼</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-brand-olive bg-brand-beige border border-brand-border px-2.5 py-0.5 rounded-lg shadow-sm">
                    {gentlemanEditCodes[0] || "8888"}
                  </span>
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed">
                  紳士在卡片點擊「編輯資料與回覆消息」所需的安全驗證密碼。
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gentlemanCodeInput}
                    onChange={(e) => {
                      setGentlemanCodeInput(e.target.value);
                      setGentlemanCodeSuccess("");
                    }}
                    placeholder="輸入新紳士密碼..."
                    className="flex-1 min-w-0 bg-brand-beige/40 border border-brand-border rounded-xl px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const cleanInput = gentlemanCodeInput.trim();
                      if (!cleanInput) {
                        setGentlemanCodeSuccess("請輸入有效的密碼");
                        return;
                      }
                      if (cleanInput === gentlemanEditCodes[0]) {
                        setGentlemanCodeSuccess("新密碼與當前密碼相同");
                        return;
                      }
                      if (profiles[cleanInput]) {
                        setGentlemanCodeSuccess(`錯誤：此密碼「${cleanInput}」與紳士編號重複！`);
                        return;
                      }
                      // 直接更換（將陣列置換為僅含新密碼）
                      const result = await handleSync(profiles, allMetrics, adminCodes, [cleanInput]);
                      if (result && result.success) {
                        setGentlemanCodeInput("");
                        setGentlemanCodeSuccess(`紳士密碼已變更為「${cleanInput}」！`);
                        setTimeout(() => setGentlemanCodeSuccess(""), 4000);
                      } else {
                        setGentlemanCodeSuccess(`錯誤：${result?.message}`);
                      }
                    }}
                    className="py-1.5 px-3 bg-brand-olive hover:bg-[#4d4d36] text-white text-[11px] font-bold rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    更換
                  </button>
                </div>
                {gentlemanCodeSuccess && (
                  <p className="text-[10px] text-brand-olive font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                    <span>{gentlemanCodeSuccess}</span>
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAILED EDIT FORM (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-brand-border/60">
              
              <h3 className="font-serif text-lg font-bold text-brand-dark tracking-wider uppercase border-b border-brand-border pb-4 flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-brand-olive" />
                <span>編輯資料與 A-D 屬性：{editData.name} ({selectedCode})</span>
              </h3>

              <AnimatePresence mode="wait">
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-brand-accent/30 text-brand-olive border border-brand-accent rounded-xl flex items-start gap-2.5 text-xs font-bold"
                  >
                    <Check className="w-5 h-5 shrink-0 text-brand-olive" />
                    <div>{successMessage}</div>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs font-semibold"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-700" />
                    <div>{errorMessage}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 自動儲存狀態指示器 */}
              {isSaving && (
                <div className="fixed bottom-6 right-6 z-50 bg-brand-olive text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                  <Save className="w-3.5 h-3.5" />
                  <span>儲存中...</span>
                </div>
              )}

              <div id="form-admin-edit" className="space-y-8">
                
                {/* 1. Basic Fields Block including Dynamic Code */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-brand-olive pb-2 border-b border-brand-border/40">
                    第一部分：基本檔案設定
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <label htmlFor="admin-input-code" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                        登入編號 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="admin-input-code"
                        name="code"
                        type="text"
                        required
                        value={editData.code}
                        onChange={handleFormChange}
                        onBlur={() => void handleAutoSave()}
                        placeholder="例如：520"
                        className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label htmlFor="admin-input-name" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="admin-input-name"
                        name="name"
                        type="text"
                        required
                        value={editData.name}
                        onChange={handleFormChange}
                        onBlur={() => void handleAutoSave()}
                        placeholder="例如：彥廷"
                        className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label htmlFor="admin-input-age" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                        年齡
                      </label>
                      <input
                        id="admin-input-age"
                        name="age"
                        type="number"
                        required
                        min={18}
                        max={99}
                        value={editData.age}
                        onChange={handleFormChange}
                        onBlur={() => void handleAutoSave()}
                        placeholder="例如：27"
                        className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label htmlFor="admin-input-location" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                        居住城市
                      </label>
                      <input
                        id="admin-input-location"
                        name="location"
                        type="text"
                        required
                        value={editData.location}
                        onChange={handleFormChange}
                        onBlur={() => void handleAutoSave()}
                        placeholder="例如：台北市"
                        className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                      />
                    </div>
                  </div>
                  {/* Matching Availability Toggle */}
                  <div className="pt-4">
                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                      配對資格
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const next = !(editData.isAcceptingMatches ?? true);
                          const nextData = { ...editData, isAcceptingMatches: next };
                          setEditData(nextData);
                          void handleAutoSave(nextData);
                        }}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-olive ${
                          (editData.isAcceptingMatches ?? true) ? 'bg-brand-olive' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                            (editData.isAcceptingMatches ?? true) ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-brand-dark">
                        {(editData.isAcceptingMatches ?? true) ? '開啟：此紳士可被配對' : '關閉：此紳士暫不參與配對'}
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-light block mt-1.5 italic">
                      提示：關閉後，麗人進行「AI 靈魂共鳴測驗」時將不會配對到此位紳士。切換即自動儲存。
                    </span>
                  </div>
                </div>

                {/* 2. Multiple Photos URLs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                      形象照圖片集 <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addImageUrlField}
                      className="flex items-center gap-1 text-[10px] font-bold text-brand-olive hover:text-brand-dark bg-brand-border/40 hover:bg-brand-border px-2 py-1 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>新增照片網址</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {editData.imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="text-[10px] font-mono font-bold text-brand-light shrink-0 w-5">
                          #{index + 1}
                        </span>
                        <input
                          type="url"
                          required
                          value={url}
                          onChange={(e) => handleImageUrlsChange(index, e.target.value)}
                          onBlur={() => void handleAutoSave()}
                          placeholder="請輸入 Unsplash 圖片網址或任何公開圖片 CDN 連結"
                          className="flex-1 bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                        />
                        {editData.imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageUrlField(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                            title="刪除此張照片"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-light block italic">
                    提示：支援添加多張照片！首張照片將作為預設縮圖，使用者點擊即可在卡片上滑動切換照片。
                  </span>
                </div>

                {/* 3. Tagline */}
                <div>
                  <label htmlFor="admin-input-tagline" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                    個人形象標籤 / 一句話簡介
                  </label>
                  <input
                    id="admin-input-tagline"
                    name="tagline"
                    type="text"
                    required
                    value={editData.tagline}
                    onChange={handleFormChange}
                    onBlur={() => void handleAutoSave()}
                    placeholder="例如：溫柔沉穩、追求空間與生活美學的室內設計師"
                    className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                </div>

                {/* 4. Bio */}
                <div>
                  <label htmlFor="admin-input-bio" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                    關於我 (詳細個人自傳)
                  </label>
                  <textarea
                    id="admin-input-bio"
                    name="bio"
                    rows={3}
                    required
                    value={editData.bio}
                    onChange={handleFormChange}
                    onBlur={() => void handleAutoSave()}
                    placeholder="介紹他的工作背景、個性特質、愛好等詳細內容..."
                    className="w-full bg-brand-beige/40 border border-brand-border rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all leading-relaxed"
                  />
                </div>

                {/* 5. Lifestyle Tags */}
                <div>
                  <label htmlFor="admin-input-lifestyle" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                    生活美學標籤 (用逗號分隔，最多 5 個)
                  </label>
                  <input
                    id="admin-input-lifestyle"
                    name="lifestyleStr"
                    type="text"
                    required
                    value={editData.lifestyleStr}
                    onChange={handleFormChange}
                    onBlur={() => void handleAutoSave()}
                    placeholder="例如：室內設計, 黑膠唱片, 古典音樂, 咖啡美學"
                    className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                </div>

                {/* 6. Card Detail / Ideal Dating */}
                <div>
                  <label htmlFor="admin-input-card" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                    心中的完美約會場景 / 心願
                  </label>
                  <textarea
                    id="admin-input-card"
                    name="cardDetail"
                    rows={2}
                    required
                    value={editData.cardDetail}
                    onChange={handleFormChange}
                    onBlur={() => void handleAutoSave()}
                    placeholder="描述他理想中的第一次約會場景或渴望的心動互動..."
                    className="w-full bg-brand-beige/40 border border-brand-border rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all leading-relaxed"
                  />
                </div>

                {/* 7. Ideal Match */}
                <div>
                  <label htmlFor="admin-input-ideal" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                    期望遇見的理想對象特質
                  </label>
                  <textarea
                    id="admin-input-ideal"
                    name="idealMatch"
                    rows={2}
                    required
                    value={editData.idealMatch}
                    onChange={handleFormChange}
                    onBlur={() => void handleAutoSave()}
                    placeholder="描述他對女方性格、生活態度或頻率的深度期許..."
                    className="w-full bg-brand-beige/40 border border-brand-border rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all leading-relaxed"
                  />
                </div>

                {/* 8. Contact Line URL */}
                <div>
                  <label htmlFor="admin-input-line" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                    一鍵聯絡的專屬 LINE 客服連結
                  </label>
                  <input
                    id="admin-input-line"
                    name="contactLineUrl"
                    type="url"
                    required
                    value={editData.contactLineUrl}
                    onChange={handleFormChange}
                    onBlur={() => void handleAutoSave()}
                    placeholder="例如：https://line.me/R/ti/p/@yuanyu_v520"
                    className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                  <span className="text-[10px] text-brand-light block mt-1.5 italic">
                    提示：當麗人解鎖此紳士，並點選「一鍵 LINE 聯絡與心動開聊」時，將會跳轉至您輸入的這個 LINE 網址。
                  </span>
                </div>

                {/* SECTION 2: PERSONALITY METRICS ADJUSTMENT */}
                <div className="pt-6 border-t border-brand-border/60">
                  <h4 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase mb-3 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-olive" />
                    <span>第二部分：調整 A-D 特質配對屬性指標 (10 - 100)</span>
                  </h4>
                  <p className="text-xs text-brand-muted mb-6 leading-relaxed">
                    請拖曳滑桿來微調該紳士在 20 個維度的人格向量數值。數值越高，代表該特質越顯著。系統會將麗人答完測驗後的 20 維生活美學指標與此處設定的紳士向量進行「餘弦相似度 (Cosine Similarity)」比對，自動算出契合百分比。
                  </p>

                  {/* One-click style presets */}
                  <div className="bg-brand-olive/[0.04] border border-brand-olive/20 rounded-2xl p-4 md:p-5 mb-6 space-y-3.5">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-brand-olive uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-brand-accent" />
                        <span>快捷設定：一鍵套用 A-D 風格屬性預設值</span>
                      </span>
                      <span className="text-[10px] text-brand-light">
                        點選後將直接覆寫下方 20 個維度的指標數值
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (DEFAULT_METRICS["huaA"]) {
                            setCurrentMetrics({ ...DEFAULT_METRICS["huaA"] });
                            setSuccessMessage("已成功套用「策略操盤手 (鄭永昌)」的屬性指標！請記得點選最下方儲存。");
                            setTimeout(() => setSuccessMessage(""), 5000);
                          }
                        }}
                        className="py-2.5 px-3 bg-white hover:bg-brand-beige border border-brand-border rounded-xl text-left transition-all duration-300 shadow-sm hover:shadow active:scale-97 cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-brand-light uppercase tracking-wider">風格預設 1</div>
                        <div className="text-[11px] font-bold text-brand-dark mt-0.5 truncate">策略操盤手 (鄭永昌)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (DEFAULT_METRICS["monkeyB"]) {
                            setCurrentMetrics({ ...DEFAULT_METRICS["monkeyB"] });
                            setSuccessMessage("已成功套用「新能源企業創辦人 (葉家銘)」的屬性指標！請記得點選最下方儲存。");
                            setTimeout(() => setSuccessMessage(""), 5000);
                          }
                        }}
                        className="py-2.5 px-3 bg-white hover:bg-brand-beige border border-brand-border rounded-xl text-left transition-all duration-300 shadow-sm hover:shadow active:scale-97 cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-brand-light uppercase tracking-wider">風格預設 2</div>
                        <div className="text-[11px] font-bold text-brand-dark mt-0.5 truncate">新能源企業創辦人 (葉家銘)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (DEFAULT_METRICS["daiC"]) {
                            setCurrentMetrics({ ...DEFAULT_METRICS["daiC"] });
                            setSuccessMessage("已成功套用「工程經理 (吴建铭)」的屬性指標！請記得點選最下方儲存。");
                            setTimeout(() => setSuccessMessage(""), 5000);
                          }
                        }}
                        className="py-2.5 px-3 bg-white hover:bg-brand-beige border border-brand-border rounded-xl text-left transition-all duration-300 shadow-sm hover:shadow active:scale-97 cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-brand-light uppercase tracking-wider">風格預設 3</div>
                        <div className="text-[11px] font-bold text-brand-dark mt-0.5 truncate">工程經理 (吴建铭)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (DEFAULT_METRICS["deerD"]) {
                            setCurrentMetrics({ ...DEFAULT_METRICS["deerD"] });
                            setSuccessMessage("已成功套用「科技公司創辦人 (陳界衡)」的屬性指標！請記得點選最下方儲存。");
                            setTimeout(() => setSuccessMessage(""), 5000);
                          }
                        }}
                        className="py-2.5 px-3 bg-white hover:bg-brand-beige border border-brand-border rounded-xl text-left transition-all duration-300 shadow-sm hover:shadow active:scale-97 cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-brand-light uppercase tracking-wider">風格預設 4</div>
                        <div className="text-[11px] font-bold text-brand-dark mt-0.5 truncate">科技公司創辦人 (陳界衡)</div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {METRIC_CATEGORIES.map((category, catIdx) => (
                      <div key={catIdx} className="bg-brand-beige/20 p-5 rounded-2xl border border-brand-border/40 space-y-4 shadow-sm">
                        <h5 className="text-xs font-bold text-brand-olive tracking-wider pb-1.5 border-b border-brand-border/20">
                          {category.title}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {category.keys.map((key) => {
                            const value = currentMetrics[key] ?? 50;
                            return (
                              <div key={key} className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-brand-dark">
                                    {METRIC_LABELS[key]}
                                  </span>
                                  <span className="font-mono font-bold text-brand-olive bg-white px-2 py-0.5 rounded border border-brand-border/40 text-[11px]">
                                    {value} / 100
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-brand-light font-bold">10</span>
                                  <input
                                    type="range"
                                    min={10}
                                    max={100}
                                    step={5}
                                    value={value}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setCurrentMetrics(prev => ({
                                        ...prev,
                                        [key]: val
                                      }));
                                    }}
                                    onMouseUp={() => void handleAutoSave()}
                                    onTouchEnd={() => void handleAutoSave()}
                                    className="flex-1 accent-brand-olive h-1.5 bg-brand-border rounded-lg cursor-pointer"
                                  />
                                  <span className="text-[10px] text-brand-light font-bold">100</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 自動儲存註記 */}
                <div className="pt-4 border-t border-brand-border/40 text-center">
                  <span className="text-[10px] text-brand-light italic">離開輸入框即自動儲存，特質滑桿放開後自動儲存</span>
                </div>

              </div>

            </div>
          </div>

        </div>{/* end gentlemen inner wrapper */}
        </div>
        )}{/* end gentlemen tab */}

        {/* ===== LADIES MANAGEMENT TAB ===== */}
        {activeTab === "ladies" && (
          <div className="flex flex-col gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "總名媛數", value: ladies.length, icon: <Users className="w-5 h-5" />, color: "bg-brand-olive" },
                { label: "已答題", value: ladies.filter(l => l.quizTaken).length, icon: <Check className="w-5 h-5" />, color: "bg-emerald-600" },
                { label: "VIP 會員", value: ladies.filter(l => l.membershipLevel === "vip").length, icon: <Crown className="w-5 h-5" />, color: "bg-amber-600" },
                { label: "已審核財力", value: ladies.filter(l => l.assetVerified === "approved").length, icon: <ShieldCheck className="w-5 h-5" />, color: "bg-blue-600" },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow border border-brand-border/60 flex flex-col gap-2">
                  <div className={`${card.color} text-white rounded-xl w-9 h-9 flex items-center justify-center`}>{card.icon}</div>
                  <div className="text-2xl font-bold font-serif text-brand-dark">{card.value}</div>
                  <div className="text-[11px] text-brand-muted uppercase tracking-wider">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Refresh button */}
            <div className="flex items-center gap-3">
              <button
                id="btn-ladies-refresh"
                type="button"
                onClick={() => void loadLadies()}
                disabled={ladiesLoading}
                className="flex items-center gap-2 px-4 py-2 border border-brand-olive/50 rounded-full text-xs font-bold text-brand-olive hover:bg-brand-olive/10 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ladiesLoading ? "animate-spin" : ""}`} />
                <span>{ladiesLoading ? "載入中..." : "重新整理"}</span>
              </button>
              {ladiesError && <span className="text-xs text-red-500">{ladiesError}</span>}
              <span className="text-xs text-brand-muted ml-auto">共 {ladies.length} 位名媛，按最新註冊排序</span>
            </div>

            {/* Ladies Table */}
            <div className="bg-white rounded-2xl shadow border border-brand-border/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-brand-beige/60 border-b border-brand-border/40">
                      {/* Name Header (Priority 1: Always) */}
                      <th 
                        onClick={() => handleSort("name")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>名稱</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "name" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* Match Header (Priority 2: Always) */}
                      <th 
                        onClick={() => handleSort("match")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>配對與解鎖</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "match" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* Membership Header (Low Priority: Tablet+) */}
                      <th 
                        onClick={() => handleSort("membership")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none hidden md:table-cell"
                      >
                        <div className="flex items-center gap-1">
                          <span>會員</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "membership" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* Quiz Header (Low Priority: Tablet+) */}
                      <th 
                        onClick={() => handleSort("quiz")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none hidden md:table-cell"
                      >
                        <div className="flex items-center gap-1">
                          <span>答題</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "quiz" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* Registered Time Header (Priority 3: Tablet+) */}
                      <th 
                        onClick={() => handleSort("createdAt")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none hidden md:table-cell"
                      >
                        <div className="flex items-center gap-1">
                          <span>註冊時間</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "createdAt" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* IP Header (Priority 4: Desktop) */}
                      <th 
                        onClick={() => handleSort("ip")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none hidden lg:table-cell"
                      >
                        <div className="flex items-center gap-1">
                          <span>IP 描述</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "ip" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* Device Header (Priority 5: Desktop) */}
                      <th 
                        onClick={() => handleSort("device")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none hidden lg:table-cell"
                      >
                        <div className="flex items-center gap-1">
                          <span>設備 ID</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "device" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* Asset Header (Low Priority: Desktop) */}
                      <th 
                        onClick={() => handleSort("asset")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none hidden lg:table-cell"
                      >
                        <div className="flex items-center gap-1">
                          <span>驗資</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "asset" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      {/* Notes Header (Low Priority: Desktop) */}
                      <th 
                        onClick={() => handleSort("notes")}
                        className="text-left px-4 py-3 text-brand-muted font-bold uppercase tracking-wider cursor-pointer hover:text-brand-dark transition-colors select-none hidden lg:table-cell"
                      >
                        <div className="flex items-center gap-1">
                          <span>備注</span>
                          <span className="text-[9px] text-brand-olive">{ladySortField === "notes" ? (ladySortDirection === "asc" ? " ▲" : " ▼") : " ⇅"}</span>
                        </div>
                      </th>
                      <th className="text-right px-4 py-3 text-brand-muted font-bold uppercase tracking-wider">操作</th>
                    </tr>
                    {/* Parallel Filters Row */}
                    <tr className="bg-brand-beige/30 border-b border-brand-border/20">
                      {/* 1. Name Filter */}
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          value={colFilterName}
                          onChange={e => setColFilterName(e.target.value)}
                          placeholder="篩選姓名"
                          className="w-full bg-white border border-brand-border/60 rounded px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive"
                        />
                      </td>
                      {/* 2. Match Filter */}
                      <td className="px-2 py-1.5">
                        <select
                          value={colFilterMatch}
                          onChange={e => setColFilterMatch(e.target.value)}
                          className="w-full bg-white border border-brand-border/60 rounded px-1 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive font-semibold cursor-pointer text-brand-dark"
                        >
                          <option value="">全部男賓</option>
                          {Object.keys(profiles).map(code => (
                            <option key={code} value={code}>
                              {profiles[code]?.name || code} ({code})
                            </option>
                          ))}
                        </select>
                      </td>
                      {/* 3. Membership Filter */}
                      <td className="px-2 py-1.5 hidden md:table-cell">
                        <select
                          value={ladyFilterMembership}
                          onChange={e => setLadyFilterMembership(e.target.value)}
                          className="w-full bg-white border border-brand-border/60 rounded px-1 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive font-semibold cursor-pointer"
                        >
                          <option value="all">全部會員</option>
                          <option value="free">free</option>
                          <option value="experience">experience</option>
                          <option value="vip">vip</option>
                        </select>
                      </td>
                      {/* 4. Quiz Filter */}
                      <td className="px-2 py-1.5 hidden md:table-cell">
                        <select
                          value={ladyFilterQuiz}
                          onChange={e => setLadyFilterQuiz(e.target.value)}
                          className="w-full bg-white border border-brand-border/60 rounded px-1 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive font-semibold cursor-pointer"
                        >
                          <option value="all">全部答題</option>
                          <option value="yes">已答題</option>
                          <option value="no">未答題</option>
                        </select>
                      </td>
                      {/* 5. Registered Time Filter Placeholder */}
                      <td className="px-2 py-1.5 hidden md:table-cell text-center">
                        <div className="text-[10px] text-brand-muted font-bold">—</div>
                      </td>
                      {/* 6. IP Filter */}
                      <td className="px-2 py-1.5 hidden lg:table-cell">
                        <input
                          type="text"
                          value={colFilterIp}
                          onChange={e => setColFilterIp(e.target.value)}
                          placeholder="篩選 IP"
                          className="w-full bg-white border border-brand-border/60 rounded px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive"
                        />
                      </td>
                      {/* 7. Device Filter */}
                      <td className="px-2 py-1.5 hidden lg:table-cell">
                        <input
                          type="text"
                          value={colFilterDevice}
                          onChange={e => setColFilterDevice(e.target.value)}
                          placeholder="篩選設備"
                          className="w-full bg-white border border-brand-border/60 rounded px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive"
                        />
                      </td>
                      {/* 8. Asset Filter */}
                      <td className="px-2 py-1.5 hidden lg:table-cell">
                        <select
                          value={ladyFilterAsset}
                          onChange={e => setLadyFilterAsset(e.target.value)}
                          className="w-full bg-white border border-brand-border/60 rounded px-1 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive font-semibold cursor-pointer"
                        >
                          <option value="all">全部驗資</option>
                          <option value="none">未驗資</option>
                          <option value="pending">審核中</option>
                          <option value="approved">已驗資</option>
                        </select>
                      </td>
                      {/* 9. Notes Filter */}
                      <td className="px-2 py-1.5 hidden lg:table-cell">
                        <input
                          type="text"
                          value={colFilterNotes}
                          onChange={e => setColFilterNotes(e.target.value)}
                          placeholder="篩選備註"
                          className="w-full bg-white border border-brand-border/60 rounded px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-brand-olive"
                        />
                      </td>
                      {/* 10. Actions Filter (Reset button) */}
                      <td className="px-2 py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setColFilterName("");
                            setColFilterMatch("");
                            setColFilterIp("");
                            setColFilterDevice("");
                            setColFilterNotes("");
                            setLadyFilterMembership("all");
                            setLadyFilterAsset("all");
                            setLadyFilterQuiz("all");
                            setLadySearchQuery("");
                          }}
                          className="text-[10px] text-brand-olive hover:underline font-bold animate-pulse"
                          title="重置所有篩選條件"
                        >
                          重置
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // 1. 同步篩選邏輯
                      const filteredLadies = ladies.filter(lady => {
                        // 1.1 全域關鍵字搜尋
                        if (ladySearchQuery.trim()) {
                          const query = ladySearchQuery.toLowerCase();
                          const uuidMatch = lady.code.toLowerCase().includes(query);
                          const nameMatch = (lady.name || "").toLowerCase().includes(query);
                          const ipMatch = (lady.ipAddress || "").toLowerCase().includes(query);
                          const noteMatch = (lady.notes || "").toLowerCase().includes(query);
                          const matchMatch = (lady.matchedGentlemanCode || "").toLowerCase().includes(query);
                          const unlockMatch = (lady.unlockedGentlemanCodes || []).some(code => code.toLowerCase().includes(query));

                          if (!uuidMatch && !nameMatch && !ipMatch && !noteMatch && !matchMatch && !unlockMatch) {
                            return false;
                          }
                        }

                        // 1.2 會員等級列篩選
                        if (ladyFilterMembership !== "all" && lady.membershipLevel !== ladyFilterMembership) {
                          return false;
                        }
                        // 1.3 驗資狀態列篩選
                        if (ladyFilterAsset !== "all" && lady.assetVerified !== ladyFilterAsset) {
                          return false;
                        }
                        // 1.3b 答題狀態列篩選
                        if (ladyFilterQuiz === "yes" && !lady.quizTaken) {
                          return false;
                        }
                        if (ladyFilterQuiz === "no" && lady.quizTaken) {
                          return false;
                        }
                        // 1.5 姓名列篩選
                        if (colFilterName.trim() && !(lady.name || "").toLowerCase().includes(colFilterName.toLowerCase())) {
                          return false;
                        }
                        // 1.6 配對與解鎖列篩選 (精確匹配選取的男賓)
                        if (colFilterMatch.trim()) {
                          const val = colFilterMatch.toLowerCase();
                          const matchCode = (lady.matchedGentlemanCode || "").toLowerCase();
                          const matchMatch = matchCode === val;
                          
                          const unlockMatch = (lady.unlockedGentlemanCodes || []).some(code => code.toLowerCase() === val);

                          if (!matchMatch && !unlockMatch) {
                            return false;
                          }
                        }
                        // 1.7 IP 與地區描述列篩選
                        if (colFilterIp.trim()) {
                          const val = colFilterIp.toLowerCase();
                          const ip = (lady.ipAddress || "").toLowerCase();
                          const desc = getIpDescription(lady.ipAddress).toLowerCase();
                          if (!ip.includes(val) && !desc.includes(val)) {
                            return false;
                          }
                        }
                        // 1.8 設備型號與設備 ID 列篩選
                        if (colFilterDevice.trim()) {
                          const val = colFilterDevice.toLowerCase();
                          const model = (lady.deviceModel || "").toLowerCase();
                          const ua = getFriendlyDevice(lady.userAgent).toLowerCase();
                          const id = (lady.deviceId || "").toLowerCase();
                          if (!model.includes(val) && !ua.includes(val) && !id.includes(val)) {
                            return false;
                          }
                        }
                        // 1.9 備註列篩選
                        if (colFilterNotes.trim() && !(lady.notes || "").toLowerCase().includes(colFilterNotes.toLowerCase())) {
                          return false;
                        }

                        return true;
                      });

                      // 2. 排序邏輯
                      const sortedLadies = [...filteredLadies].sort((a, b) => {
                        let fieldA: any = "";
                        let fieldB: any = "";

                        switch (ladySortField) {
                          case "code":
                            fieldA = a.code;
                            fieldB = b.code;
                            break;
                          case "name":
                            fieldA = a.name || "";
                            fieldB = b.name || "";
                            break;
                          case "match":
                            fieldA = a.matchedGentlemanCode || "";
                            fieldB = b.matchedGentlemanCode || "";
                            break;
                          case "ip":
                            fieldA = a.ipAddress || "";
                            fieldB = b.ipAddress || "";
                            break;
                          case "device":
                            fieldA = a.deviceModel || a.deviceId || "";
                            fieldB = b.deviceModel || b.deviceId || "";
                            break;
                          case "membership":
                            fieldA = a.membershipLevel || "";
                            fieldB = b.membershipLevel || "";
                            break;
                          case "quiz":
                            fieldA = a.quizTaken ? 1 : 0;
                            fieldB = b.quizTaken ? 1 : 0;
                            break;
                          case "asset":
                            fieldA = a.assetVerified || "";
                            fieldB = b.assetVerified || "";
                            break;
                          case "notes":
                            fieldA = a.notes || "";
                            fieldB = b.notes || "";
                            break;
                          case "createdAt":
                          default:
                            fieldA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                            fieldB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                            break;
                        }

                        if (fieldA < fieldB) return ladySortDirection === "asc" ? -1 : 1;
                        if (fieldA > fieldB) return ladySortDirection === "asc" ? 1 : -1;
                        return 0;
                      });

                      if (ladiesLoading) {
                        return <tr><td colSpan={10} className="text-center py-10 text-brand-muted">載入中...</td></tr>;
                      }
                      if (sortedLadies.length === 0) {
                        return <tr><td colSpan={10} className="text-center py-10 text-brand-muted">無符合篩選與搜尋條件的麗人帳號</td></tr>;
                      }

                      return sortedLadies.map((lady, idx) => (
                        <tr key={lady.code} className={`border-b border-brand-border/20 hover:bg-brand-beige/30 transition-colors ${idx % 2 === 0 ? "" : "bg-brand-beige/10"}`}>
                          {/* 1. 名稱 (Always) */}
                          <td className="px-4 py-3 font-semibold text-brand-dark">
                            <div className="flex items-center gap-1.5">
                              <span>{lady.name || "未命名"}</span>
                              {lady.pendingPhotoUrl && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-medium bg-red-100 text-red-800 animate-pulse">
                                  待核頭像
                                </span>
                              )}
                            </div>
                          </td>
                          {/* 2. 配對與解鎖 (Always) */}
                          <td className="px-4 py-3 text-[10px]">
                            <div className="space-y-1">
                              <div>
                                <span className="text-brand-light font-bold">配對：</span>
                                {lady.matchedGentlemanCode ? (
                                  <span className="font-mono text-brand-dark font-bold bg-brand-accent/30 px-1.5 py-0.5 rounded">
                                    {lady.matchedGentlemanCode} ({profiles[lady.matchedGentlemanCode]?.name || "未知"})
                                  </span>
                                ) : (
                                  <span className="text-brand-muted">—</span>
                                )}
                              </div>
                              <div>
                                <span className="text-brand-light font-bold">已解鎖：</span>
                                {lady.unlockedGentlemanCodes && lady.unlockedGentlemanCodes.length > 0 ? (
                                  <span className="text-brand-olive font-semibold break-all">
                                    {lady.unlockedGentlemanCodes.map(code => `${code}(${profiles[code]?.name || "未知"})`).join(", ")}
                                  </span>
                                ) : (
                                  <span className="text-brand-muted">無</span>
                                )}
                              </div>
                            </div>
                          </td>
                          {/* 3. 會員 (Tablet+) */}
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              lady.membershipLevel === "vip" ? "bg-amber-100 text-amber-700" :
                              lady.membershipLevel === "experience" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {lady.membershipLevel === "vip" ? <Crown className="w-3 h-3" /> : null}
                              {lady.membershipLevel || "free"}
                            </span>
                          </td>
                          {/* 4. 答題 (Tablet+) */}
                          <td className="px-4 py-3 hidden md:table-cell">
                            {lady.quizTaken
                              ? <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" />是</span>
                              : <span className="text-brand-muted">否</span>
                            }
                          </td>
                          {/* 5. 註冊時間 (Tablet+) */}
                          <td className="px-4 py-3 text-brand-muted hidden md:table-cell">
                            {lady.createdAt ? new Date(lady.createdAt as string).toLocaleDateString("zh-TW") : "—"}
                          </td>
                          {/* 6. IP 描述 (Desktop) */}
                          <td className="px-4 py-3 text-brand-muted hidden lg:table-cell font-mono">
                            {getIpDescription(lady.ipAddress)}
                          </td>
                          {/* 7. 設備 ID (Desktop) */}
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="font-semibold text-brand-dark text-[11px]">
                              {lady.deviceModel ? (
                                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200/50">
                                  📱 {lady.deviceModel}
                                </span>
                              ) : (
                                <span>{getFriendlyDevice(lady.userAgent)}</span>
                              )}
                            </div>
                            <div className="font-mono text-[9px] text-brand-light truncate max-w-[120px]" title={lady.deviceId}>
                              {lady.deviceId || "—"}
                            </div>
                          </td>
                          {/* 8. 驗資 (Desktop) */}
                          <td className="px-4 py-3 hidden lg:table-cell font-semibold">
                            <span className={
                              lady.assetVerified === "approved" ? "text-emerald-600" :
                              lady.assetVerified === "pending" ? "text-amber-600" :
                              "text-brand-muted"
                            }>
                              {lady.assetVerified === "approved" ? "✓已驗資" : lady.assetVerified === "pending" ? "審核中" : "未驗資"}
                            </span>
                          </td>
                          {/* 9. 備註 (Desktop) */}
                          <td className="px-4 py-3 text-brand-light truncate max-w-[150px] hidden lg:table-cell" title={lady.notes}>
                            {lady.notes || "—"}
                          </td>
                          {/* 10. 操作 (Always) */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                id={`btn-lady-edit-${idx}`}
                                type="button"
                                onClick={() => handleOpenEditLady(lady)}
                                className="p-1.5 rounded-lg text-brand-olive hover:bg-brand-olive/10 transition-colors cursor-pointer"
                                title="編輯會員與審核"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                id={`btn-lady-delete-${idx}`}
                                type="button"
                                onClick={() => void handleDeleteLady(lady.code, lady.name || "未命名")}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                title="刪除帳號"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}{/* end ladies tab */}

        {/* ===== ANALYTICS DASHBOARD TAB ===== */}
        {activeTab === "analytics" && (() => {
          const total = ladies.length;
          const quizDone = ladies.filter(l => l.quizTaken).length;
          const quizRate = total > 0 ? Math.round((quizDone / total) * 100) : 0;
          const vipCount = ladies.filter(l => l.membershipLevel === "vip").length;
          const expCount = ladies.filter(l => l.membershipLevel === "experience").length;
          const freeCount = total - vipCount - expCount;
          const approvedCount = ladies.filter(l => l.assetVerified === "approved").length;
          const pendingCount = ladies.filter(l => l.assetVerified === "pending").length;

          // IP region grouping (static prefix mapping, expanded with IPv6 support)
          const regionMap: Record<string, string> = {
            // IPv4 Taiwan Prefixes
            "202.160": "台灣（中華電信）", "61.": "台灣（台灣大哥大）", "114.": "台灣（遠傳）",
            "218.": "台灣（亞太）", "223.": "台灣（台灣之星）", "1.": "台灣（台灣固網）",
            // IPv4 Other
            "211.": "香港", "210.": "香港", "103.": "香港/東南亞",
            "65.181": "美國/VPN", "192.168": "本地（開發）", "127.": "本地（開發）",
            
            // IPv6 Taiwan
            "2001:b0": "台灣（中華電信 IPv6）",
            "2001:b4": "台灣（遠傳電信 IPv6）",
            "2001:b02": "台灣（台灣大哥大 IPv6）",
            "2001:288": "台灣（學術網路 TANet IPv6）",
            "2404:0": "台灣 IPv6",
            
            // IPv6 Local & Dev
            "::1": "本地開發 (localhost IPv6)",
            "fe80:": "本地開發 (Link-Local IPv6)",
            "fc00:": "本地開發 (Unique-Local IPv6)",
            "fd00:": "本地開發 (Unique-Local IPv6)"
          };

          // Excluded IPs list mapped directly from our database configuration
          const excludedIpList = (Array.isArray(ipMetadataList) ? ipMetadataList : [])
            .filter(item => item && item.isExcluded)
            .map(item => item.ipAddress);

          // Filter visits summary by excludedIp list for statistics only
          const rawVisits = visitsData?.summary || [];
          const visitsForStats = rawVisits.filter(v => !excludedIpList.includes(v.ipAddress));

          const totalVisitsCount = visitsForStats.reduce((acc, curr) => acc + curr.totalVisits, 0);
          const uniqueIpsCount = visitsForStats.length;
          const uniqueDevicesCount = visitsForStats.reduce((acc, curr) => acc + curr.uniqueDevicesCount, 0);

          // Detailed visits list after applying status filter (shows ALL visits including excluded ones, so we can manage them!)
          const filteredVisits = rawVisits.filter(v => {
            const matchingLadiesForIp = ladies.filter(l => l.ipAddress === v.ipAddress);
            const isRegistered = matchingLadiesForIp.length > 0;
            const hasTakenQuiz = matchingLadiesForIp.some(l => l.quizTaken);

            if (visitFilter === "quiz_completed") {
              return isRegistered && hasTakenQuiz;
            }
            if (visitFilter === "quiz_not_completed") {
              return !(isRegistered && hasTakenQuiz);
            }
            return true;
          });

          // Region counts (also exclude excludedIp list if configured)
          const regionCounts: Record<string, number> = {};
          ladies.forEach(l => {
            if (!l.ipAddress) return;
            if (excludedIpList.length > 0 && excludedIpList.includes(l.ipAddress)) return; // Exclude matching IP
            const region = Object.entries(regionMap).find(([prefix]) => (l.ipAddress as string).startsWith(prefix))?.[1] ?? "其他/未知";
            regionCounts[region] = (regionCounts[region] || 0) + 1;
          });
          const regionEntries = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]);
          const maxRegion = regionEntries[0]?.[1] || 1;

          // Circle SVG for quiz completion rate
          const circumference = 2 * Math.PI * 52;
          const dashOffset = circumference * (1 - quizRate / 100);

          const today = new Date().toDateString();
          // Filter ladies registered today, excluding excludedIp list if needed
          const todayNew = ladies.filter(l => {
            if (!l.createdAt) return false;
            if (excludedIpList.length > 0 && l.ipAddress && excludedIpList.includes(l.ipAddress)) return false;
            return new Date(l.createdAt as string).toDateString() === today;
          }).length;

          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          const week7 = ladies.filter(l => {
            if (!l.createdAt) return false;
            if (excludedIpList.length > 0 && l.ipAddress && excludedIpList.includes(l.ipAddress)) return false;
            return new Date(l.createdAt as string).getTime() >= sevenDaysAgo;
          }).length;

          return (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void loadLadies();
                    void loadVisits();
                  }}
                  disabled={ladiesLoading || visitsLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-brand-olive/50 rounded-full text-xs font-bold text-brand-olive hover:bg-brand-olive/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${ladiesLoading || visitsLoading ? "animate-spin" : ""}`} />
                  <span>{ladiesLoading || visitsLoading ? "載入中..." : "重新整理"}</span>
                </button>
                {ladiesError && <span className="text-xs text-red-500">{ladiesError}</span>}
              </div>

              {/* Visits Analysis Section */}
              <div className="grid grid-cols-1 gap-6">
                {/* Visits KPI Cards */}
                <div className="bg-white rounded-2xl p-6 shadow border border-brand-border/60 flex flex-col justify-between gap-4">
                  <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-brand-olive" />
                    網頁進入訪問統計 {excludedIpList.length > 0 && <span className="text-[10px] text-red-500 font-bold">(已啟用 {excludedIpList.length} 個 IP 排除)</span>}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-brand-beige/25 p-4 rounded-xl border border-brand-border/30">
                      <div className="text-[10px] text-brand-muted uppercase font-bold">總點擊訪問量</div>
                      <div className="text-2xl font-bold font-serif text-brand-olive mt-1">
                        {visitsLoading ? "..." : totalVisitsCount} <span className="text-xs font-sans text-brand-light">次</span>
                      </div>
                    </div>
                    <div className="bg-brand-beige/25 p-4 rounded-xl border border-brand-border/30">
                      <div className="text-[10px] text-brand-muted uppercase font-bold">獨立訪問 IP 數</div>
                      <div className="text-2xl font-bold font-serif text-emerald-700 mt-1">
                        {visitsLoading ? "..." : uniqueIpsCount} <span className="text-xs font-sans text-brand-light">個</span>
                      </div>
                    </div>
                    <div className="bg-brand-beige/25 p-4 rounded-xl border border-brand-border/30">
                      <div className="text-[10px] text-brand-muted uppercase font-bold">獨立物理設備數</div>
                      <div className="text-2xl font-bold font-serif text-blue-700 mt-1">
                        {visitsLoading ? "..." : uniqueDevicesCount} <span className="text-xs font-sans text-brand-light">台</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "總註冊名媛", value: total, sub: "全時段", icon: <Globe className="w-5 h-5" />, color: "bg-brand-olive" },
                  { label: "今日新增名媛", value: todayNew, sub: "今天", icon: <Users className="w-5 h-5" />, color: "bg-emerald-600" },
                  { label: "近 7 日新增名媛", value: week7, sub: "過去一週", icon: <Calendar className="w-5 h-5" />, color: "bg-blue-600" },
                  { label: "已完成答題", value: quizDone, sub: `共 ${total} 位`, icon: <Check className="w-5 h-5" />, color: "bg-amber-600" },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow border border-brand-border/60 flex flex-col gap-2">
                    <div className={`${card.color} text-white rounded-xl w-9 h-9 flex items-center justify-center`}>{card.icon}</div>
                    <div className="text-3xl font-bold font-serif text-brand-dark">{card.value}</div>
                    <div className="text-[11px] text-brand-muted uppercase tracking-wider">{card.label}</div>
                    <div className="text-[10px] text-brand-light">{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Answer Completion Ring */}
                <div className="bg-white rounded-2xl p-6 shadow border border-brand-border/60 flex flex-col items-center gap-4">
                  <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase">答題完成率</h3>
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#f0ede5" strokeWidth="12" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke="#6b6b47"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold font-serif text-brand-dark">{quizRate}%</span>
                      <span className="text-[10px] text-brand-muted">完成率</span>
                    </div>
                  </div>
                  <div className="text-center text-xs text-brand-muted">
                    {quizDone} 位已答題 / {total - quizDone} 位未答題
                  </div>
                </div>

                {/* Membership Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow border border-brand-border/60 flex flex-col gap-4">
                  <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase">會員等級分佈</h3>
                  <div className="flex flex-col gap-3 flex-1 justify-center">
                    {[
                      { label: "VIP 尊榮", count: vipCount, color: "bg-amber-400", textColor: "text-amber-700" },
                      { label: "體驗方案", count: expCount, color: "bg-blue-400", textColor: "text-blue-700" },
                      { label: "免費用戶", count: freeCount, color: "bg-gray-300", textColor: "text-gray-600" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="text-xs font-semibold w-20 text-right text-brand-dark shrink-0">{item.label}</div>
                        <div className="flex-1 bg-brand-beige/60 rounded-full h-4 overflow-hidden">
                          <div
                            className={`${item.color} h-4 rounded-full transition-all duration-700`}
                            style={{ width: total > 0 ? `${(item.count / total) * 100}%` : "0%" }}
                          />
                        </div>
                        <div className={`text-xs font-bold w-8 ${item.textColor}`}>{item.count}</div>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-brand-border/30 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-semibold w-20 text-right text-brand-dark shrink-0">已驗資</div>
                        <div className="flex-1 bg-brand-beige/60 rounded-full h-4 overflow-hidden">
                          <div className="bg-emerald-400 h-4 rounded-full transition-all duration-700" style={{ width: total > 0 ? `${(approvedCount / total) * 100}%` : "0%" }} />
                        </div>
                        <div className="text-xs font-bold w-8 text-emerald-700">{approvedCount}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs font-semibold w-20 text-right text-brand-dark shrink-0">審核中</div>
                        <div className="flex-1 bg-brand-beige/60 rounded-full h-4 overflow-hidden">
                          <div className="bg-amber-300 h-4 rounded-full transition-all duration-700" style={{ width: total > 0 ? `${(pendingCount / total) * 100}%` : "0%" }} />
                        </div>
                        <div className="text-xs font-bold w-8 text-amber-700">{pendingCount}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Region Bar Chart */}
                <div className="bg-white rounded-2xl p-6 shadow border border-brand-border/60 flex flex-col gap-4">
                  <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-olive" />
                    訪問地區分佈
                  </h3>
                  {regionEntries.length === 0 ? (
                    <div className="text-xs text-brand-muted text-center py-8">暫無訪問地區資料</div>
                  ) : (
                    <div className="flex flex-col gap-2.5 flex-1 justify-center">
                      {regionEntries.slice(0, 6).map(([region, count]) => (
                        <div key={region} className="flex items-center gap-2">
                          <div className="text-[10px] font-semibold text-brand-dark w-28 shrink-0 truncate text-right">{region}</div>
                          <div className="flex-1 bg-brand-beige/60 rounded-full h-3.5 overflow-hidden">
                            <div
                              className="bg-brand-olive h-3.5 rounded-full transition-all duration-700"
                              style={{ width: `${(count / maxRegion) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs font-bold text-brand-olive w-5 text-right">{count}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-brand-light text-center mt-1">* 基於 IP 前綴靜態映射</div>
                </div>

              </div>

              {/* Visited IPs Details List */}
              <div className="bg-white rounded-2xl p-6 shadow border border-brand-border/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-border/40 pb-3">
                  <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-olive" />
                    詳細訪問 IP 清單 (最新連線排序)
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-brand-light">狀態篩選：</span>
                      <select
                        value={visitFilter}
                        onChange={e => setVisitFilter(e.target.value as any)}
                        className="bg-brand-beige/50 border border-brand-border rounded-lg px-2.5 py-1 text-[11px] font-semibold text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-olive cursor-pointer"
                      >
                        <option value="all">全部訪問</option>
                        <option value="quiz_completed">✅ 已註冊並完成答題</option>
                        <option value="quiz_not_completed">❌ 未答題 / 流失訪客</option>
                      </select>
                    </div>
                    <span className="text-[10px] text-brand-light font-bold">
                      共 {filteredVisits.length} 個 IP，已過濾 {excludedIpList.length} 個
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-brand-border/40 rounded-xl">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-brand-beige/55 sticky top-0 border-b border-brand-border/30">
                        <tr>
                          <th className="px-4 py-2 text-brand-muted font-bold text-center w-12">排除</th>
                          <th className="px-4 py-2 text-brand-muted font-bold">IP 位址 (地區/國家)</th>
                          <th className="px-4 py-2 text-brand-muted font-bold">業務狀態</th>
                          <th className="px-4 py-2 text-brand-muted font-bold">點擊訪問次數</th>
                          <th className="px-4 py-2 text-brand-muted font-bold">包含設備數</th>
                          <th className="px-4 py-2 text-brand-muted font-bold">最近進入時間</th>
                          <th className="px-4 py-2 text-brand-muted font-bold">設備與瀏覽器描述</th>
                          <th className="px-4 py-2 text-brand-muted font-bold">備註 (點擊編輯)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitsLoading ? (
                          <tr>
                            <td colSpan={8} className="text-center py-8 text-brand-muted">載入中...</td>
                          </tr>
                        ) : filteredVisits.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-8 text-brand-muted">沒有符合篩選條件的記錄</td>
                          </tr>
                        ) : (
                          filteredVisits.map(item => {
                            const matchingLadiesForIp = ladies.filter(l => l.ipAddress === item.ipAddress);
                            const isRegistered = matchingLadiesForIp.length > 0;
                            const hasTakenQuiz = matchingLadiesForIp.some(l => l.quizTaken);

                            // Detect if this device has connected with other IPs
                            const isSameDeviceShared = (item.deviceIds || []).some(devId => {
                              return rawVisits.some(v => v.ipAddress !== item.ipAddress && (v.deviceIds || []).includes(devId));
                            });

                            const isIpExcluded = (Array.isArray(ipMetadataList) ? ipMetadataList : []).find(m => m && m.ipAddress === item.ipAddress)?.isExcluded || false;
                            const ipNote = (Array.isArray(ipMetadataList) ? ipMetadataList : []).find(m => m && m.ipAddress === item.ipAddress)?.note || "";

                            return (
                              <tr key={item.ipAddress} className={`border-b border-brand-border/10 hover:bg-brand-beige/10 transition-colors ${isIpExcluded ? "bg-red-50/15" : ""}`}>
                                <td className="px-4 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isIpExcluded}
                                    onChange={e => {
                                      const checked = e.target.checked;
                                      void handleSaveIpMetadata(item.ipAddress, { isExcluded: checked });
                                    }}
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-brand-olive focus:ring-brand-olive cursor-pointer"
                                    title={isIpExcluded ? "已排除此 IP 訪問統計" : "勾選排除此 IP"}
                                  />
                                </td>
                                <td className="px-4 py-2 font-mono font-semibold text-brand-dark">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span>{item.ipAddress}</span>
                                      {isSameDeviceShared && (
                                        <span 
                                          className="inline-block text-[8px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200 font-sans font-bold shrink-0"
                                          title="系統偵測到此設備使用過多個不同 IP 連線本網站"
                                        >
                                          同設備跨 IP
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-brand-muted font-sans font-normal">
                                      {getIpRegion(item.ipAddress)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  {isRegistered && hasTakenQuiz ? (
                                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                                      已註冊答題 ({matchingLadiesForIp.map(l => l.name).join(", ")})
                                    </span>
                                  ) : isRegistered ? (
                                    <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                      已註冊未答題 ({matchingLadiesForIp.map(l => l.name).join(", ")})
                                    </span>
                                  ) : (
                                    <span className="text-[9px] bg-brand-light/10 text-brand-light border border-brand-border/40 px-2 py-0.5 rounded-full">
                                      未註冊訪客
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2 font-bold text-brand-olive">{item.totalVisits} 次</td>
                                <td className="px-4 py-2 text-brand-dark">{item.uniqueDevicesCount} 台</td>
                                <td className="px-4 py-2 text-brand-light">
                                  {item.lastVisit ? new Date(item.lastVisit).toLocaleString("zh-TW") : "—"}
                                </td>
                                <td className="px-4 py-2 text-brand-muted truncate max-w-[150px]" title={item.userAgent}>
                                  {getFriendlyDevice(item.userAgent)}
                                </td>
                                <td className="px-4 py-2 min-w-[140px] max-w-[200px]">
                                  <IpNoteCell
                                    ip={item.ipAddress}
                                    initialNote={ipNote}
                                    onSave={(ip, newNote) => void handleSaveIpMetadata(ip, { note: newNote })}
                                  />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}{/* end analytics tab */}

      </div>{/* end main content wrapper */}

      {/* ===== LADY EDIT MODAL ===== */}
      <AnimatePresence>
        {editLady && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-brand-dark/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-beige w-full max-w-2xl rounded-3xl p-7 shadow-2xl border border-brand-border/80 space-y-5 max-h-[92vh] overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-brand-dark">編輯麗人與審核面板</h3>
                <button type="button" onClick={() => setEditLady(null)} className="p-1.5 rounded-full hover:bg-brand-border/40 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="text-xs text-brand-muted font-mono bg-white px-3 py-2 rounded-xl border border-brand-border/50">
                UUID: {editLady.code}
              </div>

              {/* Photo Audit Section */}
              <div className="bg-white p-4 rounded-xl border border-brand-border/50 space-y-3">
                <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">頭像審核 / 狀態</h4>
                {editLady.pendingPhotoUrl ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div>
                        <div className="text-[10px] text-brand-light mb-1">當前頭像</div>
                        <img src={editLady.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover mx-auto border border-brand-border" />
                      </div>
                      <div>
                        <div className="text-[10px] text-red-500 font-bold mb-1 animate-pulse">待審核新頭像</div>
                        <img src={editLady.pendingPhotoUrl} alt="" className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-amber-500" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => void handleRejectPhoto()}
                        disabled={ladyEditSaving}
                        className="flex-1 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        拒絕更換
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleApprovePhoto()}
                        disabled={ladyEditSaving}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all shadow cursor-pointer"
                      >
                        批准並更換
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <img src={editLady.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-brand-border" />
                    <span className="text-[10px] text-brand-light">當前無待審核的頭像變更申請</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">麗人姓名</label>
                  <input
                    type="text"
                    value={ladyEditName}
                    onChange={e => setLadyEditName(e.target.value)}
                    className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive"
                    placeholder="請輸入麗人實名..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">會員等級</label>
                  <select
                    value={ladyEditMembership}
                    onChange={e => setLadyEditMembership(e.target.value)}
                    className="w-full bg-white border border-brand-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive cursor-pointer"
                  >
                    <option value="free">免費用戶 (free)</option>
                    <option value="experience">體驗方案 (experience)</option>
                    <option value="vip">VIP 尊榮 (vip)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">驗資狀態</label>
                  <select
                    value={ladyEditAsset}
                    onChange={e => setLadyEditAsset(e.target.value)}
                    className="w-full bg-white border border-brand-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive cursor-pointer"
                  >
                    <option value="none">未驗資 (none)</option>
                    <option value="pending">審核中 (pending)</option>
                    <option value="approved">已驗資 (approved)</option>
                  </select>
                  {/* Option to clear unlocked cards when downgrading */}
                  {ladyEditAsset !== "approved" && (editLady.unlockedGentlemanCodes?.length || 0) > 0 && (
                    <div className="flex items-center gap-2 mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                      <input
                        type="checkbox"
                        id="chk-clear-unlocked"
                        checked={clearUnlockedOnDowngrade}
                        onChange={e => setClearUnlockedOnDowngrade(e.target.checked)}
                        className="rounded text-brand-olive focus:ring-brand-olive cursor-pointer"
                      />
                      <label htmlFor="chk-clear-unlocked" className="text-[10px] font-semibold text-amber-800 cursor-pointer">
                        同時清空該麗人已解鎖的男生名單 ({editLady.unlockedGentlemanCodes?.length} 位)
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">主控備注 (內部紀錄)</label>
                  <textarea
                    value={ladyEditNotes}
                    onChange={e => setLadyEditNotes(e.target.value)}
                    placeholder="在此輸入對該用戶的註記或內部紀錄..."
                    rows={2}
                    className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive resize-none"
                  />
                </div>
              </div>

              {/* Match & Unlock Details */}
              <div className="border-t border-brand-border/40 pt-3 space-y-2">
                <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-brand-olive" />
                  配對與已解鎖資訊
                </h4>
                <div className="bg-white p-2.5 rounded-xl border border-brand-border/50 text-[10px] space-y-2">
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="lady-edit-match-select" className="font-semibold text-brand-light block mb-1">AI 匹配對象：</label>
                      <select
                        id="lady-edit-match-select"
                        value={ladyEditMatchedCode}
                        onChange={e => setLadyEditMatchedCode(e.target.value)}
                        className="w-full bg-white border border-brand-border rounded-xl px-2 py-1.5 text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand-olive cursor-pointer"
                      >
                        <option value="">(無匹配對象)</option>
                        {Object.keys(profiles).map(code => (
                          <option key={code} value={code}>
                            {code} ({profiles[code]?.name || "未知"})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-light block mb-1">
                        已解鎖名單 ({ladyEditUnlockedCodes.length})：
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 p-2 bg-brand-border/10 rounded-xl max-h-32 overflow-y-auto border border-brand-border/30">
                        {Object.keys(profiles).map(code => {
                          const isChecked = ladyEditUnlockedCodes.includes(code);
                          return (
                            <label key={code} className="flex items-center gap-1.5 text-[9.5px] font-medium text-brand-dark cursor-pointer hover:text-brand-olive select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setLadyEditUnlockedCodes(prev => [...prev, code]);
                                  } else {
                                    setLadyEditUnlockedCodes(prev => prev.filter(c => c !== code));
                                  }
                                }}
                                className="rounded text-brand-olive focus:ring-brand-olive cursor-pointer w-3.5 h-3.5"
                              />
                              <span className="truncate">
                                {profiles[code]?.name || code} ({code})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Answers & Personality Analysis Section */}
              <div className="border-t border-brand-border/40 pt-3 space-y-2">
                <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-brand-olive" />
                  測驗答題與特質分析
                </h4>
                
                {editLady.quizTaken ? (
                  <div className="space-y-2">
                    {/* 1. Radar-like Analysis Cards */}
                    <div className="bg-white p-4 rounded-xl border border-brand-border/50 space-y-2">
                      <div className="text-[10px] font-bold text-brand-dark pb-1 border-b border-brand-border/30">
                        📊 人格特質深度分析
                      </div>
                      
                      {/* Metric Progress Bars */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                        {Object.entries(editLady.quizMetrics || {})
                          .map(([key, value]) => ({
                            key,
                            label: METRIC_LABELS[key as keyof PersonalityMetrics] || key,
                            val: Math.round(value as number)
                          }))
                          .sort((a, b) => b.val - a.val) // Sort desc to show top traits first
                          .map((metric) => (
                            <div key={metric.key} className="space-y-1">
                              <div className="flex justify-between text-brand-dark font-medium">
                                <span>{metric.label}</span>
                                <span className={metric.val >= 70 ? "text-emerald-700 font-bold" : metric.val <= 30 ? "text-red-700" : "text-brand-muted"}>
                                  {metric.val}%
                                </span>
                              </div>
                              <div className="w-full bg-brand-beige rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    metric.val >= 70 ? "bg-emerald-600" :
                                    metric.val <= 30 ? "bg-red-500" :
                                    "bg-brand-olive"
                                  }`}
                                  style={{ width: `${metric.val}%` }}
                                />
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      
                      {/* Highlight Top Core Character Traits */}
                      <div className="text-[10px] space-y-1 pt-1 border-t border-brand-border/20">
                        <span className="font-semibold text-brand-light block">💡 核心特質解讀：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(editLady.quizMetrics || {})
                            .filter(([_, val]) => (val as number) >= 65)
                            .map(([key]) => {
                              const label = METRIC_LABELS[key as keyof PersonalityMetrics];
                              return (
                                <span key={key} className="inline-flex items-center px-1.5 py-0.5 bg-emerald-50 text-emerald-800 text-[8px] font-bold rounded border border-emerald-200/50">
                                  強：{label}
                                </span>
                              );
                            })
                          }
                          {Object.entries(editLady.quizMetrics || {})
                            .filter(([_, val]) => (val as number) <= 35)
                            .map(([key]) => {
                              const label = METRIC_LABELS[key as keyof PersonalityMetrics];
                              return (
                                <span key={key} className="inline-flex items-center px-1.5 py-0.5 bg-red-50 text-red-800 text-[8px] font-bold rounded border border-red-200/50">
                                  弱：{label}
                                </span>
                              );
                            })
                          }
                        </div>
                      </div>
                    </div>

                    {/* 2. Question-by-Question Answers */}
                    <div className="bg-white p-4 rounded-xl border border-brand-border/50 space-y-2">
                      <div className="text-[10px] font-bold text-brand-dark pb-1 border-b border-brand-border/30">
                        📝 測驗作答選項詳情
                      </div>
                      
                      {editLady.quizAnswers && editLady.quizAnswers.length === 7 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {[
                            {
                              q: "第 1 題：城市氛圍偏好",
                              text: "如果可以隨心所欲選擇，妳最希望生活在怎樣的城市氛圍裡呢？",
                              options: ["A. 北歐精緻都會 (治安極佳、安全、高效優雅)", "B. 南法藝術小鎮 (浪漫、自由、驚喜)", "C. 紐西蘭自然露營區 (擁抱自然、極致開闊與平靜)", "D. 紐約金融核心區 (繁華、頂尖資源與自我實現)"]
                            },
                            {
                              q: "第 2 題：十萬獎金假期規劃",
                              text: "假設今天突然多了一筆十萬元的特別獎金，且有三天臨時假期，妳直覺最想怎麼規劃呢？",
                              options: ["A. 穩定累積與精緻享受 (理財帳戶，只撥出一小部分消費)", "B. 當下行樂，說走就走 (立刻出發海島，完全花在當下幸福)", "C. 投入熱愛，升級裝備 (購入頂級戶外裝備探尋未知風景)", "D. 自我增值，謀劃未來 (報名成長大師班，升級自我生產力)"]
                            },
                            {
                              q: "第 3 題：旅行移動相處氛圍",
                              text: "跟伴侶出門小旅行，妳最嚮往以下哪種移動時的相處氛圍呢？",
                              options: ["A. 乾淨平穩，井然有序 (德系座駕，聽爵士樂聊長遠規劃)", "B. 感性陪伴，溫馨分享 (高鐵火車上分食點心聊心情故事)", "C. 越野探險，隨性流浪 (四驅越野，開窗吹風去秘境冒險)", "D. 奢華尊崇，由他掌控 (加速極強超跑，他打理一切直奔預約制私廚)"]
                            },
                            {
                              q: "第 4 題：新家裝潢風格分歧",
                              text: "當兩人搬進新家在裝潢上有不同意見時，妳直覺會怎麼處理呢？",
                              options: ["A. 理性數據，折衷最優 (做優缺點對比表，客觀理性平衡)", "B. 情緒和緩，以愛退讓 (先吃大餐撒嬌表達，包容彼此差異)", "C. 輕鬆自在，隨心混搭 (各退一步混搭就好，相處舒服最重要)", "D. 信任全權，果斷跟隨 (極信任他品味，由他全權負責規劃)"]
                            },
                            {
                              q: "第 5 題：工作與生活平衡觀",
                              text: "妳如何看待工作與生活的平衡關係呢？",
                              options: ["A. 按部就班，構築安穩 (工作是為了累積堅實的財務安全)", "B. 下班萬歲，豐富體驗 (藝術課/聚餐為生活核心，極大化體驗)", "C. 彈性自由，無拘無束 (追求靈魂自由，想說走就走去旅行)", "D. 追求卓越，成就不凡 (渴望自我實現與晉升，投入高強度努力)"]
                            },
                            {
                              q: "第 6 題：器物與晚餐品味哲學",
                              text: "在挑選日常晚餐或是生活隨身器物時，妳更傾向以下哪一種品味哲學呢？",
                              options: ["A. 高質簡約，注重本質 (注重實用健康與信譽，成分天然)", "B. 視覺美感，氛圍拉滿 (高顏值設計網紅款，儀式感燈光氣氛)", "C. 在地煙火，自在舒服 (愛街頭美食，不拘束，隨意小店暢聊)", "D. 尊榮極致，高效到位 (時間成本為重，買最好的頂級私廚服務)"]
                            },
                            {
                              q: "第 7 題：認定對方的安全感瞬間",
                              text: "當關係走到穩定階段，最能帶給妳「這輩子就是他了」的瞬間是？",
                              options: ["A. 規劃清晰，重諾踐行 (承諾均落地，理財規劃為成家做準備)", "B. 情緒依託，無比溫馨 (受挫大哭時他推掉工作，全心抱緊陪伴)", "C. 絕對信任，自由無壓 (同空間不說話也無壓，不查崗情勒)", "D. 指點迷津，強大避風 (重大抉擇低潮時，他以卓越實力指引保護)"]
                            }
                          ].map((question, qIdx) => {
                            const selectedIdx = editLady.quizAnswers![qIdx];
                            const selectedOptionText = question.options[selectedIdx] ?? `未知選項 (代號: ${selectedIdx})`;
                            return (
                              <div key={qIdx} className="space-y-0.5 border-b border-brand-border/10 pb-2 last:border-0 last:pb-0">
                                <div className="font-bold text-[10px] text-brand-dark flex justify-between">
                                  <span>{question.q}</span>
                                </div>
                                <div className="text-[8.5px] text-brand-light font-medium italic">「{question.text}」</div>
                                <div className="text-[10px] bg-brand-beige/40 border border-brand-border/30 rounded p-1.5 font-semibold text-brand-dark">
                                  選擇了：<span className="text-brand-olive">{selectedOptionText}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-[10px] text-brand-light bg-brand-beige/30 p-2 rounded-lg border border-brand-border/30 leading-relaxed">
                          ⚠️ 此帳號為早期註冊測驗（歷史存量資料），未記錄各題原始選填答案。上方已為您展示基於其計算出之 16 維人格特質深度分析百分比與核心解讀。
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xl border border-brand-border/50 text-[10px] text-center text-brand-muted font-bold">
                    該麗人尚未完成測驗答題。
                  </div>
                )}
              </div>

              {ladyEditMsg && (
                <div className={`text-xs px-3 py-2 rounded-xl font-semibold ${ladyEditMsg.includes("成功") || ladyEditMsg.includes("已批准") || ladyEditMsg === "已儲存！" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                  {ladyEditMsg}
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditLady(null)}
                  className="flex-1 py-2.5 border border-brand-border text-brand-olive hover:bg-brand-border/20 text-xs font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                >取消</button>
                <button
                  type="button"
                  onClick={() => void handleSaveLady()}
                  disabled={ladyEditSaving}
                  className="flex-1 py-2.5 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow cursor-pointer disabled:opacity-50"
                >{ladyEditSaving ? "儲存中..." : "確認儲存"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Member Modal Overlay */}
      <AnimatePresence>
        {showAddModal && (
          <div id="admin-add-modal-overlay" className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-brand-dark/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-beige w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-brand-border/80 text-left space-y-5"
            >
              <div className="flex justify-between items-center pb-2 border-b border-brand-border/40">
                <h3 className="font-serif text-lg font-bold text-brand-dark flex items-center gap-2">
                  <Plus className="w-5 h-5 text-brand-olive" />
                  <span>添加全新紳士成員</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-brand-light hover:bg-brand-border/40 hover:text-brand-dark transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                  <span>{addError}</span>
                </div>
              )}

              <form onSubmit={handleAddProfile} className="space-y-4">
                <div>
                  <label htmlFor="new-code-input" className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">
                    1. 登入與配對編號 (必須為唯一) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="new-code-input"
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => {
                      setNewCode(e.target.value.trim());
                      setAddError("");
                    }}
                    placeholder="例如：666 (此為她的專屬登入密碼)"
                    className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                  <span className="text-[10px] text-brand-light block mt-1">
                    * 登入驗證與測驗結果均會使用此編號來自動加載本位紳士。
                  </span>
                </div>

                <div>
                  <label htmlFor="new-name-input" className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">
                    2. 紳士姓名 / 稱呼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="new-name-input"
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setAddError("");
                    }}
                    placeholder="例如：家豪"
                    className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 border border-brand-border text-brand-olive hover:bg-brand-border/20 text-xs font-bold tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow cursor-pointer"
                  >
                    確認新增
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* GENERIC CONFIRMATION & AUTHENTICATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-brand-dark/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-brand-beige w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-brand-border/60 space-y-4 text-left"
            >
              <div className="flex items-center gap-2.5 pb-1 border-b border-brand-border/20">
                <span className="font-serif text-sm font-bold text-brand-dark tracking-wide">
                  {confirmModal.title}
                </span>
              </div>

              <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
                {confirmModal.message}
              </p>

              {confirmModal.needsInput && (
                <div className="space-y-1.5 pt-1">
                  <label htmlFor="confirm-modal-input" className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                    安全密碼認證
                  </label>
                  <input
                    id="confirm-modal-input"
                    type="password"
                    autoFocus
                    placeholder={confirmModal.inputPlaceholder || "請輸入管理密碼..."}
                    value={confirmInputText}
                    onChange={(e) => setConfirmInputText(e.target.value)}
                    className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal(prev => ({ ...prev, show: false }));
                    setConfirmInputText("");
                  }}
                  className="px-4 py-2 border border-brand-border text-brand-muted hover:bg-brand-border/10 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmModal.onConfirm(confirmInputText);
                    setConfirmModal(prev => ({ ...prev, show: false }));
                    setConfirmInputText("");
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
                >
                  確定執行
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
