import express from "express";
import Patient from "../modules/Patient.js";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { verifyToken } from "../middleware/auth.js"; // JWT middleware

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Cloudinary storage for medical reports
const medicalReportStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "medical_reports",
        resource_type: "auto",  // Supports pdf, docx, images
        allowed_formats: ["pdf", "docx", "jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage: medicalReportStorage });

// =======================
// CREATE new patient (Protected)
// =======================
router.post("/", verifyToken, upload.single("medicalReport"), async (req, res) => {
    try {
        const patientData = {};

        // Safely parse JSON fields
        Object.keys(req.body).forEach((key) => {
            try {
                patientData[key] = JSON.parse(req.body[key]);
            } catch {
                patientData[key] = req.body[key];
            }
        });

        // Ensure nested history object exists
        if (!patientData.history) patientData.history = {};

        // Store Cloudinary URL
        if (req.file) {
            patientData.history.medicalReport = req.file.path;
        }

        const newPatient = new Patient(patientData);
        await newPatient.save();

        res.status(201).json({ success: true, patient: newPatient });
    } catch (err) {
        console.error("Error creating patient:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// =======================
// GET all patients (Protected)
// =======================
router.get("/", verifyToken, async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ success: true, patients });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// =======================
// DELETE patient by ID (Protected)
// =======================
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deleted = await Patient.findByIdAndDelete(req.params.id);

        if (!deleted)
            return res.status(404).json({ success: false, message: "Patient not found" });

        res.status(200).json({ success: true, message: "Patient deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
