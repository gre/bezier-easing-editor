bezier-easing-editor
====================

Cubic Bezier Curve editor made with React & SVG.

[![npm](https://img.shields.io/npm/v/bezier-easing-editor.svg)](https://www.npmjs.com/package/bezier-easing-editor)
[![CI](https://github.com/gre/bezier-easing-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/gre/bezier-easing-editor/actions/workflows/ci.yml)

## Example

[(click to open)
![](https://cloud.githubusercontent.com/assets/211411/6906945/5678cf8a-d732-11e4-8439-9587271a4406.png)
](https://gre.github.io/bezier-easing-editor/)

## Install

```sh
npm install bezier-easing-editor
```

Requires React 17 or higher. TypeScript types are included.

## Usage

### Controlled

Provide `value` and an `onChange` handler:

```tsx
import { useState } from "react";
import BezierEditor, { type BezierValue } from "bezier-easing-editor";

function MyEditor() {
  const [value, setValue] = useState<BezierValue>([0.25, 0.25, 0.75, 0.75]);
  return <BezierEditor value={value} onChange={setValue} />;
}
```

### Uncontrolled

Just define a `defaultValue`:

```tsx
<BezierEditor defaultValue={[0.2, 0.2, 0.8, 0.8]} onChange={console.log} />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `[x1, y1, x2, y2]` | — | current easing (controlled mode) |
| `defaultValue` | `[x1, y1, x2, y2]` | `[0.25, 0.25, 0.75, 0.75]` | initial easing (uncontrolled mode) |
| `onChange` | `(value) => void` | — | called when a handle is dragged |
| `width` | `number` | `300` | svg width in pixels |
| `height` | `number` | `300` | svg height in pixels |
| `padding` | `[top, right, bottom, left]` | `[25, 5, 25, 18]` | padding around the grid |
| `progress` | `number` | `0` | progress in `[0,1]` to visualize on the curve |
| `readOnly` | `boolean` | `false` | hide the handles and disable edition |
| `background` | `string` | `"#fff"` | background color |
| `gridColor` | `string` | `"#eee"` | grid color |
| `curveColor` | `string` | `"#333"` | curve color |
| `curveWidth` | `number` | `2` | curve stroke width |
| `handleColor` | `string` | `"#f00"` | handle color |
| `handleRadius` | `number` | `5` | handle circle radius |
| `handleStroke` | `number` | `2` | handle stroke width |
| `progressColor` | `string` | `"#ccc"` | progress lines color |
| `textStyle` | `CSSProperties` | sans-serif 10px | style of the axis labels |
| `style` / `className` | — | — | applied to the root svg |
| `children` | `ReactNode` | — | extra SVG elements rendered in the editor |

## Development

```sh
npm install
npm test          # run the test suite (vitest)
npm run build     # build the library (tsup: ESM + CJS + types)

cd example
npm install
npm run dev       # run the example app (vite)
```

The example app is deployed to GitHub Pages automatically on every push to
`master` by the [deploy workflow](.github/workflows/deploy-pages.yml).

## Release

Releases are automated with [changesets](https://github.com/changesets/changesets).
Run `npx changeset` in your PR to describe the change and pick a semver bump.
On merge, the [release workflow](.github/workflows/release.yml) opens a
"Version Packages" PR; merging it publishes to npm (via
[trusted publishing](https://docs.npmjs.com/trusted-publishers), no token)
and creates the GitHub release.

## See also

- [`bezier-easing`](https://github.com/gre/bezier-easing)
