'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/components/providers/trpc-provider';

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productInventory, setProductInventory] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { data: product, isLoading } = api.product.getById.useQuery(
    { id: params.id }
  );

  const updateProductMutation = api.product.update.useMutation({
    onSuccess: () => {
      router.push('/dashboard/products');
    },
    onError: (error) => {
      console.error('Failed to update product:', error.message);
    },
  });

  const deleteProductMutation = api.product.delete.useMutation({
    onSuccess: () => {
      router.push('/dashboard/products');
    },
    onError: (error) => {
      console.error('Failed to delete product:', error.message);
    },
  });

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductDescription(product.description || '');
      setProductPrice(product.price.toString());
      setProductInventory(product.inventory.toString());
      setIsActive(product.isActive);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProductMutation.mutateAsync({
        id: params.id,
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        inventory: parseInt(productInventory),
        isActive,
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProductMutation.mutateAsync({ id: params.id });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => router.push('/dashboard/products')}>
            Back to Products
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
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard/products')}
              >
                ← Back to Products
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? 'Deleting...' : 'Delete Product'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Update your product details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is-active"
                      checked={isActive}
                      onCheckedChange={(checked) => setIsActive(!!checked)}
                    />
                    <Label htmlFor="is-active">Product is active and visible to customers</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product"
                    rows={8}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/products')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateProductMutation.isPending}
                >
                  {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
            
            {updateProductMutation.error && (
              <p className="text-sm text-red-600 mt-2">
                {updateProductMutation.error.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}