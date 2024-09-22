import BigNumber from "bignumber.js";
import { TX } from "../db";
import { USER_BET_STATUS } from "./constant";

/**
 * Player 操作
 * 1. 
*/
/** 新建用戶 */
export const createPlayer = async (tx: TX, id: string, username: string) => {
    await tx.player.create({
        data: {
            id,
            username,
            balance: '0',
            lockedBalance: '0'
        }
    })
}

/** 取得用戶資訊 */
export const getPlayer = async (tx: TX, id: string) => {
    return await tx.player.findUniqueOrThrow({
        where: {
            id
        }
    })
}

/** 更新用戶名稱 */
export const upsertPlayerUserName = async (tx: TX, id: string, username: string) => {
    return await tx.player.upsert({
        where: {
            id
        },
        create: {
            id,
            username,
            balance: '0',
            lockedBalance: '0'
        },
        update: {
            username
        }
    })
}

/** 確定是否用戶存在 */
export const checkIsPlayerExist = async (tx: TX, id: string) => {
    try {
        const player = await getPlayer(tx, id);
        return !!player
    } catch (err) {
        return false;
    }
}

/** 取得用戶餘額資訊 */
export const getPlayerBalanceInfo = async (tx: TX, id: string) => {
    const player = await getPlayer(tx, id);

    return {
        balance: player.balance,
        lockedBalance: player.lockedBalance,
        availableBalance: BigNumber(player.balance).minus(player.lockedBalance).toString()
    }
}

/** 鎖定用戶金額 */
export const lockPlayerBalance = async (tx: TX, id: string, lockAmount: string) => {
    const player = await getPlayer(tx, id);
    await tx.player.update({
        where: { id },
        data: {
            lockedBalance: BigNumber(player.lockedBalance).plus(lockAmount).toString()
        }
    })
}

/** 解鎖用戶金額 */
export const unlockPlayerBalance = async (tx: TX, id: string, unlockAmount: string) => {
    const player = await getPlayer(tx, id);

    if (BigNumber(player.lockedBalance).isLessThan(unlockAmount)) {
        throw new Error(`Insufficient locked balance. Current balance: ${player.lockedBalance}, required: ${unlockAmount}`);
    }

    await tx.player.update({
        where: { id },
        data: {
            lockedBalance: BigNumber(player.lockedBalance).minus(unlockAmount).toString()
        }
    })
}

/** 增加用戶金額 */
export const addPlayerBalance = async (tx: TX, id: string, amount: string) => {
    const player = await getPlayer(tx, id);

    // 確保 Amount 是有效的數字
    if (BigNumber(amount).isLessThan(0)) {
        throw new Error(`Amount must be a positive value. Given: ${amount}`);
    }

    const newBalance = BigNumber(player.balance).plus(amount).toString();

    await tx.player.update({
        where: { id },
        data: {
            balance: newBalance
        }
    });

    return newBalance;
}

/** 減少用戶金額 */
export const subtractPlayerBalance = async (tx: TX, id: string, amount: string) => {
    const player = await getPlayer(tx, id);

    // 確保 Amount 是有效的數字且不會小於零
    if (BigNumber(amount).isLessThan(0)) {
        throw new Error(`Amount must be a positive value. Given: ${amount}`);
    }
    if (BigNumber(player.balance).isLessThan(amount)) {
        throw new Error(`Insufficient balance. Current balance: ${player.balance}, required: ${amount}`);
    }

    const newBalance = BigNumber(player.balance).minus(amount).toString();

    await tx.player.update({
        where: { id },
        data: {
            balance: newBalance
        }
    });

    return newBalance;
}

/** 新增 payout reward 紀錄 */
export const createPlayerPayoutRecord = async (tx: TX, playerId: string, roundId: string, playerBetRecordId: string, payoutAmount: string) => {
    await tx.payoutPlayerRecord.create({
        data: {
            playerId,
            roundId,
            playerBetRecordId,
            payoutAmount
        }
    })
}

/** 更新用戶下注結果 */
export const updatePlayerBetRecord = async (tx: TX, playerBetRecordId: string, status: USER_BET_STATUS) => {
    await tx.playerBetRecord.update({
        where: {
            id: playerBetRecordId,
        },
        data: {
            status
        }
    })
}
