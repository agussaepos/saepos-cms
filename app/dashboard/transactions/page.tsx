"use client";

import { useTransactions } from "@/hooks/api/useTransactions";
import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: number;
  receiptNumber: string;
  total: number;
  status: string;
  createdAt: string;
  store?: {
    name: string;
    buCode: string;
  };
  staff?: {
    name: string;
    email: string;
  };
  payment?: {
    method: string;
  };
}

export default function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL params
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  // Fetch transactions with DataTable params
  const { data, isLoading } = useTransactions({
    page,
    limit: 10,
    search,
    sortBy,
    sortOrder,
  });

  console.log("Transactions Data:", data); // Debugging

  // Update URL params
  const updateParams = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage.toString() });
  };

  const handleSort = (column: string, order: "asc" | "desc") => {
    updateParams({ sortBy: column, sortOrder: order, page: "1" });
  };

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

  // Define table columns
  const columns: DataTableColumn<Transaction>[] = [
    {
      header: "Receipt #",
      accessorKey: "receiptNumber",
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-sm">{row.receiptNumber}</span>
      ),
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
      header: "Cashier",
      cell: (row) => row.staff?.name || "-",
    },
    {
      header: "Total",
      accessorKey: "total",
      sortable: true,
      cell: (row) => (
        <span className="font-medium">
          Rp {row.total?.toLocaleString("id-ID") || 0}
        </span>
      ),
    },
    {
      header: "Payment",
      cell: (row) => (
        <Badge variant="default">{row.payment?.method || "N/A"}</Badge>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => (
        <Badge variant={row.status === "COMPLETED" ? "success" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      sortable: true,
      cell: (row) => new Date(row.createdAt).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Transactions</h1>
        <p className="text-zinc-500 mt-1">
          All transactions across the platform
        </p>
      </div>

      <DataTable
        columns={columns}
        data={Array.isArray(data?.items) ? data.items : []}
        pagination={data?.meta}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearch={handleSearch}
        searchValue={search}
        searchPlaceholder="Search by receipt number..."
        isLoading={isLoading}
        emptyMessage="No transactions found"
      />
    </div>
  );
}
