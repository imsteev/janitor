import { config } from "./config";
import { duration } from "./lib/constants";
import { Janitor } from "./lib/janitor";
import { join } from "path";

async function main(): Promise<void> {
  const baseDirectory = join(process.env.HOME || "", "Desktop");
  const archiveDirectory = join(
    process.env.HOME || "",
    "Desktop",
    "janitor-archive"
  );
  const patterns = [
    // E.g, matches "Screenshot 2025-06-22 at 5.15.40 PM"
    // Screenshot names on MacOS have non-standard whitespace characters (like \u202F, a non-breaking space)
    /^Screenshot \d{4}-\d{2}-\d{2} at \d{1,2}\.\d{2}\.\d{2}[\u00A0\u202F]?(AM|PM)/i,
  ];

  const janitor = new Janitor(baseDirectory, patterns, archiveDirectory);

  const numArchived = await janitor.archive({
    olderThanMs: config.screenshotThresholdMs,
  });

  if (numArchived > 0) {
    console.log(`Archived ${numArchived} file(s).`);
  } else {
    console.log(
      `No files older than ${
        config.screenshotThresholdMs / duration.OneMinute.ms
      }${duration.OneMinute.name} found.`
    );
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
