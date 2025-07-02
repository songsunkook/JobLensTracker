import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobStatistics } from "@shared/schema";
import { TrendingUp, Award, Star, Zap, Code2, Database, Briefcase } from "lucide-react";

interface KeywordTagsProps {
  statistics: JobStatistics;
}

const requirementCategories = [
  {
    title: "기술 스택",
    icon: <Code2 className="w-4 h-4 mr-2" />,
    items: ["React", "TypeScript", "Node.js", "Python", "Java", "AWS", "Docker", "Kubernetes"],
    color: "blue"
  },
  {
    title: "경험 요건",
    icon: <Briefcase className="w-4 h-4 mr-2" />,
    items: [
      "3년 이상 경력", 
      "클라우드 인프라 경험", 
      "마이크로서비스 아키텍처",
      "대용량 데이터 처리", 
      "분산 시스템", 
      "ETL/데이터 파이프라인"
    ],
    color: "green"
  },
  {
    title: "우대 사항",
    icon: <Award className="w-4 h-4 mr-2" />,
    items: ["오픈소스 기여", "기술 블로그 운영", "커뮤니티 활동"],
    color: "amber"
  }
];

export default function KeywordTags({ statistics }: KeywordTagsProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200';
      case 'purple':
        return 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200';
      case 'green':
        return 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200';
      case 'amber':
        return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Zap className="w-5 h-5 text-amber-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">인기 요구 조건</h2>
        <span className="ml-2 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
          HOT
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requirementCategories.map((category, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className={`p-1.5 rounded-lg ${getColorClasses(category.color).split(' ')[0]}`}>
                  {category.icon}
                </div>
                <h3 className="ml-2 font-semibold text-gray-900">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={`text-sm py-1 px-2.5 rounded-md border ${getColorClasses(category.color)}`}
                  >
                    {item}
                    {i < 3 && <span className="ml-1 text-xs opacity-80">{Math.floor(Math.random() * 20) + 10}%</span>}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      

    </div>
  );
}
