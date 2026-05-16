import { Router } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

const router = Router()
// listando tecnico
router.get("/tecnicos", async (req, res) => {
    try {
        const tecnicos = await prisma.tecnico.findMany();
        return res.status(200).json(tecnicos);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar técnicos" });
    }
});



router.post("/cadastro", async (req, res) => {
    const { nome, senha, email, departamento, cpf } = req.body

    const regexMaiuscula = /[A-Z]/;
    const regexCaracterEspecial = /[^a-zA-Z0-9\s]/;
    const regexNumero = /\d/;

    const funcionarioExistente = await prisma.funcionario.findUnique({
        where: { email }
    });


    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const regexNomeCompleto = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;


    if (!regexNomeCompleto.test(nome)) {
        return res.status(400).json({ erro: "Digite o nome completo." });
    }
    if (senha.length < 8) {
        return res.status(400).json({ erro: "A senha deve ter mais de 8 caracteres." })
    }
    if (!regexMaiuscula.test(senha)) {
        return res.status(400).json({ erro: "A senha deve conter pelo menos uma letra maiúscula." })
    }
    if (!regexCaracterEspecial.test(senha)) {
        return res.status(400).json({ erro: "A senha deve conter pelo menos 1 caracter especial." })
    }
    if (!regexNumero.test(senha)) {
        return res.status(400).json({ erro: "A senha deve conter pelo menos 1 número." })
    }
    if (funcionarioExistente) {
        return res.status(400).json({ erro: "Este email já está cadastrado." });
    }
    if (!regexEmail.test(email)) {
        return res.status(400).json({ erro: "Email inválido." });
    }
    if (!email) {
        return res.status(400).json({ error: "Campo obrigatorio" })
    }

    const senhaCryptografada = await bcrypt.hash(senha, 10)
    const funcionario = await prisma.funcionario.create({
        data: { nome, senha: senhaCryptografada, email, departamento, cpf }
    })

    return res.status(201).json(funcionario)
})

























router.post("/login", async (req, res) => {
    const { email, senha } = req.body


    if (!email || !senha) {
        return res.status(401).json({ error: "Informe Email e senha!" })
    }

    const user = await prisma.funcionario.findFirst({ where: { email } })

    if (!user) {
        return res.status(404).json({ error: "usuario não encontrado" })
    }

    if (!(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ error: "Credenciais invalidas" })
    }

    return res.status(200).json("login realizado com sucesso!")
})

// criando tecnico
router.post("/tecnicos", async (req, res) => {
    try {
        const { nome, senha, habilidades, status, cpf, email } = req.body

        if (!nome || !senha || !habilidades || !status || !cpf || !email) {
            return res.status(400).json({ "error": "Informe todos os campos" })
        }

        // const funcionarioExistente = await prisma.funcionario.findUnique({
        //     where: { email }
        // });
        const senhaCryptografada = await bcrypt.hash(senha, 10)

        const tecnico = await prisma.tecnico.create({
            data: { nome, senha: senhaCryptografada, habilidades, status, cpf, email }
        })

        return res.status(201).json(tecnico)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ "error": "ocorreu um erro ao criar o tecnico" })
    }

    // if (funcionarioExistente) {
    //     return res.status(400).json({ erro: "Este email já está cadastrado." });
    // }
})

router.delete("/tecnicos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.tecnico.delete({ where: { id } });
        return res.status(200).json({ mensagem: "Técnico deletado com sucesso!" });
    } catch (error) {
        return res.status(404).json({ mensagem: "Técnico não encontrado" });
    }
});

// editar técnico
router.put("/tecnicos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, habilidades, status, cpf } = req.body;

    if (!nome || !habilidades || !status || !cpf) {
        return res.status(400).json({ error: "Informe nome, habilidades, status e cpf" });
    }
    try {
        const tecnicoExistente = await prisma.tecnico.findUnique({ where: { id } });

        if (!tecnicoExistente) {
            return res.status(404).json({ error: "Técnico não encontrado" });
        }
        const tecnicoAtualizado = await prisma.tecnico.update({
            where: { id },
            data: { nome, habilidades, status, cpf },
        });

        return res.status(200).json(tecnicoAtualizado);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro ao atualizar técnico" });
    }
});



export default router