import { Lock, ShieldCheck, Heart, User, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "./AuthContext";

interface HeaderProps {
  onBackToVerify?: () => void;
  showBack?: boolean;
  onSoulMatchClick?: () => void;
}

export default function Header({ onBackToVerify, showBack = false, onSoulMatchClick }: HeaderProps) {
  const { loggedInLadyCode, logout, ladyProfiles } = useAuth();
  const currentLady = loggedInLadyCode ? ladyProfiles[loggedInLadyCode] : null;

  return (
    <nav className="sticky top-0 z-50 h-15 px-2 sm:px-6 md:px-12 flex items-center justify-between border-b border-brand-border bg-brand-beige select-none w-full">
      {/* Brand Logo - auto adjusts to fit screens */}
      <div className="flex items-center shrink-0 mr-1 sm:mr-3">
        <span className="text-sm sm:text-lg md:text-2xl font-serif tracking-normal sm:tracking-widest uppercase text-brand-olive font-bold">
          緣友 YUAN-YU
        </span>
      </div>

      {/* Main Nav Items: 專屬媒合 // 隱私 Ethos // 安全加密 // AI配對 */}
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-6 md:gap-8 mx-1 sm:mx-4 shrink min-w-0">
        <span className="cursor-default hover:text-brand-olive text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-brand-muted whitespace-nowrap transition-colors duration-200 opacity-80">
          專屬媒合
        </span>
        <span className="cursor-default hover:text-brand-olive text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-brand-muted whitespace-nowrap transition-colors duration-200 opacity-80">
          隱私 Ethos
        </span>
        <span className="cursor-default hover:text-brand-olive text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-brand-muted whitespace-nowrap transition-colors duration-200 opacity-80">
          安全加密
        </span>

        {/* AI配對 Button: Integrated beautifully as the 4th element with high priority */}
        {onSoulMatchClick && (
          <button
            id="btn-soul-match-trigger"
            onClick={onSoulMatchClick}
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 xs:px-2.5 xs:py-1.5 sm:px-4 sm:py-2 bg-brand-olive text-white hover:bg-[#4d4d36] text-[9px] xs:text-[10px] sm:text-xs font-bold rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:scale-105 active:scale-98 shrink-0 whitespace-nowrap"
          >
            <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-brand-accent fill-current animate-pulse shrink-0" />
            <span className="whitespace-nowrap">
              {currentLady?.quizTaken ? "查看我的配對" : "AI配對"}
            </span>
          </button>
        )}
      </div>

      {/* Action / Security Badge */}
      <div className="flex items-center shrink-0 ml-1 sm:ml-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {showBack && onBackToVerify && (
            <button
              onClick={onBackToVerify}
              className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 border border-brand-olive text-brand-olive text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full hover:bg-brand-olive hover:text-white transition-all duration-300 shadow-sm cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>{currentLady ? "返回" : "返回驗證"}</span>
            </button>
          )}

          {currentLady ? (
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-olive">
                <User className="w-4 h-4 text-brand-accent" />
                <span>名媛 {currentLady.name || "會員"}</span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-full text-brand-light hover:bg-brand-border/40 hover:text-brand-dark transition-colors"
                title="登出"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : !showBack && (
            <div className="flex items-center gap-1 bg-brand-border/40 p-1 sm:px-3 sm:py-1.5 rounded-full border border-brand-border/60 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-accent animate-pulse shrink-0" />
              <span className="hidden xs:inline text-[8px] sm:text-[10px] font-bold text-brand-olive uppercase tracking-wider whitespace-nowrap">
                Secure
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
