import { Router, Request, Response } from "express";
import { prisma } from "../index";

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

// GET /api/contact — get all contact messages (for admin)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// PUT /api/contact/:id/read — mark message as read
router.put("/:id/read", async (req: Request, res: Response) => {
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

// DELETE /api/contact/:id — delete a contact message
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

export default router;
