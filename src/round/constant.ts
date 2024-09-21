export enum ROUND_STATUS {
    INIT = 'INIT',               // 初始狀態
    NOT_STARTED = 'NOT_STARTED', // 尚未开始
    BETTING = 'BETTING',         // 下注中
    LOCK_BETS = 'LOCK_BETS',     // 停止下注
    DRAWING = 'DRAWING',         // 開獎中
    PAYOUT = 'PAYOUT',           // 派發下注
    RESETTING = 'RESETTING',     // 重置中
    FINISHED = 'FINISHED',       // 已完成
    FAILED = 'FAILED'            // 例外錯誤
}
