const MONTHS = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];

/**
 * Parses the human readable date format used in article frontmatter
 * (e.g. "8th March 2026") into a Date, or null when it can't be parsed.
 */
export function parseArticleDate(value: string | null | undefined): Date | null {
    if (!value) return null;

    const match = value.trim().match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!match) return null;

    const [, day, month, year] = match;
    const monthIndex = MONTHS.indexOf(month!.toLowerCase());
    if (monthIndex === -1) return null;

    return new Date(Date.UTC(Number(year), monthIndex, Number(day)));
}

/**
 * Converts an article frontmatter date into an ISO 8601 string, for use in
 * `<time datetime="...">` attributes and `article:published_time` /
 * `article:modified_time` meta tags.
 */
export function toIsoDate(value: string | null | undefined): string | undefined {
    return parseArticleDate(value)?.toISOString();
}
