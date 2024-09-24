import { createCanvas } from 'canvas';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Readable } from 'stream';

// 數據和顏色類型定義
type Data = number[][];
type Colors = string[][];
// 生成PNG圖像
const generateImage = (data: Data, colors: Colors): Buffer => {
  const cellSize = 50;
  const rows = data.length;
  const cols = data[0].length;

  // 創建畫布
  const canvas = createCanvas(cols * cellSize, rows * cellSize);
  const ctx = canvas.getContext('2d');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '20px Arial';

  // 繪製每個圓圈和數字
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * cellSize + cellSize / 2;
      const y = i * cellSize + cellSize / 2;
      const color = colors[i][j] === 'red' ? '#f00' : '#00f';

      // 畫圓
      ctx.beginPath();
      ctx.arc(x, y, (cellSize - 5) / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();

      // 畫數字
      ctx.fillStyle = '#fff';
      ctx.fillText(data[i][j].toString(), x, y);
    }
  }

  // 將圖像轉為 buffer
  return canvas.toBuffer('image/png');
};

export {
    Data,
    Colors,
    generateImage,
    
}