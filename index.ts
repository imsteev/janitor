import { Janitor } from "./lib/janitor";
import { join } from "path";

async function main(): Promise<void> {
  const desktopPath = join(process.env.HOME || "", "Desktop");
  const patterns = [
    // Apparently screenshot names on MacOS have non-standard whitespace characters (like \u202F, a non-breaking space)
    /^Screenshot \d{4}-\d{2}-\d{2} at \d{1,2}\.\d{2}\.\d{2}[\u00A0\u202F]?(AM|PM)/i,
  ];

  const janitor = new Janitor(desktopPath, patterns);
  const files = await janitor.scan();

  const oldFiles = files.filter((file) => isOlderThanOneDay(file.stats.mtime));
  if (oldFiles.length > 0) {
    await janitor.archive(oldFiles);
    console.log(`Archived ${oldFiles.length} file(s).`);
  } else {
    console.log("No files older than 24 hours found.");
  }
}

// Run the script
if (import.meta.main) {
  main().catch(console.error);
}

function isOlderThanOneDay(date: Date): boolean {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return date < oneDayAgo;
}
