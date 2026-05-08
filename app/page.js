import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllPosts } from '@/lib/posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mountain, Utensils, Sparkles, Home } from 'lucide-react'

const categories = [
	{
		name: 'Tourism',
		description: 'Landmarks, beaches, and hidden gems.',
		icon: Mountain,
		color: 'bg-[#006067]',
		span: 'md:col-span-1 md:row-span-2',
	},
	{
		name: 'Food',
		description: 'Local flavors and island cuisine.',
		icon: Utensils,
		color: 'bg-[#b35305]',
		span: 'md:col-span-1',
	},
	{
		name: 'Festivals',
		description: 'Moriones and island celebrations.',
		icon: Sparkles,
		color: 'bg-[#4c4733]',
		span: 'md:col-span-1',
	},
	{
		name: 'Living',
		description: 'Life on the island.',
		icon: Home,
		color: 'bg-[#004f54]',
		span: 'md:col-span-1',
	},
]

function formatDate(iso) {
	return new Date(iso).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

export default function HomePage() {
	const latestPosts = getAllPosts().slice(0, 3)

	return (
		<>
			<Navbar />
			<main className="flex-grow">

				{/* Hero Section */}
				<section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
					<div className="absolute inset-0 tropical-gradient opacity-90" />
					<div className="absolute inset-0 bg-[#1b1c1c]/20" />
					<div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
					<div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#b35305]/20 blur-3xl" />
					<div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
						<Card className="bg-white/90 backdrop-blur-sm border-0 ambient-shadow px-4">
							<CardHeader>
								<h1 className="font-display text-4xl md:text-5xl font-semibold text-[#006067] leading-tight">
									Discover the Heart of the Philippines
								</h1>
							</CardHeader>
							<CardContent>
								<p className="text-[#3e494a] text-lg leading-relaxed">
									Your knowledgeable local friend guiding you through pristine beaches, vibrant festivals, and authentic island life.
								</p>
							</CardContent>
							<CardFooter className="justify-center">
								<Button asChild className="bg-[#006067] hover:bg-[#004f54] text-white font-semibold tracking-wide rounded-lg px-8">
									<Link href="/blog">Start Exploring</Link>
								</Button>
							</CardFooter>
						</Card>
					</div>
				</section>

				{/* Latest Stories */}
				<section className="max-w-[1120px] mx-auto px-6 py-20">
					<div className="flex items-center justify-between mb-10">
						<h2 className="font-display text-3xl font-semibold text-[#1b1c1c]">Latest Stories</h2>
						<Button asChild variant="ghost" className="text-[#006067] hover:text-[#8e3f00] font-semibold text-sm">
							<Link href="/blog">View all →</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{latestPosts.length === 0
							? [1, 2, 3].map((i) => (
								<Card key={i} className="bg-[#e8dfc5] border-0 overflow-hidden ambient-shadow">
									<div className="h-44 tropical-gradient w-full" />
									<CardHeader>
										<Badge className="w-fit bg-[#006067]/10 text-[#006067] border-0 text-xs">Coming soon</Badge>
										<h3 className="font-display text-xl font-semibold text-[#1b1c1c]">Article {i}</h3>
									</CardHeader>
									<CardContent>
										<p className="text-[#3e494a] text-sm leading-relaxed">New stories coming soon. Check back shortly.</p>
									</CardContent>
								</Card>
							))
							: latestPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card
                  className="bg-[#e8dfc5] border-0 overflow-hidden ambient-shadow flex flex-col group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="h-48 tropical-gradient w-full" />
                  <CardHeader>
                    <Badge className="w-fit bg-[#006067]/10 text-[#006067] border-0 text-xs uppercase tracking-widest">
                      {formatDate(post.date)}
                    </Badge>
                    <h2 className="font-display text-2xl font-semibold text-[#1b1c1c] group-hover:text-[#006067] transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-[#3e494a] text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
							))}
					</div>
				</section>

				{/* Explore by Category */}
				<section className="max-w-[1120px] mx-auto px-6 pb-20">
					<h2 className="font-display text-3xl font-semibold text-[#006067] text-center mb-10">
						Explore by Category
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[180px]">
						{categories.map((cat) => {
							const Icon = cat.icon
							return (
								<Link
									key={cat.name}
									href={`/blog?category=${cat.name.toLowerCase()}`}
									className={`${cat.color} ${cat.span} rounded-xl p-6 flex flex-col justify-end text-white group hover:opacity-90 transition-opacity relative overflow-hidden`}
								>
									<div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
										<Icon size={48} />
									</div>
									<Icon size={24} className="mb-2 opacity-80" />
									<h3 className="font-display text-xl font-semibold">{cat.name}</h3>
									{cat.description && (
										<p className="text-white/70 text-sm mt-1">{cat.description}</p>
									)}
								</Link>
							)
						})}
					</div>
				</section>

				{/* Editorial Callout */}
				<section className="max-w-[1120px] mx-auto px-6 pb-24">
					<Card className="bg-[#e8dfc5] border-0 border-l-4 border-l-[#006067] rounded-xl relative overflow-hidden">
						<span className="absolute top-4 right-8 text-[#006067]/20 font-display text-9xl leading-none select-none">"</span>
						<CardContent className="p-8 md:p-12">
							<blockquote>
								<p className="font-display text-xl md:text-2xl text-[#68634d] italic leading-relaxed max-w-2xl relative z-10">
									Marinduque isn't just a destination; it's a slow, deliberate breath of fresh air. It's where the heart rate slows down to match the gentle rhythm of the tides.
								</p>
								<Separator className="my-6 bg-[#bdc9ca] max-w-xs" />
								<footer className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-[#006067] flex items-center justify-center text-white text-xs font-bold shrink-0">
										MG
									</div>
									<div>
										<p className="text-[#006067] text-sm font-semibold">Local Tip</p>
										<p className="text-[#3e494a] text-xs">Best visited between January and May.</p>
									</div>
								</footer>
							</blockquote>
						</CardContent>
					</Card>
				</section>

			</main>
			<Footer />
		</>
	)
}
