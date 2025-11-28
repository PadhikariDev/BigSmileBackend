import { v2 as cloudinary } from "cloudinary";
import express from "express";
import Doctor from "../modules/Doctors.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";  // Cloudinary storage

const router = express.Router();

// Use Cloudinary-based multer storage
const upload = multer({ storage });

// GET all doctors
router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST add doctor
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name, speciality } = req.body;

        let image = null;
        let imagePublicId = null;

        if (req.file) {
            image = req.file.path;                     
            imagePublicId = req.file.filename;         
        }

        const newDoctor = new Doctor({ name, speciality, image, imagePublicId });
        const savedDoctor = await newDoctor.save();

        res.json(savedDoctor);
    } catch (err) {
        console.log("Doctor add error:", err);
        res.status(400).json({ message: err.message });
    }
});


// DELETE doctor by name
router.delete("/name/:name", async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ name: req.params.name });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }


        // Delete image from Cloudinary if it exists
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
