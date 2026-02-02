"use client";

import { useStores } from "@/hooks/api/useStores";
import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

interface Store {
  id: number;
  buCode: string;
  name: string;
  status: string;
  createdAt: string;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    userAssignments: number;
    products: number;
  };
}

export default function StoresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  // Fetch stores
  const { data, isLoading } = useStores({
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

  const columns: DataTableColumn<Store>[] = [
    {
      header: "Store Code",
      accessorKey: "buCode",
      sortable: true,
      cell: (row) => <span className="font-mono">{row.buCode}</span>,
    },
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: "Owner",
      cell: (row) => row.owner?.name || "-",
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Employees",
      cell: (row) => row._count?.userAssignments || 0,
    },
    {
      header: "Products",
      cell: (row) => row._count?.products || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Stores</h1>
        <p className="text-zinc-500 mt-1">All stores across the platform</p>
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
        searchPlaceholder="Search stores..."
        isLoading={isLoading}
        emptyMessage="No stores found"
      />
    </div>
  );
}
