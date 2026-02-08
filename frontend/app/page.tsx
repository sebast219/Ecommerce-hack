import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { Categories } from '@/components/categories'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedProducts />
      <Categories />
    </main>
  )
}
