"use client";

import { usePartner } from "@/hooks/api/useUsers";
import { usePartnerStores } from "@/hooks/api/useStores";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Calendar, Store } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = parseInt(params.id as string);
  const [activeTab, setActiveTab] = useState<"overview" | "stores">("overview");

  const { data: partner, isLoading: partnerLoading } = usePartner(partnerId);

  const { data: stores, isLoading: storesLoading } =
    usePartnerStores(partnerId);

  if (partnerLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/partners")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              {partner?.name}
            </h1>
            <p className="text-zinc-500 mt-1">Business Partner Details</p>
          </div>
        </div>
        <Button>Edit Partner</Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("stores")}
            className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === "stores"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Stores
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid gap-6">
          {/* Partner Info Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Partner Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="font-medium">{partner?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Phone</p>
                    <p className="font-medium">{partner?.phone || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Joined Date</p>
                    <p className="font-medium">
                      {partner?.createdAt
                        ? new Date(partner.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Store className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-500">Total Stores</p>
                    <p className="font-medium">
                      {partner?._count?.ownedStores || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "stores" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Partner Stores</h2>
            <Button>Create Store</Button>
          </div>

          {storesLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores?.map((store: any) => (
                <Card
                  key={store.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Link
                    href={`/dashboard/partners/${partnerId}/stores/${store.id}`}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">
                        {store.name}
                      </h3>
                      <div className="space-y-2 text-sm text-zinc-600">
                        <p>BU Code: {store.buCode}</p>
                        <p>Products: {store._count?.products || 0}</p>
                        <p>Transactions: {store._count?.transactions || 0}</p>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
