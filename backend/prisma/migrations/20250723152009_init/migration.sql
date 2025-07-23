-- CreateTable
CREATE TABLE "UrlPing" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UrlPing_pkey" PRIMARY KEY ("id")
);
