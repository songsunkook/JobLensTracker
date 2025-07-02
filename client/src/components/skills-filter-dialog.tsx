import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { X, Filter } from "lucide-react";
import { SkillFilterOperator } from "@/lib/types";

interface SkillsFilterDialogProps {
  skills: string[];
  selectedSkills: string[];
  skillOperator: SkillFilterOperator;
  onSkillsChange: (skills: string[]) => void;
  onOperatorChange: (operator: SkillFilterOperator) => void;
}

export default function SkillsFilterDialog({
  skills,
  selectedSkills,
  skillOperator,
  onSkillsChange,
  onOperatorChange,
}: SkillsFilterDialogProps) {
  const [open, setOpen] = useState(false);

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

  const toggleOperator = () => {
    onOperatorChange(skillOperator === 'AND' ? 'OR' : 'AND');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Filter className="h-4 w-4" />
          기술 스택 필터
          {selectedSkills.length > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {selectedSkills.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">기술 스택 필터</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">선택된 기술</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onSkillsChange([])}
                  className="text-muted-foreground h-8 px-2 text-xs"
                >
                  모두 지우기
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="px-3 py-1 text-sm flex items-center"
                  >
                    {skill}
                    <X 
                      className="ml-1 h-3.5 w-3.5 cursor-pointer" 
                      onClick={(e) => removeSkill(skill, e)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Operator Toggle */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">검색 조건</h3>
            <div className="flex items-center space-x-4">
              <Button
                variant={skillOperator === 'AND' ? 'default' : 'outline'}
                onClick={() => onOperatorChange('AND')}
                className="w-24"
              >
                AND
              </Button>
              <Button
                variant={skillOperator === 'OR' ? 'default' : 'outline'}
                onClick={() => onOperatorChange('OR')}
                className="w-24"
              >
                OR
              </Button>
              <p className="text-sm text-muted-foreground">
                {skillOperator === 'AND' 
                  ? '선택한 모든 기술을 포함하는 공고를 검색합니다.'
                  : '선택한 기술 중 하나라도 포함하는 공고를 검색합니다.'}
              </p>
            </div>
          </div>

          {/* All Skills */}
          <div>
            <h3 className="font-medium mb-3">기술 스택 선택</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 text-sm transition-colors ${
                    selectedSkills.includes(skill) 
                      ? 'hover:bg-primary/90' 
                      : 'hover:bg-primary/10'
                  }`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            취소
          </Button>
          <Button 
            onClick={() => setOpen(false)}
          >
            적용하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
