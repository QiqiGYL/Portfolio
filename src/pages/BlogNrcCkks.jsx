import "katex/dist/katex.min.css";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Link } from "react-router-dom";
import SiteShell from "../components/SiteShell.jsx";
import enSource from "../content/blog/nrc-ckks.en.md?raw";
import zhSource from "../content/blog/nrc-ckks.zh.md?raw";

function splitFront(source) {
  const lines = source.trim().split("\n");
  let title = "";
  let meta = "";
  let bodyStart = 0;

  if (lines[0]?.startsWith("# ")) {
    title = lines[0].slice(2).trim();
    bodyStart = 1;
  }
  while (bodyStart < lines.length && lines[bodyStart].trim() === "") bodyStart += 1;
  if (lines[bodyStart]?.startsWith("*") && lines[bodyStart]?.endsWith("*")) {
    meta = lines[bodyStart].slice(1, -1).trim();
    bodyStart += 1;
  }
  while (bodyStart < lines.length && lines[bodyStart].trim() === "") bodyStart += 1;
  return { title, meta, body: lines.slice(bodyStart).join("\n").trim() };
}

export default function BlogNrcCkks() {
  const [lang, setLang] = useState("en");
  const source = lang === "zh" ? zhSource : enSource;
  const { title, meta, body } = useMemo(() => splitFront(source), [source]);

  return (
    <SiteShell active="blog">
      <article className="blog">
        <div className="blog-top">
          <Link className="blog-back" to="/#work">
            ← Work
          </Link>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === "en" ? "is-active" : undefined}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === "zh" ? "is-active" : undefined}
              onClick={() => setLang("zh")}
            >
              中文
            </button>
          </div>
        </div>

        <header className="blog-hero">
          <p className="section-kicker">Writing</p>
          <h1>{title}</h1>
          {meta && <p className="blog-meta">{meta}</p>}
          <p className="blog-links">
            <a href="https://github.com/QiqiGYL/NRC_Coop" target="_blank" rel="noreferrer">
              GitHub · NRC_Coop
            </a>
          </p>
        </header>

        <div className="blog-body">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              img: ({ src, alt }) => (
                <figure className="blog-figure">
                  <img src={src} alt={alt || ""} loading="lazy" />
                  {alt ? <figcaption>{alt}</figcaption> : null}
                </figure>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {body}
          </ReactMarkdown>
        </div>
      </article>
    </SiteShell>
  );
}
