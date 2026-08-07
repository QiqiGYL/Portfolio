import { profile, projects } from "./projects.js";

function statusLabel(status) {
  if (status === "live") return "Live";
  if (status === "github") return "GitHub";
  return "Coming soon";
}

export default function App() {
  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />

      <header className="top">
        <a className="mark" href="#top">
          {profile.handle}
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow reveal">{profile.role}</p>
          <h1 className="brand reveal delay-1">{profile.name}</h1>
          <p className="lede reveal delay-2">{profile.line}</p>
          <div className="cta reveal delay-3">
            <a className="btn primary" href="#work">
              View projects
            </a>
            <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>

        <section className="work" id="work">
          <div className="section-head">
            <h2>Selected work</h2>
            <p>Small, concrete builds. Add the next one in <code>src/projects.js</code>.</p>
          </div>

          <ul className="project-list">
            {projects.map((project, index) => {
              const clickable = Boolean(project.href);
              const Tag = clickable ? "a" : "div";
              const linkProps = clickable
                ? { href: project.href, target: "_blank", rel: "noreferrer" }
                : {};

              return (
                <li key={project.id} className="project-item reveal" style={{ "--i": index }}>
                  <Tag className="project-link" {...linkProps}>
                    <span className="project-accent" style={{ background: project.accent }} />
                    <div className="project-body">
                      <div className="project-top">
                        <h3>{project.title}</h3>
                        <em className={`badge badge-${project.status}`}>{statusLabel(project.status)}</em>
                      </div>
                      <p>{project.blurb}</p>
                      <div className="tags">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </Tag>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <footer className="foot">
        <strong>{profile.name}</strong>
        <span>{profile.handle}</span>
      </footer>
    </div>
  );
}
