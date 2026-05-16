// components/dashboard/submission-filters.tsx
"use client";

import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubmissionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  courseFilter: string;
  onCourseChange: (value: string) => void;
  courses: string[];
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function SubmissionFilters({
  searchQuery,
  onSearchChange,
  courseFilter,
  onCourseChange,
  courses,
  sortBy,
  onSortChange,
}: SubmissionFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="SEARCH_STUDENT_OR_ASSIGNMENT..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 font-mono text-sm"
        />
      </div>
      <Select value={courseFilter} onValueChange={onCourseChange}>
        <SelectTrigger className="w-[180px] font-mono">
          <SelectValue placeholder="COURSE_FILTER" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ALL_COURSES</SelectItem>
          {courses.map((course) => (
            <SelectItem key={course} value={course}>
              {course}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 font-mono">
            <ArrowUpDown className="size-4" />
            SORT_BY: {sortBy === "newest" ? "NEWEST" : "OLDEST"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSortChange("newest")}>
            NEWEST_FIRST
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("oldest")}>
            OLDEST_FIRST
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
