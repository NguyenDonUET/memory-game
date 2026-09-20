---
name: build-primitive-component
description: Build a single primitive/base design-system component (Button, Input, Checkbox, Badge, Avatar, etc.) from a Figma reference, following the project's token-first + shadcn workflow. Use whenever the user asks to "build/create a component from Figma", references a Figma frame/link for a base UI element, or says "build primitive X".
---

# Build Primitive Component (from Figma)

## When to use this skill
- The user gives a Figma link/frame and asks to build a base/primitive UI component (not a composed screen or full page).
- The user says things like "build Button from Figma", "tạo component Input theo Figma này", "primitive tiếp theo là Badge".

If the user asks to build a whole screen/page or a composed component (Form, Card, Modal, Table) made of multiple primitives, do NOT use this skill directly — first check that the underlying primitives exist in `src/components/ui/`; build any missing primitive with this skill, then compose.

## Pre-flight checks (do these BEFORE writing any code)
1. **Tokens:** read `src/index.css` (`@theme inline` + `:root` / `.dark`). There is **no** `tailwind.config.*` and **no** `src/styles/tokens.css`. Cross-check galleries in `src/stories/design-system/` (`pnpm storybook`) if useful. If a needed color/spacing/radius/typography token is missing, stop and flag it — propose adding it to `src/index.css` instead of hardcoding.
2. **Existing UI:** check `src/components/ui/` and `components.json`. Prefer `pnpm dlx shadcn@latest add <component>` when a shadcn primitive exists, then adapt `cva` variants to Figma — do not hand-roll a duplicate.
3. **Icons:** if the component needs an icon, import from `@/components/icons` (`IconProps`, `currentColor`, default `size={20}`). Prefer those over `lucide-react` for product UI that must match the Figma Icons frame. Do not inline raw SVG when an icon component already exists.
4. **Figma MCP:** load `/figma-design-to-code` (or `skill://figma/figma-design-to-code/SKILL.md`) before calling `get_design_context`, and pass `skillNames: "figma-design-to-code"`.

## Build steps
1. **One component, one Figma frame.** Reference only the exact frame/link the user gave. Don't infer or build sibling components not shown.
2. **Read the Figma Component Properties / Variants panel** for this component (via Figma MCP) to get the *complete* set of:
   - Sizes (e.g. sm/md/lg)
   - Visual variants (e.g. primary/secondary/ghost/outline)
   - States (default, hover, focus, active, disabled, error/invalid, loading)
   Do not stop at the default state shown in the main frame — the variants panel has the rest.
3. **Generate / adapt the component** in `src/components/ui/<kebab-or-shadcn-name>.tsx` (match sibling file naming, e.g. `button.tsx`):
   - Style with **mapped Tailwind utilities** from tokens — e.g. `bg-primary`, `text-neutral-500`, `gap-200`, `rounded-10`, `text-preset-3 font-semibold`, `focus-visible:ring-ring`. Never hardcode hex, raw `px`, or invent `text-heading` / `bg-[var(--color-*)]` when a utility already exists.
   - Prefer semantic roles (`bg-primary`) for chrome; use palette primitives (`bg-teal-700`) when matching Figma literally.
   - Implement variants with `cva` + `VariantProps` (same structure as `button.tsx`). Merge classes with `cn` (from `@/lib/utils` or `cn`, matching the file you're editing).
   - Named export (not `export default`). Props: `interface XxxProps` above the component when custom props are needed; otherwise follow the existing shadcn `React.ComponentProps<'…'> & VariantProps<…>` pattern.
   - Use `forwardRef` when the primitive should accept a ref (inputs, buttons used as composable leaves), consistent with `project.mdc`. If scaffolding via shadcn CLI omits it, add it when a ref is part of the public API.
   - Support `asChild` / Radix `Slot` when the sibling primitives do (see `Button`).
   - Import icons only from `@/components/icons` for design-matched glyphs.
4. **Accessibility pass** (do not skip):
   - Correct semantic element (`<button>`, `<input>`, `<label>` association, etc.).
   - Visible focus ring using project tokens (`ring-ring`, `border-ring`, etc.) — never remove outline without a replacement.
   - `aria-*` for state (e.g. `aria-disabled`, `aria-invalid`, `aria-busy` for loading).
   - Keyboard operability (Tab reaches it, Enter/Space activates buttons, arrow keys for composite widgets if applicable).
5. **Exports:**
   - Named-export the component (and `*Variants` helper if using `cva`) from its file, same as `Button` / `buttonVariants`.
   - Do **not** create `src/components/ui/index.ts` unless a barrel already exists — consumers import from `@/components/ui/<file>`.
6. **Add a Storybook story — required** (Storybook is set up: `.storybook/`, `pnpm storybook`):
   - Create `src/components/ui/<name>.stories.tsx` next to the component (glob in `.storybook/main.ts` picks up `src/**/*.stories.tsx`).
   - CSF3 with `Meta` / `StoryObj` from `@storybook/react-vite`, `title: 'UI/<ComponentName>'`, and `tags: ['autodocs']` when useful.
   - Define `argTypes` for every prop from step 2 (size, variant, state) so Controls are interactive.
   - One named story per meaningful Figma variant/state (e.g. `Default`, `Secondary`, `Disabled`, `Loading`, `Invalid`) — not a single generic story when Figma shows many.
   - Expose hover/focus/error as dedicated stories when those states are hard to trigger manually (helps visual review / future regression).
   - Cross-check each story against the Figma frame before finishing. Theme toolbar toggles `.dark` via preview — verify light and dark when the design differs.
7. **Report back** a short summary: which frame was used, which tokens/icons were reused, whether Storybook stories were added, and any gap (missing token, missing Figma state, a11y assumption) — don't silently guess on ambiguous specs.

## Guardrails
- Prefer extending an existing `cva` config or composing `Button` + icon over inventing `IconButton` — ask first if unclear.
- Never hardcode a color/spacing value "just this once" — if the token doesn't exist, say so and propose adding it to `src/index.css`.
- Never paste a screenshot-based guess when Figma MCP is available — prefer live frame data via `get_design_context`.
- Keep the diff scoped to one component (+ its stories) per run so it stays reviewable.
- Follow import order from `project.mdc`: React/external → `@/` absolute → relative → type-only imports last.
- Run `eslint --fix` and `prettier --write` on touched files before considering the task done.
