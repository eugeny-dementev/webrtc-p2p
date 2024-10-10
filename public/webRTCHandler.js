import { assert } from "./assert.js";

export function sendPreOffer(code) {
  assert.isString(code, 'offer code should be a string');

  console.log('preOffer function run', code);
}
