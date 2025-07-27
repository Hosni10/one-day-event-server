import { z } from "zod";
import mongoose from "mongoose";

export const insertRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  department: z.string().min(1, "Department is required"),
  gender: z.enum(["male", "female"]),
  parentTshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  bringingKids: z.boolean(),
  numberOfKids: z.number().min(0).optional(),
  kids: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    age: z.number().min(0).max(18, "Age is required"),
    gender: z.enum(["male", "female"]),
    tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"])
  })).optional(),
  spouse: z.object({
    name: z.string().min(1, "Name is required"),
    age: z.number().min(0, "Age is required"),
    gender: z.enum(["male", "female"]),
    tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"])
  }).optional(),
  entertainmentSports: z.array(z.string()).optional(),
  interestedInCompeting: z.boolean(),
  competitiveSports: z.array(z.string()).optional(),
  lastExercise: z.string().optional(),
  medicalConditions: z.array(z.string()).min(1, "Please select at least one medical condition."),
  currentMedications: z.string().optional(),
  previousInjuries: z.string().optional(),
  physicalLimitations: z.string().optional(),
  healthConcerns: z.string().optional(),
  bringingSpouse: z.boolean().optional(),
  // Physical Activity Readiness Questionnaire
  hasMedicalConditions: z.boolean().optional(),
  hasHeartCondition: z.boolean().optional(),
  hasChestPain: z.boolean().optional(),
  hasBalanceIssues: z.boolean().optional(),
  // Medical Details
  hasOtherHealthInfo: z.boolean().optional(),
  isTakingMedications: z.boolean().optional(),
  hasImmediateHealthConcerns: z.boolean().optional(),
  // Declaration
  guardianName: z.string().optional(),
  guardianSignature: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  doctorClearance: z.boolean()
});

// TypeScript types
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export interface RegistrationType extends InsertRegistration {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose schema
const registrationSchema = new mongoose.Schema<RegistrationType>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  parentTshirtSize: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"], required: true },
  bringingKids: { type: Boolean, required: true },
  numberOfKids: { type: Number, min: 0 },
  kids: [{
    name: { type: String, required: true },
    age: { type: Number, min: 0, max: 18 ,required: true},
    gender: { type: String, enum: ["male", "female"] },
    tshirtSize: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] }
  }],
  spouse: {
    name: { type: String },
    age: { type: Number, min: 0 },
    gender: { type: String, enum: ["male", "female"] },
    tshirtSize: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] }
  },
  entertainmentSports: [String],
  interestedInCompeting: { type: Boolean, required: true },
  competitiveSports: [String],
  lastExercise: { type: String, required: true },
  medicalConditions: [String],
  currentMedications: String,
  previousInjuries: String,
  physicalLimitations: String,
  healthConcerns: String,
  bringingSpouse: { type: Boolean },
  // Physical Activity Readiness Questionnaire
  hasMedicalConditions: Boolean,
  hasHeartCondition: Boolean,
  hasChestPain: Boolean,
  hasBalanceIssues: Boolean,
  // Medical Details
  hasOtherHealthInfo: Boolean,
  isTakingMedications: Boolean,
  hasImmediateHealthConcerns: Boolean,
  // Declaration
  guardianName: String,
  guardianSignature: String,
  emergencyContactRelation: String,
  doctorClearance: { type: Boolean, required: true }
}, {
  timestamps: true
});

// Mongoose model
export const Registration = mongoose.model<RegistrationType>("Registration", registrationSchema); 