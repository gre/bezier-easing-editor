# bezier-easing-editor

## 1.1.0

### Minor Changes

- [#20](https://github.com/gre/bezier-easing-editor/pull/20) [`2047de9`](https://github.com/gre/bezier-easing-editor/commit/2047de97222129c3d052d4b12f401e074dcec7b2) Thanks [@gre](https://github.com/gre)! - Improve touch support:

  - handles now have a larger invisible hit area (min 44px diameter) so they are easy to grab with a finger
  - multi-touch: each handle can be dragged by a different finger simultaneously
  - touches starting on a handle no longer scroll the page (works on iOS Safari where `touch-action` is ignored on SVG children), while the page can still be scrolled from the editor background
