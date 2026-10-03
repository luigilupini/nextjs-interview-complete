"use client";

import Form from "next/form";
import { useRef } from "react";

export function Search({ defaultValue }: { defaultValue: string }) {
	const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
	return (
		<Form action="/" replace>
			<input
				type="search"
				name="q"
				defaultValue={defaultValue}
				placeholder="Search Pokémon..."
				className="input input-bordered w-full max-w-xs"
				onChange={(e) => {
					// Debounce: submit 300ms after the last keystroke.
					const form = e.currentTarget.form;
					clearTimeout(timeout.current);
					timeout.current = setTimeout(() => form?.requestSubmit(), 300);
				}}
			/>
		</Form>
	);
}
