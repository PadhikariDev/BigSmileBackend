import { v2 as cloudinary } from "cloudinary";
import express from "express";
import Doctor from "../modules/Doctors.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";  // Cloudinary storage
import { verifyToken } from "../middleware/auth.js"; // JWT auth middleware

const router = express.Router();
const upload = multer({ storage });

// =======================
// GET all doctors (Protected)
// =======================
router.get("/", verifyToken, async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =======================
// POST add doctor (Protected)
// =======================
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const { name, speciality } = req.body;

        if (!name || !speciality || !req.file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const image = req.file.path;
        const imagePublicId = req.file.filename;

        const newDoctor = new Doctor({ name, speciality, image, imagePublicId });
        const savedDoctor = await newDoctor.save();

        res.json(savedDoctor);
    } catch (err) {
        console.error("Doctor add error:", err);
        res.status(400).json({ message: err.message });
    }
});

// =======================
// DELETE doctor by name (Protected)
// =======================
router.delete("/name/:name", verifyToken, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ name: req.params.name });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Delete image from Cloudinary
        if (doctor.imagePublicId) {
            const result = await cloudinary.uploader.destroy(doctor.imagePublicId);
            console.log("Cloudinary delete result:", result);
        }

        // Delete doctor from DB
        await Doctor.findByIdAndDelete(doctor._id);

        res.json({ message: "Doctor removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
