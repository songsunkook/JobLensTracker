import { Card, CardContent } from "@/components/ui/card";
import { JobStatistics } from "@shared/schema";

interface StatisticsOverviewProps {
  statistics: JobStatistics;
}

export default function StatisticsOverview({ statistics }: StatisticsOverviewProps) {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">검색 결과</h2>
          <span className="text-sm text-gray-500">
            조건에 맞는{" "}
            <span className="font-semibold text-primary">
              {statistics.totalJobs}개
            </span>{" "}
            기업
          </span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {statistics.avgSalary.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">평균 연봉 (만원)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {statistics.totalJobs}
            </div>
            <div className="text-sm text-gray-500">총 공고 수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {statistics.newJobs}
            </div>
            <div className="text-sm text-gray-500">신규 공고</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {statistics.companies}
            </div>
            <div className="text-sm text-gray-500">채용 기업</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
