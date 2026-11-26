# James & Co website — working notes

Source: ChatGPT Sites project `james-co-life`, version 9, commit `2ddd721`.
Export verified against `SHA256SUMS` (162/162 files match) on 2026-11-26.
An untouched copy of the export is kept beside this folder in `original_site_v9/`.

`README.md` is the original ChatGPT Sites starter readme and describes the Cloudflare build.

## How the site is built

- **Public pages** are plain HTML in `public/`: home, 13 experience pages plus a catalogue, Oasis Buccoo,
  guest guide, owners and contact. Shared files: `public/assets/style.css`, `app.js` and `content.js`.
- **Backend** (Cloudflare only): `app/api/content` (content database, D1), `app/api/upload` and
  `app/api/media` (image storage, R2), and `app/manage` (admin editor behind ChatGPT sign-in).
- `content.js` asks `/api/content` for edited text. If that endpoint is missing, as it is on Vercel,
  the pages keep the text written into the HTML. The one console 404 for `/api/content` is expected.

## Preview modes

| Where | What works | What doesn't |
|---|---|---|
| Vercel (`vercel.json`) | Every public page, images, motion, security headers | Admin editor, saving content, uploads |
| ChatGPT Sites (live) | Everything, including `/manage` | — |
| Cloudflare (later) | Everything, once auth is replaced (see S1) | — |

Local static preview without Node: `python -m http.server 4173 --directory public`

## Security review (2026-11-26)

| ID | Severity | Finding | Status |
|---|---|---|---|
| S1 | **High, once the site moves off ChatGPT Sites** | Admin checks (`/manage`, `POST /api/content`, `POST /api/upload`, `worker/index.ts`) trust the `oai-authenticated-user-email` request header. ChatGPT's hosting sets that header itself. On Vercel or plain Cloudflare, anyone can send it and become admin. | Not exposed on Vercel: those routes aren't deployed there. **Replace with real auth (for example Cloudflare Access, Clerk or Auth.js) before deploying the backend anywhere else.** |
| S2 | Medium | No security headers on pages (no CSP, clickjacking or HSTS protection). | Fixed for Vercel in `vercel.json`. Tested locally: no CSP violations. |
| S3 | Low | Uploads trust the browser's file type instead of checking the file's bytes. Mitigated: files are served back only as JPEG/PNG/WebP with `nosniff`. | Open. Add a magic-byte check when porting. |
| S4 | Low | No rate limit or storage cap on uploads (admin-only). | Open. |
| S5 | Low | One corrupt row in the content table makes `GET /api/content` fail for every page (503). | Open. Skip bad rows instead. |
| S6 | Info | ChatGPT Site settings: `remix_enabled: true`. Check whether others should be able to remix it. | Kes to decide. |
| — | OK | No secrets, keys or tokens in the code. `.env*` is git-ignored. Front-end scripts use `textContent` or escape values (no HTML injection found). Social and booking links are restricted to `https://` and known domains on both server and page. | — |

## UI/UX changes (2026-11-26)

Added to the end of `style.css` and `app.js`. The original design is unchanged.

- Sticky header that tightens with a shadow on scroll. It keeps the solid `#00373b` background that the logo artwork matches.
- Current page highlighted in the nav. Animated underline on hover.
- Hero: slow photo drift, staggered text entrance, pulsing location dot.
- Scroll-reveal for sections and cascading cards. Content stays visible if JavaScript fails.
- Hover states for buttons, cards, filters and guide shortcuts.
- Keyboard: visible focus ring and a "Skip to content" link (there was neither before).
- Mobile menu: ☰ becomes ✕, and the menu closes on link tap, Escape or tapping outside.
- Back-to-top button.
- All motion turns off for visitors who set "reduce motion".
- Removed the hero's "01 / 03" counter, which implied a slideshow that doesn't exist.
- Asset version bumped to `?v=alive-1` so browsers fetch the new files.

## Open product gaps (need a decision, not code)

1. **Contact page has no way to contact you.** It needs a form or a published email/WhatsApp. A form that
   sends enquiries needs a destination (email service, Notion, CRM) and a privacy note.
2. Property photos, Airbnb links, Wi-Fi and guest instructions are still empty in `lib/default-content.json`.
3. Experience prices are "To be confirmed" everywhere. Historical fees are not an approved rate card.
4. Owner intake and photo upload are marked "pending" on `owners.html`.
5. Domain: `jamescolife.com` is planned but not bought or connected.
