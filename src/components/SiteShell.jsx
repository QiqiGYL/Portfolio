import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Aurora from "./Aurora.jsx";
import { profile } from "../projects.js";

const MOBILE_NAV = "(max-width: 700px)";

export default function SiteShell({ children, active = "home" }) {
  const mail = profile.email ? `mailto:${profile.email}` : null;
  const [navHidden, setNavHidden] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
    };
    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(nav);

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        const mobile = window.matchMedia(MOBILE_NAV).matches;

        if (!mobile || y < 40) {
          setNavHidden(false);
        } else if (delta > 8) {
          setNavHidden(true);
        } else if (delta < -8) {
          setNavHidden(false);
        }

        lastY = y;
        ticking = false;
      });
    };

    const onResize = () => {
      syncHeight();
      if (!window.matchMedia(MOBILE_NAV).matches) setNavHidden(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.removeProperty("--nav-h");
    };
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

      <a className="skip" href="#main">
        Skip to content
      </a>

      <header ref={navRef} className={`nav-wrap${navHidden ? " is-hidden" : ""}`}>
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
      <div className="nav-spacer" aria-hidden="true" />

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
