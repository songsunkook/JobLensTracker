import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/lib/types";

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

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
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
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">필터 설정</h2>
        
        {/* Industry Filter */}
        <div className="filter-section mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">산업군</h3>
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
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  {industry}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Range Filter */}
        <div className="filter-section mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">연봉 범위</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-gray-500">최소 연봉 (만원)</Label>
              <Slider
                value={[filters.salaryMin]}
                onValueChange={handleSalaryMinChange}
                min={2500}
                max={8000}
                step={100}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2,500</span>
                <span className="font-medium text-primary">
                  {filters.salaryMin.toLocaleString()}
                </span>
                <span>8,000</span>
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-500">최대 연봉 (만원)</Label>
              <Slider
                value={[filters.salaryMax]}
                onValueChange={handleSalaryMaxChange}
                min={3000}
                max={10000}
                step={100}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3,000</span>
                <span className="font-medium text-primary">
                  {filters.salaryMax.toLocaleString()}
                </span>
                <span>10,000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div className="filter-section mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">지역</h3>
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
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="filter-section mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">경력 구분</h3>
          <RadioGroup 
            value={filters.experienceLevel} 
            onValueChange={(value) => onFilterChange({ experienceLevel: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="exp-all" />
              <Label htmlFor="exp-all" className="text-sm text-gray-600 cursor-pointer">
                전체
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="entry" id="exp-entry" />
              <Label htmlFor="exp-entry" className="text-sm text-gray-600 cursor-pointer">
                신입
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="junior" id="exp-junior" />
              <Label htmlFor="exp-junior" className="text-sm text-gray-600 cursor-pointer">
                경력 (1-3년)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="senior" id="exp-senior" />
              <Label htmlFor="exp-senior" className="text-sm text-gray-600 cursor-pointer">
                시니어 (3년+)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary-600 text-white font-medium"
          onClick={() => {
            // Trigger a refresh of data with current filters
            window.location.reload();
          }}
        >
          필터 적용하기
        </Button>
      </CardContent>
    </Card>
  );
}
