import { Search } from "./search";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q = "" } = await searchParams;

	return (
		<div className="container mx-auto max-w-6xl p-6 pb-0">
			<Search defaultValue={q} />
		</div>
	);
}
