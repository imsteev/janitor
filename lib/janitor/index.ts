import { join } from "path";
import { readdir, stat, rename, mkdir, exists } from "fs/promises";
import { Stats } from "fs";

interface JanitorFile {
  name: string;
  path: string;
  stats: Stats;
}

export class Janitor {
  public readonly archivePath: string;

  constructor(
    /**
     * The path to the directory to scan for files.
     */
    public readonly basePath: string,
    /**
     * The patterns to match against the file names.
     */
    public readonly patterns: RegExp[]
  ) {
    this.archivePath = join(this.basePath, "janitor-archive");
  }

  async scan(): Promise<JanitorFile[]> {
    const files: JanitorFile[] = [];

    const baseFiles = await readdir(this.basePath);

    for (const file of baseFiles) {
      if (this.patterns.some((pattern) => pattern.test(file))) {
        const filePath = join(this.basePath, file);
        const stats = await stat(filePath);
        files.push({
          name: file,
          path: filePath,
          stats,
        });
      }
    }

    return files;
  }

  async archive(files: JanitorFile[]): Promise<void> {
    if (files.length === 0) {
      return;
    }

    if (!(await exists(this.archivePath))) {
      await mkdir(this.archivePath, { recursive: true });
    }

    const archiveEntry = await this.createArchiveEntry();

    for (const file of files) {
      const destinationPath = join(archiveEntry, file.name);
      await rename(file.path, destinationPath);
    }
  }

  private async createArchiveEntry(): Promise<string> {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19); // Format: 2025-01-21T10-30-45
    const archiveFolder = join(this.archivePath, timestamp);

    // Create timestamped subdirectory
    await mkdir(archiveFolder, { recursive: true });

    return archiveFolder;
  }
}
