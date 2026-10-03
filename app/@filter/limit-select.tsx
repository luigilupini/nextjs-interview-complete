"use client";

import { LIMIT_OPTIONS } from "@/lib/limit";

// Submits the parent <Form> as soon as a new limit is picked.
export function LimitSelect({ defaultValue }: { defaultValue: number }) {
	return (
		<select
			name="limit"
			defaultValue={defaultValue}
			aria-label="Number of Pokémon to show"
			className="select select-bordered w-auto"
			onChange={(e) => e.currentTarget.form?.requestSubmit()}
		>
			{LIMIT_OPTIONS.map((n) => (
				<option key={n} value={n}>
					Show {n}
				</option>
			))}
		</select>
	);
}
