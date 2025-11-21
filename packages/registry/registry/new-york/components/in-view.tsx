"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { useEffect, useRef, useState } from "react";

export function InView({
  children,
  asChild,
  className,
  threshold = 1,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  threshold?: number;
} & React.ComponentProps<"div">) {
  const [inView, setInView] = useState(false);
  const Component = asChild ? Slot : "div";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      {
        threshold: threshold,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      data-in-view={inView}
      className={cn("group", className)}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
}
