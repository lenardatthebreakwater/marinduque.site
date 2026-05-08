import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllSlugs, getPostBySlug } from '@/lib/posts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Marinduque Guide`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: post.canonical || `https://yoursite.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: post.canonical || `https://yoursite.com/blog/${slug}`,
    },
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function readingTime(content) {
  const words = content.split(/\s+/).length
  return Math.ceil(words / 200)
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main className="max-w-[1120px] mx-auto px-5 md:px-6 pt-32 pb-24">

        {/* Article Header */}
        <header className="max-w-3xl mx-auto text-center mb-12">
          <Badge className="bg-[#006067]/10 text-[#006067] border-0 text-xs uppercase tracking-widest mb-4">
            {post.keywords?.[0] || 'Marinduque'}
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[#1b1c1c] mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-[#3e494a] text-sm">
            Published on {formatDate(post.date)} • {readingTime(post.content)} min read
          </p>
        </header>

        {/* Hero image placeholder */}
        <div className="w-full h-[300px] md:h-[480px] rounded-xl overflow-hidden mb-16 ambient-shadow">
          <div className="w-full h-full tropical-gradient" />
        </div>

        {/* Article Content */}
        <article className="max-w-2xl mx-auto prose prose-lg prose-headings:font-display prose-headings:text-[#1b1c1c] prose-p:text-[#3e494a] prose-p:leading-relaxed prose-a:text-[#006067] prose-strong:text-[#1b1c1c] prose-blockquote:border-l-[#006067] prose-blockquote:bg-[#e8dfc5] prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:pr-4 prose-code:text-[#006067] prose-code:bg-[#f0eded] prose-code:rounded prose-code:px-1">
          <MDXRemote source={post.content} />
        </article>

        {/* Back link */}
        <div className="max-w-2xl mx-auto mt-16">
          <Separator className="mb-8 bg-[#e4e2e1]" />
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="text-[#006067] hover:text-[#8e3f00] font-semibold text-sm p-0 h-auto">
              <Link href="/blog">← Back to Blog</Link>
            </Button>
            <span className="text-[#3e494a] text-sm">Share this article</span>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}