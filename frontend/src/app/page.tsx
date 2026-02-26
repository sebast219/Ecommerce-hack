'use client';

import { useState, useEffect, useRef } from 'react';
import { Hero } from '@/components/layout/hero';
import { FeaturedProducts } from '@/components/product/featured-products';
import { Categories } from '@/components/product/categories';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});
  
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observers = new Map();
    
    const setupObserver = (ref: React.RefObject<HTMLDivElement>, key: string) => {
      if (!ref.current) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [key]: true }));
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      );
      
      observer.observe(ref.current);
      observers.set(key, observer);
    };
    
    setupObserver(categoriesRef, 'categories');
    setupObserver(productsRef, 'products');
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className="space-y-0">
      <Hero />
      <div 
        ref={categoriesRef}
        className={`transition-all duration-700 ease-in-out ${
          visibleSections.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <Categories />
      </div>
      <div 
        ref={productsRef}
        className={`transition-all duration-700 ease-in-out ${
          visibleSections.products ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <FeaturedProducts />
      </div>
    </div>
  );
}
