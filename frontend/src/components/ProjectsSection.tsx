import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/api";

type Props = {
  projects: Project[];
};

export default function ProjectsSection({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <section id="projects" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">No projects yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  // Bento grid layout: first project featured wide, others in a grid
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Projects
          </h2>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            Things I&apos;ve built — from full-stack apps to experimental side projects.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {/* Featured projects take wider space */}
          {featured.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant={i === 0 ? "wide" : "default"}
            />
          ))}

          {/* Rest of projects */}
          {rest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
