bezier-easing-editor
====================
Cubic Bezier Curve editor made with React & SVG.

[![](https://nodei.co/npm/bezier-easing-editor.png)](https://www.npmjs.com/package/bezier-easing-editor)

## Example

[(click to open)
![](https://cloud.githubusercontent.com/assets/211411/6906945/5678cf8a-d732-11e4-8439-9587271a4406.png)
](http://gre.github.io/bezier-easing-editor/example/)

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
<BezierEditor defaultValue={[0.2, 0.2, 0.8, 0.8]} onChange={console.log.bind(console)} />
```

See also
--------

- [`bezier-easing`](https://github.com/gre/bezier-easing)
