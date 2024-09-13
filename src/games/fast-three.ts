import {
  Bet,
  BettingStatus,
  BetType,
  Player,
  RollThirdPartyFn,
  ThirdPartyNotificationFn,
} from "./fast-three.types";

/**
 * 骰子快三遊戲 Class
 */
class FastThree {
  /**
   * 骰子結果
   */
  diceResults: Array<number> = [];

  /**
   * 三方擲骰子
   */
  constructor(private rollThirdPartyFn: RollThirdPartyFn) {
    this.diceResults = [];
  }

  /**
   * 骰出結果
   */
  async rollDice() {
    this.diceResults = [
      await this.roll(),
      await this.roll(),
      await this.roll(),
    ];
    return this.diceResults;
  }

  /**
   * 單次骰出結果
   * TODO: 串接 Telegram BOT
   */
  roll() {
    return this.rollThirdPartyFn();
  }

  /**
   * 計算總和
   */
  getTotal() {
    return this.diceResults.reduce((prev, curr) => curr + prev, 0);
  }

  /**
   * 判斷大小
   * 11-17 為大
   */
  isBig() {
    const total = this.getTotal();
    return total >= 11 && total <= 17;
  }

  /**
   * 判斷大小
   * 4-10  為小
   */
  isSmall() {
    const total = this.getTotal();
    return total >= 4 && total <= 10;
  }

  /**
   * 判斷是否為單數
   */
  isOdd() {
    return this.getTotal() % 2 !== 0;
  }

  /**
   * 判斷是否為雙數
   */
  isEven() {
    return this.getTotal() % 2 === 0;
  }

  /**
   * 判斷是否為圍骰(三顆點數相同)
   * (也許需要判斷是否三個都有點數)
   */
  isTriple() {
    return (
      this.diceResults[0] === this.diceResults[1] &&
      this.diceResults[1] === this.diceResults[2]
    );
  }

  /**
   * 回傳開獎結果
   */
  getResult() {
    return {
      diceResults: this.diceResults,
      total: this.getTotal(),
      isBig: this.isBig(),
      isSmall: this.isSmall(),
      isOdd: this.isOdd(),
      isEven: this.isEven(),
      isTriple: this.isTriple(),
    };
  }

  /**
   * 重置遊戲狀態
   */
  reset() {
    this.diceResults = [];
  }
}

/**
 * 骰子賭局管理 Class
 * start     開始遊戲
 * lockBets  停止下注
 * draw      開獎
 * payout    派發下注
 * reset     重置遊戲
 */
class FastThreeBettingSystem {
  betId: number = 0;
  bets: Array<Bet> = [];
  results: Array<number> | null = null;
  game: FastThree | null = null;
  status = BettingStatus.NOT_STARTED;

  constructor(
    private rollThirdPartyFn: RollThirdPartyFn,
    private notification: ThirdPartyNotificationFn
  ) {
    this.game = new FastThree(this.rollThirdPartyFn);
    console.log(`[STATUS LOGGING] ${this.status}`);
  }

  /**
   * 玩家下注
   * TODO: 用戶餘額查詢需要採用 DI 取得查詢方法
   */
  placeBet(player: Player, betType: BetType, amount: string) {
    if (this.status !== BettingStatus.BETTING) {
      // Not Allow
      return;
    }

    this.bets.push({
      player,
      betType,
      amount,
    });
  }

  /**
   * 開始遊戲
   * 1. 職骰
   * 2. 計算結果
   */
  async start() {
    if (!this.game) {
      return;
    }

    this.betId++;
    this.bets = [];
    this.results = [];
    this.game.reset();

    await this.notification(`[30S] 開始下注, 第(${this.betId})期`);

    this.status = BettingStatus.BETTING;

    console.log(`[STATUS LOGGING] ${this.status}`);
  }

  /**
   * 停止下注
   */
  async lockBets() {
    if (!this.results) {
      // 尚未開始遊戲
      return;
    }

    if (this.status !== BettingStatus.BETTING) {
      // 尚未開始遊戲
      return;
    }

    this.status = BettingStatus.LOCK_BETS;

    await this.notification(
      `(${this.betId})停止下注, 下注人數 ${this.bets?.length || 0}`
    );

    console.log(`[STATUS LOGGING] ${this.status}`);
  }

  /**
   * 開獎
   */
  async draw() {
    if (!this.game) {
    }

    if (this.status !== BettingStatus.LOCK_BETS) {
      return;
    }

    await this.notification(`(${this.betId}) 開獎中`);

    this.results = (await this.game?.rollDice()) || [];

    const resultSummary = this.game?.getResult();

    this.status = BettingStatus.DRAWING;

    console.log(`[STATUS LOGGING] ${this.status}`);

    await this.notification(
      `(${this.betId}) 骰出點數 [${this.results.join(",")}]`
    );
    await this.notification(
      `(${this.betId}) 開獎結果 ${JSON.stringify(resultSummary)}`
    );

    return resultSummary;
  }

  /**
   * 派發下注
   */
  async payout() {
    if (this.status !== BettingStatus.DRAWING) {
      return;
    }
    await this.notification(`(${this.betId}) 派發獎勵 無資料`);

    const summary = this.game?.getResult();

    this.bets.forEach((bet) => {
      if (!summary) return;

      const { player, betType, amount } = bet;

      let win = false;

      switch (betType) {
        case BetType.BIG:
          win = summary.isBig && !summary.isTriple;
          break;
        case BetType.SMALL:
          win = summary.isSmall && !summary.isTriple;
          break;
        case BetType.ODD:
          win = summary.isOdd && !summary.isTriple;
          break;
        case BetType.EVEN:
          win = summary.isEven && !summary.isTriple;
          break;
        case BetType.TRIPLE:
          win = summary.isTriple;
          break;
        default:
          console.log(`無效的下注類型: ${betType}`);
      }

      if (win) {
        console.log(`${player.id}  Win, Type: ${betType}, Amount: ${amount}`);
      } else {
        console.log(`${player.id} Lost, Type: ${betType}, Amount: ${amount}`);
      }
    });

    this.status = BettingStatus.PAYOUT;

    console.log(`[STATUS LOGGING] ${this.status}`);
  }

  /**
   * 重設遊戲
   */
  async reset() {
    await this.notification(`(${this.betId}) 重置遊戲`);
    this.status = BettingStatus.RESETTING;
    console.log(`[STATUS LOGGING] ${this.status}`);
    this.bets = [];
    this.results = [];
    this.game = new FastThree(this.rollThirdPartyFn);
    this.status = BettingStatus.NOT_STARTED;
    console.log(`[STATUS LOGGING] ${this.status}`);
  }
}

export { FastThree, FastThreeBettingSystem };
