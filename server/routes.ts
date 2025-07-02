import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { FilterOptions } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  // Get company by ID
  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const company = await storage.getCompany(id);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Get job postings with filters
  app.get("/api/jobs", async (req, res) => {
    try {
      const filters: FilterOptions = {};
      
      if (req.query.industries) {
        filters.industries = Array.isArray(req.query.industries) 
          ? req.query.industries as string[]
          : [req.query.industries as string];
      }
      
      if (req.query.locations) {
        filters.locations = Array.isArray(req.query.locations)
          ? req.query.locations as string[]
          : [req.query.locations as string];
      }
      
      if (req.query.salaryMin) {
        filters.salaryMin = parseInt(req.query.salaryMin as string);
      }
      
      if (req.query.salaryMax) {
        filters.salaryMax = parseInt(req.query.salaryMax as string);
      }
      
      if (req.query.experienceLevel) {
        filters.experienceLevel = req.query.experienceLevel as string;
      }
      
      if (req.query.employmentType) {
        filters.employmentType = req.query.employmentType as string;
      }
      
      if (req.query.isRemote !== undefined) {
        filters.isRemote = req.query.isRemote === 'true';
      }
      
      const jobs = await storage.getJobPostings(filters);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job postings" });
    }
  });

  // Get job posting by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJobPosting(id);
      
      if (!job) {
        return res.status(404).json({ message: "Job posting not found" });
      }
      
      // Increment view count
      await storage.incrementJobViewCount(id);
      
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job posting" });
    }
  });

  // Get job statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const filters: FilterOptions = {};
      
      if (req.query.industries) {
        filters.industries = Array.isArray(req.query.industries) 
          ? req.query.industries as string[]
          : [req.query.industries as string];
      }
      
      if (req.query.locations) {
        filters.locations = Array.isArray(req.query.locations)
          ? req.query.locations as string[]
          : [req.query.locations as string];
      }
      
      if (req.query.salaryMin) {
        filters.salaryMin = parseInt(req.query.salaryMin as string);
      }
      
      if (req.query.salaryMax) {
        filters.salaryMax = parseInt(req.query.salaryMax as string);
      }
      
      if (req.query.experienceLevel) {
        filters.experienceLevel = req.query.experienceLevel as string;
      }
      
      if (req.query.employmentType) {
        filters.employmentType = req.query.employmentType as string;
      }
      
      if (req.query.isRemote !== undefined) {
        filters.isRemote = req.query.isRemote === 'true';
      }
      
      const statistics = await storage.getJobStatistics(filters);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get bookmarks for user
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const bookmarks = await storage.getBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Create bookmark
  app.post("/api/bookmarks", async (req, res) => {
    try {
      const { jobId, userId } = req.body;
      
      if (!jobId || !userId) {
        return res.status(400).json({ message: "Job ID and User ID are required" });
      }
      
      const bookmark = await storage.createBookmark({ jobId, userId });
      res.status(201).json(bookmark);
    } catch (error) {
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  // Delete bookmark
  app.delete("/api/bookmarks", async (req, res) => {
    try {
      const { jobId, userId } = req.body;
      
      if (!jobId || !userId) {
        return res.status(400).json({ message: "Job ID and User ID are required" });
      }
      
      await storage.deleteBookmark(jobId, userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
