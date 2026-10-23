import { Flag, Gamepad2, Swords } from "lucide-react";
import { motion } from "motion/react";
import "./GameArenaCard.css";

export default function GameArenaCard({
  href,
  title,
  blurb,
  tags = [],
  ctaLabel = "START",
  github,
}) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="arcade-wrap">
      <motion.a
        href={href}
        className="arcade-card"
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: [0, -10, -6],
                transition: { duration: 0.28, times: [0, 0.55, 1], ease: "easeOut" },
              }
        }
        whileTap={reduceMotion ? undefined : { y: 2 }}
      >
        <span className="arcade-map" aria-hidden="true" />
        <span className="arcade-dots" aria-hidden="true" />

        <div className="arcade-core">
          <div className="arcade-rail" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="arcade-brick" />
            ))}
          </div>

          <div className="arcade-body">
            <div className="arcade-top">
              <div className="arcade-title-row">
                <Swords className="arcade-swords" size={16} strokeWidth={2.5} aria-hidden="true" />
                <h3>{title}</h3>
              </div>
              <em className="arcade-live">
                <span className="arcade-pulse" aria-hidden="true" />
                <Gamepad2 size={13} strokeWidth={2.4} aria-hidden="true" />
                LIVE
              </em>
            </div>

            <p className="arcade-kicker">World 1-1 · PK Stage</p>
            <p className="arcade-blurb">{blurb}</p>

            <div className="arcade-foot">
              <div className="arcade-tags">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={
                      tag.toLowerCase() === "game" || tag.toLowerCase() === "game ui"
                        ? "arcade-tag-game"
                        : undefined
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="arcade-start">
                <Flag size={12} strokeWidth={2.6} aria-hidden="true" />
                {ctaLabel}
              </span>
            </div>
          </div>
        </div>
      </motion.a>

      {github ? (
        <p className="fun-meta arcade-source">
          <a href={github} target="_blank" rel="noreferrer">
            Source on GitHub
          </a>
        </p>
      ) : null}
    </div>
  );
}
