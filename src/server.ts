import express from "express";
import prisma from "./lib/prisma";
import bcrypt from "bcrypt"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
    res.send("Hello World!");
});
app.post("/users", async (req, res) => {
    const { name, password } = req.body

    const regexMaiuscula = /[A-Z]/;



    if (password.length < 8) {
        return res.status(400).json({ erro: "A senha deve ter mais de 8" })
    }
    if (!regexMaiuscula.test(password)) {
        return res.status(400).json({ error: "A senha deve conter pelo menos uma letra maiúscula" })
    }


    const senhaCryptografada = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
        data: { name, password: senhaCryptografada }
    })

    return res.status(201).json(user)
})




app.post("/login", async (req, res) => {
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



app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});
