import { useQuery } from "@tanstack/react-query";
import StatisticsOverview from "./statistics-overview";
import KeywordTags from "./keyword-tags";
import SalaryChart from "./salary-chart";
import JobCard from "./job-card";
import { FilterState } from "@/lib/types";
import { JobWithCompany, JobStatistics } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MainContentProps {
  filters: FilterState;
}

export default function MainContent({ filters }: MainContentProps) {
  const buildQueryParams = (filters: FilterState) => {
    const params = new URLSearchParams();
    
    if (filters.industries.length > 0) {
      filters.industries.forEach(industry => params.append('industries', industry));
    }
    if (filters.locations.length > 0) {
      filters.locations.forEach(location => params.append('locations', location));
    }
    if (filters.salaryMin) {
      params.append('salaryMin', filters.salaryMin.toString());
    }
    if (filters.salaryMax) {
      params.append('salaryMax', filters.salaryMax.toString());
    }
    if (filters.experienceLevel && filters.experienceLevel !== 'all') {
      params.append('experienceLevel', filters.experienceLevel);
    }
    if (filters.employmentType) {
      params.append('employmentType', filters.employmentType);
    }
    if (filters.isRemote !== undefined) {
      params.append('isRemote', filters.isRemote.toString());
    }
    
    return params.toString();
  };

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<JobWithCompany[]>({
    queryKey: ['/api/jobs', buildQueryParams(filters)],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    },
  });

  const { data: statistics, isLoading: statsLoading } = useQuery<JobStatistics>({
    queryKey: ['/api/statistics', buildQueryParams(filters)],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetch(`/api/statistics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return response.json();
    },
  });

  if (jobsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      {statistics && (
        <StatisticsOverview statistics={statistics} />
      )}

      {/* Top Keywords */}
      {statistics && (
        <KeywordTags statistics={statistics} />
      )}

      {/* Salary Distribution Chart */}
      {statistics && (
        <SalaryChart statistics={statistics} />
      )}

      {/* Job Listings */}
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">채용 공고</h3>
            <Select defaultValue="latest">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="salary">연봉순</SelectItem>
                <SelectItem value="deadline">마감임박순</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">조건에 맞는 채용 공고가 없습니다.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>
          
          {jobs.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="outline">
                더 많은 공고 보기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
