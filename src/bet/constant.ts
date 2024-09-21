export enum BET_TYPE {
    BIG_ODD = "BIG_ODD",
    BIG_EVEN = "BIG_EVEN",
    SMALL_ODD = "SMALL_ODD",
    SMALL_EVEN = "SMALL_EVEN",
    BIG = "BIG",
    SMALL = "SMALL",
    ODD = "ODD",
    EVEN = "EVEN",
    TRIPLE = "TRIPLE",
}

export const betTypeMap: { [key: string]: BET_TYPE } = {
    大單: BET_TYPE.BIG_ODD,
    大单: BET_TYPE.BIG_ODD,
    大雙: BET_TYPE.BIG_EVEN,
    大双: BET_TYPE.BIG_EVEN,
    小單: BET_TYPE.SMALL_ODD,
    小单: BET_TYPE.SMALL_ODD,
    小雙: BET_TYPE.SMALL_EVEN,
    小双: BET_TYPE.SMALL_EVEN,
    大: BET_TYPE.BIG,
    小: BET_TYPE.SMALL,
    單: BET_TYPE.ODD,
    单: BET_TYPE.ODD,
    雙: BET_TYPE.EVEN,
    双: BET_TYPE.EVEN,
  };
  