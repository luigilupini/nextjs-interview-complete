// @ts-expect-error Next.js handles CSS imports at build time.
import "./globals.css";
import type { Metadata } from "next";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Next.js Interview",
	description: "Next.js App using PokéAPI",
};

export default function RootLayout({
	filter,
	children,
	modal,
}: {
	filter: React.ReactNode;
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} min-h-screen bg-base-200 text-base-content`}
			>
				<header>{filter}</header>
				<main className="container mx-auto max-w-6xl space-y-8 p-6">
					{children}
				</main>
				{modal}
			</body>
		</html>
	);
}
