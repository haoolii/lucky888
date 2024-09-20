# Lucky888

### TODO:

MVP 缺少功能

1. 下單鎖定餘額
2. 即算扣除或增加餘額

全功能

1. 拆分下單機
2. 下單高併發 超出餘額
3. Mapping 訊息字串
4. 派發獎勵結構調整
5. 規則邏輯抽出
6. 例外發生 (Server shutdown) 重啟 rollback 或是餘額退款
7. Telegram 訊息回應分流 Support Multiple BOT TOKEN
8. Oper DB 操作失敗 error handle.

### Format

组合: dd10 ds10 xd10 xs10 或 大单 10 大双 10 小单 10 小双 10
高倍: bz1 10 bz1 10 或 豹子 1 10 豹子 2 10
特码: 定位胆位置+数字，例如: 例如: 定位胆 4 10, dwd4 10, 4y 10

### Tips

```
npx prisma migrate dev --name init
```

```
npx prisma generate
```

### Reference

https://core.telegram.org/bots/api
