export const PRACTICE_LOG_KEY = "boulder_practice_log_v1";
export const PRACTICE_STATUSES = ["planned", "tested", "revisit"];
export function trainerBackup(data, exportedAt = new Date().toISOString()) {
  return {
    version: "1.1",
    exportedAt,
    customDrills: data.customDrills,
    students: data.students,
    favorites: data.favorites,
    savedTemplates: data.savedTemplates,
    practiceEntries: cleanPracticeEntries(data.practiceEntries),
  };
}
const fields = ["observation", "hypothesis", "experiment", "result", "next"];
export function cleanPracticeEntries(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.flatMap((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      typeof entry.id !== "string" ||
      !entry.id ||
      entry.id.length > 150 ||
      seen.has(entry.id)
    )
      return [];
    if (
      typeof entry.topicId !== "string" ||
      entry.topicId.length > 100 ||
      !entry.topicId
    )
      return [];
    if (
      typeof entry.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)
    )
      return [];
    const parsed = new Date(`${entry.date}T12:00:00Z`);
    if (
      !Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== entry.date
    )
      return [];
    const clean = {
      id: entry.id,
      topicId: entry.topicId,
      date: entry.date,
      who: typeof entry.who === "string" ? entry.who.slice(0, 100) : "",
      role: entry.role === "climber" ? "climber" : "coach",
      status: PRACTICE_STATUSES.includes(entry.status)
        ? entry.status
        : "tested",
    };
    for (const field of fields)
      clean[field] =
        typeof entry[field] === "string" ? entry[field].slice(0, 3000) : "";
    if (!clean.observation.trim()) return [];
    seen.add(clean.id);
    return [clean];
  });
}
export function mergePracticeEntries(current, incoming) {
  // An imported backup adds missing records without overwriting local edits.
  return cleanPracticeEntries([
    ...cleanPracticeEntries(current),
    ...cleanPracticeEntries(incoming),
  ]);
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
