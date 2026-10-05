import Link from "next/link";

type PokemonListResponse = {
	count: number;
	results: { name: string; url: string }[];
};

async function getPokemons(limit = 20): Promise<PokemonListResponse> {
	const res = await fetch(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
		{ next: { revalidate: 3600 } }, // cache for 1h
	);
	if (!res.ok) throw new Error("Failed to fetch Pokémon");
	return res.json();
}

// Solution 1: Server-side data fetching here in children
export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; limit?: string }>;
}) {
	const { q, limit = "20" } = await searchParams;
	const query = q?.trim().toLowerCase() ?? "";

	// PokeAPI has no name search, so fetch every name (cached for 1h),
	// filter by the query (an empty query matches everything), then apply the limit.
	const { results: data } = await getPokemons(2000);
	const matches = data.filter((p) => p.name.includes(query));
	const results = matches.slice(0, Number(limit));
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
						<li key={p.name}>
							<Link
								href={{ query: { q, limit, pokemon: p.name } }}
								scroll={false}
								className="card block bg-base-100 p-4 capitalize hover:shadow-md"
							>
								#{id} {p.name}
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
