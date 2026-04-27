/*
  Warnings:

  - You are about to drop the column `cpf` on the `Funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `Tecnico` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "departamento" TEXT NOT NULL
);
INSERT INTO "new_Funcionario" ("departamento", "email", "id", "nome", "senha") SELECT "departamento", "email", "id", "nome", "senha" FROM "Funcionario";
DROP TABLE "Funcionario";
ALTER TABLE "new_Funcionario" RENAME TO "Funcionario";
CREATE UNIQUE INDEX "Funcionario_email_key" ON "Funcionario"("email");
CREATE TABLE "new_Tecnico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "habilidades" TEXT NOT NULL
);
INSERT INTO "new_Tecnico" ("habilidades", "id", "nome", "status") SELECT "habilidades", "id", "nome", "status" FROM "Tecnico";
DROP TABLE "Tecnico";
ALTER TABLE "new_Tecnico" RENAME TO "Tecnico";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
