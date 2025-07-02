import { 
  companies, 
  jobPostings, 
  bookmarks, 
  users,
  sessions,
  savedFilters,
  type Company, 
  type JobPosting, 
  type Bookmark,
  type User,
  type Session,
  type SavedFilter,
  type InsertCompany, 
  type InsertJobPosting, 
  type InsertBookmark,
  type InsertUser,
  type InsertSession,
  type InsertSavedFilter,
  type JobWithCompany,
  type FilterOptions,
  type JobStatistics
} from "@shared/schema";
import { nanoid } from "nanoid";

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
  searchJobCategories(query: string): Promise<string[]>;
  
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
  authenticateUser(username: string, password: string): Promise<User | null>;
  
  // Session methods
  createSession(userId: number): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  
  // Saved filter methods
  getSavedFilters(userId: number): Promise<SavedFilter[]>;
  saveSavedFilter(filter: InsertSavedFilter): Promise<SavedFilter>;
  deleteSavedFilter(id: number, userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private companies: Map<number, Company>;
  private jobPostings: Map<number, JobPosting>;
  private bookmarks: Map<number, Bookmark>;
  private users: Map<number, User>;
  private sessions: Map<string, Session>;
  private savedFilters: Map<number, SavedFilter>;
  private currentCompanyId: number;
  private currentJobId: number;
  private currentBookmarkId: number;
  private currentUserId: number;
  private currentSavedFilterId: number;

  constructor() {
    this.companies = new Map();
    this.jobPostings = new Map();
    this.bookmarks = new Map();
    this.users = new Map();
    this.sessions = new Map();
    this.savedFilters = new Map();
    this.currentCompanyId = 1;
    this.currentJobId = 1;
    this.currentBookmarkId = 1;
    this.currentUserId = 1;
    this.currentSavedFilterId = 1;
    
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

    // Initialize job postings with enhanced data
    const initialJobs: InsertJobPosting[] = [
      {
        companyId: 1, // 카카오페이
        title: "프론트엔드 개발자",
        description: "React 기반 웹 서비스 개발",
        requirements: ["JavaScript", "React", "TypeScript", "HTML/CSS"],
        preferredSkills: ["Next.js", "Redux", "Webpack", "Jest"],
        techStack: ["React", "TypeScript", "Node.js", "Webpack"],
        nonTechRequirements: ["대용량 트래픽 처리 경험", "금융권 개발 경험", "협업 도구 사용 경험"],
        jobCategory: "프론트엔드 개발자",
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
        techStack: ["Java", "Spring Boot", "MySQL", "Redis", "Kafka"],
        nonTechRequirements: ["대용량 데이터 처리 경험", "MSA 아키텍처 설계 경험", "금융 도메인 이해"],
        jobCategory: "백엔드 개발자",
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
        techStack: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
        nonTechRequirements: ["클라우드 운영 경험", "24시간 온콜 가능", "장애 대응 경험"],
        jobCategory: "DevOps 엔지니어",
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
        techStack: ["Python", "TensorFlow", "PyTorch", "MLOps", "Kubeflow"],
        nonTechRequirements: ["논문 리딩 능력", "대용량 데이터 처리 경험", "연구 개발 경험"],
        jobCategory: "AI 엔지니어",
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
        techStack: ["Swift", "iOS SDK", "SwiftUI", "Combine"],
        nonTechRequirements: ["앱스토어 출시 경험", "UI/UX 디자인 이해", "글로벌 서비스 개발 경험"],
        jobCategory: "모바일 개발자",
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
        techStack: ["Python", "Spark", "Hadoop", "Kafka", "Airflow"],
        nonTechRequirements: ["대용량 데이터 처리 경험", "실시간 스트리밍 처리 경험", "이커머스 도메인 이해"],
        jobCategory: "데이터 엔지니어",
        salaryMin: 5000,
        salaryMax: 8500,
        experienceLevel: "mid",
        employmentType: "full-time",
        isRemote: false,
        deadline: new Date("2025-08-05")
      },
      {
        companyId: 1, // 카카오페이
        title: "데이터 사이언티스트",
        description: "금융 데이터 분석 및 모델링",
        requirements: ["Python", "R", "SQL", "통계학"],
        preferredSkills: ["Pandas", "Scikit-learn", "Tableau", "BigQuery"],
        techStack: ["Python", "R", "SQL", "Pandas", "Scikit-learn"],
        nonTechRequirements: ["금융 도메인 지식", "비즈니스 이해력", "커뮤니케이션 능력"],
        jobCategory: "데이터 사이언티스트",
        salaryMin: 4500,
        salaryMax: 7500,
        experienceLevel: "mid",
        employmentType: "full-time",
        isRemote: false,
        deadline: new Date("2025-08-10")
      },
      {
        companyId: 2, // 토스
        title: "수학 강사",
        description: "토스 교육 플랫폼 수학 콘텐츠 제작",
        requirements: ["수학 전공", "교육 경험", "콘텐츠 제작 능력"],
        preferredSkills: ["온라인 강의 경험", "교재 개발", "학습자 데이터 분석"],
        techStack: [],
        nonTechRequirements: ["교육 열정", "학습자 중심 사고", "창의적 문제 해결"],
        jobCategory: "수학 강사",
        salaryMin: 3500,
        salaryMax: 5500,
        experienceLevel: "mid",
        employmentType: "full-time",
        isRemote: true,
        deadline: new Date("2025-07-30")
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
      if (filters.techStack && filters.techStack.length > 0) {
        jobs = jobs.filter(job => {
          if (!job.techStack || job.techStack.length === 0) return false;
          
          if (filters.techStackOperation === 'AND') {
            // All specified tech must be present
            return filters.techStack!.every(tech => job.techStack!.includes(tech));
          } else {
            // At least one specified tech must be present (OR operation)
            return filters.techStack!.some(tech => job.techStack!.includes(tech));
          }
        });
      }
      if (filters.jobCategory) {
        jobs = jobs.filter(job => 
          job.jobCategory?.toLowerCase().includes(filters.jobCategory!.toLowerCase()) ||
          job.title.toLowerCase().includes(filters.jobCategory!.toLowerCase())
        );
      }
      if (filters.nonTechRequirements && filters.nonTechRequirements.length > 0) {
        jobs = jobs.filter(job => {
          if (!job.nonTechRequirements || job.nonTechRequirements.length === 0) return false;
          return filters.nonTechRequirements!.some(req => 
            job.nonTechRequirements!.some(jobReq => 
              jobReq.toLowerCase().includes(req.toLowerCase())
            )
          );
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
      techStack: insertJob.techStack ?? null,
      nonTechRequirements: insertJob.nonTechRequirements ?? null,
      jobCategory: insertJob.jobCategory ?? null,
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

    // Calculate tech stack statistics
    const techStackCounts: Record<string, number> = {};
    const nonTechCounts: Record<string, number> = {};
    
    jobs.forEach((job: JobPosting) => {
      job.techStack?.forEach((tech: string) => {
        techStackCounts[tech] = (techStackCounts[tech] || 0) + 1;
      });
      job.nonTechRequirements?.forEach((req: string) => {
        nonTechCounts[req] = (nonTechCounts[req] || 0) + 1;
      });
    });

    const topTechStack = Object.entries(techStackCounts)
      .map(([tech, count]) => ({ tech, percentage: Math.round((count / totalJobs) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    const topNonTechRequirements = Object.entries(nonTechCounts)
      .map(([requirement, count]) => ({ requirement, percentage: Math.round((count / totalJobs) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    // Mock trending data - in real app, this would compare with historical data
    const trendingTechStack = topTechStack.slice(0, 5).map(item => ({
      tech: item.tech,
      growth: Math.floor(Math.random() * 30) + 5, // Mock growth percentage
      popularity: item.percentage
    }));

    const jobCategoryStats: Record<string, number> = {};
    jobs.forEach((job: JobPosting) => {
      if (job.jobCategory) {
        jobCategoryStats[job.jobCategory] = (jobCategoryStats[job.jobCategory] || 0) + 1;
      }
    });

    const jobCategoryTrends = Object.entries(jobCategoryStats)
      .map(([category, count]) => ({
        category,
        count,
        growth: Math.floor(Math.random() * 25) + 5 // Mock growth
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalJobs,
      avgSalary,
      newJobs,
      companies: uniqueCompanies,
      topRequirements,
      topPreferredSkills,
      topTechStack,
      topNonTechRequirements,
      salaryDistribution,
      locationStats,
      trendingTechStack,
      jobCategoryTrends
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
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async searchJobCategories(query: string): Promise<string[]> {
    const categories = new Set<string>();
    
    Array.from(this.jobPostings.values()).forEach(job => {
      if (job.jobCategory && job.jobCategory.toLowerCase().includes(query.toLowerCase())) {
        categories.add(job.jobCategory);
      }
      if (job.title.toLowerCase().includes(query.toLowerCase())) {
        categories.add(job.title);
      }
    });
    
    return Array.from(categories).slice(0, 10);
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async createSession(userId: number): Promise<Session> {
    const sessionId = nanoid();
    const session: Session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    if (session) {
      this.sessions.delete(sessionId);
    }
    return undefined;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async getSavedFilters(userId: number): Promise<SavedFilter[]> {
    return Array.from(this.savedFilters.values()).filter(f => f.userId === userId);
  }

  async saveSavedFilter(filter: InsertSavedFilter): Promise<SavedFilter> {
    const id = this.currentSavedFilterId++;
    const savedFilter: SavedFilter = {
      ...filter,
      id,
      createdAt: new Date()
    };
    this.savedFilters.set(id, savedFilter);
    return savedFilter;
  }

  async deleteSavedFilter(id: number, userId: number): Promise<void> {
    const filter = this.savedFilters.get(id);
    if (filter && filter.userId === userId) {
      this.savedFilters.delete(id);
    }
  }
}

export const storage = new MemStorage();
