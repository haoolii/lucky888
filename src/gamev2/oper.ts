import BigNumber from "bignumber.js";
import db from "../db";
import { BET_TYPE, STATUS, USER_BET_STATUS } from "./constant";
import { calculatePayout, checkBetResult, getGameResult } from "./gamfn";

export const getCurrentRound = async () => {
  try {
    const current = await db.currentRound.findUnique({
      where: {
        id: "current",
      },
    });

    const round = await db.betRound.findUnique({
      where: {
        id: current?.roundId,
      },
    });

    return round;
  } catch (err) {
    console.log("Find current round does not exist.");
  }
};

export const deleteCurrentRound = async () => {
  try {
    const existing = await db.currentRound.findUnique({
      where: {
        id: "current",
      },
    });

    if (existing) {
      await db.currentRound.delete({
        where: {
          id: "current",
        },
      });
    }
    // console.log("CurrentRound record deleted successfully.");
  } catch (err) {
    console.log("CurrentRound record does not exist.");
  }
};

export const createRound = async () => {
  try {
    const round = await db.betRound.create({
      data: {
        status: STATUS.INIT,
      },
    });
    // console.log("Create round successfully.");
    return round;
  } catch (err) {
    console.log("Create round failed.");
  }
};

export const setCurrentRound = async (roundId: string) => {
  try {
    await db.currentRound.upsert({
      where: {
        id: "current",
      },
      update: {
        roundId,
      },
      create: {
        id: "current",
        roundId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // console.log("Set curruent round successfully.");
  } catch (err) {
    console.log("Set current round failed.");
  }
};

export const updateRoundStatus = async (roundId: string, status: STATUS) => {
  try {
    const betRound = await db.betRound.findUnique({
      where: {
        id: roundId,
      },
    });

    // 确保 BetRound 记录存在
    if (betRound) {
      await db.betRound.update({
        where: {
          id: roundId,
        },
        data: {
          status,
        },
      });
      // console.log("BetRound status updated successfully.");
    } else {
      console.log("BetRound record does not exist.");
    }
  } catch (err) {
    // 输出错误信息以便调试
    console.error("Error updating round status:", err);
  }
};

export const updateRoundDiceResult = async (
  roundId: string,
  results: number[]
) => {
  try {
    const betRound = await db.betRound.findUnique({
      where: {
        id: roundId,
      },
    });

    // 确保 BetRound 记录存在
    if (betRound) {
      await db.betRound.update({
        where: {
          id: roundId,
        },
        data: {
          dice1: results[0],
          dice2: results[1],
          dice3: results[2],
        },
      });
      // console.log("BetRound status updated successfully.");
    } else {
      console.log("BetRound record does not exist.");
    }
  } catch (err) {
    // 输出错误信息以便调试
    console.error("Error updating round status:", err);
  }
};

export const placeBet = async (
  playerId: string,
  betType: BET_TYPE,
  amount: string
) => {
  try {
    const round = await getCurrentRound();

    if (round) {
      await db.playerBetRecord.create({
        data: {
          roundId: round.id,
          playerId,
          betType,
          amount,
          status: USER_BET_STATUS.PLACED,
        },
      });
    } else {
      throw new Error("PlaceBet Failed");
    }
  } catch (err) {
    console.log("PlaceBet Error", err);
  }
};

export const canPlaceBetNow = async () => {
  try {
    const round = await getCurrentRound();

    if (round) {
      return round.status === STATUS.BETTING;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Check can place bet now error", err);
  }
};

export const getRoundPlayerBets = async (roundId: string) => {
  try {
    const round = await db.betRound.findUnique({
      where: {
        id: roundId,
      },
    });

    if (round) {
      return await db.playerBetRecord.findMany({
        where: {
          roundId: round?.id,
        },
      });
    } else {
      console.log("Current round empty");
    }
  } catch (err) {
    console.log("Current round error", err);
  }
};

export const payoutRoundPlayer = async (roundId: string) => {
  try {
    await db.$transaction(async (tdb) => {
      const round = await tdb.betRound.findUnique({
        where: {
          id: roundId,
        },
      });

      if (round && round.dice1 && round.dice2 && round.dice3) {
        const diceResults = [round.dice1, round.dice2, round.dice3];

        const records = await tdb.playerBetRecord.findMany({
          where: {
            roundId: round?.id,
          },
        });

        for (let record of records) {
          const betType = record.betType as BET_TYPE;
          const amount = record.amount || "0";
          const isWin = checkBetResult(diceResults, betType);
          const winAmount = calculatePayout(isWin, betType, amount);
          const lostAmount = BigNumber(amount).times(-1).toString();
          const payoutAmount = isWin ? winAmount : lostAmount;
          await tdb.payoutPlayerRecord.create({
            data: {
              roundId: round.id,
              playerId: record.playerId,
              playerBetRecordId: record.id,
              payoutAmount,
            },
          });

          await tdb.playerBetRecord.update({
            where: {
              id: record.id,
            },
            data: {
              status: isWin ? USER_BET_STATUS.WON : USER_BET_STATUS.LOST,
            },
          });
        }
      } else {
        console.log("Current round empty");
      }
    });
  } catch (err) {
    console.log("Current round error", err);
  }
};

export const getPlayerInfo = async (playerId: string) => {
  try {
    const player = await db.player.findUnique({
      where: {
        id: playerId
      },
    });

    if (player) {
      return player;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Query player error", err);
  }
}

export const createUserInfo = async (playerId: string) => {
  try {
    const player = await db.player.create({
      data: {
        id: playerId,
        balance: '0',
        lockedBalance: '0'
      }
    })
    return player;
  } catch (err) {
    console.log("Create player error", err);
  }
}