import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/novoChamado", async (req, res) => {
    try {

        console.log(req.body);

        const { categoria, descricao, status, prioridade, sala } = req.body;

        const novoChamado = await prisma.chamado.create({
            data: {
                categoria,
                descricao,
                status,
                prioridade,
                sala
            }
        });

        return res.status(201).json(novoChamado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro_real: String(error)
        });
    }
});

export default router;