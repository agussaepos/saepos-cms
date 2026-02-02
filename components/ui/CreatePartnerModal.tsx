"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Modal } from "./modal";

interface CreatePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePartnerModal({
  isOpen,
  onClose,
}: CreatePartnerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => api.createPartner(token!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      onClose();
      setFormData({ name: "", email: "", phone: "", password: "" });
    },
  });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Partner"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Partner name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone (Optional)
          </label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+62..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6 justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => createMutation.mutate()}
          disabled={
            createMutation.isPending ||
            !formData.name ||
            !formData.email ||
            !formData.password
          }
        >
          {createMutation.isPending ? "Creating..." : "Create Partner"}
        </Button>
      </div>
    </Modal>
  );
}
