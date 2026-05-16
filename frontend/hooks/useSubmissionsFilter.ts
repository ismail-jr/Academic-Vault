// hooks/useSubmissionsFilter.ts
import { useState, useMemo } from "react";
import { Submission } from "@/contexts/submission-context";

export function useSubmissionsFilter(submissions: Submission[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.assignmentTitle
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        sub.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.lecturer.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  const hasFilters = searchQuery !== "" || statusFilter !== "all";

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredSubmissions,
    hasFilters,
  };
}
