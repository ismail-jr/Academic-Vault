import { Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
}

export function SubmitButton({ isSubmitting, disabled }: SubmitButtonProps) {
  return (
    <>
      <Button
        type="submit"
        className="w-full rounded-xl h-12 font-semibold"
        disabled={disabled}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="size-4" />
            Encrypt & Submit
          </div>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        <FileText className="size-3 inline mr-1" />
        Your file will be encrypted with AES-256 before upload. The encryption
        key is secured using RSA-2048 and can only be decrypted by the selected
        lecturer.
      </p>
    </>
  );
}
