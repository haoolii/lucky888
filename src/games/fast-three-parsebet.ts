import { BetType } from "./fast-three.types";

function mapToBetType(type: string): BetType {
    switch (type) {
        case "大單": return BetType.BIG_ODD;
        case "大雙": return BetType.BIG_EVEN;
        case "小單": return BetType.SMALL_ODD;
        case "小雙": return BetType.SMALL_EVEN;
        case "大": return BetType.BIG;
        case "小": return BetType.SMALL;
        case "單": return BetType.ODD;
        case "雙": return BetType.EVEN;
        default: throw new Error("未知的投注類型");
    }
}

export function fastThreeParseBet(input: string) {

    const pattern = /(大單|大雙|小單|小雙|大|小|單|雙)(\d+)/g;

    const matches = input.matchAll(pattern);

    // 結果陣列
    const result = [];

    for (const match of matches) {
        const [下注內容, 類型, 金額] = match;
        const betType = mapToBetType(類型);
        console.log('下注內容', 下注內容)
        result.push({ betType, 金額: Number(金額) });
    }

    return result;
}
