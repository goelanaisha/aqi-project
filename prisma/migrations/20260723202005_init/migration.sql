-- CreateTable
CREATE TABLE "Reading" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "pollutantId" TEXT NOT NULL,
    "pollutantMin" TEXT,
    "pollutantMax" TEXT,
    "pollutantAvg" TEXT,
    "lastUpdate" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);
