"use client";

import { ReactNode } from "react";
import AnimatedCard from "./AnimatedCard";

export default function AnimatedProjectsGrid({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function AnimatedProjectItem({ children, index }: { children: ReactNode; index: number }) {
  return <AnimatedCard index={index}>{children}</AnimatedCard>;
}
