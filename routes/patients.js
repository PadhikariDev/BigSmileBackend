import express from "express";
import Patient from "../modules/Patient.js";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const router = express.Router();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


const medicalReportStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "medical_reports",
        resource_type: "image",   // very important for PDFs / docs
        allowed_formats: ["pdf", "docx", "jpg", "jpeg", "png"]
    }
});

const upload = multer({ storage: medicalReportStorage });


router.post("/", upload.single("medicalReport"), async (req, res) => {
    try {
        const patientData = {};

        // Parse stringified JSON fields safely
        Object.keys(req.body).forEach((key) => {
            try {
                patientData[key] = JSON.parse(req.body[key]);
            } catch {
                patientData[key] = req.body[key];
            }
        });

        // Ensure nested history object
        if (!patientData.history) patientData.history = {};

        // Store Cloudinary file URL
        if (req.file) {
            patientData.history.medicalReport = req.file.path; // Cloudinary URL
        }

        const newPatient = new Patient(patientData);
        await newPatient.save();

        res.status(201).json({ success: true, patient: newPatient });
    } catch (err) {
        console.error("Error creating patient:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ success: true, patients });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Patient.findByIdAndDelete(req.params.id);

        if (!deleted)
            return res.status(404).json({ success: false, message: "Patient not found" });

        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
