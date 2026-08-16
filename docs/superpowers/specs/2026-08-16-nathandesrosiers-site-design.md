# nathandesrosiers.com — Site Design

## Goal

A static personal portfolio site for the domain `nathandesrosiers.com`, with a short About page and a Portfolio section showcasing art projects (images and videos). No real content yet — placeholders throughout. Built with current web dev best practices, deployed over HTTPS on a free host, under source control on GitHub with CI and Dependabot.

This mirrors the stack and conventions already established in `joepassmorefineart` (a sibling Astro site by the same owner), reused for consistency rather than re-deciding from scratch.

## Stack

- **Astro 6** — static output (`output: 'static'`), `build.format: 'file'` so routes serve without trailing-slash redirects.
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin.
- **TypeScript** with `astro check` for typechecking.
- **pnpm** as package manager (`packageManager` pinned in `package.json`).
- **sharp** for Astro's built-in image optimization.
- **@astrojs/sitemap** for sitemap generation.

## Pages & Content

- `/` — Home: short hero/intro, links to About and Portfolio.
- `/about` — short bio, placeholder text.
- `/portfolio` — grid/list of project entries pulled from a content collection.
- `/portfolio/[slug]` — detail page per project (placeholder image or video, description).

### Content collection: `projects`

Defined via Astro content collections (`src/content/config.ts` or `src/content.config.ts` depending on Astro 6 convention), schema:

```ts
{
  title: string,
  description: string,
  date: Date,
  media: { type: 'image' | 'video', src: string },
}
```

Ship with 2–3 placeholder entries (placeholder images generated as simple colored SVGs; video entries can point to a placeholder `.mp4` or embed a placeholder poster image with a "coming soon" note if no real video asset is available).

## Tooling & Quality Gates

- **Prettier** + `prettier-plugin-astro`, format script + `lint-staged` on pre-commit via **Husky**.
- **Vitest** for unit tests — content collection schema validation, any small utilities.
- **Playwright** + `@axe-core/playwright` for e2e/accessibility smoke tests — page loads for Home/About/Portfolio/detail, nav works, no axe violations.
- `astro check` wired as a `typecheck` script.
- **GitHub Actions CI** (`.github/workflows/ci.yml`): install → typecheck → unit tests → build → Playwright tests, on push and PR.
- **Dependabot** (`.github/dependabot.yml`): `npm` and `github-actions` ecosystems, weekly schedule, grouped minor/patch updates.

## Deployment

- **Netlify**, static site deployed from GitHub.
- `netlify.toml`: build command `pnpm build`, publish `dist`, Node/pnpm pinned versions, security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options) and long-lived cache headers for `/_astro/*` and static assets — adapted from the joepassmorefineart config, with CSP script-hash to be finalized once actual inline/component scripts (if any) are known.
- HTTPS is handled entirely by Netlify: once the custom domain is attached and DNS is pointed at Netlify, Netlify auto-provisions and auto-renews a Let's Encrypt certificate. No manual Certbot/cert-generation step, since there is no server to install a cert on.
- Repo→Netlify connection and DNS cutover are manual steps done via the Netlify dashboard under the user's own account/domain registrar — outside what an agent can perform without the user's interactive auth. The implementation plan will end with a documented checklist for these steps rather than automating them.

## Source Control

- New public GitHub repo `nathandesrosiers-com` under the `mdesrosiers` GitHub account (currently authenticated `gh` account).
- Standard `main` branch, initial commit containing the scaffolded project.

## Out of Scope (for this pass)

- Real about/portfolio content and real media assets — placeholders only.
- Contact form / newsletter / analytics — not requested.
- Actual Netlify project creation, GitHub repo↔Netlify linking, and DNS record changes at the registrar — these require the user's interactive credentials and will be handed off as a manual checklist.
