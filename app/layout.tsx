import "@/styles/globals.css";

import { Providers } from "@/context/providers";
import { jetbrains, rubik } from "@/fonts";

type LayoutPage = Readonly<{
	navbar: React.ReactNode;
	children: React.ReactNode;
	modal: React.ReactNode;
}>;

export default function RootLayout({ navbar, children, modal }: LayoutPage) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<body
				className={`${rubik.variable} ${jetbrains.variable} flex h-full flex-col bg-base-200 text-base-content font-sans`}
			>
				<Providers>
					{navbar}
					<main className="flex-1 overflow-y-auto">
						<div className="container mx-auto max-w-6xl space-y-8 p-6">
							{children}
						</div>
					</main>
					{modal}
				</Providers>
			</body>
		</html>
	);
}
