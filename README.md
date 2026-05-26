# Project Info

This is a resume editor and tailoring tool that can transform a CV into several tailored resumes.

> "Build once, tailor forever."

## Setup and Installation

run `npm install` to download all packages necessary for each prototype.

This is a monorepo of several prototypes in different stacks.

- [Bakeoff 1](packages/bakeoff1) - SSR: Svelte, SvelteKit w/ Cloudflare adapter, Serverless Edge functions, Postgres, Neon
- [Bakeoff 2](packages/bakeoff2) - SSG Client: Vue, Nuxt, Vercel Serverless, MongoDB, MongoDB Atlas
- [Bakeoff 3](packages/bakeoff3) - Dynamic Client: Solid, Static Astro w/ Netlify adapter, Serverless Lambdas

**Site Links**

1. https://bakeoff1.alexdombroski.workers.dev/
2. https://bakeoff2.vercel.app/
3. _bakeoff3.com_

Read the readme to get started with each

## Other resume editors

The big selling feature this resume editor will have that other's don't is the ability to tailor many resumes based off a large CV or career database. Flow CV may have this to some extent in their paid version. The other feature I'd like is an indicator to detect if the tailored resume is a fitting one-page size.

Other options for resume editors to check out.

- [open resume](https://www.open-resume.com/)
- [reactive resume](https://rxresu.me/)
- [flowcv](https://flowcv.com/)
- [vmock](https://www.vmock.com/)

## Differences in rendering modes

Some aspects of the app work really well with the different rendering models (SSR, SSG, CSR).

If an app can benefit from all three, it may be helpful to pick a framework that can do all three, such as Nuxt or Astro.

### SSR (bakeoff1)

_For Dynamic, freqently-changing content_

- Resume editor
- Resume printer

### SSG (bakeoff2)

_For content-based, infreqently-changing content_

- Feature list and development plan of the site
- Resume template picker / preview
- Static pages like the dashboard

### CSR (bakeoff3)

_All modes use CSR to a degree, but sometimes it's helpful if parts of page loading is completely isolated from the server_

- Advanced editing features such as drag and drop or undo-redo
- Some editor features must be used in CSR or the hydration of SSR, such as the resume height indicator
- I didn't use a SPA, but a completely spa can have global state that stays in memory when switching pages. This would have been really helpful when adding printing.
