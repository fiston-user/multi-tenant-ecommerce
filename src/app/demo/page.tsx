import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DemoPage() {
  const demoProducts = [
    {
      id: 1,
      name: "Premium Coffee Beans",
      description: "Ethically sourced, freshly roasted coffee beans from around the world.",
      price: 24.99,
      inventory: 50,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "Organic Tea Collection",
      description: "A curated selection of organic teas for every taste preference.",
      price: 18.99,
      inventory: 25,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "Ceramic Coffee Mug",
      description: "Beautiful handcrafted ceramic mug perfect for your morning coffee.",
      price: 12.99,
      inventory: 100,
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                StoreBuilder
              </Link>
              <Badge variant="outline">DEMO</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Store Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Demo Coffee Shop</h1>
            <p className="text-xl mb-6">This is what your store could look like</p>
            <p className="text-lg opacity-90">
              URL: <span className="font-mono">coffeeshop.storebuilder.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Demo Store Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-lg text-gray-600">
            Browse our collection of premium coffee and tea products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-brown-100 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  <Badge variant="default">
                    {product.inventory} in stock
                  </Badge>
                </div>
                <Button className="w-full" size="lg">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Showcase */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Everything You Need is Included
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3"></div>
              <h4 className="font-semibold mb-2">Product Management</h4>
              <p className="text-sm text-gray-600">Easy-to-use dashboard for managing inventory</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3"></div>
              <h4 className="font-semibold mb-2">Order Processing</h4>
              <p className="text-sm text-gray-600">Streamlined order management system</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3"></div>
              <h4 className="font-semibold mb-2">Custom Branding</h4>
              <p className="text-sm text-gray-600">Your own subdomain and custom styling</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3"></div>
              <h4 className="font-semibold mb-2">Analytics</h4>
              <p className="text-sm text-gray-600">Track sales and customer behavior</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Build Your Own Store?</h3>
          <p className="text-lg mb-6 opacity-90">
            Create a professional online store in minutes, not months.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="px-8">
                Start Building Now
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}