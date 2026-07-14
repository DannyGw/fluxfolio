import BlogForm from "../BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
