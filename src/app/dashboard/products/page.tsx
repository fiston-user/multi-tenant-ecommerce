'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/components/providers/trpc-provider';

export default function ProductsPage() {
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productInventory, setProductInventory] = useState('');

  const { data: myShop } = api.shop.getMyShop.useQuery();
  
  const createProductMutation = api.product.create.useMutation({
    onSuccess: () => {
      setIsCreateProductOpen(false);
      resetForm();
      // Refetch shop data to update product list
    },
    onError: (error) => {
      console.error('Failed to create product:', error.message);
    },
  });

  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductInventory('');
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProductMutation.mutateAsync({
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        inventory: parseInt(productInventory),
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  if (!myShop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Shop Found</h2>
          <p className="text-gray-600 mb-4">You need to create a shop first before managing products.</p>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
                ← Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            </div>
            <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
              <DialogTrigger asChild>
                <Button>Add Product</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Create a new product for your store.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Describe your product"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product-price">Price ($)</Label>
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="product-inventory">Inventory</Label>
                      <Input
                        id="product-inventory"
                        type="number"
                        min="0"
                        value={productInventory}
                        onChange={(e) => setProductInventory(e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateProductOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createProductMutation.isPending}
                    >
                      {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                    </Button>
                  </div>
                </form>
                
                {createProductMutation.error && (
                  <p className="text-sm text-red-600 mt-2">
                    {createProductMutation.error.message}
                  </p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {myShop.products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Start building your catalog by adding your first product.
                  </p>
                  <Button onClick={() => setIsCreateProductOpen(true)}>
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myShop.products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="w-full h-48 bg-gray-100 rounded-md mb-4"></div>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Draft"}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {product.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold">${product.price.toString()}</span>
                        <span className="text-sm text-gray-600">
                          {product.inventory} in stock
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.location.href = `/dashboard/products/${product.id}`}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            // For production, use actual subdomain
                            if (window.location.hostname === 'rname.ink') {
                              window.open(`https://${myShop?.subdomain}.rname.ink`, '_blank');
                            } else {
                              // For development, use /shop/[subdomain] route
                              window.open(`/shop/${myShop?.subdomain}`, '_blank');
                            }
                          }}
                        >
                          View Shop
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myShop.products
                .filter(product => product.isActive)
                .map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="w-full h-48 bg-gray-100 rounded-md mb-4"></div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold">${product.price.toString()}</span>
                        <span className="text-sm text-gray-600">
                          {product.inventory} in stock
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.location.href = `/dashboard/products/${product.id}`}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            // For production, use actual subdomain
                            if (window.location.hostname === 'rname.ink') {
                              window.open(`https://${myShop?.subdomain}.rname.ink`, '_blank');
                            } else {
                              // For development, use /shop/[subdomain] route
                              window.open(`/shop/${myShop?.subdomain}`, '_blank');
                            }
                          }}
                        >
                          View Shop
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="draft">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myShop.products
                .filter(product => !product.isActive)
                .map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="w-full h-48 bg-gray-100 rounded-md mb-4"></div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold">${product.price.toString()}</span>
                        <span className="text-sm text-gray-600">
                          {product.inventory} in stock
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.location.href = `/dashboard/products/${product.id}`}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.location.href = `/dashboard/products/${product.id}`}
                        >
                          Edit & Publish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}