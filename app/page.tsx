import { Bookmark, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Recipe = {
	id: number;
	name: string;
	difficulty: "Easy" | "Medium" | "Hard";
	image: string;
	rating: number;
	reviewCount: number;
};

type RecipeListResponse = {
	recipes: Recipe[];
	total: number;
	skip: number;
	limit: number;
};

type RecipeQuery = {
	q?: string;
	limit?: number;
	skip?: number;
};

async function getRecipes({
	q = "",
	limit = 20,
	skip = 0,
}: RecipeQuery): Promise<RecipeListResponse> {
	const url = new URL("https://dummyjson.com/recipes/search");

	url.searchParams.set("q", q.trim()); // API search is already case-insensitive
	url.searchParams.set("limit", String(limit));
	url.searchParams.set("skip", String(skip));
	url.searchParams.set("select", "id,name,difficulty,image,rating,reviewCount");

	const res = await fetch(url, { next: { revalidate: 3600 } }); // cache for 1h
	if (!res.ok) throw new Error("Failed to fetch recipes");
	return res.json();
}

type Props = {
	searchParams: Promise<{ q?: string; limit?: string }>;
};

// Solution 1: Convert client-side to server-side
export default async function Page({ searchParams }: Props) {
	const { q, limit = 20 } = await searchParams;
	const { recipes: results, total } = await getRecipes({
		q,
		limit: Number(limit) > 0 ? Number(limit) : 20, // API rejects NaN/negative
	});

	if (results.length === 0) {
		return (
			<p className="opacity-70">
				{q ? `No recipes match “${q}”.` : "No recipes found."}
			</p>
		);
	}

	return (
		<section className="space-y-4">
			<p className="text-sm opacity-70">
				Showing {results.length} of {total}
			</p>
			<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{results.map((r, i) => (
					<li key={r.id}>
						<Link
							href={{ query: { q, limit, recipe: r.id } }}
							scroll={false}
							className="card h-full bg-base-100 hover:shadow-xs ring-1 ring-inset ring-base-content/10 overflow-hidden"
						>
							<div className="flex items-center justify-between gap-2 p-2">
								<div className="flex flex-col justify-between size-full">
									<div className="flex flex-col gap-0">
										<h2 className="card-title text-sm">{r.name}</h2>
										<p className="text-xs opacity-70">
											Difficulty: {r.difficulty}
										</p>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<span className="badge badge-primary badge-ghost text-xs badge-sm rounded-md gap-1 px-2">
											<Star className="w-3 h-3" />
											<span>{r.rating}</span>
										</span>
										<span className="badge badge-primary badge-ghost text-xs badge-sm rounded-md gap-1 px-2">
											<Bookmark className="w-3 h-3" />
											<span>{r.reviewCount}</span>
										</span>
									</div>
								</div>

								<Image
									src={r.image}
									alt={r.name}
									width={200}
									height={200}
									className="aspect-square object-cover size-20 rounded-md"
									priority={i < 3} // only above-the-fold images; the rest lazy-load
								/>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
