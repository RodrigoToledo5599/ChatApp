/*
  Warnings:

  - Made the column `isGroup` on table `Conversations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversations" ALTER COLUMN "isGroup" SET NOT NULL;
