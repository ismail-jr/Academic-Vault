// components/ui/under-development.tsx (updated with lighter background)
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Hammer } from "lucide-react";

interface UnderDevelopmentContextType {
  openDialog: () => void;
  closeDialog: () => void;
  isOpen: boolean;
}

const UnderDevelopmentContext = createContext<
  UnderDevelopmentContextType | undefined
>(undefined);

export function UnderDevelopmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <UnderDevelopmentContext.Provider
      value={{ openDialog, closeDialog, isOpen }}
    >
      {children}
      <UnderDevelopmentDialog />
    </UnderDevelopmentContext.Provider>
  );
}

export function useUnderDevelopment() {
  const context = useContext(UnderDevelopmentContext);
  if (!context) {
    throw new Error(
      "useUnderDevelopment must be used within UnderDevelopmentProvider",
    );
  }
  return context;
}

export function UnderDevelopmentDialog() {
  const { isOpen, closeDialog } = useUnderDevelopment();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md shadow-2xl">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Hammer className="size-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            🚧 Under Development
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-gray-600 dark:text-gray-400">
            Our team is currently working on this feature.
            <br />
            It will be available soon!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={closeDialog}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
