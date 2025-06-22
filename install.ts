import { join } from "path";
import { existsSync } from "fs";
import { updateCrontab } from "./lib/system/crontab";
import { CrontabClient } from "./lib/system/crontab/client";
import { config } from "./config";

const programName = "janitor";

async function main() {
  if (!existsSync(join(process.cwd(), "config.ts"))) {
    console.log("Config file does not exist. Please create it.");
    return;
  }

  const janitorBinaryPath = await (async (): Promise<string> => {
    const proc = Bun.spawn([
      "bun",
      "build",
      "--compile",
      "--outfile",
      programName,
      "index.ts",
    ]);
    const output = await new Response(proc.stdout).text();
    console.log(output);
    return join(process.cwd(), programName);
  })();

  const client = new CrontabClient();
  await updateCrontab(client, programName, {
    schedule: config.defaultCron,
    command: [janitorBinaryPath],
  });
}

if (import.meta.main) {
  main();
}
