import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
    return (
        <footer className="w-full mt-24 bg-[#e8dfc5]">
            <Separator className="bg-[#bdc9ca]" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-8 max-w-[1120px] mx-auto">
                <div className="font-display text-lg font-bold text-[#68634d]">
                    Marinduque Guide
                </div>
                <p className="text-[#68634d] text-sm text-center">
                    © {new Date().getFullYear()} Marinduque Guide. Your knowledgeable local friend.
                </p>
                <div className="flex gap-6">
                    {['Facebook', 'Instagram', 'Twitter', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="text-[#68634d]/80 hover:text-[#b35305] text-sm font-semibold transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    )
}