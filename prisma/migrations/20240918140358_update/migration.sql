/*
  Warnings:

  - You are about to drop the `BetRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBetRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BetRecord";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserBetRecord";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CurrentRound" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'current',
    "roundId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BetRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "total" INTEGER,
    "dice1" INTEGER,
    "dice2" INTEGER,
    "dice3" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
