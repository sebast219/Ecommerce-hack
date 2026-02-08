'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from './ui/button'
import Link from 'next/link'
import api from '@/lib/api'

interface Category {
  name: string
  count: number
}

const categoryIcons: Record<string, string> = {
  'USB Tools': '🔌',
  'Network Devices': '🌐',
  'Audio Tools': '🎤',
}

export function Categories() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/products/categories')
      return response.data as string[]
    },
  })

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-red-600">Failed to load categories</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect cybersecurity tools for your specific needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <div
              key={category}
              className="bg-white border rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-6xl mb-4">
                {categoryIcons[category] || '🔒'}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category}</h3>
              <p className="text-gray-600 mb-6">
                Professional tools for {category.toLowerCase()}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/products?category=${encodeURIComponent(category)}`}>
                  Browse {category}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
