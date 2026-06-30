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
  RefreshCw
} from "lucide-react";
import { Profile, PersonalityMetrics } from "../types";
import { 
  DEFAULT_PROFILES, 
  DEFAULT_METRICS,
  syncSharedConfig,
  resetDatabaseToDefaults,
} from "../data";
import { useData } from "./DataContext";

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

export default function AdminEditScreen({ onExit }: AdminEditScreenProps) {
  // Load global data from context
  const { profiles, metrics: allMetrics, adminCodes, refreshData, isDataLoading, setOptimisticData } = useData();
  
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
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");

  // Admin Custom Login Code states
  const [adminCodeInput, setAdminCodeInput] = useState(() => {
    return adminCodes[0] || "";
  });
  const [adminCodeSuccess, setAdminCodeSuccess] = useState("");

  // Local state for editing metrics of the selected profile
  const [currentMetrics, setCurrentMetrics] = useState<PersonalityMetrics>({});

  // Set initial selected code once data is loaded
  React.useEffect(() => {
    if (!isDataLoading && Object.keys(profiles).length > 0 && !selectedCode) {
      setSelectedCode(Object.keys(profiles)[0] || "monkeyB");
    }
    if (adminCodes.length > 0) {
      setAdminCodeInput(adminCodes[0]);
    }
  }, [isDataLoading, profiles, selectedCode, adminCodes]);

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
    updatedAdminCodes: string[]
  ): Promise<{ success: boolean; message: string }> => {
    const adminCode = prompt("為了安全，請輸入您的管理員編號以授權本次儲存：");
    if (!adminCode) {
      const msg = "未提供管理員編號，操作已取消。";
      setErrorMessage(msg);
      return { success: false, message: msg };
    }

    const { success, message } = await syncSharedConfig({ profiles: updatedProfiles, metrics: updatedMetrics, adminCodes: updatedAdminCodes }, adminCode);
    return { success, message };
  };

  // Save changes for currently selected profile
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCode = editData.code.trim();
    if (!finalCode) {
      setErrorMessage("登入編號不可為空");
      return;
    }

    if (!editData.name.trim()) {
      setErrorMessage("姓名不可為空");
      return;
    }

    // System reserved check
    if (adminCodes.includes(finalCode) || RESERVED_MATCH_CODES.includes(finalCode)) {
      setErrorMessage(`編號「${finalCode}」為管理員或系統保留編號，請使用其他編號`);
      return;
    }

    // Code duplicate check
    if (finalCode !== selectedCode && profiles[finalCode]) {
      setErrorMessage(`編號「${finalCode}」已被紳士「${profiles[finalCode].name}」使用，請更換其他編號`);
      return;
    }

    const cleanImageUrls = editData.imageUrls.map(url => url.trim()).filter(url => url.length > 0);
    const mainImageUrl = cleanImageUrls[0] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";

    const updatedProfile: Profile = {
      code: finalCode,
      name: editData.name.trim(),
      age: Number(editData.age) || 25,
      location: editData.location.trim(),
      tagline: editData.tagline.trim(),
      bio: editData.bio.trim(),
      lifestyle: editData.lifestyleStr.split(",").map(t => t.trim()).filter(t => t.length > 0),
      imageUrl: mainImageUrl,
      imageUrls: cleanImageUrls.length > 0 ? cleanImageUrls : [mainImageUrl],
      cardDetail: editData.cardDetail.trim(),
      idealMatch: editData.idealMatch.trim(),
      contactLineUrl: editData.contactLineUrl.trim(),
      isAcceptingMatches: editData.isAcceptingMatches ?? true,
    };

    // 1. Build new profiles
    const newProfiles = { ...profiles };
    if (finalCode !== selectedCode) {
      delete newProfiles[selectedCode];
    }
    newProfiles[finalCode] = updatedProfile;

    // 2. Build new metrics
    const newMetrics = { ...allMetrics };
    if (finalCode !== selectedCode) {
      delete newMetrics[selectedCode];
    }
    newMetrics[finalCode] = { ...currentMetrics };

    // Update states in place
    const result = await handleSync(newProfiles, newMetrics, adminCodes);

    if (!result || !result.success) {
      setErrorMessage(result?.message || "儲存失敗，請檢查網路或管理員編號。");
      setSuccessMessage("");
      return;
    }

    // Re-fetch the canonical data from the server to ensure consistency
    await refreshData();

    // Set active selection to the new code
    setSelectedCode(finalCode);
    
    setErrorMessage("");
    setSuccessMessage(`「${editData.name} (${finalCode})」資料與特質指標已成功儲存！登入驗證與測驗配對將立即生效。`);

    // Auto clear success message after 4s
    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  // Reset current profile to default values
  const handleResetToDefault = async () => {
    // Find the original code key based on index/name or select the best default match
    const currentProfile = profiles[selectedCode];
    const originalDefaultCode = Object.keys(DEFAULT_PROFILES).find(
      key => DEFAULT_PROFILES[key].name === currentProfile.name
    ) || selectedCode;

    if (window.confirm(`確定要將「${currentProfile?.name}」恢復為系統預設值與預設編號 (${originalDefaultCode}) 嗎？`)) {
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

      // Re-fetch the canonical data from the server
      await refreshData();

      // Select restored profile
      setSelectedCode(originalDefaultCode);

      setErrorMessage("");
      setSuccessMessage("已成功恢復該角色的預設檔案與特質設定。");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Reset ALL profiles to system defaults
  const handleResetAllToDefault = async () => {
    const confirmationMessage = `
確定要將【所有紳士成員】的資料庫恢復為系統內建的預設值嗎？

此動作將會：
1. 清除所有您手動新增或修改的紳士資料。
2. 將紳士資料庫重置為程式碼中的 4 位預設角色。
3. 您目前設定的管理員登入編號將會被保留。

此操作無法復原，請謹慎操作！`;
    if (window.confirm(confirmationMessage)) {
      const adminCode = prompt("為了安全，請輸入您的管理員編號以授權本次重置：");
      if (!adminCode) {
        setErrorMessage("未提供管理員編號，操作已取消。");
        return;
      }

      const result = await resetDatabaseToDefaults(adminCode, adminCodes);
      if (!result || !result.success) {
        setErrorMessage(result?.message || "全部重設失敗！");
        setSuccessMessage("");
        return;
      }

      // Re-fetch the canonical data from the server after reset
      await refreshData();

      const defaultCode = Object.keys(DEFAULT_PROFILES)[0];
      setSelectedCode(defaultCode);

      setErrorMessage("");
      setSuccessMessage("所有角色檔案與特質指標皆已成功重置為系統初始預設值！");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
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
      alert("此為系統內建的預設紳士，不允許刪除。");
      return;
    }
    if (window.confirm(`確定要永久刪除紳士成員 「${profiles[codeToDelete]?.name || codeToDelete}」 嗎？此動作無法復原。`)) {
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

      // Re-fetch to get the latest state after deletion
      await refreshData();

      // Select first remaining profile
      const fallbackCode = Object.keys(updatedProfiles)[0] || Object.keys(DEFAULT_PROFILES)[0] || "monkeyB";
      handleSelectProfile(fallbackCode);

      setSuccessMessage("該紳士成員已成功移除。");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
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
              紳士會員檔案管理系統
            </h1>
            <p className="text-xs text-brand-light/90 max-w-xl leading-relaxed">
              在此可自由更改 4 位尊榮紳士的個人檔案及 20 維性格特質。儲存後，麗人答題「AI 靈魂共鳴測驗」的配對對象以及紳士「專屬驗資登入」皆會自動讀取最新變更，實現即時更換與營運。
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

            {/* Admin Security Code Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-brand-border/60 space-y-4">
              <h3 className="font-serif text-sm font-bold text-brand-dark tracking-wider uppercase border-b border-brand-border pb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-olive" />
                <span>變更管理員登入編號</span>
              </h3>
              
              <div className="space-y-3">
                <p className="text-[10px] text-brand-muted leading-relaxed">
                  更換此編號後，後續即可使用新編號登入本運營主控台（原預設之 admin、8888、9999 仍可作為備用密碼保留）。
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminCodeInput}
                    onChange={(e) => {
                      setAdminCodeInput(e.target.value);
                      setAdminCodeSuccess("");
                    }}
                    placeholder="請輸入新管理員編號"
                    className="flex-1 min-w-0 bg-brand-beige/40 border border-brand-border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateAdminCode}
                    className="py-2 px-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer shrink-0"
                  >
                    更新
                  </button>
                </div>
                
                {adminCodeSuccess && (
                  <p className="text-[10px] text-brand-olive font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                    <span>{adminCodeSuccess}</span>
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

              <form id="form-admin-edit" onSubmit={handleSaveChanges} className="space-y-8">
                
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
                        onClick={() => setEditData(prev => ({ ...prev, isAcceptingMatches: !(prev.isAcceptingMatches ?? true) }))}
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
                      提示：關閉後，麗人進行「AI 靈魂共鳴測驗」時將不會配對到此位紳士。
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
                    placeholder="例如：https://line.me/R/ti/p/@yuanyu_v520"
                    className="w-full bg-brand-beige/40 border border-brand-border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-olive/20 focus:border-brand-olive transition-all"
                  />
                  <span className="text-[10px] text-brand-light block mt-1.5 italic">
                    提示：當麗人解鎖此紳士，並點選「一鍵 LINE 聯絡與對談」時，將會跳轉至您輸入的這個 LINE 網址。
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
                            setSuccessMessage("已成功套用「新能源執行長 (葉家銘)」的屬性指標！請記得點選最下方儲存。");
                            setTimeout(() => setSuccessMessage(""), 5000);
                          }
                        }}
                        className="py-2.5 px-3 bg-white hover:bg-brand-beige border border-brand-border rounded-xl text-left transition-all duration-300 shadow-sm hover:shadow active:scale-97 cursor-pointer"
                      >
                        <div className="text-[10px] font-bold text-brand-light uppercase tracking-wider">風格預設 2</div>
                        <div className="text-[11px] font-bold text-brand-dark mt-0.5 truncate">新能源執行長 (葉家銘)</div>
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

                {/* Form Submit Button */}
                <div className="pt-6 border-t border-brand-border/60">
                  <button
                    id="btn-admin-submit-save"
                    type="submit"
                    className="w-full py-4 bg-brand-olive hover:bg-[#4d4d36] text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <Save className="w-4 h-4 text-brand-accent animate-pulse" />
                    <span>儲存此紳士檔案與特質變更</span>
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>

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
                  <label htmlFor="new-code-input" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">
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
                  <label htmlFor="new-name-input" className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">
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

    </div>
  );
}
