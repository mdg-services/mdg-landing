import { writeFileSync, mkdirSync } from "node:fs";
import {
  welcomeEmail,
  enrollmentNotificationEmail,
  grievanceAckEmail,
  grievanceNotificationEmail,
} from "../server/emails/templates.js";

const data = {
  name: "Ramesh Kumar",
  mobile: "98765 43210",
  email: "ramesh@example.com",
  siteType: "Type A" as const,
  pumpName: "Sai Petroleums, Aligarh",
  sapCode: "41001234",
  agree: true as const,
  source: "app" as const,
};

const grievance = {
  submissionId: "preview-0001",
  name: "Ramesh Kumar",
  email: "ramesh@example.com",
  mobile: "98765 43210",
  outlet: "Sai Petroleums, Aligarh",
  category: "billing" as const,
  message: "My invoice for September shows a charge I did not agree to.\nCould someone check it and call me?",
  lang: "en" as const,
};
const grievanceMeta = { ref: "G-0007", submittedAt: "2026-10-14T09:30:00.000Z" };

const outDir = ".email-preview";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/welcome.html`, welcomeEmail({ ...data, lang: "en" }).html);
writeFileSync(`${outDir}/welcome-hi.html`, welcomeEmail({ ...data, lang: "hi" }).html);
writeFileSync(
  `${outDir}/notify.html`,
  enrollmentNotificationEmail(data, {
    submittedAt: "2026-06-18T09:30:00.000Z",
    hasPassword: true,
  }).html
);
writeFileSync(
  `${outDir}/notify-not-registered.html`,
  enrollmentNotificationEmail(data, {
    submittedAt: "2026-06-18T09:30:00.000Z",
    handOff: "failed",
    hasPassword: true,
  }).html
);
writeFileSync(`${outDir}/grievance-ack-en.html`, grievanceAckEmail(grievance, grievanceMeta).html);
writeFileSync(
  `${outDir}/grievance-ack-hi.html`,
  grievanceAckEmail({ ...grievance, lang: "hi" }, grievanceMeta).html
);
writeFileSync(
  `${outDir}/grievance-notify.html`,
  grievanceNotificationEmail(grievance, grievanceMeta).html
);
console.log(`Rendered email previews to ./${outDir}/ — open the .html files in a browser.`);
