import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Profile, PersonalityMetrics } from '../types';
import { DEFAULT_PROFILES, DEFAULT_METRICS } from '../data';

interface DataContextType {
  profiles: Record<string, Profile>;
  metrics: Record<string, PersonalityMetrics>;
  adminCodes: string[];
  isDataLoading: boolean;
  refreshData: (adminCode?: string) => Promise<void>;
  setOptimisticData: (data: { profiles: Record<string, Profile>, metrics: Record<string, PersonalityMetrics> }) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function normalizeData(payload: any) {
    const finalProfiles = (typeof payload.profiles === "object" && payload.profiles ? { ...payload.profiles } : {}) as Record<string, Profile>;
    Object.keys(finalProfiles).forEach(key => {
        const profile = finalProfiles[key];
        if (!profile) return;
        if (!profile.imageUrls || !Array.isArray(profile.imageUrls) || profile.imageUrls.length === 0) {
            finalProfiles[key] = {
                ...profile,
                imageUrls: [profile.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"]
            };
        }
    });

    const finalMetrics = (typeof payload.metrics === "object" && payload.metrics ? { ...payload.metrics } : {});
    const finalAdminCodes = Array.isArray(payload.adminCodes) ? payload.adminCodes : [];

    return { finalProfiles, finalMetrics, finalAdminCodes };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [metrics, setMetrics] = useState<Record<string, PersonalityMetrics>>({});
  const [adminCodes, setAdminCodes] = useState<string[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const refreshData = useCallback(async (adminCode?: string, showLoadingScreen = false) => {
    if (showLoadingScreen) {
      setIsDataLoading(true);
    }
    try {
      const url = adminCode ? "/api/admin/config?ts=" + Date.now() : "/api/profile-config?ts=" + Date.now();
      const response = await fetch(url, {
        cache: "no-store",
        headers: adminCode ? { "X-Admin-Code": adminCode } : undefined
      });
      if (!response.ok) throw new Error(`無法載入伺服器設定: ${response.status}`);
      
      const payload = await response.json();
      const { finalProfiles, finalMetrics, finalAdminCodes } = normalizeData(payload);
      setProfiles(finalProfiles);
      setMetrics(finalMetrics);
      
      // 避免 15 秒定期輪詢（公開接口）清除記憶體中的管理密碼
      if (finalAdminCodes.length > 0) {
        setAdminCodes(finalAdminCodes);
      } else if (adminCode) {
        setAdminCodes([]); // 管理員登入下傳回空才是真空
      }
      console.log("✅ [DataContext] 成功從伺服器載入並刷新了線上設定。");
    } catch (error) {
      console.error("❌ [DataContext] 無法從伺服器載入線上設定，正在啟用【備用預設資料】。", error);
      const { finalProfiles, finalMetrics } = normalizeData({ profiles: DEFAULT_PROFILES, metrics: DEFAULT_METRICS });
      setProfiles(finalProfiles);
      setMetrics(finalMetrics);
      // 僅在並無已加載的管理密碼時才重置為空
      setAdminCodes(prev => prev.length > 0 ? prev : []);
    } finally {
      if (showLoadingScreen) {
        setIsDataLoading(false);
      }
    }
  }, []);

  const setOptimisticData = useCallback((data: { profiles: Record<string, Profile>, metrics: Record<string, PersonalityMetrics> }) => {
    console.log("⚡️ [DataContext] Applying optimistic update.");
    setProfiles(data.profiles);
    setMetrics(data.metrics);
  }, []);

  useEffect(() => {
    void refreshData(undefined, true); // 只有初次載入時顯示全螢幕「正在初始化」畫面
 
    // Set up polling to automatically refresh data every 15 seconds
    const intervalId = setInterval(() => {
      // To save resources, only refresh if the browser tab is active/visible.
      if (document.visibilityState === 'visible') {
        console.log("🔄 [DataContext] Auto-syncing data from server...");
        void refreshData(); // 靜態背景重新同步，不引發全螢幕閃動
      }
    }, 15000); // Poll every 15 seconds

    // Clean up the interval when the component is unmounted to prevent memory leaks.
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshData]); // The effect depends on the refreshData function.

  const value = { profiles, metrics, adminCodes, isDataLoading, refreshData, setOptimisticData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData 必須在 DataProvider 內部使用');
  }
  return context;
}