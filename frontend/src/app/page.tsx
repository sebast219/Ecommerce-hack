'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/layout/hero';
import { FeaturedProducts } from '@/components/product/featured-products';
import { Categories } from '@/components/product/categories';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-12">
      <Hero />
      <Categories />
      <FeaturedProducts />
    </div>
  );
}
