import { Router, Response } from "express";
import { prisma } from "../index";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { pick } from "../lib/pick";

const profileFields = ["name", "title", "bio", "avatarUrl", "resumeUrl", "email", "github", "linkedin", "twitter", "website", "skills"] as const;

const router = Router();

// GET /api/profile — get the profile (about me)
router.get("/", async (_req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/profile/:id — update the profile (admin only)
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = pick(req.body, profileFields) as any;
    const profile = await prisma.profile.update({
      where: { id: req.params.id },
      data,
    });
    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
