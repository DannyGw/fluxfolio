import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { getProjects } from "@/lib/api";

export default async function AdminProjectsPage() {
  let projects: any[] = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <div className="flex items-center gap-4">
                {project.imageUrl && (
                  <img src={project.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{project.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{project.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {project.featured && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                    Featured
                  </span>
                )}
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Edit
                </Link>
                <DeleteButton id={project.id} title={project.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
