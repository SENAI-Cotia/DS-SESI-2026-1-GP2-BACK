/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Funcionario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_nome_key" ON "Funcionario"("nome");
