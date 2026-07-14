import Link from "next/link";
import type { Project } from "@/lib/api";

type Props = {
  project: Project;
  variant?: "default" | "wide" | "tall";
};

export default function ProjectCard({ project, variant = "default" }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 ${
        variant === "wide" ? "sm:col-span-2" : ""
      } ${variant === "tall" ? "sm:row-span-2" : ""}`}
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="mt-4 flex items-center gap-3 text-xs font-medium">
          <span className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400">
            View details
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-600 text-white shadow-lg">
          Featured
        </div>
      )}
    </Link>
  );
}
