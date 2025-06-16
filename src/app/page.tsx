import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">StoreBuilder</h1>
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Your Online Store in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create a beautiful, fully-functional ecommerce store with your own custom domain. 
            No coding required - just focus on your products and customers.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-3">
                Start Building Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Sell Online
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to create, manage, and grow your online business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Custom Subdomain</CardTitle>
                <CardDescription>
                  Get your own branded subdomain like yourstore.storebuilder.com
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4"></div>
                <p className="text-sm text-gray-600">
                  Professional branding with the option to add your own custom domain later.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Easy-to-use dashboard for managing your products and inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4"></div>
                <p className="text-sm text-gray-600">
                  Add products, manage stock, set prices, and organize with categories.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Processing</CardTitle>
                <CardDescription>
                  Streamlined order management and customer communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4"></div>
                <p className="text-sm text-gray-600">
                  Track orders, manage fulfillment, and keep customers updated.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have built successful online stores with our platform.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="px-8 py-3">
              Create Your Store Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}