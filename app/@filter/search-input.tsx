"use client";

import { useRef } from "react";

// Submits the parent <Form> 300ms after the user stops typing.
export function SearchInput({ defaultValue }: { defaultValue: string }) {
	const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
	return (
		<input
			type="search"
			name="q"
			defaultValue={defaultValue}
			placeholder="Search Pokémon..."
			aria-label="Search Pokémon"
			className="input input-bordered w-full max-w-xs"
			onChange={(e) => {
				const form = e.currentTarget.form;
				clearTimeout(timeout.current);
				timeout.current = setTimeout(() => form?.requestSubmit(), 300);
			}}
		/>
	);
}
