import { cn } from "@/lib/utils";
import { terraScoreColor } from "@/lib/utils/catalog";

interface TerraScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function TerraScoreBadge({ score, size = "sm" }: TerraScoreBadgeProps) {
  const colorClass = terraScoreColor(score);

  return (
    <span
      className={cn(
        "font-mono inline-flex items-center rounded px-1.5 py-0.5 font-semibold leading-none",
        colorClass,
        size === "sm" ? "text-[10px]" : "text-xs"
      )}
      title={`TerraScore: ${score}`}
    >
      TS {score}
    </span>
  );
}
