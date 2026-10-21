const normalise = (value) =>
  value
    .toLowerCase()
    .replace(/\bfeet\b/g, "foot")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
export function findTopics(topics, query, category = "All") {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  return topics.filter(
    (topic) =>
      (category === "All" || topic.category === category) &&
      words.every((word) =>
        normalise(
          `${topic.id} ${topic.category} ${topic.title} ${topic.summary} ${topic.keywords}`,
        ).includes(word),
      ),
  );
}
