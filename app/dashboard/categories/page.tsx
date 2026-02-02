"use client";

import { useCategories } from "@/hooks/api/useCategories";
import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";

interface Category {
  id: number;
  name: string;
  createdAt: string;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { data, isLoading } = useCategories({
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

  const columns: DataTableColumn<Category>[] = [
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: "Products",
      cell: (row) => row._count?.products || 0,
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      sortable: true,
      cell: (row) => new Date(row.createdAt).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Categories</h1>
        <p className="text-zinc-500 mt-1">
          Product categories across the platform
        </p>
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
        searchPlaceholder="Search categories..."
        isLoading={isLoading}
        emptyMessage="No categories found"
      />
    </div>
  );
}
