import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { DataTableParams } from '@/lib/api';

export function useStores(params?: DataTableParams) {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/stores', { params });
      return data.data;
    },
  });
}

export function usePartnerStores(partnerId: number) {
  return useQuery({
    queryKey: ['partner-stores', partnerId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/cms/users/partners/${partnerId}/stores`);
      return data.data; // This endpoint returns a direct array, not paginated items structure
    },
    enabled: !!partnerId,
  });
}
