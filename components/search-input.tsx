"use client";

// Solution 3: Setup search filters
export function SearchInput({ defaultValue }: { defaultValue: string }) {
	return (
		<input
			type="search"
			name="q"
			defaultValue={defaultValue}
			placeholder="Search here"
			className="input input-bordered max-w-xs"
			onChange={(e) => {
				const form = e.currentTarget.form;
				form?.requestSubmit();
			}}
		/>
	);
}
