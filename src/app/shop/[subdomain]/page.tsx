"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/components/providers/trpc-provider";

interface ShopPageProps {
  params: {
    subdomain: string;
  };
}

export default function ShopPage({ params }: ShopPageProps) {
  const { subdomain } = params;

  const { data: shop, isLoading: shopLoading } =
    api.shop.getBySubdomain.useQuery({ subdomain }, { enabled: !!subdomain });

  const { data: productsData, isLoading: productsLoading } =
    api.product.getAll.useQuery(
      { tenantId: shop?.id || "", limit: 20 },
      { enabled: !!shop?.id }
    );

  if (shopLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading store...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-gray-600">
            The store &quot;{subdomain}&quot; doesn&apos;t exist or is not
            active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
        <p className="text-muted-foreground">
          {shop.description || "Welcome to our online shop"}
        </p>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Our Products</CardTitle>
            <CardDescription>
              {productsData?.products.length
                ? "Browse our collection of quality products"
                : "We&apos;re building our product catalog. Check back soon!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : productsData?.products.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-600">
                  This store is getting ready to launch. Products will be
                  available soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData?.products.map((product) => (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground">
                          Product Image
                        </span>
                      </div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description || "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold">
                          ${product.price.toString()}
                        </span>
                        <Badge
                          variant={
                            product.inventory > 0 ? "default" : "secondary"
                          }
                        >
                          {product.inventory > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <Button
                        className="w-full"
                        disabled={product.inventory === 0}
                      >
                        {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Store Info */}
      <div className="mt-12 border-t pt-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by StoreBuilder</p>
          <p className="mt-1">Store owner: {shop.owner.name}</p>
        </div>
      </div>
    </div>
  );
}
