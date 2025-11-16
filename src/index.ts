import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import express, { Request, Response } from "express";
const app = express();
import cors from "cors";

app.use(express.json());
app.use(cors());

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";
const API_PATH = "/api";
const ISSUES_API_PATH = `${API_PATH}/issues`;

// TODO: split the routes to router, split the dml layer from the controller
app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "hello from issue tracker backend!" });
});

app.get(`${ISSUES_API_PATH}`, async (req: Request, res: Response) => {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(issues);
  } catch (err: any) {
    console.error("Faild to get issues from DB:", err);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

app.post(`${ISSUES_API_PATH}/batch`, async (req, res) => {
  try {
    const { issues } = req.body;

    if (!Array.isArray(issues)) {
      return res.status(400).json({ error: "issues must be an array" });
    }

    // TODO: add zod data validiation
    const payload = issues.map((i: any) => ({
      title: i.title,
      description: i.description,
      site: i.site || null,
      severity: i.severity,
      status: i.status,
      createdAt: new Date(i.createdAt),
    }));

    const result = await prisma.issue.createMany({
      data: payload,
      skipDuplicates: true,
    });

    res.json({
      inserted: result.count,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post(`${ISSUES_API_PATH}`, async (req: Request, res: Response) => {
  try {
    const { title, description, site, severity, status, createdAt } = req.body;

    if (!title || !description || !severity || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        site: site || null,
        severity,
        status,
        createdAt: createdAt ? new Date(createdAt) : undefined,
      },
    });

    res.status(201).json(issue);
  } catch (err: any) {
    console.error("Error creating issue:", err);
    res.status(500).json({ error: "Failed to create issue" });
  }
});

app.patch(`${ISSUES_API_PATH}/:id`, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update provided" });
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedIssue);
  } catch (err: any) {
    console.error("Error updating issue:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.status(500).json({ error: "Failed to update issue" });
  }
});

app.delete(`${ISSUES_API_PATH}/:id`, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedIssue = await prisma.issue.delete({
      where: { id },
    });

    res.json(deletedIssue);
  } catch (err: any) {
    console.error("Error deleting issue:", err);

    res.status(500).json({ error: "Failed to delete issue" });
  }
});

app.listen(PORT, HOST, () => {
  console.log("Express server is running on port 3000");
});
