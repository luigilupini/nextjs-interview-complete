"use client";

import { useEffect } from "react";

type Props = { error: Error; reset: () => void };

// Solution 2: Handle errors with error boundary
export default function RootError({ error, reset }: Props) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div
			role="alert"
			className="alert alert-error flex flex-col items-start gap-2"
		>
			<h2 className="font-bold">Something went wrong loading recipes.</h2>
			<p className="text-sm">{error.message}</p>
			<button type="button" className="btn btn-sm" onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
}
