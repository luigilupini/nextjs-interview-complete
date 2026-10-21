"use client";

// Solution 3: Setup search input filter
export function SearchInput({ defaultValue }: { defaultValue: string }) {
	return (
		<input
			type="search"
			name="q"
			defaultValue={defaultValue}
			placeholder="Search Pokémon..."
			className="input input-bordered max-w-xs"
			onChange={(e) => {
				const form = e.currentTarget.form;
				form?.requestSubmit();
			}}
		/>
	);
}
