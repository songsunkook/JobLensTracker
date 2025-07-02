import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

const POPULAR_POSITIONS = [
  "백엔드 개발자",
  "프론트엔드 개발자",
  "풀스택 개발자",
  "데이터 엔지니어",
  "데이터 사이언티스트",
  "DevOps 엔지니어",
  "AI 엔지니어",
  "보안 엔지니어",
  "iOS 개발자",
  "안드로이드 개발자"
];

interface JobSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function JobSearch({ value, onChange, className }: JobSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleSelect = (position: string) => {
    setInputValue(position);
    onChange(position);
    setIsFocused(false);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setInputValue("");
    onChange("");
    inputRef.current?.focus();
  };

  // Filter positions based on input
  const filteredPositions = inputValue
    ? POPULAR_POSITIONS.filter(position =>
        position.toLowerCase().includes(inputValue.toLowerCase())
      )
    : POPULAR_POSITIONS;

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="직군을 검색하세요 (예: 백엔드 개발자)"
          className="pl-10 pr-10"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
        />
        {inputValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isFocused && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <ScrollArea className="max-h-60 overflow-auto">
            {filteredPositions.length > 0 ? (
              <div className="p-1">
                {filteredPositions.map((position) => (
                  <button
                    key={position}
                    type="button"
                    className="w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(position)}
                  >
                    {position}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-sm text-muted-foreground">
                일치하는 직군이 없습니다.
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
