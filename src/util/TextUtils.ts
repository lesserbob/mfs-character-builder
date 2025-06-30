/**
 * Converts all characters in a string to lowercase except the first character
 * @param str - The input string
 * @returns The string with only the first character capitalized
 */
export function capitalizeFirst(str: string): string {
  if (!str || str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
