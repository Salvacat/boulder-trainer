import {
  Mountain,
  LayoutGrid,
  BookOpen,
  Timer,
  Users,
  Bookmark,
} from "lucide-react";
const destinations = [
  ["sessions", "Sessions", LayoutGrid],
  ["library", "Library", BookOpen],
  ["timer", "Timer", Timer],
  ["coach", "Coach", Users],
];
export default function AppShell({
  active,
  onNavigate,
  planCount,
  onOpenPlan,
  children,
}) {
  const navigation = (
    <>
      {destinations.map(([id, label, Icon]) => (
        <button
          key={id}
          className={active === id ? "is-active" : ""}
          aria-current={active === id ? "page" : undefined}
          onClick={() => onNavigate(id)}
        >
          <Icon size={21} />
          <span>{label}</span>
        </button>
      ))}
    </>
  );
  return (
    <div className="boulder-app">
      <a href="#main-content" className="bt-skip-link">
        Skip to content
      </a>
      <aside className="bt-sidebar">
        <button
          className="bt-brand"
          onClick={() => onNavigate("sessions")}
          aria-label="Boulder Trainer home"
        >
          <span className="bt-brand-icon">
            <Mountain size={25} />
          </span>
          <span>
            BOULDER<small>TRAINER</small>
          </span>
        </button>
        <nav aria-label="Main navigation">{navigation}</nav>
        <div className="bt-sidebar-footer">
          <span className="bt-status-dot" /> Your training, on this device.
        </div>
      </aside>
      <div className="bt-app-column">
        <header className="bt-app-header">
          <button
            className="bt-brand"
            onClick={() => onNavigate("sessions")}
            aria-label="Boulder Trainer home"
          >
            <span className="bt-brand-icon">
              <Mountain size={22} />
            </span>
            <span>
              BOULDER<small>TRAINER</small>
            </span>
          </button>
          <span className="bt-header-context">
            {destinations.find((x) => x[0] === active)?.[1]}{" "}
            <span className="bt-context-line" /> Train with intention
          </span>
          <button
            className="bt-plan-button"
            aria-label={`Open my session plan, ${planCount} items`}
            onClick={onOpenPlan}
          >
            <Bookmark size={21} />
            {planCount > 0 && <span>{planCount}</span>}
          </button>
        </header>
        <main id="main-content" className="bt-main">
          {children}
        </main>
        <nav className="bt-bottom-nav" aria-label="Mobile navigation">
          {navigation}
        </nav>
      </div>
    </div>
  );
}
