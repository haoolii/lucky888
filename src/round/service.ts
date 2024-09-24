import { TX } from "../db";
import { ROUND_STATUS } from "./constant";


import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 1 });

export const getCurrentRound = async (tx: TX) => {
    return queue.add(async () => {
        const current = await tx.currentRound.findUnique({
            where: {
                id: 'current'
            }
        })

        if (!current) return null;

        const round = await tx.betRound.findUnique({
            where: { 
                id: current.roundId
            }
        })

        return round;
    })
}

export const deleteCurrentRound = async (tx: TX) => {
    const existing = await tx.currentRound.findUnique({
        where: {
            id: "current",
        },
    });

    if (existing) {
        await tx.currentRound.delete({
            where: {
                id: 'current'
            }
        })
    }
}

export const getRound = async (tx: TX, roundId: string) => {
    return await tx.betRound.findFirstOrThrow({
        where: {
            id: roundId
        }
    })
}

export const createRound = async (tx: TX) => {
    return await tx.betRound.create({
        data: {
            status: ROUND_STATUS.INIT
        }
    })
}

export const setCurrentRound = async (tx: TX, roundId: string) => {
    await tx.currentRound.upsert({
        where: {
            id: "current"
        },
        update: {
            roundId
        },
        create: {
            id: 'current',
            roundId
        }
    })
}

export const updateRoundStatus = async (tx: TX, roundId: string, status: ROUND_STATUS) => {
    await tx.betRound.update({
        where: {
            id: roundId
        },
        data: {
            status
        }
    })
}

export const updateRoundDiceResult = async (tx: TX, roundId: string, results: number[]) => {
    if (!results.length) {
        throw new Error('dice result error')
    }
    await tx.betRound.update({
        where: {
            id: roundId
        },
        data: {
            total: results[0] + results[1] + results[2],
            dice1: results[0],
            dice2: results[1],
            dice3: results[2]
        }
    })
}

export const canPlaceBetNow = async (tx: TX) => {

    const round = await getCurrentRound(tx);

    if (!round) {
        return false;
    }

    return round.status === ROUND_STATUS.BETTING;
}


export const getRoundPlayerBets = async (tx: TX, roundId: string) => {
    const records = await tx.playerBetRecord.findMany({
        where: {
            roundId
        }
    });

    return records;
}

