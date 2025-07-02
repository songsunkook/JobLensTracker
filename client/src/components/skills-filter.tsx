import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { SkillFilterOperator } from "@/lib/types";

interface SkillsFilterProps {
  skills: string[];
  selectedSkills: string[];
  skillOperator: SkillFilterOperator;
  onSkillsChange: (skills: string[]) => void;
  onOperatorChange: (operator: SkillFilterOperator) => void;
}

export default function SkillsFilter({
  skills,
  selectedSkills,
  skillOperator,
  onSkillsChange,
  onOperatorChange,
}: SkillsFilterProps) {
  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    onSkillsChange(newSkills);
  };

  const removeSkill = (skill: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSkillsChange(selectedSkills.filter(s => s !== skill));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">기술 스택</Label>
          <ToggleGroup 
            type="single" 
            value={skillOperator}
            onValueChange={(value) => onOperatorChange(value as SkillFilterOperator)}
            className="h-8 text-xs"
            variant="outline"
          >
            <ToggleGroupItem value="AND" className="px-3">AND</ToggleGroupItem>
            <ToggleGroupItem value="OR" className="px-3">OR</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              className={`cursor-pointer hover:bg-primary/80 transition-colors ${
                selectedSkills.includes(skill) ? "" : "hover:bg-primary/10"
              }`}
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
              {selectedSkills.includes(skill) && (
                <X 
                  className="ml-1 h-3 w-3" 
                  onClick={(e) => removeSkill(skill, e)}
                />
              )}
            </Badge>
          ))}
        </div>
      </div>
      
      {selectedSkills.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-2">
            선택된 기술: {selectedSkills.join(", ")}
          </p>
          <p className="text-xs text-muted-foreground">
            {skillOperator === 'AND' 
              ? '선택한 모든 기술을 포함하는 공고를 검색합니다.'
              : '선택한 기술 중 하나라도 포함하는 공고를 검색합니다.'}
          </p>
        </div>
      )}
    </div>
  );
}
