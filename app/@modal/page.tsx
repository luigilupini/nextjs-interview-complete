import { Bookmark, ChefHat, MapPin, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/types/recipe";

async function getRecipe(id: string): Promise<Recipe | null> {
	const url = new URL(
		`https://dummyjson.com/recipes/${encodeURIComponent(id)}`,
	);
	const res = await fetch(url, { next: { revalidate: 3600 } });
	if (!res.ok) throw new Error("Failed to fetch recipe");
	return res.json();
}

type Props = {
	searchParams: Promise<{ recipe?: string; q?: string; limit?: string }>;
};

// Solution 4: Displaying individual recipe detail
export default async function Page({ searchParams }: Props) {
	const { recipe: id, q, limit } = await searchParams;

	if (!id) return null;

	const recipe = await getRecipe(id);

	// Closing keeps the search + limit but drops ?recipe=
	const closeHref = { query: { q, limit } };

	return (
		<div className="modal modal-open">
			<div className="modal-box max-h-11/12 max-w-3xl">
				<Link
					href={closeHref}
					scroll={false}
					className="btn btn-ghost btn-sm absolute right-2 top-4 btn-square"
				>
					<X className="size-4" />
				</Link>

				<article className="space-y-6">
					<header className="space-y-2 pr-8">
						<h2 className="text-2xl font-bold">{recipe?.name}</h2>
						<div className="flex flex-wrap items-center gap-2 text-sm">
							<span className="badge badge-primary badge-soft text-xs badge-sm rounded-md gap-1 px-2">
								<ChefHat className="w-3 h-3" />
								{recipe?.difficulty}
							</span>
							<span className="badge badge-primary badge-soft text-xs badge-sm rounded-md gap-1 px-2">
								<MapPin className="w-3 h-3" />
								{recipe?.cuisine}
							</span>
							<span className="badge badge-primary badge-soft text-xs badge-sm rounded-md gap-1 px-2">
								<Star className="w-3 h-3" />
								{recipe?.rating}
							</span>
							<span className="badge badge-primary badge-soft text-xs badge-sm rounded-md gap-1 px-2">
								<Bookmark className="w-3 h-3" />
								{recipe?.reviewCount}
							</span>
						</div>
					</header>

					<Image
						src={recipe?.image || "/placeholder.png"}
						alt={recipe?.name || "Recipe image"}
						width={800}
						height={500}
						className="aspect-video w-full rounded-box object-cover"
						priority
					/>

					<div className="stats stats-vertical w-full bg-base-200 sm:stats-horizontal">
						<div className="stat">
							<div className="stat-title">Prep</div>
							<div className="stat-value text-base">
								{recipe?.prepTimeMinutes} min
							</div>
						</div>
						<div className="stat">
							<div className="stat-title">Cook</div>
							<div className="stat-value text-base">
								{recipe?.cookTimeMinutes} min
							</div>
						</div>
						<div className="stat">
							<div className="stat-title">Servings</div>
							<div className="stat-value text-base">{recipe?.servings}</div>
						</div>
						<div className="stat">
							<div className="stat-title">Calories</div>
							<div className="stat-value text-base">
								{recipe?.caloriesPerServing}
								<span className="text-sm font-normal opacity-60">
									{" "}
									/ serving
								</span>
							</div>
						</div>
					</div>

					<section>
						<h3 className="mb-2 text-base font-semibold">Ingredients</h3>
						<ul className="list-inside list-disc space-y-1 text-sm opacity-90">
							{recipe?.ingredients.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</section>

					<section>
						<h3 className="mb-2 text-base font-semibold">Instructions</h3>
						<ol className="list-inside list-decimal space-y-2 text-sm opacity-90">
							{recipe?.instructions.map((step, i) => (
								<li key={i}>{step}</li>
							))}
						</ol>
					</section>
				</article>
			</div>

			<Link href={closeHref} scroll={false} className="modal-backdrop" />
		</div>
	);
}
