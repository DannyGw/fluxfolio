import ProjectForm from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">New Project</h1>
      <ProjectForm />
    </div>
  );
}
