<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# YUANYU - 高端交友網站專案

這是一個使用現代技術棧（React, Vite, Express, MongoDB, Google GenAI）開發的高端交友或個人品牌展示網站。

## 本地運行

**先決條件:**
*   [Node.js](https://nodejs.org/) (建議 v18 或更高版本)
*   [MongoDB](https://www.mongodb.com/try/download/community) (或一個 MongoDB Atlas 雲端資料庫)

**安裝與設定:**

1.  **安裝依賴:**
    ```bash
    npm install
    ```

2.  **設定環境變數:**
    在專案根目錄下，複製 `.env.example` 並命名為 `.env`。
    ```bash
    cp .env.example .env
    ```
    然後編輯 `.env` 檔案，填入您的金鑰：
    ```
    # 您的 MongoDB 連線字串 (根據您的情況選擇一種)
    # 1. 本機資料庫
    # MONGODB_URI="mongodb://localhost:27017/yuanyu"
    # 2. VPS 上的 Docker 資料庫 (推薦用於部署)
    MONGODB_URI="mongodb://your_db_user:your_strong_db_password@localhost:27017/yuanyu?authSource=admin"

    # 您的主要管理員密碼 (ROOT權限)，可以設定多個，用逗號分隔
    ADMIN_CODES="your_super_secret_code,another_one"

    # 您的 Google GenAI API 金鑰
    GENAI_API_KEY="your-google-genai-api-key-here"
    ```

3.  **啟動應用:**
    此命令會同時啟動後端 Express 伺服器和前端 Vite 開發伺服器。
    ```bash
    npm run dev
    ```

4.  **訪問應用:**
    *   前端應用: `http://localhost:3000`
    *   管理後台: 登入後台需要使用您在 `.env` 中設定的 `ADMIN_CODES`。

## 專案腳本

*   `npm run dev`: 啟動開發伺服器。
*   `npm run build`: 為生產環境建置前端應用。
*   `npm run start`: 在生產模式下運行伺服器（需要先執行 `npm run build`）。

## 遠端資料庫管理 (使用 MongoDB Compass)

當您的專案部署到 VPS 伺服器後，您可能需要從自己的電腦上使用 MongoDB Compass 來直接查看或管理資料庫。以下是標準且安全的設定流程。

### 核心思路

確保伺服器上的 MongoDB 能接受遠端連線，並使用正確的連線字串在 Compass 中進行連線。

### 步驟 1：設定 MongoDB 允許遠端存取

1.  **編輯 MongoDB 設定檔** (通常在 `/etc/mongod.conf`):
    ```yaml
    net:
      port: 27017
      bindIp: 0.0.0.0   # 預設只允許 127.0.0.1 (本機)，改成 0.0.0.0 才能遠端存取
    ```
2.  **重啟 MongoDB 服務** 以讓設定生效:
    ```bash
    sudo systemctl restart mongod
    ```

### 步驟 2：啟用身份驗證 (安全性第一)

1.  在 `mongod.conf` 設定檔中加入以下區塊來強制啟用驗證：
    ```yaml
    security:
      authorization: enabled
    ```
2.  **建立一個管理員使用者** (在伺服器上執行 `mongosh` 進入命令列操作):
    ```javascript
    use admin
    db.createUser({
      user: "myAdminUser", // 自訂您的管理員帳號
      pwd: passwordPrompt(), // 或直接輸入 "您的強密碼"
      roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
    })
    ```

### 步驟 3：設定防火牆

無論是雲端服務商的安全組（如 AWS, GCP, Azure）還是 VPS 自身的防火牆 (如 `ufw`)，都必須放行 `27017` 端口。

**強烈建議**：只對您自己的電腦 IP 開放，而不是對所有網路 (`0.0.0.0/0`) 開放。
```bash
# 範例：只允許您的 IP 訪問 27017 端口
sudo ufw allow from YOUR_OWN_IP_ADDRESS to any port 27017
```

### 步驟 4：在 Compass 中連線

使用以下格式的連線字串貼到 Compass 中：
`mongodb://使用者名稱:密碼@您的VPS的IP位址:27017/?authSource=admin`

**範例：**
`mongodb://myAdminUser:您的強密碼@123.45.67.89:27017/?authSource=admin`

### 最佳安全實踐：SSH 隧道

直接將資料庫端口暴露在公網上始終存在風險。最安全的方法是**不對外開放 27017 端口**，而是使用 SSH 隧道。

MongoDB Compass 內建了 SSH 隧道功能。您只需在連線設定的 `SSH Tunnel` 標籤頁中，填入您登入 VPS 的 SSH 主機位址、使用者名稱和密碼/金鑰即可。Compass 會自動為您建立一條加密通道來連線資料庫，這是最推薦的專業作法。

### 方法二：進入 Docker 容器內部連線 (推薦用於偵錯)

如果您的 MongoDB 正在 Docker 容器中運行，而您不想對外暴露端口，可以直接進入容器內部進行操作。容器內通常已包含 `mongosh` 工具。

1.  **找到您的容器名稱或 ID**:
    ```bash
    docker ps
    ```
2.  **使用 `docker exec` 進入容器並啟動 `mongosh`**:
    ```bash
    # 將 [容器名稱或ID] 替換為您實際的容器名稱，並貼上您的完整連線字串
    docker exec -it [容器名稱或ID] mongosh "mongodb://your_db_user:your_strong_db_password@localhost:27017/?authSource=admin"
    ```
    **範例** (假設您的容器名為 `yuanyu-mongo`):
    ```bash
    docker exec -it yuanyu-mongo mongosh "mongodb://your_db_user:your_strong_db_password@localhost:27017/?authSource=admin"
    ```
3.  進入後，您就可以執行如 `use admin`、`db.getUsers()` 等標準 MongoDB 指令了。
