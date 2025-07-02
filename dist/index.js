// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import bcrypt from "bcryptjs";
var MemStorage = class {
  constructor() {
    this.companies = /* @__PURE__ */ new Map();
    this.jobPostings = /* @__PURE__ */ new Map();
    this.bookmarks = /* @__PURE__ */ new Map();
    this.users = /* @__PURE__ */ new Map();
    this.savedFilters = /* @__PURE__ */ new Map();
    this.nextCompanyId = 1;
    this.nextJobId = 1;
    this.nextUserId = 1;
    this.nextBookmarkId = 1;
    this.nextFilterId = 1;
    this.currentJobId = 1;
    this.currentBookmarkId = 1;
    this.currentFilterId = 1;
    this.marketTrends = {
      popularSkills: [],
      trendingJobs: [],
      inDemandIndustries: [],
      salaryTrends: []
    };
    this.companies = /* @__PURE__ */ new Map();
    this.jobPostings = /* @__PURE__ */ new Map();
    this.bookmarks = /* @__PURE__ */ new Map();
    this.users = /* @__PURE__ */ new Map();
    this.savedFilters = /* @__PURE__ */ new Map();
    this.nextCompanyId = 1;
    this.nextJobId = 1;
    this.nextUserId = 1;
    this.nextBookmarkId = 1;
    this.nextFilterId = 1;
    this.marketTrends = {
      popularSkills: [],
      trendingJobs: [],
      inDemandIndustries: [],
      salaryTrends: []
    };
    this.initializeData();
  }
  async initializeData() {
    try {
      await this.createCompany({
        name: "WooTech Inc.",
        industry: "Technology",
        location: "Seoul, South Korea",
        description: "Leading tech company in South Korea",
        website: "https://wootech.co.kr",
        size: "1001-5000",
        culture: ["Innovation", "Collaboration", "Excellence"]
      });
      const initialCompanies = [
        {
          name: "\uCE74\uCE74\uC624\uD398\uC774",
          industry: "\uD540\uD14C\uD06C",
          location: "\uC11C\uC6B8 \uAC15\uB0A8",
          address: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uAC15\uB0A8\uAD6C \uD14C\uD5E4\uB780\uB85C 133",
          latitude: "37.5008",
          longitude: "127.0358",
          description: "\uAE08\uC735 \uC288\uD37C\uC571",
          website: "https://toss.im",
          size: "large",
          culture: ["\uC218\uD3C9\uC870\uC9C1", "\uC131\uACFC\uC911\uC2EC", "\uC790\uC720\uB85C\uC6B4\uBD84\uC704\uAE30"]
        },
        {
          name: "\uB2F9\uADFC\uB9C8\uCF13",
          industry: "IT/\uC18C\uD504\uD2B8\uC6E8\uC5B4",
          location: "\uC11C\uC6B8 \uC1A1\uD30C",
          address: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uC1A1\uD30C\uAD6C \uC911\uB300\uB85C 135",
          latitude: "37.5157",
          longitude: "127.1026",
          description: "\uB3D9\uB124 \uCEE4\uBBA4\uB2C8\uD2F0 \uD50C\uB7AB\uD3FC",
          website: "https://www.daangn.com",
          size: "medium",
          culture: ["\uC7AC\uD0DD\uADFC\uBB34", "\uC790\uC728\uCD9C\uD1F4\uADFC", "\uD3AB\uCE5C\uD654\uC801"]
        },
        {
          name: "\uB124\uC774\uBC84",
          industry: "IT/\uC18C\uD504\uD2B8\uC6E8\uC5B4",
          location: "\uD310\uAD50",
          address: "\uACBD\uAE30\uB3C4 \uC131\uB0A8\uC2DC \uBD84\uB2F9\uAD6C \uC815\uC790\uC77C\uB85C 95",
          latitude: "37.3595",
          longitude: "127.1052",
          description: "\uAE00\uB85C\uBC8C ICT \uD50C\uB7AB\uD3FC",
          website: "https://www.navercorp.com",
          size: "large",
          culture: ["\uBCF5\uC9C0\uCDA9\uC2E4", "\uAD50\uC721\uC9C0\uC6D0", "\uAE00\uB85C\uBC8C"]
        },
        {
          name: "\uB77C\uC778",
          industry: "IT/\uC18C\uD504\uD2B8\uC6E8\uC5B4",
          location: "\uD310\uAD50",
          address: "\uACBD\uAE30\uB3C4 \uC131\uB0A8\uC2DC \uBD84\uB2F9\uAD6C \uC815\uC790\uC77C\uB85C 95",
          latitude: "37.3595",
          longitude: "127.1052",
          description: "\uAE00\uB85C\uBC8C \uBA54\uC2E0\uC800 \uD50C\uB7AB\uD3FC",
          website: "https://linecorp.com",
          size: "large",
          culture: ["\uAE00\uB85C\uBC8C", "\uB2E4\uC591\uC131", "\uC18C\uD1B5\uC911\uC2DC"]
        },
        {
          name: "\uCFE0\uD321",
          industry: "\uC774\uCEE4\uBA38\uC2A4",
          location: "\uC11C\uC6B8 \uC1A1\uD30C",
          address: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uC1A1\uD30C\uAD6C \uC1A1\uD30C\uB300\uB85C 570",
          latitude: "37.5172",
          longitude: "127.1047",
          description: "\uC774\uCEE4\uBA38\uC2A4 \uD50C\uB7AB\uD3FC",
          website: "https://www.coupang.com",
          size: "large",
          culture: ["\uBE60\uB978\uC131\uC7A5", "\uAE00\uB85C\uBC8C", "\uD601\uC2E0\uC801"]
        }
      ];
      await Promise.all(initialCompanies.map((company) => this.createCompany(company)));
      await this.createUser({
        username: "admin",
        password: "admin123"
      });
      await this.createUser({
        username: "testuser",
        password: "test123"
      });
      const initialJobs = [
        {
          companyId: 1,
          // 카카오페이
          title: "\uD504\uB860\uD2B8\uC5D4\uB4DC \uAC1C\uBC1C\uC790",
          description: "React \uAE30\uBC18 \uC6F9 \uC11C\uBE44\uC2A4 \uAC1C\uBC1C",
          requirements: ["JavaScript", "React", "TypeScript", "HTML/CSS"],
          preferredSkills: ["Next.js", "Redux", "Webpack", "Jest"],
          salaryMin: 4e3,
          salaryMax: 6e3,
          experienceLevel: "junior",
          employmentType: "full-time",
          isRemote: false,
          deadline: /* @__PURE__ */ new Date("2025-08-01")
        },
        {
          companyId: 2,
          // 토스
          title: "\uBC31\uC5D4\uB4DC \uAC1C\uBC1C\uC790",
          description: "\uB300\uADDC\uBAA8 \uD2B8\uB798\uD53D \uCC98\uB9AC \uC2DC\uC2A4\uD15C \uAC1C\uBC1C",
          requirements: ["Java", "Spring Boot", "MySQL", "Redis"],
          preferredSkills: ["Kafka", "Kubernetes", "MSA", "AWS"],
          salaryMin: 5e3,
          salaryMax: 8e3,
          experienceLevel: "mid",
          employmentType: "full-time",
          isRemote: false,
          deadline: /* @__PURE__ */ new Date("2025-07-25")
        }
      ];
      await Promise.all(initialJobs.map((job) => this.createJobPosting(job)));
      console.log("Initial data loaded successfully");
    } catch (error) {
      console.error("Error initializing data:", error);
      throw error;
    }
  }
  // Company methods
  async getCompanies() {
    return Array.from(this.companies.values());
  }
  async getCompany(id) {
    const company = this.companies.get(id);
    return company ? { ...company } : null;
  }
  async createCompany(insertCompany) {
    const id = this.nextCompanyId++;
    const now = /* @__PURE__ */ new Date();
    const company = {
      id,
      name: insertCompany.name,
      industry: insertCompany.industry,
      location: insertCompany.location,
      address: insertCompany.address ?? null,
      latitude: insertCompany.latitude ?? null,
      longitude: insertCompany.longitude ?? null,
      description: insertCompany.description ?? null,
      website: insertCompany.website ?? null,
      size: insertCompany.size ?? null,
      culture: insertCompany.culture ?? []
    };
    this.companies.set(id, company);
    return { ...company };
  }
  async getJobPostings(filters) {
    let jobs = Array.from(this.jobPostings.values()).filter((job) => job.isActive);
    if (filters) {
      if (filters.salaryMin !== void 0) {
        jobs = jobs.filter((job) => job.salaryMax !== null && job.salaryMax >= filters.salaryMin);
      }
      if (filters.salaryMax !== void 0) {
        jobs = jobs.filter((job) => job.salaryMin !== null && job.salaryMin <= filters.salaryMax);
      }
      if (filters.experienceLevel && filters.experienceLevel !== "all") {
        jobs = jobs.filter((job) => job.experienceLevel === filters.experienceLevel || job.experienceLevel === "all");
      }
      if (filters.employmentType) {
        jobs = jobs.filter((job) => job.employmentType === filters.employmentType);
      }
      if (filters.isRemote !== void 0) {
        jobs = jobs.filter((job) => job.isRemote === filters.isRemote);
      }
      if (filters.industries && filters.industries.length > 0) {
        jobs = jobs.filter((job) => {
          const company = this.companies.get(job.companyId);
          return company && filters.industries.includes(company.industry);
        });
      }
      if (filters.locations && filters.locations.length > 0) {
        jobs = jobs.filter((job) => {
          const company = this.companies.get(job.companyId);
          return company && filters.locations.some((loc) => company.location.includes(loc));
        });
      }
      if (filters.skills && filters.skills.length > 0) {
        const operator = filters.skillOperator || "OR";
        jobs = jobs.filter((job) => {
          const allJobSkills = [
            ...job.requirements || [],
            ...job.preferredSkills || []
          ].map((skill) => skill.toLowerCase());
          const requiredSkills = (filters.skills || []).map((skill) => skill.toLowerCase());
          if (operator === "AND") {
            return requiredSkills.every(
              (skill) => allJobSkills.some(
                (jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)
              )
            );
          } else {
            return requiredSkills.some(
              (skill) => allJobSkills.some(
                (jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)
              )
            );
          }
        });
      }
    }
    return jobs.map((job) => ({
      ...job,
      company: this.companies.get(job.companyId)
    }));
  }
  async getJobPosting(id) {
    const job = this.jobPostings.get(id);
    if (!job) return null;
    const company = this.companies.get(job.companyId);
    if (!company) return null;
    return { ...job, company };
  }
  async createJobPosting(insertJob) {
    const id = this.currentJobId++;
    const job = {
      ...insertJob,
      id,
      requirements: insertJob.requirements ?? [],
      preferredSkills: insertJob.preferredSkills ?? [],
      salaryMin: insertJob.salaryMin ?? null,
      salaryMax: insertJob.salaryMax ?? null,
      isRemote: insertJob.isRemote ?? false,
      deadline: insertJob.deadline ?? null,
      isActive: insertJob.isActive ?? true,
      postedAt: /* @__PURE__ */ new Date(),
      viewCount: 0
    };
    this.jobPostings.set(id, job);
    return job;
  }
  async incrementViewCount(id) {
    const job = this.jobPostings.get(id);
    if (job && job.viewCount !== null) {
      job.viewCount++;
      this.jobPostings.set(id, job);
    }
  }
  getTopItems(items, limit) {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, limit);
  }
  async getJobStatistics(filters) {
    const jobs = await this.getJobPostings(filters);
    const salaries = jobs.filter((job) => job.salaryMin && job.salaryMax).map((job) => (job.salaryMin + job.salaryMax) / 2);
    const avgSalary = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
    const experienceLevels = jobs.reduce((acc, job) => {
      const level = job.experienceLevel || "Not specified";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    const locations = jobs.reduce((acc, job) => {
      const location = job.company?.location || "Remote";
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    const requirements = jobs.flatMap((job) => job.requirements || []);
    const skills = jobs.flatMap((job) => job.preferredSkills || []);
    const topRequirements = this.getTopItems(requirements, 5);
    const topSkills = this.getTopItems(skills, 5);
    const sevenDaysAgo = /* @__PURE__ */ new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newJobs = jobs.filter(
      (job) => job.postedAt && job.postedAt >= sevenDaysAgo
    ).length;
    const salaryRanges = [
      { min: 0, max: 3e3, label: "~3,000\uB9CC\uC6D0" },
      { min: 3001, max: 5e3, label: "3,001~5,000\uB9CC\uC6D0" },
      { min: 5001, max: 8e3, label: "5,001~8,000\uB9CC\uC6D0" },
      { min: 8001, max: 1e4, label: "8,001~10,000\uB9CC\uC6D0" },
      { min: 10001, max: Infinity, label: "1\uC5B5\uC6D0~" }
    ];
    const salaryDistribution = salaryRanges.map((range) => ({
      range: range.label,
      count: jobs.filter(
        (job) => job.salaryMin && job.salaryMax && job.salaryMin >= range.min && job.salaryMax <= range.max
      ).length
    }));
    return {
      totalJobs: jobs.length,
      avgSalary,
      newJobs,
      companies: new Set(jobs.map((job) => job.companyId)).size,
      topRequirements: topRequirements.map(({ name, count }) => ({
        skill: name,
        percentage: Math.round(count / jobs.length * 100) || 0
      })),
      topPreferredSkills: topSkills.map(({ name, count }) => ({
        skill: name,
        percentage: Math.round(count / jobs.length * 100) || 0
      })),
      salaryDistribution,
      locationStats: Object.entries(locations).map(([location, count]) => ({ location, count })).sort((a, b) => b.count - a.count)
    };
  }
  async getMarketTrends() {
    return JSON.parse(JSON.stringify(this.marketTrends));
  }
  async createUser(userData) {
    const id = this.nextUserId++;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const now = /* @__PURE__ */ new Date();
    const newUser = {
      id,
      username: userData.username,
      password: hashedPassword,
      email: `${userData.username}@example.com`,
      // Generate email from username
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id.toString(), newUser);
    return { ...newUser };
  }
  async createBookmark(insertBookmark) {
    const id = this.currentBookmarkId++;
    const userIdStr = insertBookmark.userId.toString();
    const bookmark = {
      id,
      jobId: insertBookmark.jobId,
      userId: userIdStr,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.bookmarks.set(id, bookmark);
    return { ...bookmark };
  }
  async deleteBookmark(id) {
    return this.bookmarks.delete(id);
  }
  async getUser(id) {
    return this.users.get(id.toString());
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }
  async getUserByEmail(email) {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    return user ? { ...user } : null;
  }
  async getUserById(id) {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }
  async validateUser(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
  async getBookmarks(userId) {
    const userBookmarks = Array.from(this.bookmarks.values()).filter((bookmark) => bookmark.userId === userId);
    const jobs = await Promise.all(
      userBookmarks.map(async (bookmark) => {
        const job = await this.getJobPosting(bookmark.jobId);
        if (!job) return null;
        return job;
      })
    );
    return jobs.filter((job) => job !== null);
  }
  async isJobBookmarked(userId, jobId) {
    return Array.from(this.bookmarks.values()).some((bookmark) => bookmark.userId === userId && bookmark.jobId === jobId);
  }
  async getSavedFilters(userId) {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) return [];
    return Array.from(this.savedFilters.values()).filter((filter) => filter.userId === userIdNum).sort((a, b) => {
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
      return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0);
    });
  }
  async getSavedFilter(id) {
    return this.savedFilters.get(id) ?? null;
  }
  async createSavedFilter(filter) {
    const now = /* @__PURE__ */ new Date();
    const newFilter = {
      id: this.nextFilterId++,
      userId: filter.userId,
      name: filter.name,
      filters: filter.filters,
      isDefault: filter.isDefault || false,
      createdAt: now,
      updatedAt: now
    };
    if (newFilter.isDefault) {
      for (const [id, f] of this.savedFilters.entries()) {
        if (f.userId === newFilter.userId && f.isDefault) {
          this.savedFilters.set(id, { ...f, isDefault: false });
        }
      }
    }
    this.savedFilters.set(newFilter.id, newFilter);
    return { ...newFilter };
  }
  async updateSavedFilter(id, updates) {
    const existing = this.savedFilters.get(id);
    if (!existing) return null;
    const updatedFilter = {
      ...existing,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (updates.isDefault === true) {
      for (const [fid, f] of this.savedFilters.entries()) {
        if (fid !== id && f.userId === existing.userId && f.isDefault) {
          this.savedFilters.set(fid, { ...f, isDefault: false });
        }
      }
    }
    this.savedFilters.set(id, updatedFilter);
    return { ...updatedFilter };
  }
  async deleteSavedFilter(id) {
    return this.savedFilters.delete(id);
  }
  async setDefaultFilter(userId, id) {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) return;
    const filter = this.savedFilters.get(id);
    if (!filter || filter.userId !== userIdNum) return;
    for (const [fid, f] of this.savedFilters.entries()) {
      if (f.userId === userIdNum && f.isDefault) {
        this.savedFilters.set(fid, { ...f, isDefault: false });
      }
    }
    this.savedFilters.set(id, { ...filter, isDefault: true });
  }
};
var storage = new MemStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });
  app2.get("/api/companies/:id", async (req, res) => {
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
  app2.get("/api/jobs", async (req, res) => {
    try {
      const filters = {};
      if (req.query.industries) {
        filters.industries = Array.isArray(req.query.industries) ? req.query.industries : [req.query.industries];
      }
      if (req.query.locations) {
        filters.locations = Array.isArray(req.query.locations) ? req.query.locations : [req.query.locations];
      }
      if (req.query.salaryMin) {
        filters.salaryMin = parseInt(req.query.salaryMin);
      }
      if (req.query.salaryMax) {
        filters.salaryMax = parseInt(req.query.salaryMax);
      }
      if (req.query.experienceLevel) {
        filters.experienceLevel = req.query.experienceLevel;
      }
      if (req.query.employmentType) {
        filters.employmentType = req.query.employmentType;
      }
      if (req.query.isRemote !== void 0) {
        filters.isRemote = req.query.isRemote === "true";
      }
      if (req.query.skills) {
        filters.skills = Array.isArray(req.query.skills) ? req.query.skills : [req.query.skills];
      }
      if (req.query.skillOperator) {
        filters.skillOperator = req.query.skillOperator;
      }
      const jobs = await storage.getJobPostings(filters);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job postings" });
    }
  });
  app2.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJobPosting(id);
      if (!job) {
        return res.status(404).json({ message: "Job posting not found" });
      }
      await storage.incrementJobViewCount(id);
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job posting" });
    }
  });
  app2.get("/api/statistics", async (req, res) => {
    try {
      const filters = {};
      if (req.query.industries) {
        filters.industries = Array.isArray(req.query.industries) ? req.query.industries : [req.query.industries];
      }
      if (req.query.locations) {
        filters.locations = Array.isArray(req.query.locations) ? req.query.locations : [req.query.locations];
      }
      if (req.query.salaryMin) {
        filters.salaryMin = parseInt(req.query.salaryMin);
      }
      if (req.query.salaryMax) {
        filters.salaryMax = parseInt(req.query.salaryMax);
      }
      if (req.query.experienceLevel) {
        filters.experienceLevel = req.query.experienceLevel;
      }
      if (req.query.employmentType) {
        filters.employmentType = req.query.employmentType;
      }
      if (req.query.isRemote !== void 0) {
        filters.isRemote = req.query.isRemote === "true";
      }
      const statistics = await storage.getJobStatistics(filters);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const bookmarks = await storage.getBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });
  app2.post("/api/bookmarks", async (req, res) => {
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
  app2.delete("/api/bookmarks", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
async function getPlugins() {
  const plugins = [
    react(),
    runtimeErrorOverlay()
  ];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }
  return plugins;
}
var vite_config_default = defineConfig(async ({ mode }) => {
  const plugins = await getPlugins();
  return {
    base: mode === "production" ? "/" : "/",
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets")
      }
    },
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client/public"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      sourcemap: mode !== "production",
      rollupOptions: {
        input: {
          main: path.resolve(import.meta.dirname, "client/index.html")
        },
        output: {
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split(".");
            const ext = info ? info[info.length - 1] : "";
            if (["png", "jpg", "jpeg", "gif", "svg", "webp", "ico"].includes(ext)) {
              return "assets/images/[name].[hash][extname]";
            }
            return "assets/[name].[hash][extname]";
          }
        }
      }
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
    }
  };
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
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
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 3e3;
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
