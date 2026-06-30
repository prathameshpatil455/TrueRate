import { formatMoney } from "@/helpers/format";
import { cn } from "@/utils/cn";

interface FeeBreakdownProps {
  platformFee: number;
  fxMarkup: number;
  networkFee: number;
  currency: string;
  variant?: "inline" | "stacked";
  className?: string;
}

export function FeeBreakdown({
  platformFee,
  fxMarkup,
  networkFee,
  currency,
  variant = "inline",
  className,
}: FeeBreakdownProps) {
  const items = [
    { label: "Platform fee", amount: platformFee },
    { label: "Foreign exchange markup", amount: fxMarkup },
    { label: "Network fee", amount: networkFee },
  ];

  if (variant === "stacked") {
    return (
      <ul className={cn("space-y-1 text-sm", className)}>
        {items.map(({ label, amount }) => (
          <li key={label} className="flex justify-between gap-4">
            <span>{label}</span>
            <span className="font-medium">{formatMoney(amount, currency)}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className={cn("text-xs text-slate-500", className)}>
      {items.map(({ label, amount }, index) => (
        <span key={label}>
          {index > 0 && " · "}
          {label} {formatMoney(amount, currency)}
        </span>
      ))}
    </p>
  );
}
