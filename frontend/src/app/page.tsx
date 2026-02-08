import { Hero } from '@/components/layout/hero';
import { FeaturedProducts } from '@/components/product/featured-products';
import { Categories } from '@/components/product/categories';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <Categories />
      <FeaturedProducts />
    </div>
  );
}
