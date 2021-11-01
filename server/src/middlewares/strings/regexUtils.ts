const mailRegex: RegExp = /[\w-.]+@[\w-]+\.+[\w-]+(\.[\w-]+)*/

export function extractEmail(s: string): string | null {
  const matches: string[] | null = s.match(mailRegex)

  if (matches) return matches[0]
  return null
}
