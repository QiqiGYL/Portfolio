/**
 * Edit contact + projects here — push to GitHub, Cloudflare Pages redeploys.
 * status: "live" | "github" | "blog" | "soon"
 * featured: larger tile in the work grid
 * internal: true → React Router link (same site)
 */
export const projects = [
  {
    id: "nrc-ckks-blog",
    title: "Sweeping 760K CKKS Parameter Sets",
    blurb:
      "NRC co-op write-up: 760k CKKS parameter sets measured end-to-end — OpenFHE C++ extensions, a two-week precision pipeline, SQLite + GUI, and operation benchmarks.",
    tags: ["C++", "OpenFHE", "Python", "SQLite"],
    status: "blog",
    href: "/blog/nrc-ckks",
    internal: true,
    accent: "#1f6f5b",
    featured: true,
  },
  {
    id: "jobhunter",
    title: "JobHunter",
    blurb: "A personal job-search companion — tracking applications and tooling around the hunt.",
    tags: ["Full-stack"],
    status: "github",
    href: "https://github.com/QiqiGYL/JobHunter",
    accent: "#2c5f7c",
    featured: false,
  },
  {
    id: "vancouver-parcel",
    title: "Vancouver Parcel Lot Analysis",
    blurb: "Spatial analysis tooling for Vancouver parcel and lot data.",
    tags: ["Data", "GIS", "Analysis"],
    status: "github",
    href: "https://github.com/QiqiGYL/Vancouver-Parcel-Lot-Analysis-Tool",
    accent: "#5c4d3c",
    featured: false,
  },
  {
    id: "housing-price",
    title: "Housing Price Prediction",
    blurb: "Exploratory model work around housing price prediction.",
    tags: ["ML", "Python"],
    status: "github",
    href: "https://github.com/QiqiGYL/Housing-Price-Predicion-Model",
    accent: "#3d4f5f",
    featured: false,
  },
];

export const profile = {
  name: "Grace Yue Li",
  handle: "graceyueli.com",
  role: "Open to work · full-stack & data",
  line: "I turn messy notes and real workflows into tools you can actually open and use.",
  availability: "Looking for full-stack / software / data roles — happy to chat.",
  email: "graceyliy29@gmail.com",
  github: "https://github.com/QiqiGYL",
  linkedin: "https://www.linkedin.com/in/grace-li-045794169/",
  location: "Open to remote & China / North America opportunities",
};
