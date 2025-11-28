// models/Patient.js
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    general: {
        opdNumber: { type: String, required: true },
        visitType: String,
        date: Date,
        name: { type: String, required: true },
        age: Number,
        gender: String,
        address: String,
        phone: String,
        occupation: String,
        maritalStatus: String,
        facialAsymmetry: String,
        facialProfile: String,
        familyHistory: String,
        chiefComplaint: { type: String, required: true },
    },
    history: {
        presentingIllness: String,
        medicalHistory: [String],
        personalHistory: [String],
        pastDentalHistory: [String],
        familyHistory: String,
        medicalReport: String, // store file path or URL
    },
    prescription: {
        selectedConditions: [String],
        toothConditions: mongoose.Schema.Types.Mixed, // { "11": ["condition1"], "12": ["condition2"] }
    },
    evaluation: {
        muscleSides: {
            type: mongoose.Schema.Types.Mixed,
            default: {} // e.g., { "Masseter": ["Left"], "Temporalis": ["Right"] }
        },
        tmjSides: {
            type: mongoose.Schema.Types.Mixed,
            default: {} // e.g., { "Pain": ["Left"], "Clicking": ["No"] }
        },
        nodeSides: {
            type: mongoose.Schema.Types.Mixed,
            default: {} // e.g., { "Submandibular": ["Left Palpable"] }
        },
        occlusalSides: {
            type: mongoose.Schema.Types.Mixed,
            default: {} // e.g., { "Right Molar": ["Class I"], "Anterior": ["Class III"] }
        }
    }, examine: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            occlusal: {},
            decayed: {},
            mobility: {},
            permaTeeth: {},
            malocclusion: {},
            diagnosis: {},
            restorative: {},
            surgical: {},
            prosthetic: {},
        },
    },
    evaluation: {
        muscleSides: { type: mongoose.Schema.Types.Mixed, default: {} },
        tmjSides: { type: mongoose.Schema.Types.Mixed, default: {} },
        nodeSides: { type: mongoose.Schema.Types.Mixed, default: {} },
        occlusalSides: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Patient", PatientSchema);
