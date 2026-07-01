import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { LadyProfile } from '../types';
import { loginLady, registerLady as apiRegisterLady, simulateLadyAssets } from '../data';

interface AuthContextType {
  loggedInLadyCode: string | null;
  ladyProfiles: Record<string, LadyProfile>;
  login: (code: string) => Promise<LadyProfile>;
  register: () => Promise<{ lady: LadyProfile; isNew: boolean }>;
  logout: () => void;
  updateLadyProfile: (profile: LadyProfile) => void;
  simulateAssets: (level: string, verified: string, unlocked?: string[], quizTaken?: boolean, matchedGentlemanCode?: string | null) => Promise<LadyProfile>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedInLadyCode, setLoggedInLadyCode] = useState<string | null>(() => {
    // 從 localStorage 初始化，以便在重新整理後保持登入狀態
    return localStorage.getItem("yuanyu_lady_code");
  });
  const [ladyProfiles, setLadyProfiles] = useState<Record<string, LadyProfile>>({});

  const updateLadyProfile = useCallback((profile: LadyProfile) => {
    setLadyProfiles(prev => ({ ...prev, [profile.code]: profile }));
  }, []);

  const login = useCallback(async (code: string) => {
    const lady = await loginLady(code);
    localStorage.setItem("yuanyu_lady_code", code);
    setLoggedInLadyCode(code);
    updateLadyProfile(lady);
    return lady;
  }, []);

  const ongoingRegisterPromiseRef = useRef<Promise<{ lady: LadyProfile; isNew: boolean }> | null>(null);

  const register = useCallback(async () => {
    if (ongoingRegisterPromiseRef.current) {
      return ongoingRegisterPromiseRef.current;
    }

    const promise = (async () => {
      try {
        const { lady, isNew } = await apiRegisterLady();
        localStorage.setItem("yuanyu_lady_code", lady.code);
        setLoggedInLadyCode(lady.code);
        updateLadyProfile(lady);
        return { lady, isNew };
      } finally {
        ongoingRegisterPromiseRef.current = null;
      }
    })();

    ongoingRegisterPromiseRef.current = promise;
    return promise;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("yuanyu_lady_code");
    setLoggedInLadyCode(null);
    setLadyProfiles({}); // 同時清除麗人資料
  }, []);

  useEffect(() => {
    if (loggedInLadyCode && !ladyProfiles[loggedInLadyCode]) {
      loginLady(loggedInLadyCode)
        .then(lady => updateLadyProfile(lady))
        .catch(() => {
          // 帳號已被主控刪除或無效，執行徹底硬登出，清理所有本地歷史快取與測驗進度快取
          localStorage.removeItem("yuanyu_lady_code");
          localStorage.removeItem("yuanyu_lady_code_history");
          localStorage.removeItem("yuanyu_soulmatch_progress");
          setLoggedInLadyCode(null);
          setLadyProfiles({});
        });
    }
  }, [loggedInLadyCode, ladyProfiles, updateLadyProfile]);

  const simulateAssets = useCallback(async (level: string, verified: string, unlocked?: string[], quizTaken?: boolean, matched?: string | null) => {
    if (!loggedInLadyCode) throw new Error("尚未登入麗人角色");
    const lady = await simulateLadyAssets(loggedInLadyCode, level, verified, unlocked, quizTaken, matched);
    updateLadyProfile(lady);
    return lady;
  }, [loggedInLadyCode, updateLadyProfile]);

  const value = { loggedInLadyCode, ladyProfiles, login, register, logout, updateLadyProfile, simulateAssets };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內部使用');
  }
  return context;
}