import { ArrowLeft, Clock3, Layers } from "lucide-react";
import { LessonGuide } from "./CoachingPathway";
import BodyTensionSession from "./BodyTensionSession";
export default function SessionDetail({
  session,
  drills,
  renderDrill,
  onBack,
  onAdd,
  onTime,
}) {
  return (
    <div className="bt-page">
      <button className="bt-back-button" onClick={onBack}>
        <ArrowLeft size={18} />
        All sessions
      </button>
      <div className="bt-legacy bt-session-detail">
        {session.id === "body-tension" ? (
          <BodyTensionSession
            renderDrill={renderDrill}
            onAddSession={onAdd}
            onStartTimer={onTime}
          />
        ) : (
          <>
            <div className="bt-detail-heading">
              <p className="bt-eyebrow">
                {session.category} · {session.level}
              </p>
              <h1>{session.title}</h1>
              <p>{session.description}</p>
              <div className="bt-session-meta">
                <span>
                  <Clock3 size={16} />
                  {session.minutes} min suggested
                </span>
                <span>
                  <Layers size={16} />
                  {drills.length} drills
                </span>
              </div>
              <div className="bt-card-actions">
                <button className="bt-button bt-primary" onClick={onAdd}>
                  Add to my plan
                </button>
                <button className="bt-button bt-secondary" onClick={onTime}>
                  Time this session
                </button>
              </div>
              <p className="bt-footnote">
                Block timings are suggestions. Adjust them before you start.
              </p>
            </div>
            {session.coaching && <LessonGuide lesson={session.coaching} />}
            <div className="bt-detail-drills">{drills.map(renderDrill)}</div>
          </>
        )}
      </div>
    </div>
  );
}
