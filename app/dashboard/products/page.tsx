"use client";

import { useProducts } from "@/hooks/api/useProducts";
import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
  store?: {
    name: string;
    buCode: string;
  };
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { data, isLoading } = useProducts({
    page,
    limit: 10,
    search,
    sortBy,
    sortOrder,
  });

  const updateParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateParams({ search: query, page: "1" });
      }, 500);
    },
    [updateParams],
  );

  const columns: DataTableColumn<Product>[] = [
    {
      header: "SKU",
      accessorKey: "sku",
      sortable: true,
      cell: (row) => <span className="font-mono text-sm">{row.sku}</span>,
    },
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: "Category",
      cell: (row) => row.category?.name || "-",
    },
    {
      header: "Store",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.store?.name || "-"}</div>
          <div className="text-xs text-zinc-500">
            {row.store?.buCode || "-"}
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      sortable: true,
      cell: (row) => (
        <span className="font-medium">
          Rp {row.price?.toLocaleString("id-ID") || 0}
        </span>
      ),
    },
    {
      header: "Stock",
      accessorKey: "stock",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Products</h1>
        <p className="text-zinc-500 mt-1">All products across the platform</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        pagination={data?.meta}
        onPageChange={(newPage) => updateParams({ page: newPage.toString() })}
        onSort={(column, order) =>
          updateParams({ sortBy: column, sortOrder: order, page: "1" })
        }
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearch={handleSearch}
        searchValue={search}
        searchPlaceholder="Search products..."
        isLoading={isLoading}
        emptyMessage="No products found"
      />
    </div>
  );
}
