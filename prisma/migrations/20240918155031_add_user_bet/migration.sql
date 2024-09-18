/*
  Warnings:

  - Added the required column `playerId` to the `PlayerBetRecord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlayerBetRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "betType" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PlayerBetRecord" ("amount", "betType", "createdAt", "id", "roundId", "status", "updatedAt") SELECT "amount", "betType", "createdAt", "id", "roundId", "status", "updatedAt" FROM "PlayerBetRecord";
DROP TABLE "PlayerBetRecord";
ALTER TABLE "new_PlayerBetRecord" RENAME TO "PlayerBetRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
