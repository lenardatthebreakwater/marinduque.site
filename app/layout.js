import { Newsreader, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-newsreader',
	display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	variable: '--font-be-vietnam-pro',
	display: 'swap',
})

export const metadata = {
	title: 'Marinduque Guide',
	description: 'Your knowledgeable local friend guiding you through pristine beaches, vibrant festivals, and authentic island life.',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={`${newsreader.variable} ${beVietnamPro.variable}`}>
			<body className="bg-[#fcf9f8] text-[#1b1c1c] font-body antialiased min-h-screen flex flex-col">
				{children}
			</body>
		</html>
	)
}