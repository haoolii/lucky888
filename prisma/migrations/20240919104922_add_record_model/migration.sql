/*
  Warnings:

  - You are about to drop the column `userId` on the `PayoutPlayerRecord` table. All the data in the column will be lost.
  - Added the required column `playerId` to the `PayoutPlayerRecord` table without a default value. This is not possible if the table is not empty.

*/
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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PayoutPlayerRecord" ("createdAt", "id", "payoutAmount", "playerBetRecordId", "roundId", "updatedAt") SELECT "createdAt", "id", "payoutAmount", "playerBetRecordId", "roundId", "updatedAt" FROM "PayoutPlayerRecord";
DROP TABLE "PayoutPlayerRecord";
ALTER TABLE "new_PayoutPlayerRecord" RENAME TO "PayoutPlayerRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
