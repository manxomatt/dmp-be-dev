-- DropIndex
DROP INDEX `User_user_name_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `password` CHAR(255) NOT NULL;
