-- CreateTable
CREATE TABLE "BetRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "dice1" INTEGER NOT NULL,
    "dice2" INTEGER NOT NULL,
    "dice3" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserBetRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "betId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "betAmount" TEXT NOT NULL,
    "isWin" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
