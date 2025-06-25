import { join } from "path";
import { duration } from "./lib/constants";

const baseDirectory = join(process.env.HOME || "", "Desktop");
const archiveDirectory = join(
  process.env.HOME || "",
  "Desktop",
  "janitor-archive"
);

export const config = {
  screenshotThresholdMs: duration.OneMinute.ms * 30,
  defaultCron: "0 * * * *", // every hour
  patterns: [
    // Screenshot names on MacOS have non-standard whitespace characters (like \u202F, a non-breaking space)
    /^Screenshot \d{4}-\d{2}-\d{2} at \d{1,2}\.\d{2}\.\d{2}[\u00A0\u202F]?(AM|PM)/i,
  ],
  baseDirectory,
  archiveDirectory,
};
