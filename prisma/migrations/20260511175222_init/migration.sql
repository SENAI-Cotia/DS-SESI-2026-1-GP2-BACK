/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comentario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `categoriaId` on the `Chamado` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Chamado` table. All the data in the column will be lost.
  - Added the required column `categoria` to the `Chamado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sala` to the `Chamado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Tecnico` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Categoria";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Comentario";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chamado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "dataAbertura" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "dataFechamento" DATETIME,
    "sala" TEXT NOT NULL
);
INSERT INTO "new_Chamado" ("dataAbertura", "dataFechamento", "descricao", "id", "prioridade", "status") SELECT "dataAbertura", "dataFechamento", "descricao", "id", "prioridade", "status" FROM "Chamado";
DROP TABLE "Chamado";
ALTER TABLE "new_Chamado" RENAME TO "Chamado";
CREATE TABLE "new_Tecnico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "habilidades" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_Tecnico" ("cpf", "habilidades", "id", "nome", "senha", "status") SELECT "cpf", "habilidades", "id", "nome", "senha", "status" FROM "Tecnico";
DROP TABLE "Tecnico";
ALTER TABLE "new_Tecnico" RENAME TO "Tecnico";
CREATE UNIQUE INDEX "Tecnico_email_key" ON "Tecnico"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
