// 1, title: "Server-side data fetching here in children - DONE"
// 2, title: "Streaming & error handling using a loading and error boundary file - DONE"
// 3, title: "Search placed in the @filter route"
// 4, title: "Limit the number of Pokémon displayed in the @filter route"
// 5, title: "Interactive list item into @modal showing the individual Pokémon"

import { parseLimit } from "@/lib/limit";

type PokemonListResponse = {
	count: number;
	results: { name: string; url: string }[];
};

async function getPokemon(limit = 20): Promise<PokemonListResponse> {
	const res = await fetch(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
		{ next: { revalidate: 3600 } }, // cache for 1h
	);
	if (!res.ok) throw new Error("Failed to fetch Pokémon");
	return res.json();
}

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; limit?: string }>;
}) {
	const { q, limit: rawLimit } = await searchParams;
	const query = q?.trim().toLowerCase() ?? "";
	const limit = parseLimit(rawLimit);

	// PokeAPI has no name search, so fetch every name (cached for 1h),
	// filter by the query (an empty query matches everything), then apply the limit.
	const { results: data } = await getPokemon(2000);
	const matches = data.filter((p) => p.name.includes(query));
	const results = matches.slice(0, limit);
	const total = matches.length;

	if (results.length === 0) {
		return <p className="opacity-70">No Pokémon match “{q}”.</p>;
	}

	return (
		<section className="space-y-4">
			<p className="text-sm opacity-70">
				Showing {results.length} of {total}
			</p>
			<ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
				{results.map((p) => {
					const id = p.url.split("/").filter(Boolean).pop();
					return (
						<li key={p.name} className="card bg-base-100 p-4 capitalize">
							#{id} {p.name}
						</li>
					);
				})}
			</ul>
		</section>
	);
}
