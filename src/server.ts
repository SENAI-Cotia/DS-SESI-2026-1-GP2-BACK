import express from "express";
import prisma from "./lib/prisma";
import bcrypt from "bcrypt";
import 'dotenv/config';

const app = express();

app.use(express.json());

app.post("/user", async (req, res) => {
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




app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});