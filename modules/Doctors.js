import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    available: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model("Doctor", doctorSchema);