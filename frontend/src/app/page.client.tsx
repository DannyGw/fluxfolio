"use client";

import { ReactNode } from "react";
import AnimatedSection from "@/components/AnimatedSection";

export function AnimatedHero({ children }: { children: ReactNode }) {
  return <AnimatedSection>{children}</AnimatedSection>;
}

export function AnimatedProjects({ children }: { children: ReactNode }) {
  return <AnimatedSection delay={0.1}>{children}</AnimatedSection>;
}

export function AnimatedAbout({ children }: { children: ReactNode }) {
  return <AnimatedSection delay={0.2}>{children}</AnimatedSection>;
}

export function AnimatedContact({ children }: { children: ReactNode }) {
  return <AnimatedSection delay={0.3}>{children}</AnimatedSection>;
}
