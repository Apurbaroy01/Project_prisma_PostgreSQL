/*
  Warnings:

  - You are about to drop the `Subscribtion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscribtion" DROP CONSTRAINT "Subscribtion_userId_fkey";

-- DropTable
DROP TABLE "Subscribtion";

-- CreateTable
CREATE TABLE "subscribtions" (
    "id" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "status" "SubscribtionEnum" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscribtions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribtions_userId_key" ON "subscribtions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscribtions_stripeCustomerId_key" ON "subscribtions"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "subscribtions" ADD CONSTRAINT "subscribtions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
