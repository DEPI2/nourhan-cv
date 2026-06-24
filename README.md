# Nourhan Dawoud — Interactive CV

A single-page, responsive interactive resume built with **vanilla HTML, CSS, and JavaScript** — no build step, no dependencies, no framework.

## File structure

```
resume-site/
├── index.html        Page structure & content (all CV sections)
├── styles.css         Design system, layout, responsive rules, light/dark themes
├── script.js          Nav highlighting, collapsible roles, theme toggle, contact form
└── assets/
    ├── profile.jpeg          Profile photo
    └── Nourhan_Dawoud_CV.pdf Downloadable resume (linked from "Download CV")
```

## Run it locally

No installation or build tooling required.

**Option A — just open it**
Double-click `index.html`, or drag it into a browser window.

**Option B — local server (recommended, avoids any file:// quirks)**
From inside the `resume-site` folder, run one of:

```bash
# Python 3 (built into macOS/Linux, available via python.org on Windows)
python3 -m http.server 8080

# Node.js (if installed)
npx serve .
```

Then visit `http://localhost:8080` in your browser.

## "Build for production"

There is nothing to compile — the three files (`index.html`, `styles.css`, `script.js`) plus the `assets/` folder *are* the production build. To deploy:

1. Copy the whole `resume-site/` folder to your host.
2. Make sure `index.html` is served as the root/entry file.

### Deploying for free (pick one)

- **GitHub Pages**: push this folder to a repo, enable Pages in repo Settings → Pages, choose the branch/root.
- **Netlify**: drag-and-drop the `resume-site` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel**: `npx vercel` from inside the folder and follow the prompts.

No environment variables, API keys, or backend are needed — the contact form opens the visitor's own email client via a `mailto:` link rather than submitting anywhere.

## If you ever want an npm-based workflow instead

This project intentionally has no `package.json` since there's no build step. If you'd like one later purely for local dev convenience (e.g. live-reload), this is the minimal addition:

```json
{
  "name": "nourhan-dawoud-cv",
  "private": true,
  "scripts": {
    "start": "npx serve ."
  }
}
```
Then `npm start` serves the folder. It doesn't change any of the source files above.

## Customizing content

- **Photo**: replace `assets/profile.jpeg` (keep the same filename, or update the `src` in `index.html`'s `<figure class="hero__portrait">`).
- **Downloadable CV**: replace `assets/Nourhan_Dawoud_CV.pdf` with an updated PDF (same filename), or update the `href` on the "Download CV" link in `index.html`.
- **LinkedIn URL**: the source CV/portfolio only included the display name "Nourhan Dawoud," not the actual profile URL, so the link currently points to a LinkedIn people-search for that name. Replace the `href` on the LinkedIn link in the Contact section of `index.html` with the real profile URL once you have it.
- **Colors/fonts**: all design tokens live at the top of `styles.css` under `:root` and `[data-theme="light"]` — change a value once, it updates everywhere.

## Accessibility notes

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), skip-to-content link, visible focus rings.
- All interactive controls (nav toggle, theme toggle, role accordions, form fields) have proper ARIA states (`aria-expanded`, `aria-pressed`, `aria-current`, `aria-controls`).
- Color contrast checked against WCAG AA (4.5:1) for all text/background combinations in both themes.
- `prefers-reduced-motion` is respected — animations and smooth scrolling are disabled for users who request it.
- The profile photo has descriptive alt text.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari — including iOS/Android). Uses `IntersectionObserver` and CSS `color-mix()`, both widely supported as of 2026; the JS includes a fallback for browsers without `IntersectionObserver`.
