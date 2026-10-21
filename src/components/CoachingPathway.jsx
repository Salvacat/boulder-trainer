import { useState } from "react";
import { COACHING_LEVELS, lessonSessionId } from "../data/coachingPathway.js";
import {
  COACHING_SOURCES,
  VIDEOS,
  youtubeUrl,
  RESEARCH_DATE,
} from "../data/coachingResearch.js";

export function LessonGuide({ lesson }) {
  return (
    <div className="bt-lesson-guide">
      <p className="bt-eyebrow">Trainer adaptation · {lesson.anchor}</p>
      <dl>
        <div>
          <dt>Learning objective</dt>
          <dd>{lesson.objective}</dd>
        </div>
        <div>
          <dt>Observe & assess</dt>
          <dd>{lesson.observe}</dd>
        </div>
        <div>
          <dt>Make it easier</dt>
          <dd>{lesson.easier}</dd>
        </div>
        <div>
          <dt>Progress the task</dt>
          <dd>{lesson.harder}</dd>
        </div>
        <div>
          <dt>Debrief</dt>
          <dd>{lesson.review}</dd>
        </div>
      </dl>
      <p className="bt-footnote">
        Suggested 60-minute lesson: 15 min briefing/warm-up · 10 min
        demonstration · 20 min practice · 10 min transfer · 5 min reflection.
        Adapt for your group and facility.
      </p>
    </div>
  );
}

export default function CoachingPathway({
  onOpenLesson,
  onAddLesson,
  onShowCourse,
}) {
  const [selected, setSelected] = useState("level-1");
  const level = COACHING_LEVELS.find((item) => item.id === selected);
  return (
    <section className="bt-coaching">
      <div className="bt-coaching-intro">
        <p className="bt-eyebrow">Built for teaching</p>
        <h2>From gym course to coached practice.</h2>
        <p>
          Your gym’s three technical courses remain the foundation. These six
          teaching levels and lesson plans are researched app extensions. They
          are skill pathways, with no automatic grade or certification attached.
        </p>
      </div>
      <div className="bt-level-tabs" aria-label="Teaching levels">
        {COACHING_LEVELS.map((item) => (
          <button
            key={item.id}
            aria-pressed={selected === item.id}
            className={selected === item.id ? "is-active" : ""}
            onClick={() => setSelected(item.id)}
          >
            <span>Level {item.number}</span>
            {item.title}
          </button>
        ))}
      </div>
      <article className="bt-level-detail" key={level.id}>
        <p className="bt-eyebrow">Level {level.number} · trainer adaptation</p>
        <h2>{level.title}</h2>
        <button
          className="bt-source-link"
          onClick={() => onShowCourse(level.courseId)}
        >
          Gym foundation: {level.anchor} →
        </button>
        <dl>
          <div>
            <dt>Start here when</dt>
            <dd>{level.entry}</dd>
          </div>
          <div>
            <dt>Suggested progression evidence</dt>
            <dd>{level.evidence}</dd>
          </div>
        </dl>
        <p className="bt-footnote">
          Use observations across sessions, confidence and the climber’s goals
          to choose the next level. These are suggested checks, not pass/fail
          standards.
        </p>
        {level.lessons.map((lesson, index) => (
          <details className="bt-lesson" key={lesson.id} open={index === 0}>
            <summary>
              Lesson {index + 1} · {lesson.title}
              <span>60 min suggested</span>
            </summary>
            <LessonGuide lesson={{ ...lesson, anchor: level.anchor }} />
            <div className="bt-card-actions">
              <button
                className="bt-button bt-primary"
                onClick={() => onOpenLesson(lessonSessionId(lesson.id))}
              >
                Open lesson & drills
              </button>
              <button
                className="bt-button bt-secondary"
                onClick={() => onAddLesson(lesson.drillIds)}
              >
                Add drills to my plan
              </button>
            </div>
          </details>
        ))}
      </article>
      <details className="bt-research-sources">
        <summary>Research & teaching method · checked {RESEARCH_DATE}</summary>
        <p>
          Agree one learning goal. Demonstrate briefly, let the climber explore,
          then ask what they noticed before offering one useful cue. Finish on a
          different problem and revisit next session. This is our synthesis of
          the sources below, not a gym-issued syllabus.
        </p>
        <p>
          Video relevance was checked against public creator descriptions and
          chapters; full video playback and transcripts were not reviewed.
          Related references may demonstrate the principle rather than the exact
          app exercise.
        </p>
        <ul>
          {COACHING_SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.publisher} · {source.title} ↗
              </a>
              <p>{source.use}</p>
            </li>
          ))}
        </ul>
        <h3>Demonstration library</h3>
        <ul>
          {Object.entries(VIDEOS).map(([key, video]) => (
            <li key={key}>
              <a
                href={youtubeUrl(key)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {video.channel} · {video.title} ↗
              </a>
              <p>{video.note}</p>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
