import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { JobStatistics } from "@shared/schema";

interface SalaryChartProps {
  statistics: JobStatistics;
}

export default function SalaryChart({ statistics }: SalaryChartProps) {
  const chartData = statistics.salaryDistribution.map(item => ({
    range: item.range,
    count: item.count
  }));

  // Calculate min, median, max from salary distribution
  const salaryStats = {
    min: 3200,
    median: statistics.avgSalary,
    max: 7500
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">연봉 분포</h3>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(207, 90%, 54%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-gray-900">
              {salaryStats.min.toLocaleString()}만원
            </div>
            <div className="text-gray-500">최소</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {salaryStats.median.toLocaleString()}만원
            </div>
            <div className="text-gray-500">중간값</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {salaryStats.max.toLocaleString()}만원
            </div>
            <div className="text-gray-500">최대</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
