# nathandesrosiers.com Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a static Astro + Tailwind portfolio site for nathandesrosiers.com with placeholder About/Portfolio content, tests, CI, Dependabot, and a Netlify deployment (auto-HTTPS via Netlify's managed Let's Encrypt).

**Architecture:** Astro 6 static site (`output: 'static'`, `build.format: 'file'`) styled with Tailwind 4 via the Vite plugin. Portfolio entries live in a plain typed data module (`src/data/projects.ts`) rather than Astro content collections — the site currently has only a handful of hand-authored placeholder entries with no external asset directory to glob over, so a small typed array is simpler to write, simpler to unit-test in Vitest, and matches the sibling `joepassmorefineart` project's proven data-module pattern more closely than the Content Layer API would. Pages are static Astro components; the one dynamic route (`/portfolio/[slug]`) uses `getStaticPaths()` sourced from that data module.

**Tech Stack:** Astro 6, Tailwind CSS 4, TypeScript, pnpm, Vitest (unit), Playwright + @axe-core/playwright (e2e/a11y), Husky + lint-staged + Prettier, GitHub Actions, Dependabot, Netlify.

**Spec:** `docs/superpowers/specs/2026-08-16-nathandesrosiers-site-design.md`

## Global Constraints

- Package manager: pnpm (pinned via `packageManager` field), Node >=22.12.
- Astro output must stay static (`output: 'static'`), `build.format: 'file'` (avoids trailing-slash redirects on Netlify).
- No real portfolio content/media yet — placeholders only, clearly labeled as such in code/comments where non-obvious.
- No dark mode, no analytics, no contact form, no JSON-LD/OG-image pipeline — out of scope per spec.
- Deployment (Netlify project creation, GitHub↔Netlify link, DNS cutover) requires the user's own interactive credentials and cannot be automated by an agent — the final task produces a documented manual checklist instead of performing these steps.
- GitHub repo: `nathandesrosiers-com`, public, under the `mdesrosiers` GitHub account (current `gh` auth).

---

### Task 1: Project scaffold & tooling

**Files:**
- Create: `package.json`
- Create: `.nvmrc`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `.prettierrc`
- Create: `.prettierignore`
- Create: `.editorconfig`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro` (minimal placeholder, replaced in Task 3)
- Create: `.husky/pre-commit`
- Modify: `.gitignore`

**Interfaces:**
- Produces: a working `pnpm build`/`pnpm dev`/`pnpm typecheck` toolchain every later task relies on. Path alias `~/*` → `src/*` (used by every subsequent `~/...` import).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "nathandesrosiers-com",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12",
    "pnpm": ">=9"
  },
  "packageManager": "pnpm@9.15.9",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "typecheck": "astro check",
    "format": "prettier --write \"**/*.{astro,ts,tsx,css,md,json,yaml,yml}\"",
    "test": "playwright test",
    "test:unit": "vitest run",
    "prepare": "husky || true"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "astro": "^6.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "@axe-core/playwright": "^4.9.0",
    "@playwright/test": "^1.45.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.2.0",
    "prettier-plugin-astro": "^0.13.0",
    "typescript": "^5.4.0",
    "vitest": "^4.1.6"
  },
  "lint-staged": {
    "*.{astro,ts,tsx,css,md,json,yaml,yml}": "prettier --write"
  }
}
```

- [ ] **Step 2: Write `.nvmrc`**

```
22
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  },
  "include": ["src", ".astro/types.d.ts"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nathandesrosiers.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwind()],
    build: {
      assetsInlineLimit: 0,
    },
  },
});
```

- [ ] **Step 5: Write `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": { "parser": "astro" }
    }
  ]
}
```

- [ ] **Step 6: Write `.prettierignore`**

```
dist
.astro
node_modules
pnpm-lock.yaml
```

- [ ] **Step 7: Write `.editorconfig`**

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
```

- [ ] **Step 8: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['src/**/*.test.ts'] },
});
```

- [ ] **Step 9: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: 0,
  workers: 4,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    colorScheme: 'light',
  },
  webServer: {
    command: 'pnpm preview',
    port: 4321,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['iPhone 15'] },
  ],
});
```

- [ ] **Step 10: Write `src/styles/global.css`**

```css
@import 'tailwindcss';
```

- [ ] **Step 11: Write a minimal `src/pages/index.astro`**

This is a throwaway placeholder — Task 3 replaces it with the real Home page.

```astro
---
import '~/styles/global.css';
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>nathandesrosiers.com</title>
  </head>
  <body>
    <p>Coming soon.</p>
  </body>
</html>
```

- [ ] **Step 12: Update `.gitignore`**

Append to the existing file (keep the current `.claude/settings.local.json` line):

```
node_modules
dist
.astro
.env
test-results
playwright-report
```

- [ ] **Step 13: Install dependencies**

Run: `pnpm install`
Expected: installs successfully, creates `pnpm-lock.yaml`, and (via the `prepare` script) sets Husky's git hooks path.

- [ ] **Step 14: Write `.husky/pre-commit`**

```
pnpm lint-staged
```

Then make it executable: `chmod +x .husky/pre-commit`

- [ ] **Step 15: Verify the toolchain works**

Run: `pnpm typecheck`
Expected: PASS, no errors.

Run: `pnpm build`
Expected: PASS, `dist/index.html` exists and contains "Coming soon.".

- [ ] **Step 16: Commit**

```bash
git add package.json pnpm-lock.yaml .nvmrc tsconfig.json astro.config.mjs .prettierrc .prettierignore .editorconfig vitest.config.ts playwright.config.ts src/styles/global.css src/pages/index.astro .husky/pre-commit .gitignore
git commit -m "chore: scaffold Astro + Tailwind project"
```

---

### Task 2: Project data module and placeholder media

**Files:**
- Create: `src/data/site.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/projects.test.ts`
- Create: `public/media/placeholder-1.svg`
- Create: `public/media/placeholder-2.svg`

**Interfaces:**
- Consumes: nothing from Task 1 beyond the working Vitest config.
- Produces: `export const site: { title: string; description: string; url: string }` from `~/data/site`. `export type Project = { slug: string; title: string; description: string; date: string; media: { type: 'image'; src: string; alt: string } | { type: 'video'; alt: string } }`, `export function getProjects(): readonly Project[]`, `export function getProject(slug: string): Project | undefined` from `~/data/projects` — used by Tasks 3, 5, and 6.

- [ ] **Step 1: Write the failing test — `src/data/projects.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { getProjects, getProject } from './projects';

describe('projects', () => {
  it('returns at least one project', () => {
    expect(getProjects().length).toBeGreaterThan(0);
  });

  it('returns projects sorted by date descending (newest first)', () => {
    const dates = getProjects().map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it('every project has a unique slug', () => {
    const slugs = getProjects().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('getProject returns the matching project by slug', () => {
    const [first] = getProjects();
    expect(getProject(first.slug)?.slug).toBe(first.slug);
  });

  it('getProject returns undefined for an unknown slug', () => {
    expect(getProject('does-not-exist')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test:unit`
Expected: FAIL — `./projects` module not found.

- [ ] **Step 3: Write `src/data/site.ts`**

```ts
export const site = {
  title: 'Nathan Desrosiers',
  description: 'Artist portfolio and personal site for Nathan Desrosiers.',
  url: 'https://nathandesrosiers.com',
};
```

- [ ] **Step 4: Write `src/data/projects.ts`**

```ts
export type Project = {
  slug: string;
  title: string;
  description: string;
  date: string;
  media: { type: 'image'; src: string; alt: string } | { type: 'video'; alt: string };
};

const projects: readonly Project[] = [
  {
    slug: 'placeholder-one',
    title: 'Placeholder Project One',
    description: 'A short placeholder description of the first project. Real content coming soon.',
    date: '2026-01-01',
    media: { type: 'image', src: '/media/placeholder-1.svg', alt: 'Placeholder artwork one' },
  },
  {
    slug: 'placeholder-two',
    title: 'Placeholder Project Two',
    description: 'A short placeholder description of the second project. Real content coming soon.',
    date: '2026-02-01',
    media: { type: 'image', src: '/media/placeholder-2.svg', alt: 'Placeholder artwork two' },
  },
  {
    slug: 'placeholder-three',
    title: 'Placeholder Project Three',
    description: 'A short placeholder description of a video project. Real content coming soon.',
    date: '2026-03-01',
    media: { type: 'video', alt: 'Placeholder video project' },
  },
];

export function getProjects(): readonly Project[] {
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
```

- [ ] **Step 5: Write the two placeholder SVGs**

`public/media/placeholder-1.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#e5e0d8" />
  <text x="400" y="300" font-family="sans-serif" font-size="28" fill="#57534e" text-anchor="middle" dominant-baseline="middle">Placeholder Artwork 1</text>
</svg>
```

`public/media/placeholder-2.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#d8e0e5" />
  <text x="400" y="300" font-family="sans-serif" font-size="28" fill="#3f4b57" text-anchor="middle" dominant-baseline="middle">Placeholder Artwork 2</text>
</svg>
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm test:unit`
Expected: PASS, all 5 assertions green.

- [ ] **Step 7: Commit**

```bash
git add src/data/site.ts src/data/projects.ts src/data/projects.test.ts public/media/placeholder-1.svg public/media/placeholder-2.svg
git commit -m "feat: add site config and placeholder project data"
```

---

### Task 3: Layout, Nav, Footer, and Home page

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro` (replace Task 1's placeholder)
- Create: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `site` from `~/data/site` (Task 2).
- Produces: `Layout.astro` with `Props = { title: string; description: string }`, used by every page from here on (Tasks 4, 5, 6).

- [ ] **Step 1: Write the failing test — `tests/home.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('home page loads with nav and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Home/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nathan Desrosiers');
});

test('nav exposes links to about and portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  await expect(page.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '/portfolio');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — no heading "Nathan Desrosiers" and no About/Portfolio links exist yet (current `index.astro` only says "Coming soon.").

- [ ] **Step 3: Write `src/components/Nav.astro`**

```astro
---
const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
];
const current = Astro.url.pathname;
---

<header class="border-b border-neutral-200">
  <nav class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4" aria-label="Main">
    <a href="/" class="font-semibold">Nathan Desrosiers</a>
    <ul class="flex gap-6">
      {links.map((link) => (
        <li>
          <a
            href={link.href}
            aria-current={current === link.href ? 'page' : undefined}
            class="hover:underline"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

- [ ] **Step 4: Write `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t border-neutral-200">
  <p class="mx-auto max-w-3xl px-4 py-6 text-sm text-neutral-600">
    &copy; {year} Nathan Desrosiers.
  </p>
</footer>
```

- [ ] **Step 5: Write `src/layouts/Layout.astro`**

```astro
---
import '~/styles/global.css';
import Nav from '~/components/Nav.astro';
import Footer from '~/components/Footer.astro';
import { site } from '~/data/site';

type Props = {
  title: string;
  description: string;
};

const { title, description } = Astro.props;
const canonicalUrl = new URL(Astro.url.pathname, site.url).toString();
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} · {site.title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalUrl} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta name="twitter:card" content="summary" />
  </head>
  <body class="flex min-h-dvh flex-col bg-white text-neutral-900">
    <Nav />
    <main class="mx-auto max-w-3xl flex-1 px-4 py-10">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 6: Replace `src/pages/index.astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
import { site } from '~/data/site';
---

<Layout title="Home" description={site.description}>
  <h1 class="text-3xl font-bold">Nathan Desrosiers</h1>
  <p class="mt-4 text-neutral-700">
    Welcome. This site is a work in progress — more about me and a look at my art projects are
    coming soon.
  </p>
  <p class="mt-6">
    <a href="/about" class="underline">Read the About page</a> or
    <a href="/portfolio" class="underline">browse the Portfolio</a>.
  </p>
</Layout>
```

- [ ] **Step 7: Add the favicon referenced by Layout**

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#171717" />
  <text x="16" y="22" font-family="sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">N</text>
</svg>
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS, both tests in `tests/home.spec.ts` green.

- [ ] **Step 9: Commit**

```bash
git add src/layouts/Layout.astro src/components/Nav.astro src/components/Footer.astro src/pages/index.astro public/favicon.svg tests/home.spec.ts
git commit -m "feat: add site layout, nav, footer, and home page"
```

---

### Task 4: About page

**Files:**
- Create: `src/pages/about.astro`
- Create: `tests/about.spec.ts`

**Interfaces:**
- Consumes: `Layout` from `~/layouts/Layout.astro` (Task 3).

- [ ] **Step 1: Write the failing test — `tests/about.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('about page loads with heading and bio text', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveTitle(/About/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');
  await expect(page.getByText('Placeholder bio')).toBeVisible();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — `/about` returns 404 (page doesn't exist yet).

- [ ] **Step 3: Write `src/pages/about.astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
---

<Layout title="About" description="A short bio for Nathan Desrosiers.">
  <h1 class="text-3xl font-bold">About</h1>
  <p class="mt-4 text-neutral-700">
    Placeholder bio — a short introduction to Nathan Desrosiers and their work will go here.
  </p>
</Layout>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro tests/about.spec.ts
git commit -m "feat: add about page"
```

---

### Task 5: Portfolio index page

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/portfolio/index.astro`
- Create: `tests/portfolio.spec.ts`

**Interfaces:**
- Consumes: `Project` type and `getProjects()` from `~/data/projects` (Task 2); `Layout` from `~/layouts/Layout.astro` (Task 3).
- Produces: `ProjectCard.astro` with `Props = { project: Project }`, reused by Task 6's detail page styling conventions (not imported there, but same visual pattern).

- [ ] **Step 1: Write the failing test — `tests/portfolio.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('portfolio page lists all placeholder projects', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page).toHaveTitle(/Portfolio/);
  await expect(page.getByRole('heading', { name: 'Placeholder Project One' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Placeholder Project Two' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Placeholder Project Three' })).toBeVisible();
});

test('project cards link to their detail pages', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('link', { name: /Placeholder Project One/ })).toHaveAttribute(
    'href',
    '/portfolio/placeholder-one',
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — `/portfolio` returns 404.

- [ ] **Step 3: Write `src/components/ProjectCard.astro`**

```astro
---
import type { Project } from '~/data/projects';

type Props = { project: Project };
const { project } = Astro.props;
---

<a
  href={`/portfolio/${project.slug}`}
  class="block rounded border border-neutral-200 p-4 hover:border-neutral-400"
>
  {project.media.type === 'image' ? (
    <img
      src={project.media.src}
      alt={project.media.alt}
      class="mb-3 h-48 w-full rounded object-cover"
    />
  ) : (
    <div class="mb-3 flex h-48 w-full items-center justify-center rounded bg-neutral-100 text-neutral-600">
      <span>Video preview coming soon</span>
    </div>
  )}
  <h2 class="font-semibold">{project.title}</h2>
  <p class="mt-1 text-sm text-neutral-600">{project.description}</p>
</a>
```

- [ ] **Step 4: Write `src/pages/portfolio/index.astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
import ProjectCard from '~/components/ProjectCard.astro';
import { getProjects } from '~/data/projects';

const projects = getProjects();
---

<Layout title="Portfolio" description="A showcase of art projects by Nathan Desrosiers.">
  <h1 class="text-3xl font-bold">Portfolio</h1>
  <ul class="mt-6 grid gap-6 sm:grid-cols-2">
    {projects.map((project) => (
      <li>
        <ProjectCard project={project} />
      </li>
    ))}
  </ul>
</Layout>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/portfolio/index.astro tests/portfolio.spec.ts
git commit -m "feat: add portfolio index page"
```

---

### Task 6: Portfolio detail page

**Files:**
- Create: `src/pages/portfolio/[slug].astro`
- Create: `tests/portfolio-detail.spec.ts`

**Interfaces:**
- Consumes: `getProjects`, `getProject` from `~/data/projects` (Task 2); `Layout` from `~/layouts/Layout.astro` (Task 3).

- [ ] **Step 1: Write the failing test — `tests/portfolio-detail.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('detail page for an image project shows title, image, and description', async ({ page }) => {
  await page.goto('/portfolio/placeholder-one');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Placeholder Project One');
  await expect(page.getByAltText('Placeholder artwork one')).toBeVisible();
  await expect(
    page.getByText('A short placeholder description of the first project.'),
  ).toBeVisible();
});

test('detail page for a video project shows the video placeholder', async ({ page }) => {
  await page.goto('/portfolio/placeholder-three');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Placeholder Project Three');
  await expect(page.getByText('Video preview coming soon')).toBeVisible();
});

test('back link returns to the portfolio index', async ({ page }) => {
  await page.goto('/portfolio/placeholder-one');
  await page.getByRole('link', { name: /Back to Portfolio/ }).click();
  await expect(page).toHaveURL('/portfolio');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test`
Expected: FAIL — `/portfolio/placeholder-one` returns 404.

- [ ] **Step 3: Write `src/pages/portfolio/[slug].astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
import { getProjects, getProject } from '~/data/projects';

export async function getStaticPaths() {
  return getProjects().map((p) => ({ params: { slug: p.slug } }));
}

const { slug } = Astro.params;
const project = getProject(slug!)!;
---

<Layout title={project.title} description={project.description}>
  <a href="/portfolio" class="text-sm underline">&larr; Back to Portfolio</a>
  <h1 class="mt-4 text-3xl font-bold">{project.title}</h1>
  {project.media.type === 'image' ? (
    <img src={project.media.src} alt={project.media.alt} class="mt-6 w-full rounded" />
  ) : (
    <div class="mt-6 flex h-64 w-full items-center justify-center rounded bg-neutral-100 text-neutral-600">
      <span>Video preview coming soon</span>
    </div>
  )}
  <p class="mt-6 text-neutral-700">{project.description}</p>
</Layout>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/portfolio/\[slug\].astro tests/portfolio-detail.spec.ts
git commit -m "feat: add portfolio detail page"
```

---

### Task 7: Accessibility smoke tests

**Files:**
- Create: `tests/a11y.spec.ts`

**Interfaces:**
- Consumes: `@axe-core/playwright`'s `AxeBuilder` (already a devDependency from Task 1); all pages built in Tasks 3–6.

- [ ] **Step 1: Write the test — `tests/a11y.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const paths = ['/', '/about', '/portfolio', '/portfolio/placeholder-one'];

for (const path of paths) {
  test(`no automatic accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
```

- [ ] **Step 2: Run the test**

Run: `pnpm test`
Expected: PASS — all four pages report zero axe violations. (The Layout/Nav/Footer/ProjectCard markup was written with AA text contrast in mind — e.g. `text-neutral-600` rather than lighter grays — specifically so this passes without follow-up fixes.)

If a violation does appear, read the `results.violations` output for the failing rule id and target selector, fix the specific markup/class named in the report, and re-run until clean — do not suppress or filter violations out of the assertion.

- [ ] **Step 3: Commit**

```bash
git add tests/a11y.spec.ts
git commit -m "test: add accessibility smoke tests"
```

---

### Task 8: Netlify config

**Files:**
- Create: `netlify.toml`

**Interfaces:**
- Consumes: nothing (declarative deploy config; Netlify reads this file directly).

- [ ] **Step 1: Write `netlify.toml`**

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
  PNPM_VERSION = "9"
  NPM_CONFIG_PRODUCTION = "false"
  NODE_ENV = "development"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/media/*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "interest-cohort=(), camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    X-Frame-Options = "DENY"
    Content-Security-Policy = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'"
```

- [ ] **Step 2: Verify the build still succeeds**

Run: `pnpm build`
Expected: PASS (this file doesn't affect the Astro build itself; Netlify applies it at deploy time).

- [ ] **Step 3: Commit**

```bash
git add netlify.toml
git commit -m "chore: add Netlify build config and security headers"
```

---

### Task 9: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `pnpm typecheck`, `pnpm test:unit`, `pnpm build`, `pnpm test` scripts (Task 1).

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm typecheck

      - run: pnpm test:unit

      - run: pnpm build

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - run: pnpm playwright install --with-deps chromium webkit

      - run: pnpm test
```

- [ ] **Step 2: Dry-run every CI step locally**

Run each of the following in order and confirm each succeeds before moving on:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test:unit
pnpm build
pnpm playwright install --with-deps chromium webkit
pnpm test
```

Expected: all PASS — this is the same sequence CI will run.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow"
```

---

### Task 10: Dependabot config

**Files:**
- Create: `.github/dependabot.yml`

**Interfaces:**
- Consumes: nothing (declarative; GitHub reads this file directly once pushed).

- [ ] **Step 1: Write `.github/dependabot.yml`**

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      npm-minor-patch:
        update-types:
          - "minor"
          - "patch"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      actions-minor-patch:
        update-types:
          - "minor"
          - "patch"
```

- [ ] **Step 2: Verify it's valid YAML**

Run: `npx -y js-yaml .github/dependabot.yml`
Expected: prints the parsed structure back out with no errors.

- [ ] **Step 3: Commit**

```bash
git add .github/dependabot.yml
git commit -m "chore: add Dependabot config for npm and github-actions"
```

---

### Task 11: README, GitHub repo, and deployment handoff

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: nothing. This task also performs the repo-creation/push side effect described in the steps below.

- [ ] **Step 1: Write `README.md`**

```markdown
# nathandesrosiers.com

Personal site and art portfolio for Nathan Desrosiers. Built with [Astro](https://astro.build)
and [Tailwind CSS](https://tailwindcss.com), deployed on [Netlify](https://www.netlify.com).

## Development

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

## Scripts

- `pnpm dev` — start the local dev server
- `pnpm build` — build the static site to `dist/`
- `pnpm preview` — preview the production build locally
- `pnpm typecheck` — run `astro check`
- `pnpm test:unit` — run Vitest unit tests
- `pnpm test` — run Playwright end-to-end and accessibility tests
- `pnpm format` — format the codebase with Prettier

## Deployment

Deployed on Netlify from the `main` branch. To connect for the first time:

1. In the [Netlify dashboard](https://app.netlify.com), click **Add new site → Import an
   existing project**, and select the `nathandesrosiers-com` GitHub repo.
2. Netlify reads `netlify.toml` automatically for the build command (`pnpm build`) and publish
   directory (`dist`) — no manual build settings needed.
3. Once the site is live on its `*.netlify.app` subdomain, go to **Site configuration → Domain
   management → Add a domain** and add `nathandesrosiers.com`.
4. Update your domain's DNS at your registrar per Netlify's instructions (typically an
   `A`/`ALIAS` record for the apex domain and a `CNAME` for `www`, pointing at Netlify).
5. Netlify automatically provisions and renews a Let's Encrypt TLS certificate for the domain
   once DNS resolves to Netlify — no manual certificate steps required.
```

- [ ] **Step 2: Create the GitHub repo and push**

Run: `gh repo create nathandesrosiers-com --public --source=. --remote=origin --push`
Expected: creates `nathandesrosiers-com` under the authenticated `github.com` account (`mdesrosiers`), adds it as the `origin` remote, and pushes `main` with the full commit history from Tasks 1–10.

- [ ] **Step 3: Verify the push**

Run: `git status`
Expected: "Your branch is up to date with 'origin/main'." and no uncommitted changes.

Run: `gh repo view nathandesrosiers-com --web`
Expected: opens the new repo in the browser, showing the pushed files.

- [ ] **Step 4: Commit the README**

```bash
git add README.md
git commit -m "docs: add README with dev and deployment instructions"
git push
```

- [ ] **Step 5: Manual handoff checklist (cannot be automated — requires your Netlify/registrar login)**

Report this checklist to the user as the final output of this task:

1. Connect the repo in Netlify: **Add new site → Import an existing project → GitHub → `nathandesrosiers-com`**.
2. Confirm the auto-detected build command is `pnpm build` and publish directory is `dist` (from `netlify.toml`).
3. After the first deploy succeeds on the `*.netlify.app` URL, go to **Domain management → Add a domain** and add `nathandesrosiers.com`.
4. At your domain registrar, set the DNS records Netlify displays (typically an apex `A`/`ALIAS` record and a `www` `CNAME`).
5. Wait for DNS to propagate; Netlify will show the domain as verified and automatically issue a Let's Encrypt certificate — no manual cert action needed.

---

## Self-Review Notes

- **Spec coverage:** Home/About/Portfolio pages (Tasks 3–6), placeholder content (Task 2), Prettier/Husky/lint-staged/Vitest/Playwright/axe (Tasks 1, 2, 7), `astro check` typecheck (Task 1, run throughout), GitHub Actions CI (Task 9), Dependabot (Task 10), Netlify config + security headers (Task 8), HTTPS via Netlify's managed Let's Encrypt (documented in Task 11, no manual cert step per spec), public GitHub repo under `mdesrosiers` (Task 11). All spec sections are covered.
- **Deviation from spec flagged to user:** the spec said "Astro content collections" for portfolio entries; this plan uses a plain typed data module instead (see Architecture note above) because there's no real media/markdown source to glob over yet and it keeps unit testing simple, matching the sibling project's pattern. Functionally equivalent for the placeholder-content scope; swapping to real content collections later (if/when content is authored by someone other than the developer) is a contained change to `src/data/projects.ts` and its two call sites.
- **Type consistency:** `Project`, `getProjects()`, `getProject(slug)` signatures introduced in Task 2 are used identically (same names, same shapes) in Tasks 3, 5, and 6.
