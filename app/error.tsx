"use client";

import { useEffect } from "react";

type Props = { error: Error; reset: () => void };

// Solution 2: Streaming & error handling using a loading and error boundary file
export default function RootError({ error, reset }: Props) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div
			role="alert"
			className="alert alert-error flex flex-col items-start gap-2"
		>
			<h2 className="font-bold">Something went wrong loading Pokémon.</h2>
			<p className="text-sm">{error.message}</p>
			<button type="button" className="btn btn-sm" onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
}
