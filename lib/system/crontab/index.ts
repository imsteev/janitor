import { CrontabClient } from "./client";
import type { CrontabEntry } from "./types";

export * from "./types";

export async function updateCrontab(
  client: CrontabClient,
  keyword: string,
  entry: CrontabEntry
): Promise<CrontabEntry[]> {
  const currentCrontabs = await client.list();

  let index: number | null = null;
  for (const [i, line] of currentCrontabs.entries()) {
    if (line.command.some((c) => c.includes(keyword))) {
      if (index !== null) {
        throw new Error(
          `Multiple crontab entries found for keyword: "${keyword}". Please be more specific.`
        );
      }
      index = i;
    }
  }

  if (currentCrontabs.length === 0 || index === null) {
    return client.update([entry]);
  }

  currentCrontabs[index] = entry;
  return client.update(currentCrontabs);
}
