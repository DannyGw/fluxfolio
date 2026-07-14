import { Router, Request, Response } from "express";
import { prisma } from "../index";

const router = Router();

// GET /api/profile — get the profile (about me)
router.get("/", async (_req: Request, res: Response) => {
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

// PUT /api/profile/:id — update the profile
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
