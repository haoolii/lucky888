/*
  Warnings:

  - You are about to drop the `UserDev` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTransactionDev` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserDev";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserTransactionDev";
PRAGMA foreign_keys=on;
