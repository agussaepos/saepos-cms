"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Store as StoreIcon,
  Package,
  Grid,
  Receipt,
} from "lucide-react";
import { useState } from "react";

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const partnerId = parseInt(params.id as string);
  const storeId = parseInt(params.storeId as string);
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "transactions"
  >("overview");

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cms/stores/${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch store");
      return (await res.json()).data;
    },
    enabled: !!token,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["store-products", storeId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cms/products?storeId=${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return (await res.json()).data;
    },
    enabled: !!token && activeTab === "products",
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["store-categories", storeId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cms/categories?storeId=${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return (await res.json()).data;
    },
    enabled: !!token && activeTab === "categories",
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["store-transactions", storeId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cms/transactions?storeId=${storeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return (await res.json()).data;
    },
    enabled: !!token && activeTab === "transactions",
  });

  if (storeLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/partners/${partnerId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Partner
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">{store?.name}</h1>
            <p className="text-zinc-500 mt-1">BU Code: {store?.buCode}</p>
          </div>
        </div>
        <Button>Edit Store</Button>
      </div>

      <div className="border-b border-zinc-200">
        <div className="flex gap-6">
          {["overview", "products", "categories", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 px-1 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Store Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <StoreIcon className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Store Name</p>
                    <p className="font-medium">{store?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Total Products</p>
                    <p className="font-medium">
                      {store?._count?.products || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Grid className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Categories</p>
                    <p className="font-medium">
                      {store?._count?.categories || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Receipt className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Total Transactions</p>
                    <p className="font-medium">
                      {store?._count?.transactions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Store Products</h2>
            <Button>Add Product</Button>
          </div>
          {productsLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.items?.length > 0 ? (
                      products.items.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.sku}
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category?.name || "-"}</TableCell>
                          <TableCell>
                            Rp {product.price?.toLocaleString()}
                          </TableCell>
                          <TableCell>{product.stock || 0}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-zinc-500 py-8"
                        >
                          No products found for this store
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Product Categories</h2>
            <Button>Add Category</Button>
          </div>
          {categoriesLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.items?.length > 0 ? (
                      categories.items.map((category: any) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell>{category.description || "-"}</TableCell>
                          <TableCell>
                            {category._count?.products || 0}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-zinc-500 py-8"
                        >
                          No categories found for this store
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Store Transactions</h2>
          {transactionsLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.items?.length > 0 ? (
                      transactions.items.map((tx: any) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium">
                            {tx.receiptNumber}
                          </TableCell>
                          <TableCell>
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{tx.items?.length || 0} items</TableCell>
                          <TableCell>Rp {tx.total?.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                tx.status === "COMPLETED"
                                  ? "bg-green-100 text-green-700"
                                  : tx.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {tx.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-zinc-500 py-8"
                        >
                          No transactions found for this store
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
