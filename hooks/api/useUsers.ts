import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { DataTableParams } from '@/lib/api'; // We might want to move types later

// --- Types ---
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: { id: number; name: string };
  createdAt: string;
}

// Partner interface removed as it is unused

// --- Hooks ---

export function usePartners(params?: DataTableParams) {
  return useQuery({
    queryKey: ['partners', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/users/partners', { params });
      return data.data;
    },
  });
}

export function usePartner(id: number) {
  return useQuery({
    queryKey: ['partner', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/cms/users/partners/${id}`);
      return data.data; // Single object, keeping as is
    },
    enabled: !!id,
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await axiosInstance.post('/cms/users/owners', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number } & Record<string, unknown>) => {
      const { data } = await axiosInstance.put(`/cms/users/${id}`, payload);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partner', variables.id] });
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/cms/users/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });
}

export function useAdmins() {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/users/admins');
      return data.data;
    },
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/users/employees');
      return data.data;
    },
  });
}
