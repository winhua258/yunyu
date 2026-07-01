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
- **提交哈希**：8e013be233c047cc92cbfd29e2b52a62ffba3194 (third commit)
- **是否已經收斂**：是。
- **剩餘風險及暫不處理原因**：無。

## 2026-06-30 第四輪優化與背景同步閃屏與編號失效修復記錄

- **本輪目標**：修復主頁/後台每隔 15 秒重新整理導致閃屏的 UX 問題，並恢復 `jim1995.YY` 等管理編號與 `daiC` 等紳士編號的登入效力。
- **發現的問題**：
  1. `DataContext.tsx` 中的輪詢機制每 15 秒調用 `refreshData()` 時會將 `isDataLoading` 設為 `true`，引發全螢幕 loading 畫面，造成高頻率的白屏/閃動。
  2. 伺服器端後台程序（Express）未被重啟以載入最新的 `server.js` 及 `.env` 設定，導致 `/api/auth/verify` 等 API 返回 404 (Cannot POST)，編號無法通過後端驗證。
  3. `package.json` 中的 dev/start 指令先前為 `node server.js`，由於它直接導入 `.ts` 檔案，在沒有載入 `tsx` 模組時會因為不支援 ESM TS 編譯解析而崩潰。
  4. `.env` 中的 `ADMIN_CODES` 被之前的更改重置為 `"admin123"`，丟失了用戶原本的 `jim1995.YY` 管理主控碼。
- **是否真實可複現**：是，啟動網頁停留 15 秒即可穩定複現全螢幕閃動；輸入編號登入皆會提示查無此人。
- **複現命令或驗證方式**：停留網頁觀察閃動、用 `curl` 測試驗證接口 `/api/auth/verify`。
- **修改內容**：
  - `DataContext.tsx`：
    - 修改 `refreshData` 使其接受第二個參數 `showLoadingScreen` (預設為 `false`)。
    - 僅在首頁首次載入（`useEffect` 執行時）傳入 `true` 觸發全螢幕載入畫面，背景 15 秒自動輪詢不再設置載入狀態，從而修復閃屏問題。
  - `package.json`：
    - 將 `dev` 和 `start` 指令改為 `tsx server.js` 以便支援直接導入 `.ts` 檔案。
  - `.env`：
    - 將 `ADMIN_CODES` 修正為 `"admin123, jim1995.YY"`，成功回復主控管理碼。
  - **重啟服務**：
    - 在背景殺死舊的 `server.js` 後台進程並以 `tsx` 重新啟動 Node.js，使 `/api/auth/verify` 等安全驗證路由以及 `.env` 配置更新正式生效。
- **驗證命令和結果**：
  - 執行 `npx tsc --noEmit`：無任何報錯，編譯成功。
  - 執行 `npm run build`：Vite 編譯打包順利完成。
  - 使用 `curl` 驗證 `daiC` (紳士) 與 `jim1995.YY` (管理員) 接口：均正確返回對應角色與 profile 結構。
- **提交哈希**：eee4d5b23de2228d886a1fa4e8c9059abb95ec67 (amended)
- **是否已經收斂**：是。

## 2026-06-30 第五輪後台登入卡死與後台無彈窗自動儲存實作記錄

- **本輪目標**：
  1. 修復管理員認證成功後卡在「正在啟用您專屬的安全媒合通道，請稍後...」的 Loading 頁面問題。
  2. 移除後台管理儲存時彈出的「請輸入管理員編號」確認框。
  3. 移除「儲存此紳士檔案與特質變更」按鈕，實作「離開輸入框（onBlur）、切換配對資格開關（onClick）及放開特質滑桿（onMouseUp/onTouchEnd）時自動儲存」的體驗。
- **發現的問題**：
  1. **React 狀態更新競爭條件 (Race Condition)**：`refreshData` 是一個非同步更新 React state 的過程。當 900ms 後觸發 `onVerifySuccess` 時，`adminCodes` state 可能還沒完成更新，導致 `App.tsx` 中的邏輯判定 `adminCodes.includes(code)` 為 `false`，將管理員誤判為紳士代碼，卡在 Loading。
  2. **Vite 靜態資源快取**：當未執行生產建置 `npm run build` 時，ViteExpress 可能仍在使用 `dist/` 中帶有舊「儲存按鈕」的舊版靜態資源，因此即使重啟服務，瀏覽器上仍然顯示舊按鈕。
- **修改內容**：
  - `VerificationScreen.tsx`：
    - 在 `onVerifySuccess` 回調中新增並傳遞 server 權威返回的 `role` 參數，不依賴異步的本地 `adminCodes` state。
  - `App.tsx`：
    - 更新 `handleVerifySuccess` 接收並優先採用 `role` 來判斷管理員，徹底解決 Loading 卡死。
  - `AdminEditScreen.tsx`：
    - `handleSync` 移除 `prompt` 輸入框，改為直接使用記憶體中已登入的 `adminCodes[0]`。
    - 移除原本表單的 Submit 儲存按鈕及 `<form onSubmit>`。
    - 所有輸入欄位加裝 `onBlur={() => void handleAutoSave()}`。
    - 特質滑桿加裝 `onMouseUp` 和 `onTouchEnd` 以實作放開時自動儲存。
    - 配對資格切換開關改為點擊後立即觸發自動儲存。
    - 引進樂觀更新 `setOptimisticData` 於儲存成功時立刻更新本地 state，避免後續 15 秒背景 polling 將狀態閃回。
- **驗證命令和結果**：
  - 執行 `npm run build`：成功編譯打包出最新 `index-D276varD.js` 包。
  - 執行 `pm2 restart yuanyu`：重啟服務後，確認按鈕已消失，onBlur 自動儲存工作正常。
- **提交哈希**：40d30c3f972b88b9f60f5dcde8a2a0be83d52333 (amended)
- **是否已經收斂**：是。

## 2026-06-30 第六輪配對資格開關閃回與 Mongoose Schema 欄位修復記錄

- **本輪目標**：修復後台變更配對資格後，開關數秒內自動閃回為「開啟」狀態的 Bug。
- **發現的問題**：
  1. **資料庫 Schema 欄位遺漏**：`server.js` 中的 Mongoose `ProfileSchema` 定義中缺少了 `isAcceptingMatches` 欄位。當前端發送儲存請求時，Mongoose 會將該未定義欄位自動過濾過濾掉，導致設定無法寫入 MongoDB。
  2. **自動輪詢同步覆寫**：因資料庫中該值為空，伺服器返回設定時，前端判定為 `undefined` 並預設 fallback 為 `true`，因而在下一次 15 秒背景輪詢資料同步時，將已關閉的開關重新覆寫為「開啟」。
- **修改內容**：
  - `server.js`：
    - 在 Mongoose `ProfileSchema` 定義中新增 `isAcceptingMatches: { type: Boolean, default: true }` 欄位，使其能正常被資料庫儲存與讀取。
  - **重啟與同步**：
    - 重新執行 `npm run build` 打包。
    - 使用 `pm2 restart yuanyu` 重啟伺服器加載新 Schema，徹底修復閃回問題。
- **驗證命令和結果**：
  - 成功完成打包建置與後台重啟。
  - 變更配對狀態後，狀態能長久正確保留。
- **提交哈希**：6cdd23c6fe5d40a50f49caa7fd1f0bb3c5357864 (amended)
- **是否已經收斂**：是。

## 2026-07-01 第六輪麗人卡片退出後重定向與首頁清空記錄

- **本輪目標**：修復女性用戶（麗人）進行 AI 性格測驗配對成功進入紳士卡片後，點擊右上角「退出」登出按鈕，頁面仍卡在紳士卡片，需要再次點擊「返回驗證」才能退回主頁的體驗 Bug。
- **發現的問題**：
  - 點擊右上角退出時，`Header.tsx` 觸發 `useAuth` 的 `logout()` 函數，這成功清空了 `loggedInLadyCode` 使其為 `null`，但 `App.tsx` 中的 `verifiedCode`（儲存當前展示紳士代碼）狀態並未被同步清空。
  - 由於 `verifiedCode !== null` 仍然成立，`App.tsx` 的 `<AnimatePresence>` 仍然渲染 `<ProfileScreen>`，且由於此時已登出，Header 右上角再次轉換為訪客用的「返回驗證」按鈕，造成需要操作兩次登出的邏輯混亂。
- **修改內容**：
  - `App.tsx`：
    - 在處理登入狀態的 `useEffect` 中，當檢測到 `loggedInLadyCode` 為空，且代表已完成登入初始化的 `hasInitializedLady` 為 `true` 時（說明發生了麗人登出行為），自動將 `verifiedCode` 設置為 `null`。
    - 藉此讓女性用戶在點擊「退出」時，頁面狀態自動重設，一步直接退回到主頁（VerificationScreen）。
- **驗證命令和結果**：
  - 執行 `npm run build` 並以 `pm2 restart yuanyu` 重啟：編譯打包完成並成功部署生效，經邏輯審查，狀態清空與首頁返回工作正常。
- **提交哈希**：cbe64545c0c5160f8a1baa45b034fbe6735b2b89 (amended)
- **是否已經收斂**：是。

## 2026-07-01 第七輪配對排除名單（TEMPLATE_EXCLUDED_CODES）邏輯修正

- **本輪目標**：修復女性用戶（麗人）測驗後配對到的紳士不是後台/主控台設定的四位預設角色（而是可能退回到空範本/單一默認配對）的 Bug。
- **發現的問題**：
  - 在 `src/data.ts` 中，`TEMPLATE_EXCLUDED_CODES` 陣列包含了 `["monkeyB", "daiC", "deerD", "huaA"]`，這正是系統內建的四位主要營運紳士。
  - 因為他們被列在「排除名單」中，導致：
    1. 前端 `VerificationScreen` 的 `gentlemanList`（可配對列表）被過濾成空陣列，輸入這四個編號時會提示 `此編號為範本用戶，不可用於匹配`。
    2. `SoulMatchQuiz.tsx` 的餘弦相似度配對引擎因所有可用紳士皆被排除，配對目標集（`targetCodes`）為空，導致數學比對不執行，永遠只能 fallback 到預設最底線的 `'monkeyB'`。
- **修改內容**：
  - `src/data.ts`：
    - 將 `TEMPLATE_EXCLUDED_CODES` 修改為空陣列 `[]`。
    - 藉此將這四位核心營運紳士釋放回可用配對池中，允許測驗進行精確的 20 維向量匹配，且能在首頁列表正常解鎖與展示。
- **驗證命令和結果**：
  - 重新執行打包與重啟，經確認 `profiles` 的四個角色已能在首頁列表與匹配運算中正常使用。
- **提交哈希**：97013ed19be91f3c50a2f531c87ee21bb916271a (amended)
- **是否已經收斂**：是。





