import { duration } from "./lib/constants";

export const config = {
  screenshotThresholdMs: duration.OneMinute.ms * 30,
  defaultCron: "0 * * * *", // every hour
};
