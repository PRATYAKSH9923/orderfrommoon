import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 shadow-sm border border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
