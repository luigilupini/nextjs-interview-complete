"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div role="alert" className="alert alert-error flex flex-col items-start gap-2">
			<h2 className="font-bold">Something went wrong loading Pokémon.</h2>
			<p className="text-sm">{error.message}</p>
			<button type="button" className="btn btn-sm" onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
}
