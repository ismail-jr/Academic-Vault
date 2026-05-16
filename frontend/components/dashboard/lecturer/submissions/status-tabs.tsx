// components/dashboard/status-tabs.tsx
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatusTabsProps {
  onStatusChange: (status: string) => void;
}

export function StatusTabs({ onStatusChange }: StatusTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
        <TabsTrigger value="all" onClick={() => onStatusChange("all")}>
          ALL
        </TabsTrigger>
        <TabsTrigger
          value="pending"
          onClick={() => onStatusChange("submitted")}
        >
          PENDING
        </TabsTrigger>
        <TabsTrigger
          value="encrypted"
          onClick={() => onStatusChange("encrypted")}
        >
          ENCRYPTED
        </TabsTrigger>
        <TabsTrigger value="viewed" onClick={() => onStatusChange("viewed")}>
          VIEWED
        </TabsTrigger>
        <TabsTrigger value="graded" onClick={() => onStatusChange("graded")}>
          GRADED
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
