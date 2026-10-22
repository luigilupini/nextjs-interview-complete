import Form from "next/form";
import { LimitSelect } from "./_components/limit-select";
import { SearchInput } from "./_components/search-input";
import { ThemeSwitch } from "./_components/theme-switch";

type Props = {
	searchParams: Promise<{ q?: string; limit?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const { q = "", limit = "20" } = await searchParams;

	return (
		<header className="z-10 shrink-0 border-b border-base-content/10 bg-base-200">
			<div className="container mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
				{/* GET form: submitting navigates to /?q=...&limit=... and the server re-renders */}
				<Form action="/" replace className="flex gap-2">
					<SearchInput defaultValue={q} />
					<LimitSelect defaultValue={limit} />
				</Form>
				<ThemeSwitch />
			</div>
		</header>
	);
}
