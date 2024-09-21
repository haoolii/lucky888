/*
  Warnings:

  - Added the required column `userDevId` to the `UserTransactionDev` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserTransactionDev" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userDevId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_UserTransactionDev" ("amount", "createdAt", "id", "type", "updatedAt") SELECT "amount", "createdAt", "id", "type", "updatedAt" FROM "UserTransactionDev";
DROP TABLE "UserTransactionDev";
ALTER TABLE "new_UserTransactionDev" RENAME TO "UserTransactionDev";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
