/**
 * Asserts an object is defined and not null. Throws otherwise.
 * @param {*} object Object reference to check for null or undefined.
 * @param {string} message Message to attach to Error.
 * @returns The verified object.
 * @throws Error if object is null or undefined.
 */
function assertExists(object, message = null) {
  if (object === undefined) {
    throw new Error(`Failed assertion: object undefined!` + (message ? ` ${message}` : null));
  }
  else if (object === null) {
    throw new Error(`Failed assertion: object null!` + (message ? ` ${message}` : null));
  }
  return object;
}

/**
 * Asserts two objects softly equal one another. Throws otherwise.
 * @param {*} obj1 First value to check.
 * @param {*} obj2 Second value to check.
 * @param {string} message Message to attach to Error.
 * @returns Obj1 (for continued chaining)
 * @throws Error if equality is not met.
 */
function assertSoftEquals(obj1, obj2, message = null) {
  if (obj1 != obj2) {
    throw new Error(`Failed assertion: soft equals!` + (message ? ` ${message}` : null));
  }

  return obj1;
}

/**
 * Asserts two objects hard equal (type and value match) one another. Throws otherwise.
 * @param {*} obj1 First value and type to check.
 * @param {*} obj2 Second value and type to check.
 * @param {string} message Message to attach to Error.
 * @returns Obj1 (for continued chaining)
 * @throws Error if equality is not met or types mismatch.
 */
function assertHardEquals(obj1, obj2, message = null) {
  if (obj1 !== obj2) {
    throw new Error(`Failed assertion: hard equals!` + (message ? ` ${message}` : null));
  }

  return obj1;
}


export { assertExists, assertHardEquals, assertSoftEquals};
