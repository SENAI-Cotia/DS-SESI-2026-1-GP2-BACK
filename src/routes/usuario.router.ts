import { Router } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

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

const router = Router()
// listando tecnico
router.get("/tecnicos",verificarToken, async (req, res) => {
    try {
        const tecnicos = await prisma.tecnico.findMany();
        return res.status(200).json(tecnicos);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar técnicos" });
    }
});




router.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Validar se os campos foram enviados
        if (!email || !senha) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
        }

        // 2. Buscar o técnico no banco de dados pelo e-mail
        const tecnico = await prisma.tecnico.findUnique({
            where: { email }
        });

        // 3. Verificar se o técnico existe
        if (!tecnico) {
            return res.status(401).json({ error: "E-mail ou senha incorretos" });
        }

        // 4. Comparar a senha enviada com a senha criptografada no banco
        const senhaValida = await bcrypt.compare(senha, tecnico.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: "E-mail ou senha incorretos" });
        }

        // 5. Se chegou aqui, as credenciais estão certas. Geramos o Token!
        const token = jwt.sign(
            { id: tecnico.id, email: tecnico.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' } // O token vale por 24 horas
        );

        // 6. Retornamos o token e alguns dados do técnico (menos a senha!)
        return res.json({
            token,
            tecnico: {
                id: tecnico.id,
                nome: tecnico.nome,
                email: tecnico.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno no servidor" });
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
        const { nome, senha, habilidades, status, cpf, email } = req.body;

        if (!nome || !senha || !habilidades || !status || !cpf || !email) {
            return res.status(400).json({ "error": "Informe todos os campos" });
        }

        const senhaCryptografada = await bcrypt.hash(senha, 10);

        const tecnico = await prisma.tecnico.create({
            data: { nome, senha: senhaCryptografada, habilidades, status, cpf, email }
        });

        const token = jwt.sign(
            { id: tecnico.id, email: tecnico.email }, 
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        return res.status(201).json({
            tecnico,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ "error": "ocorreu um erro ao criar o tecnico" });
    }
}); 

router.delete("/tecnicos/:id", verificarToken, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.tecnico.delete({ where: { id } });
        return res.status(200).json({ mensagem: "Técnico deletado com sucesso!" });
    } catch (error) {
        return res.status(404).json({ mensagem: "Técnico não encontrado" });
    }
});

// editar técnico
router.put("/tecnicos/:id", verificarToken, async (req, res) => {
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