"use client";

// Solution 3: Setup limit filters
export function LimitSelect({ defaultValue }: { defaultValue: string }) {
	return (
		<select
			name="limit"
			defaultValue={defaultValue}
			className="select appearance-none w-40"
			onChange={(e) => e.currentTarget.form?.requestSubmit()}
		>
			<option value="10">Show 10</option>
			<option value="20">Show 20</option>
			<option value="30">Show 30</option>
			<option value="100">Show 100</option>
		</select>
	);
}
