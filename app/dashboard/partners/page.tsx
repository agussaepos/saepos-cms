"use client";

import { usePartners } from "@/hooks/api/useUsers";

import { useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import { CreatePartnerModal } from "@/components/ui/CreatePartnerModal";
import Link from "next/link";

interface Partner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  _count?: {
    ownedStores: number;
  };
}

export default function PartnersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // State from URL params
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch partners with DataTable params
  const { data, isLoading } = usePartners({
    page,
    limit: 10,
    search,
    sortBy,
    sortOrder,
  });

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
  const columns: DataTableColumn<Partner>[] = [
    {
      header: "Name",
      accessorKey: "name",
      sortable: true,
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (row) => row.phone || "-",
    },
    {
      header: "Stores",
      cell: (row) => row._count?.ownedStores || 0,
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      sortable: true,
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (row) => (
        <Link href={`/dashboard/partners/${row.id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Partners</h1>
          <p className="text-zinc-500 mt-1">Manage business partner accounts</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create Partner
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        pagination={data?.meta}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearch={handleSearch}
        searchValue={search}
        searchPlaceholder="Search partners..."
        isLoading={isLoading}
        emptyMessage="No partners found"
      />

      <CreatePartnerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
