import Form from "next/form";
import { LimitSelect } from "./_components/limit-select";
import { SearchInput } from "./_components/search-input";

type Props = {
	searchParams: Promise<{ q?: string; limit?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const { q = "", limit = "20" } = await searchParams;

	return (
		<header className="container mx-auto max-w-6xl p-6 pb-0">
			{/* GET form: submitting navigates to /?q=...&limit=... and the server re-renders */}
			<Form action="/" replace className="flex flex-wrap gap-2">
				<SearchInput defaultValue={q} />
				<LimitSelect defaultValue={limit} />
			</Form>
		</header>
	);
}
