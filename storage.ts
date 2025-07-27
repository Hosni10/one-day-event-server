import mongoose from "mongoose";
import { Registration, type RegistrationType, type InsertRegistration } from "./schema";

export interface IStorage {
  getRegistration(id: string): Promise<any | undefined>;
  getRegistrationByEmail(email: string): Promise<any | undefined>;
  createRegistration(registration: InsertRegistration): Promise<any>;
  getAllRegistrations(): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  constructor() {
    this.connect();
  }

  private async connect() {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27018/sports-day';
      try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('MongoDB connection error:', error);
        // Fall back to in-memory storage for development
        console.log('Falling back to in-memory storage');
      }
    }
  }

  async getRegistration(id: string): Promise<any | undefined> {
    try {
      const registration = await Registration.findById(id);
      return registration || undefined;
    } catch (error) {
      console.error('Error getting registration:', error);
      return undefined;
    }
  }

  async getRegistrationByEmail(email: string): Promise<any | undefined> {
    try {
      const registration = await Registration.findOne({ email });
      return registration || undefined;
    } catch (error) {
      console.error('Error getting registration by email:', error);
      return undefined;
    }
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<any> {
    try {
      const registration = new Registration(insertRegistration);
      await registration.save();
      return registration;
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  }

  async getAllRegistrations(): Promise<any[]> {
    try {
      const registrations = await Registration.find();
      return registrations;
    } catch (error) {
      console.error('Error getting all registrations:', error);
      return [];
    }
  }
}

// Memory storage fallback for development
export class MemStorage implements IStorage {
  private registrations: Map<string, any>;

  constructor() {
    this.registrations = new Map();
  }

  async getRegistration(id: string): Promise<any | undefined> {
    return this.registrations.get(id);
  }

  async getRegistrationByEmail(email: string): Promise<any | undefined> {
    return Array.from(this.registrations.values()).find(
      (registration) => registration.email === email,
    );
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<any> {
    const id = new mongoose.Types.ObjectId().toString();
    const registration = { 
      ...insertRegistration, 
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.registrations.set(id, registration as any);
    return registration;
  }

  async getAllRegistrations(): Promise<any[]> {
    return Array.from(this.registrations.values());
  }
}

export const storage = new MongoStorage();
