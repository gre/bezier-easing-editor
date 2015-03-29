bezier-easing-editor
====================
Cubic Bezier Curve editor made with React & SVG.

[![](https://nodei.co/npm/bezier-easing-editor.png)](https://www.npmjs.com/package/bezier-easing-editor)

## Example

[(click to open)
![](https://cloud.githubusercontent.com/assets/211411/6886919/d5925f40-d64f-11e4-9eb3-a6e2cf47018b.png)
](http://glslio.github.io/bezier-easing-editor/example/)

Controlled / Uncontrolled Component
-----

`bezier-easing-editor` allows to be **Controlled**:
you have to provide `value` and an `onChange` handler
to enable the edition.
```jsx
<BezierEditor value={this.state.val} onChange={val => this.setState({ val })} />
```

`bezier-easing-editor` allows to be **Uncontrolled**:
just define a `defaultValue`:
```jsx
<BezierEditor defaultValue={[0.2, 0.2, 0.8, 0.8]} />
```

See also
--------

- [`bezier-easing`](https://github.com/gre/bezier-easing)
