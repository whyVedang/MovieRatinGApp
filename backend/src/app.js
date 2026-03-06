import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/favorite", favoriteRouter);
app.use("/api/v1/review", reviewRouter);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'MovieMate API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});