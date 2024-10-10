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

  isInstanceOf(value, klass, message) {
    if (value instanceof klass) {
      return;
    }

    throw new TypeError(message);
  },
};
