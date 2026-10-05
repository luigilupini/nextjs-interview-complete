import Form from "next/form";
import { LimitSelect } from "./limit-select";
import { SearchInput } from "./search-input";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; limit?: string }>;
}) {
	const { q = "", limit = "20" } = await searchParams;

	return (
		<div className="container mx-auto max-w-6xl p-6 pb-0">
			{/* GET form: submitting navigates to /?q=...&limit=... and the server re-renders */}
			<Form action="/" replace className="flex flex-wrap gap-2">
				<SearchInput defaultValue={q} />
				<LimitSelect defaultValue={limit} />
			</Form>
		</div>
	);
}
