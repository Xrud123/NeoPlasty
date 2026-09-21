# NeoPlasty product landing page

Production-ready one-page commercial catalog for a plastic 20 000 l water retention tank.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Cloudflare Pages
- Cloudflare Pages Function at `POST /api/inquiry`

No Python, React, Vue, Angular, Flask, Django, or Node backend is used.

## Project structure

```text
.
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── images/
├── functions/api/inquiry.js
├── tests/inquiry.test.js
├── index.html
├── wrangler.toml
├── package.json
├── .env.example
└── README.md
```

## Local development

Install dependencies:

```bash
npm install
```

Run locally with Cloudflare Pages Functions:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Deployment

Push the repository to GitHub and connect it to Cloudflare Pages.

Recommended Cloudflare Pages settings:

- Framework preset: `None`
- Build command: empty
- Build output directory: `/`
- Functions directory: `functions`

The form submits JSON to `/api/inquiry`. The Cloudflare Pages Function validates the inquiry and then delivers it by webhook or email.

### Form delivery setup

Choose one delivery method in Cloudflare Pages → Settings → Environment variables.

Webhook option:

```text
INQUIRY_WEBHOOK_URL=https://your-webhook-url.example
```

Email option with Resend:

```text
RESEND_API_KEY=re_...
INQUIRY_TO_EMAIL=neoplastpl@info.pl
INQUIRY_FROM_EMAIL=NeoPlasty <noreply@your-verified-domain.pl>
```

For local testing without real delivery, create `.dev.vars`:

```text
INQUIRY_LOG_ONLY=true
```

Then run:

```bash
npm run dev
```

Do not open `index.html` directly when testing the form. Direct file preview cannot run `/api/inquiry`, so the browser will show a network error.

## Editing product data

Demo pricing and configurator options are centralized in `assets/js/main.js` in the `PRODUCT` object.

Text content, SEO metadata, and technical placeholder values are in `index.html`.

Product images are placeholders in `assets/images/` and can be replaced with real product photos while keeping the same filenames.

## Image notes

The current gallery uses locally saved reference images for layout/testing:

- `assets/images/tank-gallery-1.png`
- `assets/images/tank-gallery-2.png`
- `assets/images/tank-gallery-3.png`
- `assets/images/tank-gallery-4.png`
- `assets/images/tank-gallery-5.png`

Before production launch, replace these with NeoPlasty-owned or properly licensed product photos.
