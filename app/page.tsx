// 1, title: "Server-side data fetching here in children"
// 2, title: "Streaming & error handling using a loading and error boundary file"
// 3, title: "Debounced search placed in the filter route"
// 4, title: "Pagination & filters"
// 5, title: "Interactive list item into modal parallel route"

type PokemonListResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: { name: string; url: string }[];
};

async function getPokemon(
	limit = 20,
	offset = 0,
): Promise<PokemonListResponse> {
	const res = await fetch(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
		{ next: { revalidate: 3600 } }, // cache for 1h
	);
	if (!res.ok) throw new Error("Failed to fetch Pokémon");
	return res.json();
}

export default async function Page() {
	const { results } = await getPokemon();

	return (
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
	);
}
