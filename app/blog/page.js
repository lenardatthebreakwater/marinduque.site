import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllPosts } from '@/lib/posts'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Blog | Marinduque Guide',
  description: 'Stories, tips, and hidden gems from Marinduque.',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-5 md:px-6 max-w-[1120px] mx-auto w-full">

        {/* Header */}
        <header className="mb-16 pt-8">
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-[#1b1c1c] mb-3">
            The Latest from the Island
          </h1>
          <p className="text-[#3e494a] text-lg max-w-2xl leading-relaxed">
            Discover stories, tips, and hidden gems from Marinduque. Your journey starts here.
          </p>
        </header>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <p className="text-[#3e494a]">No posts yet. Add MDX files to the content/ directory.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="bg-[#e8dfc5] border-0 overflow-hidden ambient-shadow flex flex-col group hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Image placeholder */}
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

                <CardFooter>
                  <Button asChild variant="ghost" className="text-[#b35305] hover:text-[#8e3f00] font-semibold text-sm p-0 h-auto">
                    <Link href={`/blog/${post.slug}`}>Read More →</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}