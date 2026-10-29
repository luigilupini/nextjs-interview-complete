# Next.js Interview Exercise: Recipes Browser

A small [Next.js 16](https://nextjs.org/) (App Router, React 19) app that lists recipes from the public [DummyJSON Recipes API](https://dummyjson.com/docs/recipes). The candidate works through a set of exercises to refactor and extend it. Each exercise is marked in the code with `// Solution N`. Discussion prompts are marked with `// Question: Why is this not optimal?`.

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
```

Other scripts:

| Script                     | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `npm run lint`             | ESLint                                                                      |
| `npm run typecheck`        | `tsc --noEmit`                                                              |
| `npm run generate-types`   | Generates TypeScript types from the live API into `lib/types/recipe.ts`     |

## Tech Stack

- Next.js 16 (App Router, Server Components, `next/form`, parallel routes)
- React 19
- Tailwind CSS v4 + daisyUI 5
- `next-themes` (light/dark switch)
- `lucide-react` (icons)

## Project Structure

```
app/
  layout.tsx          Root layout (fonts, providers, <main> container)
  page.tsx            Recipes list page            -> Exercises 1, 2
  @navbar/page.tsx    Parallel-route navbar slot with the search/limit <Form>
components/
  search-input.tsx    Search box                   -> Exercise 3
  limit-select.tsx    Page size selector           -> Exercise 3
  recipes-list.tsx    Recipe cards                 -> Exercise 4
  theme-switch.tsx    Light/dark toggle
context/providers.tsx ThemeProvider wrapper
lib/types/            Output of `generate-types` (empty to start)
```

## The API

Base URL: `https://dummyjson.com`

| Endpoint                         | Use                         | Docs                                                     |
| -------------------------------- | --------------------------- | -------------------------------------------------------- |
| `GET /recipes`                   | All recipes (paginated)     | [recipes-all](https://dummyjson.com/docs/recipes#recipes-all)       |
| `GET /recipes/{id}`              | Single recipe               | [recipes-single](https://dummyjson.com/docs/recipes#recipes-single) |
| `GET /recipes/search?q={query}`  | Search recipes by text      | [recipes-search](https://dummyjson.com/docs/recipes#recipes-search) |
| `GET /recipes?limit={n}&skip={n}`| Limit and skip results      | [recipes-limit](https://dummyjson.com/docs/recipes#recipes-limit)   |

The list endpoints return:

```ts
{
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}
```

Each `Recipe` includes `id`, `name`, `ingredients[]`, `instructions[]`, `prepTimeMinutes`, `cookTimeMinutes`, `servings`, `difficulty`, `cuisine`, `caloriesPerServing`, `tags[]`, `userId`, `image`, `rating`, `reviewCount` and `mealType[]`.

Query params can be combined, for example `/recipes/search?q=pasta&limit=10`. Use `limit=0` to get all items.

---

## Exercises

### Exercise "Solution" 1: Convert client-side fetching to server-side

**Where:** `app/page.tsx`

**Current state:** The page is a Client Component (`"use client"`). It fetches in `useEffect` and stores the result in `useState<any>`. It also ignores `searchParams` (it just logs the Promise).

**Goal:**
- Remove `"use client"` and turn the page into an `async` Server Component.
- Fetch recipes on the server from `GET /recipes` (or `/recipes/search` once filters exist).
- `await searchParams` (it is a Promise in Next 15) and read `q` and `limit`.
- Replace `any` with real types. Run `npm run generate-types` and use `RecipeListResponse` / `Recipe`.
- Show the commented-out `Showing X of {total}` line using `total` from the response.

**Interview questions:**
1. *`useState<any>`: why is this not optimal?*
   - `any` turns off type safety. Typos in fields like `r.ratting` are not caught, and you get no autocomplete or refactor help.
   - API data is untyped at runtime. Generated types give compile-time safety, but nothing validates the response at runtime.
   - The three separate states (`recipes`, `loading`, `error`) can get out of sync with each other.
2. *`useEffect` fetch: why is this not optimal?*
   - The page ships JS, renders an empty shell, hydrates, and only then fetches. This creates a client-server waterfall and makes LCP worse.
   - The initial HTML has no content, which hurts SEO.
   - There is no caching, deduplication, or request cancellation (no `AbortController`). It can also race when inputs change.
   - The empty dependency array means it never reacts to `searchParams`.
   - In Strict Mode during development, the effect runs twice.
   - Server Components can fetch near the data source and stream HTML, with zero client JS for this logic.
3. Follow-ups:
   - What does `"use client"` actually mean, and where is the boundary?
   - Why is `searchParams` a Promise in Next 15?
   - Does reading `searchParams` make the route dynamic?
   - How does `fetch` caching work in Next 15? Discuss `cache`, `next: { revalidate }` and tags.

---

### Exercise "Solution" 2: Loading and error states with Suspense and Error Boundaries

**Where:** `app/page.tsx` (the `if (loading)` / `if (error)` branches)

**Goal:**
- Replace the manual loading branch with a Suspense boundary. Options are `app/loading.tsx`, or wrapping the async list in `<Suspense fallback={...}>` inside the page so the shell renders right away.
- Replace the manual error branch with `app/error.tsx` (it must be a Client Component and receives `error` and `reset`).
- Optionally add a skeleton UI that matches the card layout.

**Interview questions:**
- What is the difference between `loading.tsx` and an inline `<Suspense>`? Which one streams more of the page?
- Why must `error.tsx` be a Client Component? What does `reset()` do?
- What happens when you change the search params? Does the fallback show again? Discuss using `key` on `Suspense` to re-trigger it.
- How would you handle a 404 for a single recipe? (`notFound()` and `not-found.tsx`)

---

### Exercise "Solution" 3: Search and limit filters

**Where:** `components/search-input.tsx`, `components/limit-select.tsx`, and their usage in `app/@navbar/page.tsx`

**Current state:** Both inputs are inside a `next/form` `<Form action="/">`, but they have no `name` attributes, so nothing is submitted. Their `defaultValue`s are hard-coded (`""` and `"20"`) instead of coming from the URL.

**Goal:**
- Use the URL as the source of truth: `?q=...&limit=...`.
- Add `name="q"` and `name="limit"` so `next/form` serializes them into the query string.
- Initialize `defaultValue` from the current search params so the inputs stay in sync after navigation and refresh.
- Submit the limit on change, e.g. `form.requestSubmit()`. Optionally debounce search-as-you-type using `useRouter().replace` or `useSearchParams`.
- In the page, call `/recipes/search?q={q}&limit={limit}` (or `/recipes?limit=` when there is no query).

**Interview questions:**
- Why keep filter state in the URL instead of in `useState`? (Shareable links, back/forward, server rendering)
- How does `next/form` differ from a regular `<form>`? (Client-side navigation, prefetching)
- What do `replace` and `push` mean for history?
- How would you debounce, and why should you?
- How do you show pending UI during navigation? (`useTransition`, `useFormStatus`, `useLinkStatus`)
- The layout does not render the `@navbar` slot. How do parallel routes work, and what is needed to show it? (Add a `navbar` prop to `layout.tsx` and probably a `default.tsx`.)
- Validate and clamp `limit`. What if `?limit=abc` or `?limit=999999`?

---

### Exercise "Solution" 4: Recipe detail page

**Where:** `components/recipes-list.tsx` (plus a new route)

**Goal:**
- Create a dynamic route such as `app/recipes/[id]/page.tsx` that fetches `GET /recipes/{id}`.
- Make each card a `next/link` `<Link href={`/recipes/${r.id}`}>`. Today it is an `<a>` with no `href`.
- Show the recipe details: image, ingredients, instructions, times, servings, tags, and so on.
- Handle an invalid id with `notFound()`. Optionally add `generateMetadata` for the title and description.

**Interview questions:**
1. *`recipes.map((r, i) => <li key={i}>)`: why is this not optimal?*
   - Index keys break reconciliation when the list is filtered, sorted, or paginated. React reuses the wrong DOM and state. Use the stable `r.id` instead.
   - `r` is `any`, so it should be typed as `Recipe`.
2. *`<img src={r.image} ...>`: why is this not optimal?*
   - It skips `next/image`, which gives automatic resizing, modern formats (AVIF/WebP), lazy loading, `srcset`/`sizes`, and prevents layout shift.
   - It downloads the full source image, then displays it at 80px (`size-20`) while declaring 200×200.
   - Using `next/image` with a remote host requires `images.remotePatterns` for `cdn.dummyjson.com` in `next.config.ts`.
   - Consider `priority` / `fetchPriority` for above-the-fold images.
3. Follow-ups:
   - Why use `<Link>` over `<a>`? (Client navigation, prefetching)
   - Discuss `generateStaticParams` vs. dynamic rendering for detail pages.
   - Discuss an intercepting route or modal (`@modal/(.)recipes/[id]`) for showing the detail over the list.

---

## Bonus / Stretch Topics

- Pagination with `skip` and `limit`, using `total` from the response.
- Caching strategy: `revalidate`, `unstable_cache` / `"use cache"`, tag-based revalidation.
- Accessibility: input labels, `aria-label` on the select, focus states, meaningful `alt` text.
- Tests: what would you unit test vs. e2e test here?
- Type safety end to end: generated types only give compile-time safety. Where (and how) would you validate at runtime?
