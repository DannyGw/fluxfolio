import { getProjects, getProfile, type Project, type Profile } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactForm from "@/components/ContactForm";
import { AnimatedHero, AnimatedProjects, AnimatedAbout, AnimatedContact } from "./page.client";

export default async function HomePage() {
  let projects: Project[] = [];
  let profile: Profile | null = null;

  try {
    [projects, profile] = await Promise.all([getProjects(), getProfile()]);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  return (
    <>
      <AnimatedHero><HeroSection profile={profile} /></AnimatedHero>
      <AnimatedProjects><ProjectsSection projects={projects} /></AnimatedProjects>
      <AnimatedAbout><AboutSection profile={profile} /></AnimatedAbout>
      <AnimatedContact><ContactForm /></AnimatedContact>
    </>
  );
}
