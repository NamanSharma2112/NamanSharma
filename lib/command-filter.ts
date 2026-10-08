export interface Searchable {
  label: string
  keywords?: Array<string>
  disabled?: boolean
}

function subsequence(text: string, query: string) {
  let at = -1
  for (const char of query) {
    at = text.indexOf(char, at + 1)
    if (at === -1) return false
  }
  return true
}

export function matches(option: Searchable, query: string) {
  if (option.disabled) return false
  if (subsequence(option.label.toLowerCase(), query)) return true
  return option.keywords?.some((keyword) => keyword.toLowerCase().includes(query)) ?? false
}

export function rank(label: string, query: string) {
  const name = label.toLowerCase()
  if (name === query) return 0
  if (name.startsWith(query)) return 1
  if (name.includes(query)) return 2
  return 3
}

export function search<T extends Searchable>(options: Array<T>, query: string): Array<T> {
  const needle = query.trim().toLowerCase()
  if (!needle) return options

  return options
    .filter((option) => matches(option, needle))
    .toSorted((a, b) => rank(a.label, needle) - rank(b.label, needle))
}
