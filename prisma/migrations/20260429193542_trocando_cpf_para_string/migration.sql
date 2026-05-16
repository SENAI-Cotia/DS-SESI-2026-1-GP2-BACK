/*
  Warnings:

  - Added the required column `senha` to the `Tecnico` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tecnico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "habilidades" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_Tecnico" ("cpf", "habilidades", "id", "nome", "status") SELECT "cpf", "habilidades", "id", "nome", "status" FROM "Tecnico";
DROP TABLE "Tecnico";
ALTER TABLE "new_Tecnico" RENAME TO "Tecnico";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
