/**
 * A fork of https://github.com/jquense/uncontrollable/blob/master/src/uncontrollable.js
 */

'use strict';
var React = require('react');
var invariant = require('react/lib/invariant');

function customPropType(handler, propType) {
  return function(props, propName, componentName, location) {
    if(props[propName] !== undefined) {
      return propType && propType(props, propName, componentName, location);
    }
  };
}

var version = React.version.split('.').map(parseFloat);

function getType(component){
  if( version[0] === 0 && version[1] >= 13)
    return component;

  return component.type;
}

module.exports = function(Component, controlledValues, taps) {
    var types = {};

    if ( process.env.NODE_ENV !== 'production' && getType(Component).propTypes ) {
      types = transform(controlledValues, function(obj, handler, prop){
            var type = getType(Component).propTypes[prop];

            invariant(typeof handler === 'string' && handler.trim().length,
              'Uncontrollable - [%s]: the prop `%s` needs a valid handler key name in order to make it uncontrollable',
              Component.displayName,
              prop);

            obj[prop] = customPropType(handler, type);
            if(type !== undefined ) {
              obj[defaultKey(prop)] = type;
            }
          }, {});
    }

    taps = taps || {}

    return React.createClass({

      displayName: Component.displayName,

      propTypes: types,

      getInitialState() {
        var props = this.props
          , keys  = Object.keys(controlledValues);

        return transform(keys, function(state, key){
          state[key] = props[defaultKey(key)]
        }, {})
      },

      shouldComponentUpdate() {
        //let the setState trigger the update
        return !this._notifying;
      },

      render() {
        var props = {};

        each(controlledValues, (handle, prop) => {

          props[prop] = isProp(this.props, prop)
            ? this.props[prop]
            : this.state[prop]

          props[handle] = this.props[handle] && setAndNotify.bind(this, prop)
        })

        for (var k in this.props)
          if (!(k in props))
            props[k] = this.props[k];

        each(taps, (val, key) =>
          props[key] = chain(this, val, props[key]))

        return React.createElement(Component, props);
      }
    })

    function setAndNotify(prop, value, ...args){
      var handler    = controlledValues[prop]
        , controlled = handler && isProp(this.props, prop)
        , args;

      if( this.props[handler] ) {
        this._notifying = true
        this.props[handler].call(this, value, ...args)
        this._notifying = false
      }

      this.setState({
        [prop]: value
      })

      return !controlled
    }

    function isProp(props, prop){
      return props[prop] !== undefined;
    }
  }


function defaultKey(key){
  return 'default' + key.charAt(0).toUpperCase() + key.substr(1)
}

function chain(thisArg, a, b){
  return function chainedFunction(...args){
    a && a.call(thisArg, ...args)
    b && b.call(thisArg, ...args)
  }
}

function transform(obj, cb, seed){
  each(obj, cb.bind(null, seed = seed || (Array.isArray(obj) ? [] : {})))
  return seed
}

function each(obj, cb, thisArg){
  if( Array.isArray(obj)) return obj.forEach(cb, thisArg)

  for(var key in obj) if(has(obj, key))
    cb.call(thisArg, obj[key], key, obj)
}

function has(o, k){
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false
}
