import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { pick } from "../lib/pick";

const projectFields = ["title", "slug", "description", "content", "techStack", "imageUrl", "liveUrl", "repoUrl", "featured", "order"] as const;

const router = Router();

// GET /api/projects — list all projects
router.get("/", async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /api/projects/featured — get featured projects
router.get("/featured", async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({ error: "Failed to fetch featured projects" });
  }
});

// GET /api/projects/:slug — get single project by slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST /api/projects — create a new project (admin only)
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = pick(req.body, projectFields) as any;
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /api/projects/:id — update a project (admin only)
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = pick(req.body, projectFields) as any;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /api/projects/:id — delete a project (admin only)
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
