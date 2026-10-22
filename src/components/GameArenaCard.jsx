import { Gamepad2, Swords } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import "./GameArenaCard.css";

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

export default function GameArenaCard({
  href,
  title,
  blurb,
  tags = [],
  ctaLabel = "Enter arena",
  github,
}) {
  const ref = useRef(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 220, damping: 22, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 220, damping: 22, mass: 0.6 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-11, 11]);
  const glareX = useTransform(springX, [-0.5, 0.5], [10, 90]);
  const glareY = useTransform(springY, [-0.5, 0.5], [10, 90]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255, 214, 102, 0.22), transparent 55%)`;

  const onMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div className="arcade-wrap">
      <motion.a
        ref={ref}
        href={href}
        className="arcade-card"
        style={
          reduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                transformPerspective: 900,
              }
        }
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={reduceMotion ? undefined : { y: -6, scale: 1.015 }}
        whileTap={reduceMotion ? undefined : { scale: 0.985, y: -2 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        <span className="arcade-beam" aria-hidden="true" />
        <span className="arcade-grid" aria-hidden="true" />
        <motion.span className="arcade-glare" style={{ background: glare }} aria-hidden="true" />

        <div className="arcade-core">
          <div className="arcade-rail" aria-hidden="true" />
          <div className="arcade-body">
            <div className="arcade-top">
              <div className="arcade-title-row">
                <Swords className="arcade-swords" size={18} strokeWidth={2.25} aria-hidden="true" />
                <h3>{title}</h3>
              </div>
              <em className="arcade-live">
                <span className="arcade-pulse" aria-hidden="true" />
                <Gamepad2 size={13} strokeWidth={2.4} aria-hidden="true" />
                LIVE
              </em>
            </div>

            <p className="arcade-kicker">PK · Compare · Crown a winner</p>
            <p>{blurb}</p>

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
              <span className="arcade-cta">
                {ctaLabel}
                <ArrowIcon />
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
