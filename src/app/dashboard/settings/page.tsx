'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { api } from '@/components/providers/trpc-provider';

export default function ShopSettingsPage() {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  const { data: myShop, isLoading, refetch } = api.shop.getMyShop.useQuery();

  const updateShopMutation = api.shop.update.useMutation({
    onSuccess: () => {
      refetch();
      alert('Shop settings updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update shop:', error.message);
      alert('Failed to update shop settings. Please try again.');
    },
  });

  useEffect(() => {
    if (myShop) {
      setShopName(myShop.name);
      setDescription(myShop.description || '');
      setCustomDomain(myShop.customDomain || '');
    }
  }, [myShop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!myShop) return;

    try {
      await updateShopMutation.mutateAsync({
        name: shopName,
        description: description || undefined,
        customDomain: customDomain || undefined,
      });
    } catch (error) {
      console.error('Error updating shop:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading shop settings...</div>
      </div>
    );
  }

  if (!myShop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Shop Found</h2>
          <p className="text-gray-600 mb-4">You need to create a shop first.</p>
          <Button onClick={() => router.push('/dashboard')}>
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
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your shop&apos;s basic details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input
                    id="shop-name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="My Awesome Store"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is the name that appears on your storefront
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell customers about your store"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    A brief description of what you sell
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateShopMutation.isPending}
                  >
                    {updateShopMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Domain Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>Manage your shop&apos;s web address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Current Subdomain</Label>
                <div className="mt-1">
                  <Input
                    value={`${myShop.subdomain}.storebuilder.com`}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Your subdomain cannot be changed after creation
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
                <Input
                  id="custom-domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="www.yourstore.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Connect your own domain name. You'll need to update your DNS settings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shop Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Shop Statistics</CardTitle>
              <CardDescription>Overview of your shop&apos;s performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{myShop._count.products}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{myShop._count.orders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {myShop.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-gray-600">Shop Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for your shop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard/products')}
                >
                  Manage Products
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // For production, use actual subdomain
                    if (window.location.hostname === 'rname.ink') {
                      window.open(`https://${myShop.subdomain}.rname.ink`, '_blank');
                    } else {
                      // For development, use /shop/[subdomain] route
                      window.open(`/shop/${myShop.subdomain}`, '_blank');
                    }
                  }}
                >
                  View Storefront
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}