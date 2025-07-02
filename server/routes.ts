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

      if (req.query.techStack) {
        filters.techStack = Array.isArray(req.query.techStack)
          ? req.query.techStack as string[]
          : [req.query.techStack as string];
      }

      if (req.query.techStackOperation) {
        filters.techStackOperation = req.query.techStackOperation as 'AND' | 'OR';
      }

      if (req.query.jobCategory) {
        filters.jobCategory = req.query.jobCategory as string;
      }

      if (req.query.nonTechRequirements) {
        filters.nonTechRequirements = Array.isArray(req.query.nonTechRequirements)
          ? req.query.nonTechRequirements as string[]
          : [req.query.nonTechRequirements as string];
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

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser({ username, password, email });
      const session = await storage.createSession(user.id);
      
      res.status(201).json({ 
        user: { id: user.id, username: user.username, email: user.email },
        sessionId: session.id 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const session = await storage.createSession(user.id);
      
      res.json({ 
        user: { id: user.id, username: user.username, email: user.email },
        sessionId: session.id 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  app.get("/api/auth/session/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(401).json({ message: "Invalid session" });
      }
      
      const user = await storage.getUser(session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      res.json({ 
        user: { id: user.id, username: user.username, email: user.email },
        session 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  // Job category search (autocomplete)
  app.get("/api/job-categories/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const categories = await storage.searchJobCategories(query);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to search job categories" });
    }
  });

  // Saved filters routes
  app.get("/api/saved-filters/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const savedFilters = await storage.getSavedFilters(userId);
      res.json(savedFilters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved filters" });
    }
  });

  app.post("/api/saved-filters", async (req, res) => {
    try {
      const { userId, name, filterData } = req.body;
      
      if (!userId || !name || !filterData) {
        return res.status(400).json({ message: "User ID, name, and filter data are required" });
      }
      
      const savedFilter = await storage.saveSavedFilter({
        userId,
        name,
        filterData: JSON.stringify(filterData)
      });
      
      res.status(201).json(savedFilter);
    } catch (error) {
      res.status(500).json({ message: "Failed to save filter" });
    }
  });

  app.delete("/api/saved-filters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      await storage.deleteSavedFilter(id, userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete saved filter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
