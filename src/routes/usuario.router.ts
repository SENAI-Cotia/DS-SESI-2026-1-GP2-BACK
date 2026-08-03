
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import { Router } from "express";
const router = Router();

const verificarToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);


        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};
//listagem
router.get("/listarFuncionarios", async (req, res) => {
    console.log("REQUISIÇÃO DE LISTAGEM RECEBIDA")

    try {
        const funcionarios = await prisma.funcionario.findMany()
        return res.status(200).json(funcionarios)
    } catch (erro) {
        console.error(erro)
        return res.status(500).json({ erro: "Erro ao listar os funcionários." })
    }
})


// cadastro funcionario
router.post("/cadastroFuncionario", async (req, res) => {
    console.log("REQUISIÇÃO RECEBIDA")


    const { nome, senha, departamento } = req.body

    const regexMaiuscula = /[A-Z]/;
    const regexCaracterEspecial = /[^a-zA-Z0-9\s]/;
    const regexNumero = /\d/;

    // tirar isso pq nn vamos usar o email aq
    // nn tem lugar para colocar email no mobile, entao nn tem pq validar email
    // const funcionarioExistente = await prisma.funcionario.findUnique({
    //     where: { email }
    // });


    const regexNomeCompleto = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

    const funcionarioExistente = await prisma.funcionario.findFirst({
        where: { nome: nome }
    });

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
    if (!departamento) {
        return res.status(400).json({ error: "Campo obrigatorio" })
    }
    if (funcionarioExistente) {
        return res.status(400).json({ erro: "Este funcionário já está cadastrado." });
    }


    const senhaCryptografada = await bcrypt.hash(senha, 10)
    const funcionario = await prisma.funcionario.create({
        data: {
            nome,
            senha: senhaCryptografada,
            departamento
        }
    })

    return res.status(201).json(funcionario)
})

//login funcionario

router.post("/loginFuncionario", async (req, res) => {
    console.log("REQUISIÇÃO DE LOGIN RECEBIDA")
    
    const { nome, senha } = req.body

    // 1. Valida se os campos foram enviados
    if (!nome || !senha) {
        return res.status(400).json({ error: "Informe Nome e Senha!" })
    }

    const user = await prisma.funcionario.findFirst({ 
        where: { nome: nome } 
    })


    // 3. Bloqueia se o usuário não existir
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" })
    }

    // 4. Compara a senha digitada com a criptografada do banco
    if (!(await bcrypt.compare(senha, user.senha))) {
        return res.status(401).json({ error: "Credenciais inválidas" })
    }

    // 5. Retorna o sucesso e os dados do usuário (menos a senha)
    return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        usuario: {
            id: user.id,
            nome: user.nome,
            departamento: user.departamento
        }
    })
})


export default router


