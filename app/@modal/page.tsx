import Image from "next/image";
import Link from "next/link";

async function getPokemon(name: string) {
	const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name.toLowerCase())}`;
	const res = await fetch(url, { next: { revalidate: 3600 } }); // cache for 1h
	const data = res.ok
		? await res.json()
		: { error: `${res.status} ${res.statusText}` };
	return { data };
}

type Props = {
	searchParams: Promise<{ pokemon?: string; q?: string; limit?: string }>;
};

// Solution 4: Displaying individual Pokémon details
export default async function Page({ searchParams }: Props) {
	const { pokemon, q, limit } = await searchParams;

	if (!pokemon) return null;

	const { data } = await getPokemon(pokemon);

	const image: string | null =
		data.sprites?.other?.["official-artwork"]?.front_default ??
		data.sprites?.front_default;

	// Closing keeps the search + limit but drops ?pokemon=
	const closeHref = { query: { q, limit } };

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-3xl">
				<Link
					href={closeHref}
					scroll={false}
					className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
				>
					✕
				</Link>
				<h2 className="mb-4 text-xl font-bold capitalize">{pokemon}</h2>
				<Image src={image ?? ""} alt={pokemon} width={300} height={300} />
				{/* Temporary: dump everything */}
				<pre className="max-h-[70vh] overflow-auto rounded bg-base-200 p-4 font-mono text-xs">
					{JSON.stringify({ data }, null, 2)}
				</pre>
			</div>
			<Link href={closeHref} scroll={false} className="modal-backdrop" />
		</div>
	);
}
