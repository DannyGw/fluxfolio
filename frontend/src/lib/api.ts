const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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
  const res = await fetch(`${API_URL}/profile/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
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
  return fetchJSON<ContactMessage[]>("/contact");
}

export async function markMessageRead(id: string): Promise<ContactMessage> {
  const res = await fetch(`${API_URL}/contact/${id}/read`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to mark message as read");
  return res.json();
}

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/contact/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete message");
}

export async function createProject(
  data: Partial<Project>
): Promise<Project> {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project> {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project");
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const baseUrl = API_URL.replace("/api", "");
  const res = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
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
  const res = await fetch(`${baseUrl}/api/upload/resume`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload resume");
  const result = await res.json();
  if (result.url.startsWith("/")) {
    result.url = `${baseUrl}${result.url}`;
  }
  return result;
}
