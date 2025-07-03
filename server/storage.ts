import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { scrypt, randomBytes } from 'crypto';

const scryptAsync = promisify(scrypt);

// Password hashing utilities
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return `${derivedKey.toString('hex')}.${salt}`;
}

async function comparePasswords(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('.');
  const derivedKey = await scryptAsync(suppliedPassword, salt, 64) as Buffer;
  return hashedPassword === derivedKey.toString('hex');
}
import { 
  Company, 
  InsertCompany, 
  JobPosting, 
  InsertJobPosting, 
  Bookmark, 
  InsertBookmark, 
  User, 
  InsertUser, 
  SavedFilter, 
  InsertSavedFilter,
  JobStatistics,
  FilterOptions,
  JobWithCompany
} from '@shared/schema';

// Define MarketTrends interface since it's not in the schema
export interface MarketTrends {
  popularSkills: { skill: string; percentage: number }[];
  trendingJobs: { title: string; count: number }[];
  inDemandIndustries: { industry: string; count: number }[];
  salaryTrends: { level: string; average: number }[];
}

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export interface IStorage {
  // Company methods
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | null>;
  
  // Job posting methods
  getJobPostings(filters?: FilterOptions): Promise<JobPosting[]>;
  getJobPosting(id: number): Promise<JobPosting | null>;
  incrementViewCount(id: number): Promise<void>;
  
  // User methods
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  createUser(userData: Omit<InsertUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Statistics methods
  getJobStatistics(filters?: FilterOptions): Promise<JobStatistics>;
  
  // Market trends methods
  getMarketTrends(): Promise<MarketTrends>;
  
  // Bookmark methods
  getBookmarks(userId: string): Promise<JobPosting[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<boolean>;
  isJobBookmarked(userId: string, jobId: number): Promise<boolean>;
  
  // Saved filter methods
  getSavedFilters(userId: string): Promise<SavedFilter[]>;
  getSavedFilter(id: number): Promise<SavedFilter | null>;
  createSavedFilter(filter: Omit<InsertSavedFilter, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedFilter>;
  updateSavedFilter(id: number, updates: Partial<Omit<InsertSavedFilter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<SavedFilter | null>;
  deleteSavedFilter(id: number): Promise<boolean>;
  setDefaultFilter(userId: string, id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private companies: Map<number, Company> = new Map();
  private jobPostings: Map<number, JobPosting> = new Map();
  private bookmarks: Map<number, Bookmark> = new Map();
  private users: Map<string, User> = new Map();
  private savedFilters: Map<number, SavedFilter> = new Map();
  private nextCompanyId = 1;
  private nextJobId = 1;
  private nextUserId = 1;
  private nextBookmarkId = 1;
  private nextFilterId = 1;
  private currentJobId = 1;
  private currentBookmarkId = 1;
  private currentFilterId = 1;
  private marketTrends: MarketTrends = {
    popularSkills: [],
    trendingJobs: [],
    inDemandIndustries: [],
    salaryTrends: []
  };

  constructor() {
    // Initialize all maps
    this.companies = new Map();
    this.jobPostings = new Map();
    this.bookmarks = new Map();
    this.users = new Map();
    this.savedFilters = new Map();
    
    // Initialize counters
    this.nextCompanyId = 1;
    this.nextJobId = 1;
    this.nextUserId = 1;
    this.nextBookmarkId = 1;
    this.nextFilterId = 1;
    
    // Initialize market trends
    this.marketTrends = {
      popularSkills: [],
      trendingJobs: [],
      inDemandIndustries: [],
      salaryTrends: []
    };
    
    // Load initial data
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Create initial companies
      await this.createCompany({
        name: 'WooTech Inc.',
        industry: 'Technology',
        location: 'Seoul, South Korea',
        description: 'Leading tech company in South Korea',
        website: 'https://wootech.co.kr',
        size: '1001-5000',
        culture: ['Innovation', 'Collaboration', 'Excellence']
      } as InsertCompany);
      const initialCompanies: InsertCompany[] = [
        {
          name: "카카오페이",
          industry: "핀테크",
          location: "서울 강남",
          address: "서울특별시 강남구 테헤란로 133",
          latitude: "37.5008",
          longitude: "127.0358",
          description: "금융 슈퍼앱",
          website: "https://toss.im",
          size: "large",
          culture: ["수평조직", "성과중심", "자유로운분위기"]
        },
        {
          name: "당근마켓",
          industry: "IT/소프트웨어",
          location: "서울 송파",
          address: "서울특별시 송파구 중대로 135",
          latitude: "37.5157",
          longitude: "127.1026",
          description: "동네 커뮤니티 플랫폼",
          website: "https://www.daangn.com",
          size: "medium",
          culture: ["재택근무", "자율출퇴근", "펫친화적"]
        },
        {
          name: "네이버",
          industry: "IT/소프트웨어",
          location: "판교",
          address: "경기도 성남시 분당구 정자일로 95",
          latitude: "37.3595",
          longitude: "127.1052",
          description: "글로벌 ICT 플랫폼",
          website: "https://www.navercorp.com",
          size: "large",
          culture: ["복지충실", "교육지원", "글로벌"]
        },
        {
          name: "라인",
          industry: "IT/소프트웨어",
          location: "판교",
          address: "경기도 성남시 분당구 정자일로 95",
          latitude: "37.3595",
          longitude: "127.1052",
          description: "글로벌 메신저 플랫폼",
          website: "https://linecorp.com",
          size: "large",
          culture: ["글로벌", "다양성", "소통중시"]
        },
        {
          name: "쿠팡",
          industry: "이커머스",
          location: "서울 송파",
          address: "서울특별시 송파구 송파대로 570",
          latitude: "37.5172",
          longitude: "127.1047",
          description: "이커머스 플랫폼",
          website: "https://www.coupang.com",
          size: "large",
          culture: ["빠른성장", "글로벌", "혁신적"]
        }
      ];

      // Create companies
      await Promise.all(initialCompanies.map(company => this.createCompany(company)));
      
      // Initialize admin user
      await this.createUser({
        username: 'admin',
        password: 'admin123'
      });
      
      // Initialize test user
      await this.createUser({
        username: 'testuser',
        password: 'test123'
      });
      
      // Initialize job postings
      const initialJobs: InsertJobPosting[] = [
        {
          companyId: 1, // 카카오페이
          title: "프론트엔드 개발자",
          description: "React 기반 웹 서비스 개발",
          requirements: ["JavaScript", "React", "TypeScript", "HTML/CSS"],
          preferredSkills: ["Next.js", "Redux", "Webpack", "Jest"],
          salaryMin: 4000,
          salaryMax: 6000,
          experienceLevel: "junior",
          employmentType: "full-time",
          isRemote: false,
          deadline: new Date("2025-08-01")
        },
        {
          companyId: 2, // 토스
          title: "백엔드 개발자",
          description: "대규모 트래픽 처리 시스템 개발",
          requirements: ["Java", "Spring Boot", "MySQL", "Redis"],
          preferredSkills: ["Kafka", "Kubernetes", "MSA", "AWS"],
          salaryMin: 5000,
          salaryMax: 8000,
          experienceLevel: "mid",
          employmentType: "full-time",
          isRemote: false,
          deadline: new Date("2025-07-25")
        }
      ];

      await Promise.all(initialJobs.map(job => this.createJobPosting(job)));
      
      console.log('Initial data loaded successfully');
    } catch (error) {
      console.error('Error initializing data:', error);
      throw error;
    }
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | null> {
    const company = this.companies.get(id);
    return company ? { ...company } : null;
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.nextCompanyId++;
    const now = new Date();
    
    // Create a company with only the fields defined in the schema
    const company: Company = {
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

  async getJobPostings(filters?: FilterOptions): Promise<JobWithCompany[]> {
    let jobs = Array.from(this.jobPostings.values()).filter(job => job.isActive);
    
    if (filters) {
      if (filters.salaryMin !== undefined) {
        jobs = jobs.filter(job => job.salaryMax !== null && job.salaryMax >= filters.salaryMin!);
      }
      if (filters.salaryMax !== undefined) {
        jobs = jobs.filter(job => job.salaryMin !== null && job.salaryMin <= filters.salaryMax!);
      }
      if (filters.experienceLevel && filters.experienceLevel !== "all") {
        jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel || job.experienceLevel === "all");
      }
      if (filters.employmentType) {
        jobs = jobs.filter(job => job.employmentType === filters.employmentType);
      }
      if (filters.isRemote !== undefined) {
        jobs = jobs.filter(job => job.isRemote === filters.isRemote);
      }
      if (filters.industries && filters.industries.length > 0) {
        jobs = jobs.filter(job => {
          const company = this.companies.get(job.companyId);
          return company && filters.industries!.includes(company.industry);
        });
      }
      if (filters.locations && filters.locations.length > 0) {
        jobs = jobs.filter(job => {
          const company = this.companies.get(job.companyId);
          return company && filters.locations!.some(loc => company.location.includes(loc));
        });
      }
      
      // Apply skill-based filtering
      if (filters.skills && filters.skills.length > 0) {
        const operator = filters.skillOperator || 'OR';
        jobs = jobs.filter(job => {
          // Combine both requirements and preferred skills for searching
          const allJobSkills = [
            ...(job.requirements || []),
            ...(job.preferredSkills || [])
          ].map(skill => skill.toLowerCase());
          
          const requiredSkills = (filters.skills || []).map(skill => skill.toLowerCase());
          
          if (operator === 'AND') {
            // All skills must be present in the job's skills
            return requiredSkills.every(skill => 
              allJobSkills.some(jobSkill => 
                jobSkill.includes(skill) || skill.includes(jobSkill)
              )
            );
          } else {
            // OR: At least one skill must match
            return requiredSkills.some(skill => 
              allJobSkills.some(jobSkill => 
                jobSkill.includes(skill) || skill.includes(jobSkill)
              )
            );
          }
        });
      }
    }

    return jobs.map(job => ({
      ...job,
      company: this.companies.get(job.companyId)!
    }));
  }

  async getJobPosting(id: number): Promise<JobWithCompany | null> {
    const job = this.jobPostings.get(id);
    if (!job) return null;
    
    const company = this.companies.get(job.companyId);
    if (!company) return null;
    
    return { ...job, company };
  }

  async createJobPosting(insertJob: InsertJobPosting): Promise<JobPosting> {
    const id = this.currentJobId++;
    const job: JobPosting = { 
      ...insertJob, 
      id,
      requirements: insertJob.requirements ?? [],
      preferredSkills: insertJob.preferredSkills ?? [],
      salaryMin: insertJob.salaryMin ?? null,
      salaryMax: insertJob.salaryMax ?? null,
      isRemote: insertJob.isRemote ?? false,
      deadline: insertJob.deadline ?? null,
      isActive: insertJob.isActive ?? true,
      postedAt: new Date(),
      viewCount: 0
    };
    this.jobPostings.set(id, job);
    return job;
  }

  async incrementViewCount(id: number): Promise<void> {
    const job = this.jobPostings.get(id);
    if (job && job.viewCount !== null) {
      job.viewCount++;
      this.jobPostings.set(id, job);
    }
  }

  private getTopItems(items: string[], limit: number): Array<{ name: string; count: number }> {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getJobStatistics(filters?: FilterOptions): Promise<JobStatistics> {
    const jobs = await this.getJobPostings(filters);
    
    // Calculate average salary
    const salaries = jobs.filter(job => job.salaryMin && job.salaryMax)
      .map(job => (job.salaryMin! + job.salaryMax!) / 2);
    const avgSalary = salaries.length > 0 
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) 
      : 0;
    
    // Calculate experience level distribution
    const experienceLevels = jobs.reduce((acc, job) => {
      const level = job.experienceLevel || 'Not specified';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate location stats
    const locations = jobs.reduce((acc, job) => {
      const location = job.company?.location || 'Remote';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get top requirements and skills
    const requirements = jobs.flatMap(job => job.requirements || []);
    const skills = jobs.flatMap(job => job.preferredSkills || []);
    
    const topRequirements = this.getTopItems(requirements, 5);
    const topSkills = this.getTopItems(skills, 5);
    
    // Calculate new jobs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newJobs = jobs.filter(job => 
      job.postedAt && job.postedAt >= sevenDaysAgo
    ).length;
    
    // Calculate salary distribution (simplified example)
    const salaryRanges = [
      { min: 0, max: 3000, label: '~3,000만원' },
      { min: 3001, max: 5000, label: '3,001~5,000만원' },
      { min: 5001, max: 8000, label: '5,001~8,000만원' },
      { min: 8001, max: 10000, label: '8,001~10,000만원' },
      { min: 10001, max: Infinity, label: '1억원~' },
    ];
    
    const salaryDistribution = salaryRanges.map(range => ({
      range: range.label,
      count: jobs.filter(job => 
        job.salaryMin && job.salaryMax && 
        job.salaryMin >= range.min && 
        job.salaryMax <= range.max
      ).length
    }));
    
    return {
      totalJobs: jobs.length,
      avgSalary,
      newJobs,
      companies: new Set(jobs.map(job => job.companyId)).size,
      topRequirements: topRequirements.map(({ name, count }) => ({
        skill: name,
        percentage: Math.round((count / jobs.length) * 100) || 0
      })),
      topPreferredSkills: topSkills.map(({ name, count }) => ({
        skill: name,
        percentage: Math.round((count / jobs.length) * 100) || 0
      })),
      salaryDistribution,
      locationStats: Object.entries(locations)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
    };
  }

  async getMarketTrends(): Promise<MarketTrends> {
    // Return a copy to prevent external modifications
    return JSON.parse(JSON.stringify(this.marketTrends));
  }

  async createUser(userData: Omit<InsertUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = this.nextUserId++;
    const hashedPassword = await hashPassword(userData.password);
    const now = new Date();
    
    // Create user with only the fields defined in the schema
    const newUser: User = {
      id,
      username: userData.username,
      password: hashedPassword,
      email: `${userData.username}@example.com`, // Generate email from username
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id.toString(), newUser);
    return { ...newUser };
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const userIdStr = insertBookmark.userId.toString();
    
    const bookmark: Bookmark = { 
      id,
      jobId: insertBookmark.jobId,
      userId: userIdStr,
      createdAt: new Date()
    };
    
    this.bookmarks.set(id, bookmark);
    return { ...bookmark };
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id.toString());
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    return user ? { ...user } : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await comparePasswords(user.password, password);
    return isValid ? user : null;
  }

  async getBookmarks(userId: string): Promise<JobPosting[]> {
    const userBookmarks = Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.userId === userId);
    
    const jobs = await Promise.all(
      userBookmarks.map(async bookmark => {
        const job = await this.getJobPosting(bookmark.jobId);
        if (!job) return null;
        return job;
      })
    );
    
    return jobs.filter((job): job is JobWithCompany => job !== null);
  }

  async isJobBookmarked(userId: string, jobId: number): Promise<boolean> {
    return Array.from(this.bookmarks.values())
      .some(bookmark => bookmark.userId === userId && bookmark.jobId === jobId);
  }

  async getSavedFilters(userId: string): Promise<SavedFilter[]> {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) return [];
    
    return Array.from(this.savedFilters.values())
      .filter(filter => filter.userId === userIdNum)
      .sort((a, b) => {
        // Default filters first, then by most recently updated
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
        return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0);
      });
  }

  async getSavedFilter(id: number): Promise<SavedFilter | null> {
    return this.savedFilters.get(id) ?? null;
  }

  async createSavedFilter(filter: Omit<InsertSavedFilter, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedFilter> {
    const now = new Date();
    
    const newFilter: SavedFilter = {
      id: this.nextFilterId++,
      userId: filter.userId,
      name: filter.name,
      filters: filter.filters,
      isDefault: filter.isDefault || false,
      createdAt: now,
      updatedAt: now
    };
    
    // If this is set as default, unset any existing default for this user
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

  async updateSavedFilter(id: number, updates: Partial<Omit<InsertSavedFilter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<SavedFilter | null> {
    const existing = this.savedFilters.get(id);
    if (!existing) return null;
    
    const updatedFilter: SavedFilter = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    
    // If this is set as default, unset any existing default for this user
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

  async deleteSavedFilter(id: number): Promise<boolean> {
    return this.savedFilters.delete(id);
  }

  async setDefaultFilter(userId: string, id: number): Promise<void> {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) return;
    
    const filter = this.savedFilters.get(id);
    if (!filter || filter.userId !== userIdNum) return;
    
    // Unset any existing default for this user
    for (const [fid, f] of this.savedFilters.entries()) {
      if (f.userId === userIdNum && f.isDefault) {
        this.savedFilters.set(fid, { ...f, isDefault: false });
      }
    }
    
    // Set the new default
    this.savedFilters.set(id, { ...filter, isDefault: true });
  }
}

export const storage = new MemStorage();
