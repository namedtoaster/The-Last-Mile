# Rendering the real components

When the demo needs to be the actual component rather than a drawing of it.

Worth building once per project. After that it is one command per state, and it
cannot drift from the code, because it IS the code.

## What it is

Three pieces:

1. A bundler (esbuild is enough) that swaps `react-native` for `react-native-web`
   and stubs the native-only modules.
2. A page per feature that imports the real components and renders them in the
   states you want, chosen by the URL fragment.
3. A headless browser that screenshots it at phone width.

## What it can and cannot prove

**Trustworthy:** copy, colour, type hierarchy, layout inside a card, how a long
string wraps, both themes.

**Not trustworthy:** anything native, gestures, real navigation, scroll behaviour,
safe areas, and anything that depends on a store or a database you have stubbed.
Horizontal pagers and native headers in particular do not behave.

Say which half you used it for.

## Setting it up

Stub these, because they will not load in a browser:

- analytics (export every function the real module exports, as no-ops; a missing
  export is a build error, and the list is the only tedious part)
- haptics
- the theme hook, so you can force light and dark
- any database or store module the component imports
- the router

Two settings that are not obvious:

- Set the bundler's public path to the output folder, or every bundled image 404s.
- Resolve `.web.tsx` before `.tsx` so platform-specific files are picked up.

## Driving it

```
node <harness>/build.mjs <page>
chrome --headless --disable-gpu --hide-scrollbars \
  --window-size=390,1500 --screenshot=out.png "file://$PWD/<page>.html#<variant>"
```

On macOS, Chrome lives at
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.

Use a real browser driver instead only when you need a mid-animation frame.

## Giving a component a preview seam

Sometimes a state cannot be reached without tapping: a multi step sheet opens on
step one and nothing in a screenshot can press the button. Add one optional prop:

```tsx
/** Opens straight onto one step, for the preview harness only. Nothing in the app passes it. */
initialStepForPreview?: Step;
```

Two rules for a seam like this:

- It must be inert in the app. Nothing passes it, and a test asserts the normal
  path still starts at the beginning.
- Let it also pick the non-modal render branch, so the screenshot is not blank.
  See the portal trap in `traps.md`.

This is a real cost: production code carrying a prop that exists for tooling. It is
worth it for a component whose later steps are where the hard copy lives, and not
worth it for a component with one state.
