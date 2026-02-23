import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "docNumbers.json");

function pad(n: number, size = 6) {
  return String(n).padStart(size, "0");
}

export function getNextNumber(type: "invoice" | "receipt") {
  const raw = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(raw);

  json[type] = (json[type] || 0) + 1;

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf8");

  const year = new Date().getFullYear();
  const prefix = type === "invoice" ? "INV" : "RCPT";

  return `${prefix}-${year}-${pad(json[type])}`;
}