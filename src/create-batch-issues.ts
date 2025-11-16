import fs from "fs";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";

dotenv.config();

async function main(filePath: string) {
  const file = fs.readFileSync(filePath, "utf8");
  const batchApi = `${process.env.SERVER_API_URL}/issues/batch`;
  const rows = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const issues = rows.map((r: any) => ({
    title: r.title,
    description: r.description,
    site: r.site,
    severity: r.severity,
    status: r.status,
    createdAt: r.createdAt,
  }));

  const res = await fetch(batchApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ issues }),
  });

  const data = await res.json();
  console.log("Inserted:", data);
}

main("./src/issues.csv");

// run: npx tsx src/create-batch-issues.ts
// src/issues.csv
