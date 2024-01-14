/*
  Warnings:

  - The primary key for the `BlackLists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `register_id` on the `BlackLists` table. All the data in the column will be lost.
  - Added the required column `id` to the `BlackLists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BlackLists` DROP PRIMARY KEY,
    DROP COLUMN `register_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
