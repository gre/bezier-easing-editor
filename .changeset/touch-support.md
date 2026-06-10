---
"bezier-easing-editor": minor
---

Improve touch support:

- handles now have a larger invisible hit area (min 44px diameter) so they are easy to grab with a finger
- multi-touch: each handle can be dragged by a different finger simultaneously
- touches starting on a handle no longer scroll the page (works on iOS Safari where `touch-action` is ignored on SVG children), while the page can still be scrolled from the editor background
