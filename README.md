# NeverDeliver Shop Tests

UI tests for [never-deliver-shop.vercel.app](https://never-deliver-shop.vercel.app/) —
a satirical e-commerce demo site ("Big catalog energy, zero delivery
anxiety.") built with a full mock product catalog, flash sale countdown,
category filters, and region/currency/language selectors.

## Defects found

Testing a site I don't control means writing tests that report what's
actually wrong rather than working around it. Found so far:

| # | Defect | Severity | Where it's covered |
|---|---|---|---|
| 1 | Below the `md` breakpoint, the header cart button is icon-only with no `aria-label`, so screen readers announce just "button" ([WCAG 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)) | Medium (accessibility) | `catalog.spec.ts` › *header cart button has an accessible name* — marked `test.fail()` on Mobile Chrome so the suite stays green but flags the day it's fixed |
| 2 | Each "Add to Cart" `<button>` is nested inside the product card's `<a>` link. Interactive content inside a link is invalid HTML and gives keyboard and screen-reader users two overlapping targets | Low (accessibility) | Observed while inspecting the DOM; not yet asserted |

## Locator strategy

The site has no `data-testid` attributes, so locators use ARIA roles and
visible text (`getByRole`, `getByText`) — Playwright's recommended
approach when you don't control the markup, and one that doubles as a
light accessibility check. Category names appear in both the header nav
and the filter pill row, so filter locators are scoped to
`#main-content` to avoid strict-mode duplicate matches.

## Project structure

```
NeverDeliverShopTests/
├── tests/
│   ├── homepage.spec.ts   # Hero content, flash sale countdown, search box
│   └── catalog.spec.ts    # Results, category filtering, cart, cart a11y
├── playwright.config.js   # Targets never-deliver-shop.vercel.app directly
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
  sort/per-page controls are visible, product cards display their
  delivery/discount badges, a category filter narrows the results, adding
  items updates the cart count, and the header cart button has an
  accessible name

## CI/CD

`.github/workflows/playwright.yml` runs on push/PR to `main`, and also on
a **weekly schedule** — since this suite targets a live external site
outside this repo, its markup or copy could change independent of any
commit here, so a schedule catches drift that push-triggered CI alone
would miss.

## Possible extensions

- Add an axe-core scan (`@axe-core/playwright`) to catch issues like defect #2 automatically
- Add a Page Object Model layer (`pages/`) once locators are confirmed stable, matching the structure used in this portfolio's other Playwright TS project
- Add visual regression coverage for the flash sale banner/countdown, which is exactly the kind of dynamic content that's easy to break without noticing
