-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BetRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" INTEGER NOT NULL,
    "total" INTEGER,
    "dice1" INTEGER,
    "dice2" INTEGER,
    "dice3" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BetRecord" ("createdAt", "dice1", "dice2", "dice3", "id", "status", "total", "updatedAt") SELECT "createdAt", "dice1", "dice2", "dice3", "id", "status", "total", "updatedAt" FROM "BetRecord";
DROP TABLE "BetRecord";
ALTER TABLE "new_BetRecord" RENAME TO "BetRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
