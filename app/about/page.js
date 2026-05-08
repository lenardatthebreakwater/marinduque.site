import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About | Marinduque Guide',
  description: 'Learn about Marinduque Guide — your knowledgeable local friend for everything about Marinduque, the Heart of the Philippines.',
}

const topics = ['Tourism', 'Beaches', 'Festivals', 'Food', 'Living', 'Travel Tips']

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1120px] mx-auto px-5 md:px-6 pt-32 pb-24">

        {/* Header */}
        <header className="max-w-2xl mx-auto text-center mb-16 pt-8">
          <Badge className="bg-[#006067]/10 text-[#006067] border-0 text-xs uppercase tracking-widest mb-4">
            About
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-[#1b1c1c] mb-6 leading-tight">
            Your Knowledgeable Local Friend
          </h1>
          <p className="text-[#3e494a] text-lg leading-relaxed">
            Marinduque Guide is a content site dedicated to the Heart of the Philippines — Marinduque, a small island province with big stories, pristine beaches, and deeply rooted traditions.
          </p>
        </header>

        {/* Hero placeholder */}
        <div className="w-full h-[280px] rounded-xl overflow-hidden mb-16 ambient-shadow">
          <div className="w-full h-full tropical-gradient" />
        </div>

        {/* About content */}
        <div className="max-w-2xl mx-auto space-y-12">

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#1b1c1c] mb-4">What is Marinduque Guide?</h2>
            <p className="text-[#3e494a] text-lg leading-relaxed">
              Marinduque Guide is a travel and lifestyle blog covering everything you need to know about Marinduque — from its stunning beaches and hidden coves to its world-famous Moriones Festival and local delicacies. Whether you're planning a visit or you're a local looking for things to explore, this is your go-to resource.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#1b1c1c] mb-4">What we cover</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  className="bg-[#e8dfc5] text-[#68634d] border-0 text-sm px-3 py-1"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <p className="text-[#3e494a] text-lg leading-relaxed">
              From practical travel tips like ferry schedules and where to stay, to cultural deep-dives into the Moriones festival and local cuisine — we cover it all.
            </p>
          </section>

          <Card className="bg-[#e8dfc5] border-0 border-l-4 border-l-[#006067] rounded-xl">
            <CardContent className="p-8">
              <p className="font-display text-xl text-[#68634d] italic leading-relaxed">
                "Marinduque isn't just a destination; it's a slow, deliberate breath of fresh air. It's where the heart rate slows down to match the gentle rhythm of the tides."
              </p>
            </CardContent>
          </Card>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[#1b1c1c] mb-4">About Marinduque</h2>
            <p className="text-[#3e494a] text-lg leading-relaxed">
              Marinduque is a heart-shaped island province located in the MIMAROPA region of the Philippines. Known as the Heart of the Philippines, it is famous for its Moriones Festival during Holy Week, the pristine Tres Reyes Islands, Bathala Caves, Poctoy White Beach, and its warm, welcoming people. Despite being one of the smallest provinces in the country, Marinduque offers an authentic Philippine island experience far from the tourist crowds.
            </p>
          </section>

        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <h2 className="font-display text-2xl font-semibold text-[#1b1c1c] mb-4">
            Ready to explore?
          </h2>
          <p className="text-[#3e494a] mb-8">
            Browse our latest articles about Marinduque.
          </p>
          <Button asChild className="bg-[#006067] hover:bg-[#004f54] text-white font-semibold tracking-wide rounded-lg px-8">
            <Link href="/blog">Read the Blog</Link>
          </Button>
        </div>

      </main>
      <Footer />
    </>
  )
}