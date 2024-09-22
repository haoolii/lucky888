export enum USER_BET_STATUS {
    /**
     * 下注已被提交，但尚未處理（例如，等待確認或等待遊戲開始）。
     */
    PENDING = 'PENDING',

    /**
     * 下注已成功接受並記錄。
     */
    PLACED = 'PLACED',

    /**
     * 下注被取消（可能是用戶取消或者因系統原因失效）。
     */
    CANCELED = 'CANCELED',

    /**
     * 下注贏了，用戶獲得了獎金。
     */
    WIN = 'WIN',

    /**
     * 下注輸了，沒有獲得獎金。
     */
    LOST = 'LOST',

    /**
     * 下注金額已被退回（可能因為遊戲取消或其他異常情況）。
     */
    REFUNDED = 'REFUNDED',

    /**
     * 下注結果為平局，可能根據遊戲規則無贏家或輸家。
     */
    DRAW = 'DRAW',

    /**
     * 下注正在被系統處理（例如，等待計算結果或確認）。
     */
    PROCESSING = 'PROCESSING',

    /**
     * 下注已過期，因為超出了有效下注時間範圍。
     */
    EXPIRED = 'EXPIRED',

    /**
     * 下注被暫時凍結，可能因為系統檢查或爭議。
     */
    SUSPENDED = 'SUSPENDED'
}