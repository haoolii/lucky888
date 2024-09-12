import { FastThreeBettingSystem } from './games/fast-three';
import { BetType } from './games/fast-three.types';

const fastThreeBetting = new FastThreeBettingSystem();

fastThreeBetting.placeBet("使用者1", BetType.BIG, '100');
fastThreeBetting.placeBet("使用者2", BetType.SMALL, '50');
fastThreeBetting.placeBet("使用者3", BetType.ODD, '200');

fastThreeBetting.startGame();
fastThreeBetting.settleBets();