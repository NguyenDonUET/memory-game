---
name: compose-molecule-component
description: Compose a molecule-level component (e.g. SearchInput, FormField, CardHeader, Pagination item, Toast) by combining existing primitive components, from a Figma reference. Use whenever the user asks to "build/compose a molecule", references a Figma frame that is clearly made of multiple primitives, or says things like "ghép Input với Button thành SearchBar", "build FormField từ Figma".
---

# Compose Molecule Component (from Figma)

## What counts as a molecule
A molecule is 2+ primitives arranged together with a specific layout/behavior, but still a single reusable unit (not a full page section). Examples: `SearchInput` (Input + Icon + clear Button), `FormField` (Label + Input + helper/error text), `CardHeader` (Avatar + title + action Button), `Toast` (Icon + text + close Button), `Pagination item`.

If the target only needs one primitive with different props, this is NOT a molecule — use `build-primitive-component` instead. If the target is a full section/page (e.g. entire login form, entire settings panel), this is too big for this skill — break it into molecules first.

## Where molecules live
- **App-wide reusable** (used or intended for 2+ features): `src/components/shared/<kebab-name>.tsx`
- **Feature-specific**: `src/features/<feature>/components/<kebab-name>.tsx`
- Do **not** put hand-composed molecules in `src/components/ui/` — that folder is for shadcn/base primitives only. There is **no** `src/components/molecules/` folder.
- Promote from a feature folder to `shared/` only once the molecule is reused by 2+ features (see `project.mdc` / `design-system.mdc`).

## Pre-flight checks (do these BEFORE writing any code)
1. **Inventory required primitives.** From the Figma frame, list every primitive the molecule is built from (e.g. `Input`, `Icon`, `Button`). Check each exists in `src/components/ui/`.
   - If any primitive is missing, STOP. Tell the user which primitive(s) are missing and offer to build them first with `build-primitive-component`, rather than inlining a one-off replacement inside the molecule.
2. **Tokens:** read `src/index.css` (`@theme inline` + `:root` / `.dark`). There is **no** `tailwind.config.*` and **no** `src/styles/tokens.css`. If a needed color/spacing/radius/typography token is missing, stop and flag it — propose adding it to `src/index.css` instead of hardcoding.
3. **Do not re-style primitives inside the molecule.** Compose via public props (`variant`, `size`, `className` via `cn()`, etc.) — do not reach into a primitive's internals or override its tokens with one-off classes. If Figma needs a primitive variant that doesn't exist yet, flag it and add that variant on the primitive itself (separate task / `build-primitive-component`), not as a local override here.
4. **Icons:** if the molecule needs an icon, import from `@/components/icons` (`IconProps`, `currentColor`, default `size={20}`). Prefer those over `lucide-react` for product UI that must match the Figma Icons frame. Do not inline raw SVG when an icon component already exists.
5. **Existing overlap:** check `src/components/shared/`, `src/components/ui/`, and relevant `src/features/*/components/` for an existing component with the same name or overlapping purpose.
6. **Figma MCP:** load `/figma-design-to-code` (or `skill://figma/figma-design-to-code/SKILL.md`) before calling `get_design_context`, and pass `skillNames: "figma-design-to-code"`.

## Build steps
1. **One molecule, one Figma frame.** Reference only the exact frame/link given. Don't infer sibling molecules not shown.
2. **Read the Figma Component Properties / Variants panel** (via Figma MCP) for the complete set of:
   - Composition-level props (e.g. `label`, `placeholder`, `error`, `helperText`, `showClearButton`)
   - Layout variants (e.g. horizontal/vertical, with/without icon)
   - States that span multiple primitives at once (e.g. molecule-level `error` should drive both the Input's `aria-invalid` and the helper text's color/icon)
3. **Generate the component** in the correct folder (see "Where molecules live"), kebab-case file name matching siblings (e.g. `search-input.tsx`):
   - Import and compose only existing primitives from `@/components/ui/<file>` and icons from `@/components/icons` — no new raw `<div>`-based buttons/inputs/etc.
   - Layout and spacing use **mapped Tailwind utilities** from tokens — e.g. `gap-200`, `p-100`, `rounded-10`, `text-preset-4-medium`. Never hardcode hex, raw `px`, or `var(--spacing-*)` / `var(--space-*)` when a utility already exists.
   - Merge classes with `cn` from `@/lib/utils` (or `cn` as used by sibling files).
   - Named export (not `export default`). Props: `interface XxxProps` above the component.
   - Expose a props API at the molecule's own level of abstraction (e.g. `<FormField label="Email" error={...}>` rather than forcing the consumer to wire Label + Input + error text every time).
   - Use `forwardRef` and forward native props to the primary underlying primitive (e.g. the `Input` inside `FormField`) so the molecule stays composable — same pattern as `project.mdc` / primitives.
4. **Cross-primitive state wiring** — unique to molecules, do not skip:
   - `error` → propagate to every child that must reflect it (e.g. Input `aria-invalid` + error styling, helper text error color/icon).
   - `disabled` / `loading` → propagate to all interactive children (e.g. disable both Input and clear/submit Button).
5. **Accessibility pass** (molecule-specific, on top of what primitives already handle):
   - Label association: `<label htmlFor>` linked to the underlying input's `id` (`useId` if none provided).
   - Error/helper text linked via `aria-describedby`.
   - Composite widgets: verify focus order and keyboard interaction across children.
   - Group related elements with the correct semantic wrapper (`fieldset`/`legend`, `role="group"`, etc.) when appropriate.
6. **Exports:** named-export from the component file. Do **not** create `src/components/ui/index.ts` or a molecules barrel unless one already exists — consumers import from `@/components/shared/<file>` (or the feature path).
7. **Add a Storybook story — required** (Storybook is set up: `.storybook/`, `pnpm storybook`):
   - Create `<name>.stories.tsx` next to the component (glob in `.storybook/main.ts` picks up `src/**/*.stories.tsx`).
   - CSF3 with `Meta` / `StoryObj` from `@storybook/react-vite`, `title: 'Shared/<ComponentName>'` (or `'Features/<Feature>/<ComponentName>'` for feature-scoped molecules), and `tags: ['autodocs']` when useful.
   - `argTypes` for every composition-level prop from step 2.
   - One named story per meaningful state (`Default`, `WithError`, `Disabled`, `Loading`, layout variants) — including states only visible when a child is driven by the molecule (e.g. `WithError` must show the Input in its error variant, not just helper text).
   - Theme toolbar toggles `.dark` via preview — verify light and dark when the design differs.
8. **Report back**: which primitives/icons were reused, which Figma frame was used, any missing primitive/variant/token that had to be flagged instead of worked around, and whether Storybook stories were added.

## Guardrails
- Never build a molecule by copy-pasting a primitive's markup instead of importing and composing it.
- Never patch a missing primitive variant with a local CSS override inside the molecule — surface it as a gap on the primitive.
- Never hardcode a color/spacing value "just this once" — if the token doesn't exist, say so and propose adding it to `src/index.css`.
- Keep composition logic (layout, state wiring, a11y linking) separate from visual styling (which stays inside the primitives).
- Never paste a screenshot-based guess when Figma MCP is available — prefer live frame data via `get_design_context`.
- Keep the diff scoped to one molecule (+ its stories) per run.
- Follow import order from `project.mdc`: React/external → `@/` absolute → relative → type-only imports last.
- Run `eslint --fix` and `prettier --write` on touched files before considering the task done.

## Batch mode (multiple molecules requested at once)
If the user gives a list of several molecules to build in one message:
- Process them sequentially, one full pass (steps 1–8) per molecule.
- After finishing each molecule, pause and summarize it (per step 8) before starting the next, rather than generating all diffs at once — this keeps each one reviewable and matches how `build-primitive-component` handles batches.
- If several molecules in the list depend on the same missing primitive, flag that once up front rather than repeating the same stop for each one.
