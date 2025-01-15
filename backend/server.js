import express from 'express';
import dotenv from 'dotenv';
import { connection } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';



dotenv.config();

const app=express();
app.use(cors());

app.use(express.json());

app.use('/api/users',userRoutes)


app.get("/",(req,res)=>{
    res.send("server is ready");
});
 
app.listen(5000,()=> {
    connection();
    console.log("server started at https://localhost:5000");
});

