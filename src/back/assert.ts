export const assert = {
  isString(value, message) {
    if (typeof value === 'string') {
      return;
    }

    throw new TypeError(message);
  },

  isBoolean(value, message) {
    if (typeof value === 'boolean') {
      return;
    }

    throw new TypeError(message);
  },

  isFunction(value, message) {
    if (typeof value === 'function') {
      return;
    }

    throw new TypeError(message);
  },

  oneOf(value, values) {
    if (values.includes(value)) {
      return
    }

    throw new TypeError(`value should be on of ${values.join(',')} but it is: ${value}`);
  },

  isInstanceOf(value, klass, message) {
    if (value instanceof klass) {
      return;
    }
  },
  isFalse(value, message) {
    if (value === false) {
      return
    }

    throw new TypeError(message);
  },
};
