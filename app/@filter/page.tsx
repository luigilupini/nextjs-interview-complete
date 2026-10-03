import Form from "next/form";
import { parseLimit } from "@/lib/limit";
import { LimitSelect } from "./limit-select";
import { SearchInput } from "./search-input";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; limit?: string }>;
}) {
	const { q = "", limit } = await searchParams;

	return (
		<div className="container mx-auto max-w-6xl p-6 pb-0">
			{/* GET form: submitting navigates to /?q=...&limit=... and the server re-renders */}
			<Form action="/" replace className="flex flex-wrap gap-2">
				<SearchInput defaultValue={q} />
				<LimitSelect defaultValue={parseLimit(limit)} />
			</Form>
		</div>
	);
}
