/**
 * Strips non-alphanumeric characters from a string and converts it to lowercase.
 * @param str The string to be stripped
 * @returns The stripped and lowercased string
 */
export function stripString(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}
