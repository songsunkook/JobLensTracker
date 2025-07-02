export type SkillFilterOperator = 'AND' | 'OR';

export interface FilterState {
  industries: string[];
  salaryMin: number;
  salaryMax: number;
  locations: string[];
  experienceLevel: string;
  employmentType: string;
  isRemote?: boolean;
  skills: string[];
  skillOperator: SkillFilterOperator;
  jobPosition: string;
}

export interface CompanyMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  industry: string;
  salaryRange: string;
}

export interface SalaryRange {
  range: string;
  min: number;
  max: number;
}
