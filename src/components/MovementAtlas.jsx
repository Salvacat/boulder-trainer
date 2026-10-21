import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Search, ArrowRight } from "lucide-react";
import { MOVEMENT_TOPICS, ADVANCED_SOURCES } from "../data/advancedTraining.js";
import { VIDEOS, youtubeUrl, RESEARCH_DATE } from "../data/coachingResearch.js";
import PracticeLog from "./PracticeLog";
import { findTopics } from "../utils/topicSearch.js";
import "./MovementAtlas.css";

export default function MovementAtlas({
  selectedId,
  onSelect,
  renderDrill,
  onBuild,
  onOpenLesson,
  onShowCourse,
  entries,
  onUpdateEntries,
  onBackup,
}) {
  const [role, setRole] = useState("coach");
  const [pane, setPane] = useState("understand");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const topic = MOVEMENT_TOPICS.find((t) => t.id === selectedId);
  const openTopic = (id) => {
    onSelect(id);
    setPane("understand");
  };
  if (!topic) {
    const topics = findTopics(MOVEMENT_TOPICS, search, category);
    return (
      <section className="bt-atlas">
        <div className="bt-atlas-intro">
          <p className="bt-eyebrow">Explore. Experiment. Revisit.</p>
          <h1>Movement atlas.</h1>
          <p>
            Start with what happens on the wall. Open a topic for climber
            explanations, coach experiments and practice that grows with the
            task.
          </p>
        </div>
        <label className="bt-atlas-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search movement topics"
            placeholder="Feet cut? Slab balance? Projecting?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="bt-filter-row" aria-label="Movement topic categories">
          {["All", "Contact", "Movement", "Tactics", "Learning"].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "is-active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="bt-topic-grid">
          {topics.map((t) => (
            <button
              className="bt-topic-card"
              key={t.id}
              onClick={() => openTopic(t.id)}
            >
              <span className="bt-eyebrow">{t.category}</span>
              <h3>{t.title}</h3>
              <p>{t.summary}</p>
              <span className="bt-topic-footer">
                Explore & build practice <ArrowUpRight size={18} />
              </span>
            </button>
          ))}
        </div>
        {topics.length === 0 && (
          <div className="bt-atlas-empty">
            <p>No topic matches that search.</p>
            <button
              className="bt-button bt-secondary"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Show all topics
            </button>
          </div>
        )}
        <p className="bt-footnote">
          Performance extensions build on your gym courses. Choose tasks by
          readiness and the movement problem; grade alone does not select a
          level. Notes stay on this device.
        </p>
      </section>
    );
  }
  const tabs = [
    ["understand", "Understand"],
    ["practice", "Practise"],
    ...(role === "coach" ? [["coach", "Coach notes"]] : []),
    ["log", "Log"],
  ];
  return (
    <article className="bt-atlas bt-topic-detail" key={topic.id}>
      <button className="bt-back-button" onClick={() => onSelect(null)}>
        <ArrowLeft size={18} />
        Movement atlas
      </button>
      <header className="bt-topic-heading">
        <p className="bt-eyebrow">{topic.category} · movement study</p>
        <h1>{topic.title}</h1>
        <p>{topic.summary}</p>
      </header>
      <div className="bt-perspective" aria-label="Reading perspective">
        {["climber", "coach"].map((value) => (
          <button
            key={value}
            aria-pressed={role === value}
            className={role === value ? "is-active" : ""}
            onClick={() => {
              setRole(value);
              if (pane === "coach") setPane("understand");
            }}
          >
            {value === "coach" ? "Coach" : "Climber"}
          </button>
        ))}
      </div>
      <div className="bt-atlas-tabs" aria-label="Topic sections">
        {tabs.map(([id, title]) => (
          <button
            key={id}
            className={pane === id ? "is-active" : ""}
            aria-pressed={pane === id}
            onClick={() => setPane(id)}
          >
            {title}
            {id === "log" && entries.some((e) => e.topicId === topic.id) && (
              <span className="bt-tab-dot" aria-label="has saved notes" />
            )}
          </button>
        ))}
      </div>
      <div className="bt-topic-pane">
        {pane === "understand" && (
          <>
            <div className="bt-topic-principles">
              {topic.principles.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
            <blockquote className="bt-coach-cue">
              <span>
                {role === "coach" ? "Try one cue" : "Keep this in mind"}
              </span>
              {role === "coach" ? topic.coachCue : topic.cue}
            </blockquote>
            <div className="bt-reflection">
              <p className="bt-eyebrow">After an attempt</p>
              <h3>{topic.reflect}</h3>
            </div>
            <button
              className="bt-button bt-primary"
              onClick={() => setPane("practice")}
            >
              Explore the practice tasks <ArrowRight size={17} />
            </button>
          </>
        )}
        {pane === "practice" && (
          <>
            <p className="bt-footnote">
              Start with the easiest useful version. Keep attempts comparable
              and recover enough to practise with control. These are trainer
              adaptations, not fixed training doses.
            </p>
            <details className="bt-topic-progression">
              <summary>Explore → refine → transfer</summary>
              {topic.progression.map(([stage, task, success]) => (
                <div key={stage}>
                  <p className="bt-eyebrow">{stage}</p>
                  <p>{task}</p>
                  <p className="bt-footnote">
                    <strong>Look for:</strong> {success}
                  </p>
                </div>
              ))}
            </details>
            <div className="bt-card-actions">
              <button
                className="bt-button bt-primary"
                onClick={() => onBuild(topic.drillIds.slice(0, 2))}
              >
                Add practice block to my plan
              </button>
              <button
                className="bt-button bt-secondary"
                onClick={() => setPane("log")}
              >
                Record a practice note
              </button>
            </div>
            <div className="bt-legacy bt-topic-drills">
              {topic.drillIds.map((id) => renderDrill(id))}
            </div>
          </>
        )}
        {pane === "coach" && (
          <>
            <div className="bt-coaching-question">
              <p className="bt-eyebrow">Start with an observation</p>
              <h3>{topic.question}</h3>
            </div>
            <p className="bt-footnote">
              Possible explanations to test, not a diagnosis of the climber.
              Compare fresh, comfortable attempts before deciding whether the
              limiter is task choice, coordination or capacity.
            </p>
            {topic.diagnoses.map(([see, mayBe, test], index) => (
              <section className="bt-experiment-card" key={see}>
                <p className="bt-eyebrow">Experiment {index + 1}</p>
                <dl>
                  <div>
                    <dt>Observed event</dt>
                    <dd>{see}</dd>
                  </div>
                  <div>
                    <dt>Possible explanation</dt>
                    <dd>{mayBe}</dd>
                  </div>
                  <div>
                    <dt>Change one thing</dt>
                    <dd>{test}</dd>
                  </div>
                </dl>
                <button
                  className="bt-source-link"
                  onClick={() => setPane("log")}
                >
                  Log your observation →
                </button>
              </section>
            ))}
            <details className="bt-topic-progression">
              <summary>Demonstration & advanced variations</summary>
              <p>{topic.demo}</p>
              {topic.progression.map(([stage, task, success]) => (
                <div key={stage}>
                  <p className="bt-eyebrow">{stage}</p>
                  <p>{task}</p>
                  <p className="bt-footnote">Observe: {success}</p>
                </div>
              ))}
            </details>
            <div className="bt-card-actions">
              <button
                className="bt-button bt-primary"
                onClick={() => onBuild(topic.drillIds.slice(0, 2))}
              >
                Build a practice block
              </button>
              <button
                className="bt-button bt-secondary"
                onClick={() => onOpenLesson(topic.sessionId)}
              >
                Open related coach lesson
              </button>
            </div>
          </>
        )}
        <div hidden={pane !== "log"}>
          <PracticeLog
            key={topic.id}
            entries={entries}
            onChange={onUpdateEntries}
            topicId={topic.id}
            role={role}
            onBackup={onBackup}
          />
        </div>
      </div>
      <button
        className="bt-source-link bt-gym-anchor"
        onClick={() => onShowCourse(topic.courseId)}
      >
        {topic.anchor} →
      </button>
      <details className="bt-topic-sources">
        <summary>Sources, demonstrations & evidence limits</summary>
        <p className="bt-footnote">
          Checked {RESEARCH_DATE}. Articles and the study text/abstract were
          reviewed as labelled. Video relevance uses creator descriptions and
          chapters, without full playback. Tasks and coaching checks are our
          synthesis.
        </p>
        {topic.sourceIds.map((id) => {
          const source = ADVANCED_SOURCES[id];
          return (
            <article key={id}>
              <span className="bt-eyebrow">{source.type}</span>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.author} · {source.title} ↗
              </a>
              <p>{source.finding}</p>
              <p className="bt-footnote">Limit: {source.limit}</p>
            </article>
          );
        })}
        <h3>Related YouTube references</h3>
        {topic.videoKeys.map((key) => (
          <a
            className="bt-video-reference"
            key={key}
            href={youtubeUrl(key)}
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶ {VIDEOS[key].channel} · {VIDEOS[key].title} ↗
          </a>
        ))}
      </details>
    </article>
  );
}
