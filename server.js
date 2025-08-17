import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import mongoose from 'mongoose';
import authrouter from './routes/authRoutes/authRoutes.js';
import msgrouter from './routes/msgRoutes/msgRoutes.js';

const app = express();
app.use(express.json())
app.use(cors())
dotenv.config()

const server = http.createServer(app);

server.listen(process.env.SERVER_PORT || 5000, () => {
    console.log(`Server running on http://localhost:${process.env.SERVER_PORT || 5000}`);
});

async function initServer() {
    try { 
        await mongoose.connect(process.env.DB_mongoURI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to start server:", err);
    }
}
initServer();

app.get('/', (req, res) => {
    res.send("Server is running and databases are connected!");
});

app.use('/auth', authrouter);
app.use('/messages', msgrouter);

app.use((req, res) => {
    res.status(404).json({ code: 1, message: "ERROR 404! Page not Found, Check the URL" });
});