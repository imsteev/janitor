import type { CrontabEntry } from "./types";

export class CrontabClient {
  async list(): Promise<CrontabEntry[]> {
    const proc = Bun.spawn(["crontab", "-l"]);
    const output = await new Response(proc.stdout).text();
    return output
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [min, hour, dayOfMonth, month, dayOfWeek, ...command] = line
          .trimEnd()
          .split(" ");
        return {
          schedule: `${min} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`,
          command: command ?? [],
        };
      });
  }

  async update(entries: CrontabEntry[]): Promise<CrontabEntry[]> {
    const crontabContent =
      entries.map((e) => `${e.schedule} ${e.command.join(" ")}`).join("\n") +
      "\n"; // Trailing new line is important to ensure updated crontab is installed

    const proc = Bun.spawn(["crontab", "-"], {
      stdin: new TextEncoder().encode(crontabContent),
    });

    const status = await proc.exited;
    const stderr = await new Response(proc.stderr).text();

    if (status !== 0) {
      throw new Error(`Failed to update crontab: ${stderr}`);
    }

    return entries;
  }
}
