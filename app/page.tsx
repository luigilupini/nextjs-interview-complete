import { Bookmark, Check, Eye, Hash, Slash, Star, View } from "lucide-react";
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

async function getAllRecipes(): Promise<RecipeListResponse> {
	const res = await fetch(
		"https://dummyjson.com/recipes?limit=0&select=id,name,difficulty,image,rating,reviewCount",
		{ next: { revalidate: 3600 } }, // cache for 1h
	);
	if (!res.ok) throw new Error("Failed to fetch recipes");
	return res.json();
}

type Props = {
	searchParams: Promise<{ q?: string; limit?: string }>;
};

// Solution 1: Convert client-side to server-side
export default async function Page({ searchParams }: Props) {
	const { q, limit = "20" } = await searchParams;
	const query = q?.trim().toLowerCase() ?? "";

	const { recipes } = await getAllRecipes();

	const matches = recipes.filter((r) => r.name.toLowerCase().includes(query));
	const results = matches.slice(0, Number(limit));
	const total = matches.length;

	if (results.length === 0) {
		return <p className="opacity-70">No recipes match “{q}”.</p>;
	}

	return (
		<section className="space-y-4">
			<p className="text-sm opacity-70">
				Showing {results.length} of {total}
			</p>
			<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{results.map((r) => (
					<li key={r.id}>
						<Link
							href={{ query: { q, limit, recipe: r.id } }}
							prefetch={true}
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
									priority
								/>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
