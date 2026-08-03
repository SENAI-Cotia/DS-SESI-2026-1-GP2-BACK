import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/criarChamados", async (req, res) => {
    try {
        console.log(req.body);
        const { categoria, descricao, sala, setor } = req.body;

        const chamadoExistente = await prisma.chamado.findFirst({
            where: {
                sala: sala,
                categoria: categoria,
                status: {
                    in: ["ABERTO", "EM_ANDAMENTO"]
                }
            }
        });

        if (chamadoExistente) {
            return res.status(400).json({ 
                erro: "Já existe um chamado em andamento para esta categoria nesta sala." 
            });
        }

        const novoChamado = await prisma.chamado.create({
            data: {
                titulo: `Chamado ${categoria} - ${sala}`,
                descricao,
                status: "ABERTO",
                prioridade: "MEDIA",
                categoria,
                sala,
                setor,
                funcionarioId: null
            },
        });

        const formatarOhorario = (data: Date | null) => {
            if (!data) return null;
            const d = new Date(data.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
        };

        const { titulo, funcionarioId, ...restoDoChamado } = novoChamado;

        return res.status(201).json({
            ...restoDoChamado,
            dataAbertura: formatarOhorario(novoChamado.dataAbertura),
            dataFechamento: formatarOhorario(novoChamado.dataFechamento)
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            erro_real: String(error)
        });
    }
});


router.put("/editarChamados/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, prioridade } = req.body;

        if (!id) {
            return res.status(400).json({ erro: "ID do chamado é obrigatório." });
        }

        const chamadoAtualizado = await prisma.chamado.update({
            where: {
                id: Number(id)
            },
            data: {
                status,
                prioridade,
                dataFechamento: status === "FECHADO" ? new Date() : null
            }
        });

        const formatarOhorario = (data: Date | null) => {
            if (!data) return null;
            const d = new Date(data.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
        };

        const { titulo, funcionarioId, ...restoDoChamado } = chamadoAtualizado;

        return res.status(200).json({
            ...restoDoChamado,
            dataAbertura: formatarOhorario(chamadoAtualizado.dataAbertura),
            dataFechamento: formatarOhorario(chamadoAtualizado.dataFechamento)
        });

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ erro: "Chamado não encontrado." });
        }
        return res.status(500).json({
            erro_real: String(error)
        });
    }
});


router.delete("/deletarChamados/:id", async (req, res) => {
    console.log("REQUISIÇÃO DE EXCLUSÃO RECEBIDA");

    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ erro: "ID do chamado é obrigatório." });
        }

        await prisma.chamado.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({ mensagem: "Chamado deletado com sucesso!" });

    } catch (error: any) {
        console.error(error);

        if (error && error.code === 'P2025') {
            return res.status(404).json({ erro: "Chamado não encontrado no banco de dados." });
        }

        return res.status(500).json({
            erro_real: String(error)
        });
    }

});

router.get("/listarChamados", async (req, res) => {
    try {
        const chamados = await prisma.chamado.findMany();

        const formatarOhorario = (data: Date | null) => {
            if (!data) return null;
            const d = new Date(data.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
        };

        const chamadosModificados = chamados.map((chamado) => {
            const { titulo, funcionarioId, ...restoDoChamado } = chamado;

            return {
                ...restoDoChamado,
                dataAbertura: formatarOhorario(chamado.dataAbertura),
                dataFechamento: formatarOhorario(chamado.dataFechamento)
            };
        });

        return res.status(200).json(chamadosModificados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro_real: String(error)
        });
    }
});



router.put("/fecharChamados/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ erro: "ID do chamado é obrigatório." });
        }

        const chamadoFechado = await prisma.chamado.update({
            where: {
                id: Number(id)
            },
            data: {
                status: "FECHADO",
                dataFechamento: new Date()
            }
        });

        const formatarOhorario = (data: Date | null) => {
            if (!data) return null;
            const d = new Date(data.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
        };

        const { titulo, funcionarioId, ...restoDoChamado } = chamadoFechado;

        return res.status(200).json({
            ...restoDoChamado,
            dataAbertura: formatarOhorario(chamadoFechado.dataAbertura),
            dataFechamento: formatarOhorario(chamadoFechado.dataFechamento)
        });

    } catch (error: any) {
        console.error(error);
        if (error && error.code === 'P2025') {
            return res.status(404).json({ erro: "Chamado não encontrado no banco de dados." });
        }
        return res.status(500).json({
            erro_real: String(error)
        });
    }
});



export default router;