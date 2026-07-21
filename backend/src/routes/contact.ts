import { Router, Request, Response } from "express";
import { prisma } from "../index";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/contact — submit a contact message
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    res.status(201).json(contactMessage);
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

// POST /api/contact/:id/reply — admin reply to a contact message (admin only)
router.post("/:id/reply", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const parent = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
    });
    if (!parent) {
      return res.status(404).json({ error: "Original message not found" });
    }

    const reply = await prisma.contactMessage.create({
      data: {
        name: "Admin",
        email: parent.email,
        subject: parent.subject ? `Re: ${parent.subject}` : null,
        message,
        isAdmin: true,
        parentId: parent.id,
        read: true,
      },
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error("Error creating reply:", error);
    res.status(500).json({ error: "Failed to create reply" });
  }
});

// GET /api/contact — get all top-level messages with their replies (admin only)
router.get("/", requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      where: { parentId: null },
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// PUT /api/contact/:id/read — mark message as read (admin only)
router.put("/:id/read", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json(message);
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

// DELETE /api/contact/:id — delete a contact message (admin only)
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
