import { delay } from "../core/utils";

type RollDiceFn = () => Promise<number>;

/**
 * 骰子快三遊戲 Class
 */
export default class Gam {
  /**
   * 骰子結果
   */
  diceResults: Array<number> = [];

  /**
   * 三方擲骰子
   */
  constructor(private rollDiceFn: RollDiceFn) {
    this.diceResults = [];
  }

  /**
   * 骰出結果
   */
  async rollDice() {
    try {
      this.diceResults.push(await this.roll());
      await delay(1000);
      this.diceResults.push(await this.roll());
      await delay(1000);
      this.diceResults.push(await this.roll());
      return this.diceResults;
    } catch (err) {
      throw new Error("擲骰子過程出錯了");
    }
  }

  /**
   * 單次骰出結果
   */
  roll() {
    return this.rollDiceFn();
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
   * 判斷是否為大單
   * 大單：11-17 且為單數
   */
  isBigOdd() {
    return this.isBig() && this.isOdd();
  }

  /**
   * 判斷是否為大雙
   * 大雙：11-17 且為雙數
   */
  isBigEven() {
    return this.isBig() && this.isEven();
  }

  /**
   * 判斷是否為小單
   * 小單：4-10 且為單數
   */
  isSmallOdd() {
    return this.isSmall() && this.isOdd();
  }

  /**
   * 判斷是否為小雙
   * 小雙：4-10 且為雙數
   */
  isSmallEven() {
    return this.isSmall() && this.isEven();
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
      isBigOdd: this.isBigOdd(),
      isBigEven: this.isBigEven(),
      isSmallOdd: this.isSmallOdd(),
      isSmallEven: this.isSmallEven(),
    };
  }

  /**
   * 重置遊戲狀態
   */
  reset() {
    this.diceResults = [];
  }
}
