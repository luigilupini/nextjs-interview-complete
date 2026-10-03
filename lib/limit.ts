// Shared by the @filter slot and the main page so both agree on valid values.
export const LIMIT_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_LIMIT = 20;

// Only allow known values; anything else (e.g. ?limit=99999 or ?limit=abc)
// falls back to the default.
export function parseLimit(value: string | undefined): number {
	const n = Number(value);
	return (LIMIT_OPTIONS as readonly number[]).includes(n) ? n : DEFAULT_LIMIT;
}
