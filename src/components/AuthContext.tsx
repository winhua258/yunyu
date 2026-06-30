import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { LadyProfile } from '../types';
import { loginLady, registerLady as apiRegisterLady, simulateLadyAssets } from '../data';

interface AuthContextType {
  loggedInLadyCode: string | null;
  ladyProfiles: Record<string, LadyProfile>;
  login: (code: string) => Promise<LadyProfile>;
  register: () => Promise<LadyProfile>;
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

  const register = useCallback(async () => {
    const lady = await apiRegisterLady();
    localStorage.setItem("yuanyu_lady_code", lady.code);
    setLoggedInLadyCode(lady.code);
    updateLadyProfile(lady);
    return lady;
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
          // code is invalid, log out
          logout();
        });
    }
  }, [loggedInLadyCode, ladyProfiles, updateLadyProfile, logout]);

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