import { 
  companies, 
  jobPostings, 
  bookmarks, 
  users,
  type Company, 
  type JobPosting, 
  type Bookmark,
  type User,
  type InsertCompany, 
  type InsertJobPosting, 
  type InsertBookmark,
  type InsertUser,
  type JobWithCompany,
  type FilterOptions,
  type JobStatistics
} from "@shared/schema";

export interface IStorage {
  // Company methods
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Job posting methods
  getJobPostings(filters?: FilterOptions): Promise<JobWithCompany[]>;
  getJobPosting(id: number): Promise<JobWithCompany | undefined>;
  createJobPosting(job: InsertJobPosting): Promise<JobPosting>;
  incrementJobViewCount(id: number): Promise<void>;
  
  // Statistics methods
  getJobStatistics(filters?: FilterOptions): Promise<JobStatistics>;
  
  // Bookmark methods
  getBookmarks(userId: string): Promise<JobWithCompany[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(jobId: number, userId: string): Promise<void>;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private companies: Map<number, Company>;
  private jobPostings: Map<number, JobPosting>;
  private bookmarks: Map<number, Bookmark>;
  private users: Map<number, User>;
  private currentCompanyId: number;
  private currentJobId: number;
  private currentBookmarkId: number;
  private currentUserId: number;

  constructor() {
    this.companies = new Map();
    this.jobPostings = new Map();
    this.bookmarks = new Map();
    this.users = new Map();
    this.currentCompanyId = 1;
    this.currentJobId = 1;
    this.currentBookmarkId = 1;
    this.currentUserId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize with Korean tech companies
    const initialCompanies: InsertCompany[] = [
      {
        name: "카카오페이",
        industry: "핀테크",
        location: "판교",
        address: "경기도 성남시 분당구 판교역로 235",
        latitude: "37.4020",
        longitude: "127.1080",
        description: "모바일 간편결제 서비스",
        website: "https://www.kakaopay.com",
        size: "large",
        culture: ["유연근무", "자율복장", "점심지원"]
      },
      {
        name: "토스",
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

    initialCompanies.forEach(company => {
      this.createCompany(company);
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
      },
      {
        companyId: 3, // 당근마켓
        title: "DevOps 엔지니어",
        description: "클라우드 인프라 관리 및 자동화",
        requirements: ["AWS", "Docker", "Kubernetes", "Linux"],
        preferredSkills: ["Terraform", "Jenkins", "Prometheus", "Grafana"],
        salaryMin: 4500,
        salaryMax: 7000,
        experienceLevel: "mid",
        employmentType: "full-time",
        isRemote: true,
        deadline: new Date("2025-08-15")
      },
      {
        companyId: 4, // 네이버
        title: "AI 엔지니어",
        description: "머신러닝 모델 개발 및 서비스 적용",
        requirements: ["Python", "TensorFlow", "PyTorch", "SQL"],
        preferredSkills: ["MLOps", "Kubeflow", "Docker", "Spark"],
        salaryMin: 5500,
        salaryMax: 9000,
        experienceLevel: "senior",
        employmentType: "full-time",
        isRemote: false,
        deadline: new Date("2025-07-30")
      },
      {
        companyId: 5, // 라인
        title: "모바일 개발자 (iOS)",
        description: "라인 메신저 iOS 앱 개발",
        requirements: ["Swift", "iOS SDK", "Objective-C", "Git"],
        preferredSkills: ["SwiftUI", "Combine", "RxSwift", "Fastlane"],
        salaryMin: 4500,
        salaryMax: 7500,
        experienceLevel: "mid",
        employmentType: "full-time",
        isRemote: false,
        deadline: new Date("2025-08-10")
      },
      {
        companyId: 6, // 쿠팡
        title: "데이터 엔지니어",
        description: "대용량 데이터 파이프라인 구축",
        requirements: ["Python", "Spark", "Hadoop", "SQL"],
        preferredSkills: ["Airflow", "Kafka", "Elasticsearch", "AWS"],
        salaryMin: 5000,
        salaryMax: 8500,
        experienceLevel: "mid",
        employmentType: "full-time",
        isRemote: false,
        deadline: new Date("2025-08-05")
      }
    ];

    initialJobs.forEach(job => {
      this.createJobPosting(job);
    });
  }

  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const company: Company = { 
      ...insertCompany, 
      id,
      address: insertCompany.address ?? null,
      latitude: insertCompany.latitude ?? null,
      longitude: insertCompany.longitude ?? null,
      description: insertCompany.description ?? null,
      website: insertCompany.website ?? null,
      size: insertCompany.size ?? null,
      culture: insertCompany.culture ?? []
    };
    this.companies.set(id, company);
    return company;
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
    }

    return jobs.map(job => ({
      ...job,
      company: this.companies.get(job.companyId)!
    }));
  }

  async getJobPosting(id: number): Promise<JobWithCompany | undefined> {
    const job = this.jobPostings.get(id);
    if (!job) return undefined;
    
    const company = this.companies.get(job.companyId);
    if (!company) return undefined;
    
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

  async incrementJobViewCount(id: number): Promise<void> {
    const job = this.jobPostings.get(id);
    if (job && job.viewCount !== null) {
      job.viewCount++;
      this.jobPostings.set(id, job);
    }
  }

  async getJobStatistics(filters?: FilterOptions): Promise<JobStatistics> {
    const jobs = await this.getJobPostings(filters);
    const companies = await this.getCompanies();
    
    const totalJobs = jobs.length;
    const avgSalary = Math.round(
      jobs.reduce((sum, job) => sum + ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2, 0) / totalJobs
    );
    
    // Count new jobs (posted in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newJobs = jobs.filter(job => job.postedAt && job.postedAt > weekAgo).length;
    
    const uniqueCompanies = new Set(jobs.map(job => job.companyId)).size;
    
    // Calculate skill statistics
    const allRequirements: string[] = [];
    const allPreferredSkills: string[] = [];
    
    jobs.forEach(job => {
      if (job.requirements) {
        allRequirements.push(...job.requirements);
      }
      if (job.preferredSkills) {
        allPreferredSkills.push(...job.preferredSkills);
      }
    });
    
    const requirementCounts = this.countSkills(allRequirements);
    const preferredCounts = this.countSkills(allPreferredSkills);
    
    const topRequirements = Object.entries(requirementCounts)
      .map(([skill, count]) => ({ skill, percentage: Math.round((count / totalJobs) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
      
    const topPreferredSkills = Object.entries(preferredCounts)
      .map(([skill, count]) => ({ skill, percentage: Math.round((count / totalJobs) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
    
    // Salary distribution
    const salaryRanges = [
      { range: "2500-3000", min: 2500, max: 3000 },
      { range: "3000-4000", min: 3000, max: 4000 },
      { range: "4000-5000", min: 4000, max: 5000 },
      { range: "5000-6000", min: 5000, max: 6000 },
      { range: "6000-7000", min: 6000, max: 7000 },
      { range: "7000+", min: 7000, max: Infinity }
    ];
    
    const salaryDistribution = salaryRanges.map(range => ({
      range: range.range,
      count: jobs.filter(job => {
        const avgJobSalary = ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2;
        return avgJobSalary >= range.min && avgJobSalary < range.max;
      }).length
    }));
    
    // Location statistics
    const locationCounts: Record<string, number> = {};
    jobs.forEach(job => {
      const location = job.company.location;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    const locationStats = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalJobs,
      avgSalary,
      newJobs,
      companies: uniqueCompanies,
      topRequirements,
      topPreferredSkills,
      salaryDistribution,
      locationStats
    };
  }

  private countSkills(skills: string[]): Record<string, number> {
    const counts: Record<string, number> = {};
    skills.forEach(skill => {
      counts[skill] = (counts[skill] || 0) + 1;
    });
    return counts;
  }

  async getBookmarks(userId: string): Promise<JobWithCompany[]> {
    const userBookmarks = Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.userId === userId);
    
    const jobs: JobWithCompany[] = [];
    for (const bookmark of userBookmarks) {
      const job = await this.getJobPosting(bookmark.jobId);
      if (job) {
        jobs.push(job);
      }
    }
    
    return jobs;
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const bookmark: Bookmark = { 
      ...insertBookmark, 
      id,
      createdAt: new Date()
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(jobId: number, userId: string): Promise<void> {
    const entries = Array.from(this.bookmarks.entries());
    for (const [id, bookmark] of entries) {
      if (bookmark.jobId === jobId && bookmark.userId === userId) {
        this.bookmarks.delete(id);
        break;
      }
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
