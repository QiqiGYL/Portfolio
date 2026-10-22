import { Link } from "react-router-dom";
import SiteShell from "../components/SiteShell.jsx";
import SpotlightCard from "../components/SpotlightCard.jsx";
import { toys } from "../toys.js";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 11L11 3M11 3H5.5M11 3V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FunPage() {
  return (
    <SiteShell active="fun">
      <section className="fun-page">
        <div className="section-head">
          <p className="section-kicker">Playground</p>
          <h1>Fun</h1>
          <p>
            Small frontends I ship for fun — open them in the browser, no backend required. More will
            land here over time.
          </p>
        </div>

        <ul className="bento fun-grid">
          {toys.map((toy, index) => (
            <li key={toy.id} className="bento-item" style={{ "--i": index }}>
              <SpotlightCard className="bezel">
                <a className="project-core" href={toy.href}>
                  <div className="project-rail" style={{ background: toy.accent }} />
                  <div className="project-body">
                    <div className="project-top">
                      <h3>{toy.title}</h3>
                      <em className="badge badge-live">Live</em>
                    </div>
                    <p>{toy.blurb}</p>
                    <div className="project-foot">
                      <div className="tags">
                        {toy.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <span className="open-hint">
                        Play
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </a>
              </SpotlightCard>
              {toy.github && (
                <p className="fun-meta">
                  <a href={toy.github} target="_blank" rel="noreferrer">
                    Source on GitHub
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="fun-back">
          <Link to="/">← Back home</Link>
        </p>
      </section>
    </SiteShell>
  );
}
