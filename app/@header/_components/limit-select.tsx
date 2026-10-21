"use client";

// Solution 3: Setup limit select filter
export function LimitSelect({ defaultValue }: { defaultValue: string }) {
	return (
		<select
			name="limit"
			defaultValue={defaultValue}
			className="select select-bordered w-40"
			onChange={(e) => e.currentTarget.form?.requestSubmit()}
		>
			<option value="10">Show 10</option>
			<option value="20">Show 20</option>
			<option value="50">Show 50</option>
			<option value="100">Show 100</option>
		</select>
	);
}
