import express from 'express';

const app = express();
const PORT = process.env.PORT || 1234;

// 健康檢查端點
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});