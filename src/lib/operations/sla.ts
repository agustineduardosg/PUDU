const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Santiago",
  weekday: "short",
});

export function nextBusinessResponseDueAt(from = new Date()) {
  const weekday = weekdayFormatter.format(from);
  const daysToAdd = weekday === "Fri" ? 3 : weekday === "Sat" ? 2 : 1;

  return new Date(from.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
}
