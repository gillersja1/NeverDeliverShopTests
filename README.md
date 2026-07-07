# NeverDeliver Shop Tests

UI tests for [never-deliver-shop.vercel.app](https://never-deliver-shop.vercel.app/) —
a satirical e-commerce demo site ("Big catalog energy, zero delivery
anxiety.") built with a full mock product catalog, flash sale countdown,
category filters, and region/currency/language selectors.

## An important caveat about this project

Unlike the other projects in this portfolio, this one's test locators were
written from a **screenshot** of the site rather than by inspecting its
actual HTML. That means:

- Locators use visible text and ARIA roles (`getByText`, `getByRole`,
  `getByPlaceholder`) rather than IDs/classes/`data-testid`, since those
  weren't visible in a screenshot. This is Playwright's own recommended
  fallback when you don't control the markup, but it's inherently more
  brittle than test-id-based locators.
- Two tests in `catalog.spec.ts` are marked `test.fixme()` rather than
  given real assertions, because I couldn't verify from a screenshot
  whether category filtering or the cart actually update dynamically.
  Fill these in once you've confirmed the real behavior — the easiest way
  is:

  ```bash
  npm run codegen
  ```

  which opens Playwright's recorder against the live site, generates
  accurate locators as you interact with it, and shows you the real
  behavior to assert against.

**If this is your own project**, adding `data-testid` attributes to key
elements (search input, category pills, product cards, cart) would make
these tests significantly more robust than text matching, and is worth
doing before this becomes a serious regression suite.

## Project structure

```
NeverDeliverShopTests/
├── tests/
│   ├── homepage.spec.ts   # Hero content, flash sale countdown, search box
│   └── catalog.spec.ts    # Result count, sort/pagination controls, badges
├── playwright.config.ts   # Targets never-deliver-shop.vercel.app directly
└── .github/workflows/playwright.yml
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+

## Setup

```bash
npm install
npm run install:browsers
```

## Running the tests

```bash
npm test                 # headless, chromium + mobile Chrome
npm run test:headed      # watch it run
npm run test:ui          # Playwright's interactive UI mode
npm run report           # view the last HTML report
```

## What's actually being tested

- **`homepage.spec.ts`** — the hero heading and tagline render, the flash
  sale banner shows and its countdown timer is genuinely ticking down (not
  a static string), the search input accepts text, and the
  region/currency/language selectors are visible
- **`catalog.spec.ts`** — a result count + pagination summary is shown,
  sort/per-page controls are visible, and product cards display their
  delivery/discount badges

## CI/CD

`.github/workflows/playwright.yml` runs on push/PR to `main`, and also on
a **weekly schedule** — since this suite targets a live external site
outside this repo, its markup or copy could change independent of any
commit here, so a schedule catches drift that push-triggered CI alone
would miss.

## Possible extensions

- Replace the fixme'd tests with real assertions once category filtering and cart behavior are confirmed
- Add a Page Object Model layer (`pages/`) once locators are confirmed stable, matching the structure used in this portfolio's other Playwright TS project
- Add visual regression coverage for the flash sale banner/countdown, which is exactly the kind of dynamic content that's easy to break without noticing
