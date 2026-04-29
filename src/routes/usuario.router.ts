import { Router } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

const router = Router()

router.post("/user", async (req, res) => {
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
  const {email, senha} = req.body

  if (!email || !senha){
    return res.status(401).json({error: "Informe Email e senha!"})
  }

  const user = await prisma.funcionario.findFirst({where: {email}})
  
  if(!user){ 
  return res.status(404).json({error: "usuario não encontrado"})
  }

  if (!(await bcrypt.compare(senha, user.senha))){
    return res.status(401).json({error: "Credenciais invalidas"})
  }

  return res.status(200).json("login realizado com sucesso!")
})

export default router