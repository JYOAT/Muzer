/*
  Warnings:

  - Added the required column `bigImage` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smallImage` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "bigImage" TEXT NOT NULL,
ADD COLUMN     "smallImage" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;