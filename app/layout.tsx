// @ts-expect-error Next.js handles CSS imports at build time.
import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	header,
	children,
	modal,
}: {
	header: React.ReactNode;
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} min-h-screen bg-base-200 text-base-content`}
			>
				{header}
				<main className="container mx-auto max-w-6xl space-y-8 p-6">
					{children}
				</main>
				{modal}
			</body>
		</html>
	);
}
