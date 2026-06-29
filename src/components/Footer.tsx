export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-beige px-6 md:px-12 py-8 md:h-40 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
      <div className="md:border-r border-brand-border h-full flex flex-col justify-center md:pr-8">
        <span className="text-lg md:text-xl font-serif text-brand-dark font-semibold">
          01. 實名認證
        </span>
        <p className="text-[11px] uppercase tracking-wider text-brand-light mt-1.5 leading-relaxed">
          100% 真人手動審核，杜絕虛假資訊，保障最真誠的相遇
        </p>
      </div>

      <div className="md:border-r border-brand-border h-full flex flex-col justify-center md:px-8">
        <span className="text-lg md:text-xl font-serif text-brand-dark font-semibold">
          02. 隱私加密
        </span>
        <p className="text-[11px] uppercase tracking-wider text-brand-light mt-1.5 leading-relaxed">
          採用專屬戀人編號驗證，不對外公開資訊，完全保護您與對方的隱私
        </p>
      </div>

      <div className="h-full flex flex-col justify-center md:pl-8">
        <span className="text-lg md:text-xl font-serif text-brand-dark font-semibold">
          03. 專屬媒合
        </span>
        <p className="text-[11px] uppercase tracking-wider text-brand-light mt-1.5 leading-relaxed">
          由資深專家親自推薦引導，一鍵連接 LINE 暢快對談與互動
        </p>
      </div>
    </footer>
  );
}
