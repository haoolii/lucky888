import { FastThree } from './fast-three';

describe('FastThree', () => {
    let fastThree: FastThree;

    beforeEach(() => {
        // fastThree = new FastThree();
        // jest.spyOn(fastThree, 'roll').mockImplementation(() => 1); // mock roll 函數，設定初始值為 1
    });

    test('應該骰出三個點數', () => {
        const dice1 = fastThree.roll();
        const dice2 = fastThree.roll();
        const dice3 = fastThree.roll();
        expect(dice1).toBeGreaterThanOrEqual(1);
        expect(dice1).toBeLessThanOrEqual(6);
        expect(dice2).toBeGreaterThanOrEqual(1);
        expect(dice2).toBeLessThanOrEqual(6);
        expect(dice3).toBeGreaterThanOrEqual(1);
        expect(dice3).toBeLessThanOrEqual(6);
    });
});
