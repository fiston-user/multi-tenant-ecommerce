"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { api } from "@/components/providers/trpc-provider";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCreateShopOpen, setIsCreateShopOpen] = useState(false);
  const [shopName, setShopName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [description, setDescription] = useState("");

  const { data: myShop, isLoading, refetch } = api.shop.getMyShop.useQuery();

  const createShopMutation = api.shop.create.useMutation({
    onSuccess: () => {
      setIsCreateShopOpen(false);
      setShopName("");
      setSubdomain("");
      setDescription("");
      refetch();
    },
    onError: (error) => {
      console.error("Failed to create shop:", error.message);
    },
  });

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createShopMutation.mutateAsync({
        name: shopName,
        subdomain: subdomain.toLowerCase(),
        description,
      });
    } catch (error) {
      console.error("Error creating shop:", error);
    }
  };

  // Redirect to login if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session?.user?.name || session?.user?.email}
              </span>
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/settings")}
              >
                Shop Settings
              </Button>
              <Button
                variant="ghost"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!myShop ? (
          // No shop created yet
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to rname.ink!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              You haven&apos;t created your online store yet. Let&apos;s get
              started by setting up your shop.
            </p>

            <Dialog open={isCreateShopOpen} onOpenChange={setIsCreateShopOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8 py-3">
                  Create Your First Shop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Your Online Shop</DialogTitle>
                  <DialogDescription>
                    Set up your online store with a custom subdomain and start
                    selling.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateShop} className="space-y-4">
                  <div>
                    <Label htmlFor="shop-name">Shop Name</Label>
                    <Input
                      id="shop-name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="My Awesome Store"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subdomain">Subdomain</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="subdomain"
                        value={subdomain}
                        onChange={(e) =>
                          setSubdomain(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "")
                          )
                        }
                        placeholder="mystore"
                        required
                      />
                      <span className="text-sm text-gray-500">.rname.ink</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell customers about your store"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateShopOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createShopMutation.isPending}
                    >
                      {createShopMutation.isPending
                        ? "Creating..."
                        : "Create Shop"}
                    </Button>
                  </div>
                </form>

                {createShopMutation.error && (
                  <p className="text-sm text-red-600 mt-2">
                    {createShopMutation.error.message}
                  </p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          // Shop exists - show dashboard
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {myShop.name}
                </h2>
                <p className="text-gray-600">
                  <a
                    href={`https://${myShop.subdomain}.rname.ink`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {myShop.subdomain}.rname.ink
                  </a>
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    // For production, use actual subdomain
                    if (window.location.hostname === "rname.ink") {
                      window.open(
                        `https://${myShop.subdomain}.rname.ink`,
                        "_blank"
                      );
                    } else {
                      // For development, use /shop/[subdomain] route
                      window.open(`/shop/${myShop.subdomain}`, "_blank");
                    }
                  }}
                >
                  View Store
                </Button>
                <Button
                  onClick={() => (window.location.href = "/dashboard/products")}
                >
                  Manage Products
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {myShop._count.products}
                  </div>
                  <p className="text-sm text-gray-600">Active listings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {myShop._count.orders}
                  </div>
                  <p className="text-sm text-gray-600">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shop Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={myShop.isActive ? "default" : "secondary"}>
                    {myShop.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Your latest product listings</CardDescription>
              </CardHeader>
              <CardContent>
                {myShop.products.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      No products yet. Add your first product to get started!
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() =>
                        (window.location.href = "/dashboard/products")
                      }
                    >
                      Add Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myShop.products.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            ${product.price.toString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                          >
                            {product.isActive ? "Active" : "Draft"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
