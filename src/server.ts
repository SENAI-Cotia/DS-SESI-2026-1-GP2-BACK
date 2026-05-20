import express from "express";
import cors from "cors";
import userRouter from "./routes/usuario.router"
import chamadoRouter from "./routes/chamado.router"
import jwt from 'jsonwebtoken';
import 'dotenv/config';



import { Request, Response, NextFunction } from 'express';

const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    // O header vem como "Bearer <TOKEN>", vamos pegar só a segunda parte
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        // Se chegou aqui, o token é válido!
        next(); // Autoriza a execução da rota
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};












const app = express();


app.use(cors());
app.use(express.json());
app.use(userRouter)
app.use(chamadoRouter)

app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});