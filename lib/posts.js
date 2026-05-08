import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Get all posts sorted by date (newest first)
export function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const filePath = path.join(CONTENT_DIR, filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)

    return {
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      slug: data.slug || filename.replace('.mdx', ''),
      type: data.type || 'longtail',
      keywords: data.keywords || [],
      canonical: data.canonical || '',
    }
  })

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Get a single post by slug (returns frontmatter + raw content)
export function getPostBySlug(slug) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    slug: data.slug || slug,
    type: data.type || 'longtail',
    keywords: data.keywords || [],
    canonical: data.canonical || '',
    content, // raw MDX string for next-mdx-remote
  }
}

// Get all slugs (for generateStaticParams)
export function getAllSlugs() {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}
