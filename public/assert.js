export const assert = {
  isString(str, message) {
    if (typeof str === 'string') {
      return;
    }

    throw new TypeError(message);
  },

  isBoolean(value, message) {
    if (typeof str === 'boolean') {
      return;
    }

    throw new TypeError(message);
  },

  isInstanceOf(instance, klass, message) {
    if (instance instanceof klass) {
      return;
    }

    throw new TypeError(message);
  },
};
