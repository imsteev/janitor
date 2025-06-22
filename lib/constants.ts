class Duration {
  static Zero = { ms: 0, name: "0" };
  static OneMinute = { ms: 60 * 1000, name: "min" };
  static OneHour = { ms: 60 * 60 * 1000, name: "hr" };
  static OneDay = { ms: 24 * Duration.OneHour.ms, name: "day" };
  static OneWeek = { ms: 7 * Duration.OneDay.ms, name: "week" };
  static OneMonth = { ms: 30 * Duration.OneDay.ms, name: "month" };
  static OneYear = { ms: 365 * Duration.OneDay.ms, name: "year" };
}

export const duration = Duration;
