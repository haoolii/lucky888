-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PayoutPlayerRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "playerBetRecordId" TEXT NOT NULL,
    "payoutAmount" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PayoutPlayerRecord_playerBetRecordId_fkey" FOREIGN KEY ("playerBetRecordId") REFERENCES "PlayerBetRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PayoutPlayerRecord" ("createdAt", "id", "payoutAmount", "playerBetRecordId", "playerId", "roundId", "updatedAt") SELECT "createdAt", "id", "payoutAmount", "playerBetRecordId", "playerId", "roundId", "updatedAt" FROM "PayoutPlayerRecord";
DROP TABLE "PayoutPlayerRecord";
ALTER TABLE "new_PayoutPlayerRecord" RENAME TO "PayoutPlayerRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
