import { useEffect } from "react";
import Aurora from "./components/Aurora.jsx";
import BlurText from "./components/BlurText.jsx";
import Magnet from "./components/Magnet.jsx";
import SpotlightCard from "./components/SpotlightCard.jsx";
import { profile, projects } from "./projects.js";

function statusLabel(status) {
  if (status === "live") return "Live";
  if (status === "github") return "GitHub";
  return "Soon";
}

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

export default function App() {
  const mail = profile.email ? `mailto:${profile.email}` : null;

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true">
        <Aurora
          colorStops={["#1f6f5b", "#c5ddd2", "#6d8ea3"]}
          amplitude={0.85}
          blend={0.42}
          speed={0.55}
          lightMode
        />
      </div>
      <div className="grain" aria-hidden="true" />

      <a className="skip" href="#work">
        Skip to work
      </a>

      <header className="nav-wrap">
        <div className="nav-island">
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
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="status-pill reveal-load">
              <span className="pulse-dot" aria-hidden="true" />
              {profile.role}
            </p>
            <h1 className="brand reveal-load delay-1">{profile.name}</h1>
            <BlurText
              as="p"
              className="lede"
              text={profile.line}
              delay={70}
              animateBy="words"
              direction="bottom"
              stepDuration={0.28}
            />
            <div className="cta reveal-load delay-3">
              <Magnet padding={80} magnetStrength={8} wrapperClassName="magnet-btn">
                <a className="btn primary group" href="#work">
                  <span>View projects</span>
                  <span className="btn-orb">
                    <ArrowIcon />
                  </span>
                </a>
              </Magnet>
              {mail && (
                <Magnet padding={80} magnetStrength={8} wrapperClassName="magnet-btn">
                  <a className="btn ghost group" href={mail}>
                    <span>Email me</span>
                    <span className="btn-orb muted">
                      <ArrowIcon />
                    </span>
                  </a>
                </Magnet>
              )}
            </div>
          </div>
          <aside className="hero-aside reveal-load delay-2" aria-label="Highlights">
            <div className="aside-shell">
              <div className="aside-core">
                <p className="aside-label">Now</p>
                <p className="aside-title">{profile.availability}</p>
                <p className="aside-meta">{profile.location}</p>
                <div className="aside-links">
                  {mail && <a href={mail}>{profile.email}</a>}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="work" id="work">
          <div className="section-head reveal-on-scroll">
            <p className="section-kicker">Selected work</p>
            <h2>Things I have built</h2>
            <p>Full-stack tools, data analysis, and applied ML — concrete and shippable.</p>
          </div>

          <ul className="bento">
            {projects.map((project, index) => {
              const clickable = Boolean(project.href);
              const Tag = clickable ? "a" : "div";
              const linkProps = clickable
                ? { href: project.href, target: "_blank", rel: "noreferrer" }
                : {};

              return (
                <li
                  key={project.id}
                  className={`bento-item reveal-on-scroll ${project.featured ? "featured" : ""}`}
                  style={{ "--i": index }}
                >
                  <SpotlightCard className="bezel">
                    <Tag className="project-core" {...linkProps}>
                      <div className="project-rail" style={{ background: project.accent }} />
                      <div className="project-body">
                        <div className="project-top">
                          <h3>{project.title}</h3>
                          <em className={`badge badge-${project.status}`}>{statusLabel(project.status)}</em>
                        </div>
                        <p>{project.blurb}</p>
                        <div className="project-foot">
                          <div className="tags">
                            {project.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                          {clickable && (
                            <span className="open-hint">
                              Open
                              <ArrowIcon />
                            </span>
                          )}
                        </div>
                      </div>
                    </Tag>
                  </SpotlightCard>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="contact" id="contact">
          <div className="contact-bezel reveal-on-scroll">
            <div className="contact-core">
              <p className="section-kicker">
                <span className="pulse-dot" aria-hidden="true" />
                Open to opportunities
              </p>
              <h2>Let&apos;s talk</h2>
              <p className="contact-copy">{profile.availability}</p>
              <p className="contact-meta">{profile.location}</p>
              <div className="contact-links">
                {mail && (
                  <a className="btn primary group" href={mail}>
                    <span>{profile.email}</span>
                    <span className="btn-orb">
                      <ArrowIcon />
                    </span>
                  </a>
                )}
                <a className="btn ghost group" href={profile.github} target="_blank" rel="noreferrer">
                  <span>GitHub</span>
                  <span className="btn-orb muted">
                    <ArrowIcon />
                  </span>
                </a>
                {profile.linkedin && (
                  <a className="btn ghost group" href={profile.linkedin} target="_blank" rel="noreferrer">
                    <span>LinkedIn</span>
                    <span className="btn-orb muted">
                      <ArrowIcon />
                    </span>
                  </a>
                )}
              </div>
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
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          <span>{profile.handle}</span>
        </div>
      </footer>
    </div>
  );
}
