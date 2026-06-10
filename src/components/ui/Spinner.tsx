import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("size-6 animate-spin text-brand", className)} />
  );
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-gray-500">
      <Spinner className="size-8" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
