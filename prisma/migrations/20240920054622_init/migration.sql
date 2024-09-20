/*
  Warnings:

  - Added the required column `userRaceId` to the `TxRace` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TxRace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userRaceId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TxRace" ("amount", "createdAt", "id", "updatedAt") SELECT "amount", "createdAt", "id", "updatedAt" FROM "TxRace";
DROP TABLE "TxRace";
ALTER TABLE "new_TxRace" RENAME TO "TxRace";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
