import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import doctorRoutes from "./routes/doctors.js";
import patientRoutes from "./routes/patients.js"; // <-- Add this
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // replace with your frontend URL
    credentials: true
}));

app.use(express.json()); // for parsing JSON

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded files (images, PDFs)
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes); // <-- Add this
app.use("/admin", adminRoutes);

// Root route (optional)
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
