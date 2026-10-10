/**
 * Conditionally join class names. Filters out falsy values.
 * @param {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
