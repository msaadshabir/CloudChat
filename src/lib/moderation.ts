// Simple, configurable profanity check without shipping explicit terms in code.
// Configure via env var BANNED_WORDS as a comma-separated list.

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[\s\-_.]/g, '') // collapse separators
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't');
}

export function containsBannedLanguage(text: string): boolean {
  const list = (process.env.BANNED_WORDS || '')
    .split(',')
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
  if (list.length === 0) return false; // No configured list, treat as allowed
  const normalizedText = normalize(text);
  return list.some((term) => normalizedText.includes(normalize(term)));
}

export function getModerationErrorMessage() {
  return 'Content contains inappropriate language';
}
