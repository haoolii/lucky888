# 使用 Node.js 20 官方映像作為基礎映像
FROM node:20

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json（或 yarn.lock）
COPY package*.json ./

# 安裝專案依賴
RUN npm install

# 複製其餘的專案文件
COPY . .

# 編譯 TypeScript 源碼
RUN npm run build

# 設定環境變量
ENV NODE_ENV=production

# 暴露應用程式端口 1234
EXPOSE 1234

# 設定容器啟動後執行的命令
CMD [ "node", "dist/index.js" ]