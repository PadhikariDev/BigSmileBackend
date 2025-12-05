import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

// Login route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password required" });
    }

    // Check credentials
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        // Create JWT token
        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET,   // add JWT_SECRET in your .env
            { expiresIn: "2h" }
        );

        return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
});

export default router;
