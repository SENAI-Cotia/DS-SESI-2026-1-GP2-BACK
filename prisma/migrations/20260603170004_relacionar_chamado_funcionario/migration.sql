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
    "sala" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "setor" TEXT,
    "funcionarioId" INTEGER,
    CONSTRAINT "Chamado_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chamado" ("categoria", "dataAbertura", "dataFechamento", "descricao", "id", "prioridade", "sala", "status", "titulo") SELECT "categoria", "dataAbertura", "dataFechamento", "descricao", "id", "prioridade", "sala", "status", "titulo" FROM "Chamado";
DROP TABLE "Chamado";
ALTER TABLE "new_Chamado" RENAME TO "Chamado";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
