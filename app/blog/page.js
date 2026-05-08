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

const CATEGORIES = ['All', 'Tourism', 'Food', 'Festivals', 'Living']

// Map category names to keywords that appear in posts
const CATEGORY_KEYWORDS = {
  tourism: ['tourism', 'beach', 'travel', 'tourist', 'island', 'resort', 'trek', 'cave', 'hopping', 'itinerary', 'stay', 'visit'],
  food: ['food', 'eat', 'delicacies', 'restaurant', 'cuisine', 'longganisa', 'taboan', 'squid', 'seafood', 'market'],
  festivals: ['festival', 'moriones', 'holy week', 'celebration', 'tradition', 'event', 'fiesta'],
  living: ['living', 'retire', 'retiring', 'cost', 'life', 'local', 'province', 'community'],
}

function postMatchesCategory(post, category) {
  if (category === 'all') return true
  const keywords = CATEGORY_KEYWORDS[category] || []
  const searchText = `${post.title} ${post.description} ${post.keywords?.join(' ')}`.toLowerCase()
  return keywords.some((kw) => searchText.includes(kw))
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage({ searchParams }) {
  const activeCategory = (searchParams?.category || 'all').toLowerCase()
  const allPosts = getAllPosts()
  const posts = allPosts.filter((post) => postMatchesCategory(post, activeCategory))

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-5 md:px-6 max-w-[1120px] mx-auto w-full">

        {/* Header */}
        <header className="mb-10 pt-8">
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-[#1b1c1c] mb-3">
            The Latest from the Island
          </h1>
          <p className="text-[#3e494a] text-lg max-w-2xl leading-relaxed">
            Discover stories, tips, and hidden gems from Marinduque. Your journey starts here.
          </p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.toLowerCase()
            return (
              <Button
                key={cat}
                asChild
                variant={isActive ? 'default' : 'outline'}
                className={
                  isActive
                    ? 'bg-[#006067] hover:bg-[#004f54] text-white border-0 rounded-full text-sm'
                    : 'border-[#006067] text-[#006067] hover:bg-[#006067] hover:text-white rounded-full text-sm'
                }
              >
                <Link href={cat === 'All' ? '/blog' : `/blog?category=${cat.toLowerCase()}`}>
                  {cat}
                </Link>
              </Button>
            )
          })}
        </div>

        {/* Results count */}
        <p className="text-[#3e494a] text-sm mb-8">
          {posts.length} article{posts.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' ? ` in ${CATEGORIES.find(c => c.toLowerCase() === activeCategory)}` : ''}
        </p>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#3e494a] text-lg mb-4">No posts found in this category yet.</p>
            <Button asChild variant="outline" className="border-[#006067] text-[#006067] rounded-full">
              <Link href="/blog">View all posts</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card
                key={post.slug}
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
