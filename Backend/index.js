import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})
import express from 'express';
import userRoutes from './routes/user.routes.js';
import swapRoutes from './routes/swap.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import adminRoutes from './routes/admin.routes.js';
import connectDB from './db/db.js';
import cors from "cors";
const app = express();


connectDB();
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // if using cookies or authorization headers
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use("/api/v1/user", userRoutes);
app.use("/api/v1/swap", swapRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/admin", adminRoutes);








app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
})







