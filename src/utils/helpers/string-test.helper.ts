export function capitalize(string: string | undefined) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
