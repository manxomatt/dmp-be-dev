/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `created_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL,
    ADD COLUMN `updated_at` DATETIME(0) NULL,
    ADD COLUMN `user_name` CHAR(45) NULL,
    ADD COLUMN `uuid` CHAR(45) NOT NULL,
    MODIFY `email` CHAR(255) NULL,
    MODIFY `password` CHAR(45) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_user_name_key` ON `User`(`user_name`);
