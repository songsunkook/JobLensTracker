import { useState } from "react";
import FilterPanel from "@/components/filter-panel";
import MainContent from "@/components/main-content";
import MapVisualization from "@/components/map-visualization";
import { FilterState } from "@/lib/types";
import { Search, Bell, Bookmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    industries: ["IT/소프트웨어", "핀테크"],
    salaryMin: 3000,
    salaryMax: 6000,
    locations: ["서울", "판교"],
    experienceLevel: "all",
    employmentType: "full-time",
    isRemote: false,
    skills: [],
    skillOperator: 'OR',
    jobPosition: "",
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">JobLens</h1>
              </div>
              <span className="text-sm text-gray-500 hidden sm:inline">
                취업 데이터 통합 인사이트
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-3">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6">
            <MainContent filters={filters} />
          </div>

          {/* Right Sidebar - Map */}
          <div className="lg:col-span-3">
            <MapVisualization filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}
