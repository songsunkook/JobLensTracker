import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  description: text("description"),
  website: text("website"),
  size: text("size"), // startup, small, medium, large
  culture: text("culture").array(), // work-life balance tags
});

export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  preferredSkills: text("preferred_skills").array(),
  salaryMin: integer("salary_min"), // in 만원
  salaryMax: integer("salary_max"), // in 만원
  experienceLevel: text("experience_level").notNull(), // entry, junior, mid, senior, all
  employmentType: text("employment_type").notNull(), // full-time, contract, internship
  isRemote: boolean("is_remote").default(false),
  postedAt: timestamp("posted_at").defaultNow(),
  deadline: timestamp("deadline"),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobPostings.id),
  userId: text("user_id").notNull(), // For simplicity, using string user IDs
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedFilters = pgTable("saved_filters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  filters: jsonb("filters").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  postedAt: true,
  viewCount: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type Company = typeof companies.$inferSelect;
export type JobPosting = typeof jobPostings.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Extended types for API responses
export type JobWithCompany = JobPosting & {
  company: Company;
};

export interface FilterOptions {
  industries?: string[];
  salaryMin?: number;
  salaryMax?: number;
  locations?: string[];
  experienceLevel?: string;
  employmentType?: string;
  isRemote?: boolean;
  skills?: string[];
  skillOperator?: 'AND' | 'OR';
};

export type JobStatistics = {
  totalJobs: number;
  avgSalary: number;
  newJobs: number;
  companies: number;
  topRequirements: Array<{ skill: string; percentage: number }>;
  topPreferredSkills: Array<{ skill: string; percentage: number }>;
  salaryDistribution: Array<{ range: string; count: number }>;
  locationStats: Array<{ location: string; count: number }>;
};

export interface SavedFilter {
  id: number;
  userId: number;
  name: string;
  filters: FilterOptions;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertSavedFilter {
  userId: number;
  name: string;
  filters: FilterOptions;
  isDefault?: boolean;
}
