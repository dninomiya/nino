import { cn } from "@/lib/utils";

function FlipCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group/flip-card perspective-midrange", className)}>
      <div className="relative size-full transition duration-500 transform-3d group-hover/flip-card:rotate-y-180">
        {children}
      </div>
    </div>
  );
}

const panelClassName = "size-full absolute inset-0 backface-hidden";

function FlipCardFront({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(panelClassName, className)}>{children}</div>;
}

function FlipCardBack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(panelClassName, "rotate-y-180", className)}>
      {children}
    </div>
  );
}

export { FlipCard, FlipCardFront, FlipCardBack };
