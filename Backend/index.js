import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import connectDB from './db/db.js';
import cors from "cors";
const app = express();
dotenv.config();
connectDB();
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // if using cookies or authorization headers
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use("/api/v1/user", userRoutes);








app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
})







