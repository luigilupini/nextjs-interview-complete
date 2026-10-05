// Solution 2: Streaming & error handling using a loading and error boundary file
export default function RootLoading() {
	return (
		<section className="space-y-4">
			<div className="skeleton h-8 w-48" />
			<ul className="grid grid-cols-2 gap-2 md:grid-cols-4">
				{Array.from({ length: 20 }).map((_, i) => (
					<li key={i} className="skeleton h-14" />
				))}
			</ul>
		</section>
	);
}
