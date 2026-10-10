-- CreateEnum
CREATE TYPE "SubscribtionEnum" AS ENUM ('ACTIVE', 'CANCELD', 'EXPRIED');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Subscribtion" (
    "id" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "status" "SubscribtionEnum" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscribtion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscribtion_userId_key" ON "Subscribtion"("userId");

-- AddForeignKey
ALTER TABLE "Subscribtion" ADD CONSTRAINT "Subscribtion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
