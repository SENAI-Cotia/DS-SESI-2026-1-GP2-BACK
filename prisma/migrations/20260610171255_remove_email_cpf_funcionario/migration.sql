/*
  Warnings:

  - You are about to drop the column `email` on the `Funcionario` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "departamento" TEXT NOT NULL
);
INSERT INTO "new_Funcionario" ("departamento", "id", "nome", "senha") SELECT "departamento", "id", "nome", "senha" FROM "Funcionario";
DROP TABLE "Funcionario";
ALTER TABLE "new_Funcionario" RENAME TO "Funcionario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
