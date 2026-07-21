import { getProjects } from "@/lib/api";
import { notFound } from "next/navigation";
import ProjectForm from "../ProjectForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  let projects: any[] = [];

  try {
    projects = await getProjects();
  } catch {
    notFound();
  }

  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Edit &quot;{project.title}&quot;</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
