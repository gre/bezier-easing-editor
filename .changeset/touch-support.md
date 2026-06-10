---
"bezier-easing-editor": minor
---

Improve touch support: handles now have a larger invisible hit area (min 44px diameter) so they are easy to grab with a finger, and `touch-action: none` is scoped to the handles instead of the whole editor so the page can still be scrolled from the editor background.
