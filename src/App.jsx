import { profile, projects } from "./projects.js";

function statusLabel(status) {
  if (status === "live") return "Live";
  if (status === "github") return "GitHub";
  return "Coming soon";
}

export default function App() {
  const mail = profile.email ? `mailto:${profile.email}` : null;

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />

      <header className="top">
        <a className="mark" href="#top">
          {profile.handle}
        </a>
        <nav>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow reveal">
            <span className="pulse-dot" aria-hidden="true" />
            {profile.role}
          </p>
          <h1 className="brand reveal delay-1">{profile.name}</h1>
          <p className="lede reveal delay-2">{profile.line}</p>
          <div className="cta reveal delay-3">
            <a className="btn primary" href="#work">
              View projects
            </a>
            {mail && (
              <a className="btn ghost" href={mail}>
                Email me
              </a>
            )}
          </div>
        </section>

        <section className="work" id="work">
          <div className="section-head">
            <h2>Selected work</h2>
            <p>Concrete builds across full-stack, data, and applied ML.</p>
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

        <section className="contact" id="contact">
          <div className="contact-panel reveal">
            <p className="eyebrow">
              <span className="pulse-dot" aria-hidden="true" />
              Open to opportunities
            </p>
            <h2>Let&apos;s talk</h2>
            <p className="contact-copy">{profile.availability}</p>
            <p className="contact-meta">{profile.location}</p>
            <div className="contact-links">
              {mail && (
                <a className="btn primary" href={mail}>
                  {profile.email}
                </a>
              )}
              <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              {profile.linkedin && (
                <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <strong>{profile.name}</strong>
        <div className="foot-links">
          {mail && <a href={mail}>Email</a>}
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span>{profile.handle}</span>
        </div>
      </footer>
    </div>
  );
}
