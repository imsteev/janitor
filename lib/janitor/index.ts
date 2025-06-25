import { join } from "path";
import { readdir, stat, rename, mkdir, exists } from "fs/promises";
import { Stats } from "fs";

interface JanitorFile {
  name: string; // slug
  path: string; // full path
  stats: Stats;
}

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

    const filesToArchive = allFiles.filter((file) => {
      return file.stats.mtime.getTime() < Date.now() - olderThanMs;
    });

    if (filesToArchive.length === 0) {
      return 0;
    }

    if (!(await exists(this.archiveDirectory))) {
      await mkdir(this.archiveDirectory, { recursive: true });
    }

    const archiveEntry = await this.createArchiveEntry();

    for (const file of filesToArchive) {
      const destinationPath = join(archiveEntry, file.name);
      await rename(file.path, destinationPath);
    }

    return filesToArchive.length;
  }

  // scans a directory for files that match @patterns
  private async scan(dir: string): Promise<JanitorFile[]> {
    const files: JanitorFile[] = [];

    for (const fileName of await readdir(dir)) {
      if (this.patterns.some((pattern) => pattern.test(fileName))) {
        files.push({
          name: fileName,
          path: join(dir, fileName),
          stats: await stat(join(dir, fileName)),
        });
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
