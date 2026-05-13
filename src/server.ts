import express from "express";
import userRouter from "./routes/usuario.router"
import chamadoRouter from "./routes/chamado.router"

import 'dotenv/config';

const app = express();


app.use(express.json());
app.use(userRouter)
app.use(chamadoRouter)

app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
});