const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/** Get auth token from localStorage (client-side only) */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fluxfolio-token");
}

/** Redirect to login when token expires */
function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("fluxfolio-token");
    window.location.href = "/admin/login";
  }
}

/** Authenticated fetch helper — sends JWT token in Authorization header */
async function authenticatedFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  // Only set Content-Type when there's a JSON body to send
  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (res.status === 401) {
    redirectToLogin();
    throw new Error("Session expired — redirecting to login");
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  // Handle 204 No Content (e.g., DELETE responses)
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Fetch all blog posts (admin — requires auth) */
export async function getPosts(): Promise<BlogPost[]> {
  return authenticatedFetch<BlogPost[]>("/blog/all", { cache: "no-store" as any });
}

/** Fetch a single blog post by ID (admin — requires auth) */
export async function getPost(id: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.id === id) || null;
}

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  techStack: string[];
  imageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string | null;
  resumeUrl: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
  skills: string[];
  createdAt: string;
  updatedAt: string;
};

async function fetchJSON<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getProjects(): Promise<Project[]> {
  return fetchJSON<Project[]>("/projects");
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return fetchJSON<Project[]>("/projects/featured");
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  return fetchJSON<Project>(`/projects/${slug}`);
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export async function getProfile(): Promise<Profile> {
  return fetchJSON<Profile>("/profile");
}

export async function updateProfile(
  id: string,
  data: Partial<Profile>
): Promise<Profile> {
  return authenticatedFetch<Profile>(`/profile/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<ContactMessage> {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit message");
  return res.json();
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  return authenticatedFetch<ContactMessage[]>("/contact");
}

export async function markMessageRead(id: string): Promise<ContactMessage> {
  return authenticatedFetch<ContactMessage>(`/contact/${id}/read`, { method: "PUT" });
}

export async function deleteMessage(id: string): Promise<void> {
  await authenticatedFetch(`/contact/${id}`, { method: "DELETE" });
}

export async function createProject(
  data: Partial<Project>
): Promise<Project> {
  return authenticatedFetch<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project> {
  return authenticatedFetch<Project>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await authenticatedFetch(`/projects/${id}`, { method: "DELETE" });
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const baseUrl = API_URL.replace("/api", "");
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  const result = await res.json();
  if (result.url.startsWith("/")) {
    result.url = `${baseUrl}${result.url}`;
  }
  return result;
}

export async function uploadResume(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const baseUrl = API_URL.replace("/api", "");
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${baseUrl}/api/upload/resume`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload resume");
  const result = await res.json();
  if (result.url.startsWith("/")) {
    result.url = `${baseUrl}${result.url}`;
  }
  return result;
}

// ─── Blog CRUD (admin — requires auth) ────────────────────────

export async function createBlogPost(
  data: Partial<BlogPost>
): Promise<BlogPost> {
  return authenticatedFetch<BlogPost>("/blog", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<BlogPost> {
  return authenticatedFetch<BlogPost>(`/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await authenticatedFetch(`/blog/${id}`, { method: "DELETE" });
}
