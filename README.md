# Grace Yue Li — Portfolio

Personal site for [graceyueli.com](https://graceyueli.com).

## Local

```bash
npm install
npm run dev
```

## Add a project

Edit [`src/projects.js`](src/projects.js): add an object with `title`, `blurb`, `tags`, `status`, `href`.

## Deploy on Cloudflare Pages

1. Push this repo to GitHub
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → Connect the repo
3. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. After deploy → **Custom domains** → add `graceyueli.com` (and optionally `www`)
