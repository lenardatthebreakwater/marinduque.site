import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllPosts } from '@/lib/posts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CATEGORIES, postMatchesCategory } from '@/lib/categories'

export async function generateStaticParams() {
  // Generate routes for all categories except 'All'
  return CATEGORIES.filter(c => c !== 'All').map((cat) => ({
    category: cat.toLowerCase(),
  }))
}

export async function generateMetadata({ params }) {
  const { category } = await params
  
  // Validate category
  const validCategory = CATEGORIES.find(c => c.toLowerCase() === category)
  if (!validCategory) return {}

  const titleMap = {
    tourism: 'Tourism & Travel Guide',
    food: 'Food & Local Delicacies',
    festivals: 'Festivals & Culture',
    living: 'Living & Lifestyle',
  }

  const titlePrefix = titleMap[category] || validCategory
  
  return {
    title: `${titlePrefix} | Marinduque Guide`,
    description: `Read the latest articles about ${titlePrefix.toLowerCase()} in Marinduque.`,
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  
  const validCategory = CATEGORIES.find(c => c.toLowerCase() === category)
  if (!validCategory) {
    notFound()
  }

  const activeCategory = category
  const allPosts = getAllPosts()
  const posts = allPosts.filter((post) => postMatchesCategory(post, activeCategory))

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-5 md:px-6 max-w-[1120px] mx-auto w-full">

        {/* Header */}
        <header className="mb-10 pt-8">
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-[#1b1c1c] mb-3 capitalize">
            {validCategory} in Marinduque
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
                <Link href={cat === 'All' ? '/blog' : `/blog/category/${cat.toLowerCase()}`}>
                  {cat}
                </Link>
              </Button>
            )
          })}
        </div>

        {/* Results count */}
        <p className="text-[#3e494a] text-sm mb-8">
          {posts.length} article{posts.length !== 1 ? 's' : ''} in {validCategory}
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
        )}
      </main>
      <Footer />
    </>
  )
}
