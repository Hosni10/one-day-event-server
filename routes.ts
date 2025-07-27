import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "./schema";
import { z } from "zod";
import { sendConfirmationEmail } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Register for sports day
  app.post("/api/registrations", async (req, res) => {
    console.log("Registration route hit");
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      
      // Check if email already exists
      const existingRegistration = await storage.getRegistrationByEmail(validatedData.email);
      if (existingRegistration) {
        return res.status(400).json({ 
          message: "This email is already registered. Each employee can only register once for the sports day event." 
        });
      }

      const registration = await storage.createRegistration(validatedData);
      
      // Send confirmation email
      console.log("Calling sendConfirmationEmail");
      try {
        await sendConfirmationEmail(validatedData);
        console.log(`Confirmation email sent to ${validatedData.email}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the registration if email fails, but log the error
      }
      
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Create a more user-friendly validation error message
        const fieldErrors = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        }).join(', ');
        
        return res.status(400).json({
          message: "Please check your registration details and try again.",
          details: fieldErrors,
          errors: error.errors,
        });
      }
      res.status(500).json({ 
        message: "We're experiencing technical difficulties. Please try again in a few moments." 
      });
    }
  });

  // Get all registrations (for admin/export)
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ 
        message: "Unable to retrieve registrations at this time. Please try again later." 
      });
    }
  });

  // Export registrations as CSV
  app.get("/api/registrations/export", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      
      // Create CSV headers
      const headers = [
        "ID", "Full Name", "Email", "Phone", "Department", "Gender", "T-Shirt Size",
        "Bringing Kids", "Number of Kids", "Kids Details", "Entertainment Sports",
        "Interested in Competing", "Competitive Sports", "Last Exercise", 
        "Medical Conditions", "Current Medications", "Previous Injuries", 
        "Physical Limitations", "Health Concerns", 
        // Physical Activity Readiness Questionnaire
        "Has Medical Conditions", "Has Heart Condition", "Has Chest Pain", "Has Balance Issues",
        // Medical Details
        "Has Other Health Info", "Is Taking Medications", "Has Immediate Health Concerns",
        // Declaration
        "Guardian Name", "Guardian Signature",
        "Emergency Contact Name", 
        "Emergency Contact Phone", "Emergency Contact Relation", "Doctor Clearance"
      ];
      
      // Create CSV rows
      const rows = registrations.map(reg => [
        reg._id?.toString() || "",
        reg.fullName,
        reg.email,
        reg.phone,
        reg.department,
        reg.gender,
        reg.parentTshirtSize,
        reg.bringingKids ? "Yes" : "No",
        reg.numberOfKids || 0,
        reg.kids ? reg.kids.map((kid: any) => `Name: ${kid.name}, Age: ${kid.age}, Gender: ${kid.gender}, Size: ${kid.tshirtSize}`).join("; ") : "",
        reg.entertainmentSports?.join(", ") || "",
        reg.interestedInCompeting ? "Yes" : "No",
        reg.competitiveSports?.join(", ") || "",
        reg.lastExercise,
        reg.medicalConditions?.join(", ") || "",
        reg.currentMedications || "",
        reg.previousInjuries || "",
        reg.physicalLimitations || "",
        reg.healthConcerns || "",
        // Physical Activity Readiness Questionnaire
        reg.hasMedicalConditions ? "Yes" : "No",
        reg.hasHeartCondition ? "Yes" : "No",
        reg.hasChestPain ? "Yes" : "No",
        reg.hasBalanceIssues ? "Yes" : "No",
        // Medical Details
        reg.hasOtherHealthInfo ? "Yes" : "No",
        reg.isTakingMedications ? "Yes" : "No",
        reg.hasImmediateHealthConcerns ? "Yes" : "No",
        // Declaration
        reg.guardianName || "",
        reg.guardianSignature || "",
        reg.emergencyContactName || "",
        reg.emergencyContactPhone || "",
        reg.emergencyContactRelation || "",
        reg.doctorClearance ? "Yes" : "No"
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sports-day-registrations.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ 
        message: "Unable to export registrations at this time. Please try again later." 
      });
    }
  });

  return createServer(app);
}
