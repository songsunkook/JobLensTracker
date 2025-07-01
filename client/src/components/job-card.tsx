import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JobWithCompany } from "@shared/schema";
import { MapPin, DollarSign, User, Bookmark } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: JobWithCompany;
}

export default function JobCard({ job }: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        return apiRequest('DELETE', '/api/bookmarks', { 
          jobId: job.id, 
          userId: 'demo-user' 
        });
      } else {
        return apiRequest('POST', '/api/bookmarks', { 
          jobId: job.id, 
          userId: 'demo-user' 
        });
      }
    },
    onSuccess: () => {
      setIsBookmarked(!isBookmarked);
      toast({
        title: isBookmarked ? "북마크 해제됨" : "북마크 추가됨",
        description: isBookmarked 
          ? "북마크에서 제거되었습니다." 
          : "북마크에 추가되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "북마크 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "협의";
    if (!min) return `~${max?.toLocaleString()}만원`;
    if (!max) return `${min.toLocaleString()}만원~`;
    return `${min.toLocaleString()}~${max.toLocaleString()}만원`;
  };

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case "entry": return "신입";
      case "junior": return "경력 1-3년";
      case "mid": return "경력 3-5년";
      case "senior": return "시니어 5년+";
      default: return "경력무관";
    }
  };

  const isNew = job.postedAt && 
    new Date(job.postedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-gray-900">{job.title}</h4>
              {isNew && (
                <Badge variant="secondary" className="bg-accent-100 text-accent-700">
                  신규
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{job.company.name}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {job.company.location}
              </span>
              <span className="flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {getExperienceLabel(job.experienceLevel)}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.requirements.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{job.requirements.length - 4}
                </Badge>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={`transition-colors ${
              isBookmarked 
                ? "text-accent hover:text-accent-600" 
                : "text-gray-400 hover:text-accent"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              bookmarkMutation.mutate();
            }}
            disabled={bookmarkMutation.isPending}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
