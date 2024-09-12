import { Bet, BetType } from "./fast-three.types";

/**
 * 骰子快三遊戲 Class
 */
class FastThree {
    /**
     * 骰子結果
     */
    diceResults: Array<number> = [];

    constructor() {
        this.diceResults = [];
    }

    /**
     * 骰出結果
     */
    rollDice() {
        this.diceResults = [this.roll(), this.roll(), this.roll()];
        return this.diceResults;
    }

    /**
     * 單次骰出結果
     */
    roll() {
        return Math.floor(Math.random() * 6) + 1;
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
        return this.diceResults[0] === this.diceResults[1] && this.diceResults[1] === this.diceResults[2];
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
            isTriple: this.isTriple()
        }
    }
}


/**
 * 骰子賭局管理 Class
 */
class FastThreeBettingSystem {
    bets: Array<Bet> = [];
    results: Array<number> | null = null;
    game: FastThree = new FastThree();

    constructor() { }

    /**
     * 玩家下注
     * TODO: 用戶餘額查詢需要採用 DI 取得查詢方法
     */
    placeBet(player: string, betType: BetType, amount: string) {
        this.bets.push({
            player,
            betType,
            amount
        })
    }

    /**
     * 開始遊戲
     * 1. 職骰
     * 2. 計算結果
     */
    startGame() {

        this.results = this.game.rollDice();

        const resultSummary = this.game.getResult();

        console.log('擲骰結果:', resultSummary);

        return resultSummary;
    }

    /**
     * 結算下注
     */
    settleBets() {
        if (!this.results) {
            // 尚未開始遊戲
            return;
        }

        const summary = this.game.getResult();

        this.bets.forEach(bet => {
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
                console.log(`${player}  Win, Type: ${betType}, Amount: ${amount}`);
            } else {
                console.log(`${player} Lost, Type: ${betType}, Amount: ${amount}`)
            }
        })
    }
}

export {
    FastThree,
    FastThreeBettingSystem
}