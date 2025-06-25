import { join } from "path";
import { readdir, stat, rename, mkdir, exists } from "fs/promises";
import { Stats } from "fs";

export class Janitor {
  constructor(
    /**
     * The path to the directory to scan for files.
     */
    public readonly baseDirectory: string,
    /**
     * The patterns to match against the file names in @basePath.
     */
    public readonly patterns: RegExp[],
    /**
     * The path to the directory where files will be moved to.
     */
    public readonly archiveDirectory: string = ""
  ) {
    this.archiveDirectory =
      archiveDirectory || join(this.baseDirectory, "janitor-archive");
  }
  async archive({ olderThanMs }: { olderThanMs: number }): Promise<number> {
    const allFiles = await this.scan(this.baseDirectory);

    const filesToArchive = allFiles.filter(async (file) => {
      const stat = await file.stat();
      return stat.mtime.getTime() < Date.now() - olderThanMs;
    });

    if (filesToArchive.length === 0) {
      return 0;
    }

    if (!(await exists(this.archiveDirectory))) {
      await mkdir(this.archiveDirectory, { recursive: true });
    }

    const archiveEntry = await this.createArchiveEntry();

    for (const file of filesToArchive) {
      if (file.name) {
        const slug = file.name.split("/").at(-1);
        if (!slug) {
          console.error("No slug found for file", file.name);
          continue;
        }
        const destinationPath = join(archiveEntry, slug);
        await rename(file.name, destinationPath);
      }
    }

    return filesToArchive.length;
  }

  // scans a directory for files that match @patterns
  private async scan(dir: string): Promise<Bun.BunFile[]> {
    const files: Bun.BunFile[] = [];

    for (const fileName of await readdir(dir)) {
      if (this.patterns.some((pattern) => pattern.test(fileName))) {
        files.push(Bun.file(join(dir, fileName)));
      }
    }

    return files;
  }

  private async createArchiveEntry(): Promise<string> {
    const archiveFolder = join(
      this.archiveDirectory,
      new Date().toISOString().replaceAll(":", ".")
    );
    await mkdir(archiveFolder, { recursive: true });
    return archiveFolder;
  }
}
