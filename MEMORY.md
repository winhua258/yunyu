# MEMORY.md

## 2026-06-30 本輪優化與修復記錄

- **本輪目標**：優化與修復緣友 YUAN-YU 交友平臺定位，完成功能審查，解決所有編譯及語法錯誤。
- **發現的問題**：
  1. `Header.tsx` 引用 `../context/AuthContext` 路徑錯誤（實際在 `./AuthContext`），導致編譯失敗。
  2. `SoulMatchQuiz.tsx` 在 `useEffect` 依賴項中使用了尚未宣告的 `questions.length`，導致 TypeScript Block-scoped 變數宣告前引用錯誤（Hoisting 錯誤）。
  3. `VerificationScreen.tsx` 存在多行 JSX 註釋（第 817-819 行）未閉合大括號 `{}`，導致編譯器產生 TS1005 `}` expected 錯誤。
  4. `VerificationScreen.tsx` 中 `Object.values(profiles)` 的傳回類型被推導為 `unknown[]`，導致後續 `.filter` 及 `.map` 存取 `code` 和 `isAcceptingMatches` 報錯。
- **是否真實可複現**：是，執行 `npx tsc --noEmit` 即可穩定複現上述錯誤。
- **複現命令或驗證方式**：
  - 複現與驗證命令：`npx tsc --noEmit`
- **修改內容**：
  - `Header.tsx`：修正 `useAuth` 的導入路徑為 `./AuthContext`。
  - `SoulMatchQuiz.tsx`：從 `useEffect` 依賴數組中移除了靜態的 `questions.length`。
  - `VerificationScreen.tsx`：
    - 將第 817-819 行的註釋改為標準閉合的 JSX 註釋。
    - 將 `Object.values(profiles)` 顯式轉換為 `Profile[]`。
    - 在未登入的麗人通道右側增加了顯眼的「免費開始 AI 靈魂配對測試」直接入口按鈕。
    - 使用 `IS_DEV` 常量（透過 `(import.meta as any).env` 檢測環境）限制調試器的渲染，只在開發環境中顯現，生產環境自動隱藏。
    - 紳士列表 `gentlemanList` 過濾時新增了 `p.isAcceptingMatches !== false` 條件，確保已關閉匹配的紳士不會被列出。
  - `ProfileScreen.tsx`：優化 LINE 聯絡按鈕，若為官方帳號連結，自動將問候語帶入 URL 參數，實現一鍵預填。
- **刪除或減少了什麼代碼、文件、配置、狀態或入口**：
  - 在生產環境下移除了調試工具控制面板的入口。
  - 移成了 `useEffect` 中多餘的 static length 依賴。
- **執行效率優化點**：
  - 減少了靜態長度變更引起的無效 Effect 觸發。
- **函數/變量/常量重命名及命名來源**：無。
- **新增或調整的測試**：無。
- **單元測試覆蓋了哪些函數和返回可能性**：無。
- **驗證命令和結果**：
  - 執行 `npx tsc --noEmit`：無任何報錯，編譯成功。
  - 執行 `npm run build`：Vite 編譯打包順利完成，無任何警告與錯誤。
- **提交哈希**：cbc8904d9d18234042f9dcae3ad9585bd5bcf8b6 (first commit)
- **是否已經收斂**：是。
- **剩餘風險及暫不處理原因**：無。

## 2026-06-30 第二輪優化與 BUG 修復記錄

- **本輪目標**：修復女性註冊直接解鎖、訪客答題解鎖且皆可重複之 BUG。
- **發現的問題**：
  1. 訪客能直接點擊 AI 靈魂測試且完成後查看匹配紳士，此時沒綁定麗人帳號，傳回 Guest 視圖後可重複答題解鎖多個不同紳士。
  2. 麗人查看或解鎖紳士時，觸發 `handleVerifySuccess` 導致自動執行 `logout()` 登出麗人，傳回 Guest 視圖後可重複註冊新麗人帳號再次答題。
  3. `useEffect` 中僅偵測 `loggedInLadyCode` 和 `ladyProfiles` 變化，當麗人解鎖名單更新時會再次出發 Effect 將視圖強制導向先前配對的紳士檔案。
- **是否真實可複現**：是，手動操作上述流程即可重複解鎖多個男士。
- **複現命令或驗證方式**：手動操作註冊與答題流程。
- **修改內容**：
  - `App.tsx`：
    - 新增 `hasInitializedLady` 狀態，防止 `useEffect` 在麗人資料更新時重複初始化與重定向。
    - 在 `handleVerifySuccess` 中，麗人查看/解鎖紳士檔案時不再執行 `logout()`，保留登入狀態。
    - 訪客（未登入者）點擊 AI 測驗時，由系統自動調用 `register()` 靜態註冊麗人帳號登入，使其在有帳號前提下答題，測驗結果自動綁定，從而保證每人僅能解鎖一個的規則。
- **驗證命令和結果**：
  - 執行 `npx tsc --noEmit`：無任何報錯，編譯成功。
  - 執行 `npm run build`：Vite 編譯打包順利完成。
- **提交哈希**：acd94684b08569d816520b4028222b616544b950 (second commit)
- **是否已經收斂**：是。
- **剩餘風險及暫不處理原因**：無。

## 2026-06-30 第三輪優化與設備碼+IP防刷機制實作記錄

- **本輪目標**：實作「設備碼 + IP」雙重掃描攔截與自動登入機制，防止重複註冊/多次答題。
- **發現的問題**：訪客或已登出的用戶即使有 localStorage 限制，仍可手動清除快取或使用不同瀏覽器重複點擊 AI 靈魂測試進行答題與多次解鎖，破壞「每人僅限解鎖一次」的商業規則。
- **是否真實可複現**：是，清除 localStorage 後重新進入即可再次答題。
- **複現命令或驗證方式**：清除快取或在無痕視窗中進行二次註冊。
- **修改內容**：
  - `server.js`：
    - `LadyProfile` Mongoose Schema 新增了 `deviceId`（設備辨識碼）與 `ipAddress`（IP 位址）欄位。
    - `POST /api/lady/register` 接口中，增加 `getClientIp()` 輔助函式提取 `x-forwarded-for` 或 `req.ip`。
    - 實作防刷掃描機制：註冊時會先比對 `deviceId` 與 `ipAddress`（過濾 localhost 開發環境）。若匹配到已註冊用戶，不再創建新帳號，而是直接返回先前建立的帳戶資訊完成「自動登入/加載原有帳戶」，實現重複點擊自動重定向至原有配對紳士的規則。
  - `src/data.ts`：
    - 實作 `getOrCreateDeviceId()` 輔助函式，在瀏覽器端隨機生成一個設備 UUID 並存儲於 localStorage 作為設備碼。
    - 修改 `registerLady` 使其在請求體中將 `deviceId` 發送給伺服器端。
- **驗證命令和結果**：
  - 執行 `npx tsc --noEmit`：無任何報錯，編譯成功。
  - 執行 `npm run build`：Vite 生產建置打包順利完成。
- **提交哈希**：b04ae914eda57c10b1661371b60bf4f5f105cbaa (amended)
- **是否已經收斂**：是。
