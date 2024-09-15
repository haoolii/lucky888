import express from "express";

const PORT = process.env.PORT || 1234;

const app = express();

// 健康檢查
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
