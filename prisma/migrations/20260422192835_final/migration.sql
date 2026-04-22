/*
  Warnings:

  - You are about to drop the `funcionario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "funcionario";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "senha" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "departamento" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_email_key" ON "Funcionario"("email");
