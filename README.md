# nathandesrosiers.com

Personal site and art portfolio for Nathan Desrosiers. Built with [Astro](https://astro.build)
and [Tailwind CSS](https://tailwindcss.com), deployed on [Netlify](https://www.netlify.com).

## Development

```bash
pnpm install
pnpm dev
```

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
