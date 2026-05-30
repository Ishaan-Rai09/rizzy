const DELIMITER = "---OPTION---"

export function parseOptions(text: string, limit = 3) {
  return text
    .split(DELIMITER)
    .map((option) => option.trim())
    .filter(Boolean)
    .slice(0, limit)
}
