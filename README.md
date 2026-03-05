# Hagerstown Rapid Response (HRR)

A community-led alert and intervention network in Washington County, MD.

## Landing Page

Static, mobile-first landing page. Ready for GitHub Pages.

### Deploy to GitHub Pages

1. Create a new repo on GitHub
2. Push this folder to the repo
3. Go to **Settings → Pages** → Source: **Deploy from a branch**
4. Branch: `main` (or `master`), folder: `/ (root)`
5. Save — site will be live at `https://<username>.github.io/<repo>/`

### Local Preview

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Or open index.html in a browser
```

### Structure

- `index.html` — Main page
- `styles.css` — Civic Tech aesthetic (navy #002147, amber #FF8C00)
- `script.js` — Status bar and smooth scroll
- `assets/logo.png` — HRR logo (Maryland flag shield)
- `.nojekyll` — Ensures GitHub Pages serves static files as-is

### Sections

1. **Status Bar** — Live monitoring indicator (sticky)
2. **Hero** — Logo, headline, CTAs (Join Signal Group, Report Incident)
3. **How It Works** — Vetting, Mapping, Action + 500+ members, 6 sectors
4. **Join the Network** — Secure vetting, Signal encryption
5. **Coalition** — E.A.C., ACLU of Maryland
6. **Footer** — Logo, CLINIC resources, Privacy, Secure Contact

