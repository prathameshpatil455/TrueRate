import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function SelectField({ label, className, id, ...props }: SelectFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        id={fieldId}
        className={cn(
          "rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200",
          className,
        )}
        {...props}
      />
    </label>
  );
}
