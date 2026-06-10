import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.post("/novoChamado", async (req, res) => {
    try {

        console.log(req.body);

       
    const { categoria, descricao, status, prioridade, sala, titulo, funcionario, setor } = req.body;

    const novoChamado = await prisma.chamado.create({
         data: {
              titulo,
              descricao,
              categoria,
              status,
              prioridade,
              sala,
              setor,
              funcionarioId: funcionario ? Number(funcionario) : null,
  },
});

        return res.status(201).json(novoChamado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro_real: String(error)
        });
    }
});

router.get("/chamados", async (req, res) => {
    try {
        const chamados = await prisma.chamado.findMany();
        return res.status(200).json(chamados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro_real: String(error)
        });
    }
});

export default router;