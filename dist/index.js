// index.ts
import express2 from "express";

// routes.ts
import { createServer } from "http";

// storage.ts
import mongoose2 from "mongoose";

// schema.ts
import { z } from "zod";
import mongoose from "mongoose";
var insertRegistrationSchema = z.object({
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
  entertainmentSports: z.array(z.string()).optional(),
  interestedInCompeting: z.boolean(),
  competitiveSports: z.array(z.string()).optional(),
  lastExercise: z.string().optional(),
  medicalConditions: z.array(z.string()).min(1, "Please select at least one medical condition."),
  currentMedications: z.string().optional(),
  previousInjuries: z.string().optional(),
  physicalLimitations: z.string().optional(),
  healthConcerns: z.string().optional(),
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
var registrationSchema = new mongoose.Schema({
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
    age: { type: Number, min: 0, max: 18, required: true },
    gender: { type: String, enum: ["male", "female"] },
    tshirtSize: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] }
  }],
  entertainmentSports: [String],
  interestedInCompeting: { type: Boolean, required: true },
  competitiveSports: [String],
  lastExercise: { type: String, required: true },
  medicalConditions: [String],
  currentMedications: String,
  previousInjuries: String,
  physicalLimitations: String,
  healthConcerns: String,
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
  emergencyContactName: String,
  emergencyContactPhone: String,
  emergencyContactRelation: String,
  doctorClearance: { type: Boolean, required: true }
}, {
  timestamps: true
});
var Registration = mongoose.model("Registration", registrationSchema);

// storage.ts
var MongoStorage = class {
  constructor() {
    this.connect();
  }
  async connect() {
    if (mongoose2.connection.readyState === 0) {
      const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27018/sports-day";
      try {
        await mongoose2.connect(mongoUri);
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("MongoDB connection error:", error);
        console.log("Falling back to in-memory storage");
      }
    }
  }
  async getRegistration(id) {
    try {
      const registration = await Registration.findById(id);
      return registration || void 0;
    } catch (error) {
      console.error("Error getting registration:", error);
      return void 0;
    }
  }
  async getRegistrationByEmail(email) {
    try {
      const registration = await Registration.findOne({ email });
      return registration || void 0;
    } catch (error) {
      console.error("Error getting registration by email:", error);
      return void 0;
    }
  }
  async createRegistration(insertRegistration) {
    try {
      const registration = new Registration(insertRegistration);
      await registration.save();
      return registration;
    } catch (error) {
      console.error("Error creating registration:", error);
      throw error;
    }
  }
  async getAllRegistrations() {
    try {
      const registrations = await Registration.find();
      return registrations;
    } catch (error) {
      console.error("Error getting all registrations:", error);
      return [];
    }
  }
};
var storage = new MongoStorage();

// routes.ts
import { z as z2 } from "zod";

// emailService.ts
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
var emailConfig = {
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};
var transporter = createTransport(emailConfig);
var createConfirmationEmail = (registration) => {
  const kidsInfo = registration.kids && registration.kids.length > 0 ? registration.kids.map((kid) => `- ${kid.name} (Age: ${kid.age}, Gender: ${kid.gender}, T-Shirt: ${kid.tshirtSize})`).join("\n") : "None";
  const entertainmentSports = registration.entertainmentSports?.join(", ") || "None";
  const competitiveSports = registration.competitiveSports?.join(", ") || "None";
  return {
    subject: "\u{1F389} DOF Registration Confirmation",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DOF Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
          .success-badge { background: #4CAF50; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 20px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0; }
          @media (max-width: 600px) {
            .info-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>\u{1F3C6} DOF Registration Confirmed!</h1>
            <p>Thank you for registering for our Company Day of family Event</p>
          </div>
          
          <div class="content">
            <div class="success-badge">\u2705 Registration Successful</div>
            
            <div class="section">
              <h3>\u{1F4CB} Registration Details</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Full Name:</div>
                  <div class="value">${registration.fullName}</div>
                </div>
                <div class="info-item">
                  <div class="label">Email:</div>
                  <div class="value">${registration.email}</div>
                </div>
                <div class="info-item">
                  <div class="label">Phone:</div>
                  <div class="value">${registration.phone}</div>
                </div>
                <div class="info-item">
                  <div class="label">Department:</div>
                  <div class="value">${registration.department}</div>
                </div>
                <div class="info-item">
                  <div class="label">Gender:</div>
                  <div class="value">${registration.gender}</div>
                </div>
                <div class="info-item">
                  <div class="label">T-Shirt Size:</div>
                  <div class="value">${registration.parentTshirtSize}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466} Family Information</h3>
              <div class="info-item">
                <div class="label">Bringing Kids:</div>
                <div class="value">${registration.bringingKids ? "Yes" : "No"}</div>
              </div>
              ${registration.bringingKids ? `
                <div class="info-item">
                  <div class="label">Number of Kids:</div>
                  <div class="value">${registration.numberOfKids}</div>
                </div>
                <div class="info-item">
                  <div class="label">Kids Details:</div>
                  <div class="value">${kidsInfo}</div>
                </div>
              ` : ""}
            </div>

            <div class="section">
              <h3>\u26BD Sports Preferences</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Entertainment Sports:</div>
                  <div class="value">${entertainmentSports}</div>
                </div>
                <div class="info-item">
                  <div class="label">Interested in Competing:</div>
                  <div class="value">${registration.interestedInCompeting ? "Yes" : "No"}</div>
                </div>
                ${registration.interestedInCompeting ? `
                  <div class="info-item">
                    <div class="label">Competitive Sports:</div>
                    <div class="value">${competitiveSports}</div>
                  </div>
                ` : ""}
              </div>
            </div>

            <div class="section">
              <h3>\u{1F4AA} Health Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Last Exercise:</div>
                  <div class="value">${registration.lastExercise}</div>
                </div>
                <div class="info-item">
                  <div class="label">Medical Conditions:</div>
                  <div class="value">${registration.medicalConditions?.join(", ") || "None"}</div>
                </div>
              </div>
            </div>

            <div class="highlight">
              <strong>\u{1F4C5} Event Details:</strong><br>
              \u2022 Date: 17th August 2025<br>
              \u2022 Time: 8:00 AM - 6:00 PM<br>
              \u2022 Location: Adnec Abu Dhabi Summer Sports hall 9<br>

              <br>
              <strong>\u{1F3AF} Important Notes:</strong><br>
              \u2022 Please arrive 15 minutes before the event starts<br>
              \u2022 All participants will receive their event t-shirts on the day<br>
            </div>

            <div class="footer">
              <p>If you have any questions, please contact the event organizers.</p>
              <p>We look forward to seeing you at the Sports Day!</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Sports Day Registration Confirmation

Dear ${registration.fullName},

Thank you for registering for our Company Sports Day Event! Your registration has been successfully received.

REGISTRATION DETAILS:
- Full Name: ${registration.fullName}
- Email: ${registration.email}
- Phone: ${registration.phone}
- Department: ${registration.department}
- Gender: ${registration.gender}
- T-Shirt Size: ${registration.parentTshirtSize}

FAMILY INFORMATION:
- Bringing Kids: ${registration.bringingKids ? "Yes" : "No"}
${registration.bringingKids ? `- Number of Kids: ${registration.numberOfKids}
- Kids Details: ${kidsInfo}` : ""}

SPORTS PREFERENCES:
- Entertainment Sports: ${entertainmentSports}
- Interested in Competing: ${registration.interestedInCompeting ? "Yes" : "No"}
${registration.interestedInCompeting ? `- Competitive Sports: ${competitiveSports}` : ""}

HEALTH INFORMATION:
- Last Exercise: ${registration.lastExercise}
- Medical Conditions: ${registration.medicalConditions?.join(", ") || "None"}

EVENT DETAILS:
- Date: [Event Date]
- Time: [Event Time]
- Location: [Event Location]

IMPORTANT NOTES:
- Please arrive 15 minutes before the event starts
- All participants will receive their event t-shirts on the day
- Medical staff will be available throughout the event
- Refreshments and snacks will be provided

If you have any questions, please contact the event organizers.

We look forward to seeing you at the Sports Day!

Best regards,
The Sports Day Team
    `
  };
};
var sendConfirmationEmail = async (registration) => {
  try {
    const emailContent = createConfirmationEmail(registration);
    const mailOptions = {
      from: `"Sports Day Team" <${emailConfig.auth.user}>`,
      to: registration.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw new Error("Failed to send confirmation email");
  }
};
var verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("Email configuration verified successfully");
    return true;
  } catch (error) {
    console.error("Email configuration verification failed:", error);
    return false;
  }
};

// routes.ts
async function registerRoutes(app2) {
  app2.post("/api/registrations", async (req, res) => {
    console.log("Registration route hit");
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const existingRegistration = await storage.getRegistrationByEmail(validatedData.email);
      if (existingRegistration) {
        return res.status(400).json({
          message: "This email is already registered. Each employee can only register once for the sports day event."
        });
      }
      const registration = await storage.createRegistration(validatedData);
      console.log("Calling sendConfirmationEmail");
      try {
        await sendConfirmationEmail(validatedData);
        console.log(`Confirmation email sent to ${validatedData.email}`);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        const fieldErrors = error.errors.map((err) => {
          const field = err.path.join(".");
          return `${field}: ${err.message}`;
        }).join(", ");
        return res.status(400).json({
          message: "Please check your registration details and try again.",
          details: fieldErrors,
          errors: error.errors
        });
      }
      res.status(500).json({
        message: "We're experiencing technical difficulties. Please try again in a few moments."
      });
    }
  });
  app2.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({
        message: "Unable to retrieve registrations at this time. Please try again later."
      });
    }
  });
  app2.get("/api/registrations/export", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      const headers = [
        "ID",
        "Full Name",
        "Email",
        "Phone",
        "Department",
        "Gender",
        "T-Shirt Size",
        "Bringing Kids",
        "Number of Kids",
        "Kids Details",
        "Entertainment Sports",
        "Interested in Competing",
        "Competitive Sports",
        "Last Exercise",
        "Medical Conditions",
        "Current Medications",
        "Previous Injuries",
        "Physical Limitations",
        "Health Concerns",
        // Physical Activity Readiness Questionnaire
        "Has Medical Conditions",
        "Has Heart Condition",
        "Has Chest Pain",
        "Has Balance Issues",
        // Medical Details
        "Has Other Health Info",
        "Is Taking Medications",
        "Has Immediate Health Concerns",
        // Declaration
        "Guardian Name",
        "Guardian Signature",
        "Emergency Contact Name",
        "Emergency Contact Phone",
        "Emergency Contact Relation",
        "Doctor Clearance"
      ];
      const rows = registrations.map((reg) => [
        reg._id?.toString() || "",
        reg.fullName,
        reg.email,
        reg.phone,
        reg.department,
        reg.gender,
        reg.parentTshirtSize,
        reg.bringingKids ? "Yes" : "No",
        reg.numberOfKids || 0,
        reg.kids ? reg.kids.map((kid) => `Name: ${kid.name}, Age: ${kid.age}, Gender: ${kid.gender}, Size: ${kid.tshirtSize}`).join("; ") : "",
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
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))
      ].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="sports-day-registrations.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({
        message: "Unable to export registrations at this time. Please try again later."
      });
    }
  });
  return createServer(app2);
}

// vite.ts
import express from "express";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// index.ts
var app = express2();
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173"
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const emailConfigValid = await verifyEmailConfig();
  if (!emailConfigValid) {
    log("\u26A0\uFE0F  Email configuration is invalid. Confirmation emails will not be sent.");
    log("\u{1F4E7} Please check your SMTP settings in the environment variables.");
  } else {
    log("\u2705 Email configuration verified successfully");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
