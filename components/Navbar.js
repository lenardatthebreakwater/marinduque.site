import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    return (
        <nav className="bg-[#fcf9f8]/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm shadow-[#006067]/5">
            <div className="flex justify-between items-center px-6 py-4 max-w-[1120px] mx-auto">
                <Link href="/" className="font-display text-xl font-bold text-[#006067]">
                    Marinduque Guide
                </Link>
                <div className="hidden md:flex gap-8 items-center">
                    {['/', '/blog', '/about'].map((href, i) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-[#3e494a] hover:text-[#8e3f00] transition-all duration-300 text-sm font-semibold tracking-wide"
                        >
                            {['Home', 'Blog', 'About'][i]}
                        </Link>
                    ))}
                </div>
                <Button
                    className="bg-[#b35305] hover:bg-[#8e3f00] text-white text-sm font-semibold tracking-wide rounded-lg"
                >
                    Subscribe
                </Button>
            </div>
        </nav>
    )
}