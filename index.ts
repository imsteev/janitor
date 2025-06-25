import { config } from "./config";
import { duration } from "./lib/constants";
import { Janitor } from "./lib/janitor";

async function main(): Promise<void> {
  const janitor = new Janitor(
    config.baseDirectory,
    config.patterns,
    config.archiveDirectory
  );

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
