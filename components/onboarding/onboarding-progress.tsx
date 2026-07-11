import { cn } from "@/lib/utils";

const STEPS = ["Project", "Connect Stripe", "Install snippet"];

export function OnboardingProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === step;
        const isDone = stepNumber < step;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                isDone && "bg-success text-success-foreground",
                isActive && "bg-primary text-primary-foreground",
                !isActive && !isDone && "bg-muted text-muted-foreground",
              )}
            >
              {stepNumber}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {stepNumber < STEPS.length && <div className="h-px flex-1 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
