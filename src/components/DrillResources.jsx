import {
  DRILL_RESOURCES,
  VIDEOS,
  youtubeUrl,
  RESEARCH_DATE,
} from "../data/coachingResearch.js";
export default function DrillResources({ drill }) {
  const resource = DRILL_RESOURCES[drill.id];
  if (!resource)
    return (
      <p className="bt-footnote">
        Your custom drill · add your own demonstration using Add GIF/Video.
        Built-in research does not cover custom exercises.
      </p>
    );
  const [key, seconds, focus, relation] = resource;
  const video = VIDEOS[key];
  return (
    <aside className="bt-resource">
      <p className="bt-eyebrow">Trainer reference · YouTube</p>
      <a
        href={youtubeUrl(key, seconds)}
        target="_blank"
        rel="noopener noreferrer"
      >
        ▶ {video.title} ↗
      </a>
      <p>
        {video.channel}
        {seconds > 0
          ? ` · chapter ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
          : ""}
      </p>
      <span className="bt-source-tag">{relation}</span>
      <p>
        <strong>Observe:</strong> {focus}
      </p>
      <small>
        Link and relevance checked {RESEARCH_DATE} using creator descriptions
        and chapter lists. The app’s variations and assessment criteria are
        trainer adaptations.
      </small>
    </aside>
  );
}
