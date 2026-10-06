import { Link } from "react-router-dom";
import Aurora from "./Aurora.jsx";
import { profile } from "../projects.js";

export default function SiteShell({ children, active = "home" }) {
  const mail = profile.email ? `mailto:${profile.email}` : null;

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

      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="nav-wrap">
        <div className="nav-island">
          <Link className="mark" to="/">
            {profile.handle}
          </Link>
          <nav>
            <Link to="/#work" className={active === "work" ? "is-active" : undefined}>
              Work
            </Link>
            <Link
              to="/blog/nrc-ckks"
              className={active === "blog" ? "is-active" : undefined}
            >
              Blog
            </Link>
            <Link to="/#contact" className={active === "contact" ? "is-active" : undefined}>
              Contact
            </Link>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div id="main">{children}</div>

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
          <Link to="/blog/nrc-ckks">Blog</Link>
          <span>{profile.handle}</span>
        </div>
      </footer>
    </div>
  );
}
