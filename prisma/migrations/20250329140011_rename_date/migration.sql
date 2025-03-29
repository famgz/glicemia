/*
  Warnings:

  - You are about to drop the column `time` on the `GlucoseLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlucoseLog" DROP COLUMN "time",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
