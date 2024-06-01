import express from "express";
import dotenv from "dotenv";
import { db } from './db.js'; // Corrected ixmport statement
import {jwtAuthMiddleware} from './jwt.js';
import userRoutes from './routes/userRoutes.js'
import partyRoutes from './routes/partyRoutes.js'
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());  
dotenv.config();
// by default sare routes me /user end point lagjayega
// use the router by using middleware
app.use('/user',userRoutes);
//only admin user authenticated to access party routes
//implemented party routes 
app.use('/party',jwtAuthMiddleware,partyRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server started on following PORT:${PORT}`);
});

