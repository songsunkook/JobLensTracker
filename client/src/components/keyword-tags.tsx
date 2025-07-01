import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobStatistics } from "@shared/schema";

interface KeywordTagsProps {
  statistics: JobStatistics;
}

export default function KeywordTags({ statistics }: KeywordTagsProps) {
  return (
    <Card className="animate-slide-up">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 요구 조건</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">필수 조건</h4>
          <div className="flex flex-wrap gap-2">
            {statistics.topRequirements.slice(0, 8).map((requirement) => (
              <Badge
                key={requirement.skill}
                variant="secondary"
                className="keyword-tag bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
              >
                {requirement.skill}
                <span className="ml-1 text-blue-600">{requirement.percentage}%</span>
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">우대 조건</h4>
          <div className="flex flex-wrap gap-2">
            {statistics.topPreferredSkills.slice(0, 8).map((skill) => (
              <Badge
                key={skill.skill}
                variant="secondary"
                className="keyword-tag bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
              >
                {skill.skill}
                <span className="ml-1 text-green-600">{skill.percentage}%</span>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
