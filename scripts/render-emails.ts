import { writeFileSync, mkdirSync } from "node:fs";
import { welcomeEmail, enrollmentNotificationEmail } from "../server/emails/templates.js";

const data = {
  name: "Ramesh Kumar",
  mobile: "98765 43210",
  email: "ramesh@example.com",
  siteType: "Type A" as const,
  pumpName: "Sai Petroleums, Aligarh",
  sapCode: "41001234",
  agree: true as const,
};

const outDir = ".email-preview";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/welcome.html`, welcomeEmail(data).html);
writeFileSync(
  `${outDir}/notify.html`,
  enrollmentNotificationEmail(data, { submittedAt: "2026-06-18T09:30:00.000Z" }).html
);
console.log(`Rendered email previews to ./${outDir}/ — open the .html files in a browser.`);
