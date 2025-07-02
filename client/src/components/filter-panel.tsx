import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/lib/types";
import SkillsFilterDialog from "./skills-filter-dialog";
import JobSearch from "./job-search";
import { X } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

const INDUSTRIES = [
  "IT/소프트웨어",
  "핀테크",
  "게임",
  "바이오/헬스케어",
  "이커머스",
  "교육/에듀테크"
];

const LOCATIONS = [
  "서울",
  "판교",
  "부산",
  "대구",
  "원격근무"
];

const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "Spring",
  "AWS", "Docker", "Kubernetes", "GraphQL", "Next.js", "NestJS", "Express",
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Git", "Jest", "CI/CD"
];

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleSkillsChange = (skills: string[]) => {
    onFilterChange({ ...filters, skills });
  };

  const handleJobPositionChange = (jobPosition: string) => {
    onFilterChange({ ...filters, jobPosition });
  };

  const handleSkillOperatorChange = (skillOperator: 'AND' | 'OR') => {
    onFilterChange({ ...filters, skillOperator });
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    const newIndustries = checked
      ? [...filters.industries, industry]
      : filters.industries.filter(i => i !== industry);
    onFilterChange({ industries: newIndustries });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...filters.locations, location]
      : filters.locations.filter(l => l !== location);
    onFilterChange({ locations: newLocations });
  };

  const handleSalaryMinChange = (value: number[]) => {
    onFilterChange({ salaryMin: value[0] });
  };

  const handleSalaryMaxChange = (value: number[]) => {
    onFilterChange({ salaryMax: value[0] });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">직군 검색</h3>
          <JobSearch
            value={filters.jobPosition || ""}
            onChange={handleJobPositionChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">필터 설정</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onFilterChange({
              industries: [],
              locations: [],
              skills: [],
              salaryMin: undefined,
              salaryMax: undefined,
              experienceLevel: undefined,
              employmentType: undefined,
              isRemote: undefined,
              skillOperator: 'OR'
            })}
          >
            <X className="h-4 w-4 mr-1" />
            초기화
          </Button>
        </div>
        
        {/* Skills Filter */}
        <div className="space-y-2">
          <h3 className="font-medium">기술 스택</h3>
          <SkillsFilterDialog
            skills={SKILLS}
            selectedSkills={filters.skills || []}
            skillOperator={filters.skillOperator || 'OR'}
            onSkillsChange={handleSkillsChange}
            onOperatorChange={handleSkillOperatorChange}
          />
        </div>

        {/* Industry Filter */}
        <div className="space-y-2">
          <h3 className="font-medium">산업군</h3>
          <div className="space-y-2">
            {INDUSTRIES.map((industry) => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox
                  id={`industry-${industry}`}
                  checked={filters.industries.includes(industry)}
                  onCheckedChange={(checked) => 
                    handleIndustryChange(industry, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`industry-${industry}`}
                  className="text-sm cursor-pointer"
                >
                  {industry}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <h3 className="font-medium">지역</h3>
          <div className="space-y-2">
            {LOCATIONS.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={(checked) => 
                    handleLocationChange(location, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`location-${location}`}
                  className="text-sm cursor-pointer"
                >
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Range Filter */}
        <div className="space-y-2">
          <h3 className="font-medium">연봉 범위 (만원)</h3>
          <div className="px-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {filters.salaryMin?.toLocaleString() || '0'}
              </span>
              <span className="text-sm text-muted-foreground">
                {filters.salaryMax?.toLocaleString() || '10,000+'}
              </span>
            </div>
            <Slider
              value={[filters.salaryMin || 0, filters.salaryMax || 10000]}
              onValueChange={([min, max]) => {
                onFilterChange({
                  salaryMin: min,
                  salaryMax: max
                });
              }}
              min={0}
              max={10000}
              step={100}
              minStepsBetweenThumbs={1}
            />
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <h3 className="font-medium">경력</h3>
          <RadioGroup
            value={filters.experienceLevel || ''}
            onValueChange={(value) => onFilterChange({ experienceLevel: value || undefined })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="exp-all" />
              <Label htmlFor="exp-all" className="text-sm cursor-pointer">
                전체
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newcomer" id="exp-newcomer" />
              <Label htmlFor="exp-newcomer" className="text-sm cursor-pointer">
                신입
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mid" id="exp-mid" />
              <Label htmlFor="exp-mid" className="text-sm cursor-pointer">
                경력
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <h3 className="font-medium">고용 형태</h3>
          <RadioGroup
            value={filters.employmentType || ''}
            onValueChange={(value) => onFilterChange({ employmentType: value || undefined })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="emp-all" />
              <Label htmlFor="emp-all" className="text-sm cursor-pointer">
                전체
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full-time" id="emp-fulltime" />
              <Label htmlFor="emp-fulltime" className="text-sm cursor-pointer">
                정규직
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contract" id="emp-contract" />
              <Label htmlFor="emp-contract" className="text-sm cursor-pointer">
                계약직
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intern" id="emp-intern" />
              <Label htmlFor="emp-intern" className="text-sm cursor-pointer">
                인턴
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Remote Work */}
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="remote-work"
            checked={filters.isRemote || false}
            onCheckedChange={(checked) => onFilterChange({ isRemote: checked as boolean })}
          />
          <Label htmlFor="remote-work" className="text-sm cursor-pointer">
            원격근무 가능
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
