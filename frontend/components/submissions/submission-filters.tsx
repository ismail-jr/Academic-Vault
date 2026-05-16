// components/submissions/SubmissionFilters.tsx
"use client";

import { Search, Filter, ArrowUpDown, LayoutGrid, Rows } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubmissionFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export function SubmissionFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode = "grid",
  onViewModeChange,
}: SubmissionFiltersProps) {
  return (
    <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="SEARCH_STUDENT_OR_ASSIGNMENT..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 font-mono text-sm border-primary/20 focus-visible:ring-primary/30"
            />
          </div>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px] font-mono text-xs border-primary/20">
              <SelectValue placeholder="FILTER_BY_STATUS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL_STATUS</SelectItem>
              <SelectItem value="submitted">PENDING</SelectItem>
              <SelectItem value="encrypted">ENCRYPTED</SelectItem>
              <SelectItem value="viewed">VIEWED</SelectItem>
              <SelectItem value="graded">GRADED</SelectItem>
            </SelectContent>
          </Select>

          {onViewModeChange && (
            <div className="flex gap-2 shrink-0">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="gap-2 font-mono text-xs"
              >
                <LayoutGrid className="size-4" />
                GRID
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="gap-2 font-mono text-xs"
              >
                <Rows className="size-4" />
                LIST
              </Button>
            </div>
          )}
        </div>

        {/* Active filters display */}
        {statusFilter !== "all" && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-primary/10">
            <Badge variant="secondary" className="gap-1 font-mono text-[10px]">
              <Filter className="size-2.5" />
              STATUS: {statusFilter.toUpperCase()}
              <button
                onClick={() => onStatusChange("all")}
                className="ml-1 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </Badge>
            {searchQuery && (
              <Badge
                variant="secondary"
                className="gap-1 font-mono text-[10px]"
              >
                SEARCH: {searchQuery}
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
