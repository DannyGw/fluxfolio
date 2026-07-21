import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { pick } from "../lib/pick";

const blogFields = ["title", "slug", "excerpt", "content", "imageUrl", "tags", "published"] as const;

const router = Router();

// GET /api/blog — list all published posts (public)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        imageUrl: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/blog/all — list ALL posts (admin only)
router.get("/all", requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/blog/:slug — get single post (public)
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!post.published) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST /api/blog — create a post (admin)
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = pick(req.body, blogFields) as any;
    const post = await prisma.blogPost.create({ data });
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT /api/blog/:id — update a post (admin)
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = pick(req.body, blogFields) as any;
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data,
    });
    res.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/blog/:id — delete a post (admin)
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;
