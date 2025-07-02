import { TrendingUp, Star } from "lucide-react";

export default function TrendingSkills() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-3">
          <TrendingUp className="inline w-4 h-4 mr-1.5" />
          급상승 기술 스택
        </h4>
        <div className="space-y-2">
          {["Rust", "Go", "Kotlin", "GraphQL"].map((tech, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm font-medium">{tech}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {Math.floor(Math.random() * 15) + 5}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-green-50 p-4 rounded-lg border border-green-100">
        <h4 className="font-medium text-green-800 mb-3">
          <Star className="inline w-4 h-4 mr-1.5" />
          핵심 역량
        </h4>
        <div className="space-y-2">
          {["문제 해결 능력", "커뮤니케이션", "팀워크", "리더십"].map((skill, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm font-medium">{skill}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {Math.floor(Math.random() * 20) + 80}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
