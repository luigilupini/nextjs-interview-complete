import Form from "next/form";
import { SearchInput } from "./search-input";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const { q = "" } = await searchParams;

	return (
		<div className="container mx-auto max-w-6xl p-6 pb-0">
			{/* GET form: submitting navigates to /?q=... and the server re-renders */}
			<Form action="/" replace>
				<SearchInput defaultValue={q} />
			</Form>
		</div>
	);
}
