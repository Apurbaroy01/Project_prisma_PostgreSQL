/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Subscribtion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCustomerId` to the `Subscribtion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscribtion" ADD COLUMN     "stripeCustomerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscribtion_stripeCustomerId_key" ON "Subscribtion"("stripeCustomerId");
