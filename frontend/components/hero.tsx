import { Button } from './ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Cybersecurity Tools
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Advanced penetration testing and network security equipment for professionals and researchers
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              <Link href="/products">
                Shop Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black opacity-10"></div>
    </section>
  )
}
