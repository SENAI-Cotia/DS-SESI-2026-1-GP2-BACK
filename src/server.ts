import express from "express";
import prisma from "./lib/prisma";
import bcrypt from "bcrypt"

const app = express();

app.use(express.json());

app.post("/users", async (req, res) => {
    const { nome, senha, email, departamento, cpf } = req.body

    const regexMaiuscula = /[A-Z]/;



    if (senha.length < 8) {
        return res.status(400).json({ erro: "A senha deve ter mais de 8" })
    }
    if (!regexMaiuscula.test(senha)) {
        return res.status(400).json({ error: "A senha deve conter pelo menos uma letra maiúscula" })
    }


    const senhaCryptografada = await bcrypt.hash(senha, 10)
    const funcionario = await prisma.funcionario.create({
        data: { nome, senha: senhaCryptografada, email, departamento}
    })

    return res.status(201).json(funcionario)
})



app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});
