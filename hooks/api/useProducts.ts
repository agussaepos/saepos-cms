import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { DataTableParams } from '@/lib/api';

export function useProducts(params?: DataTableParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/products', { params });
      return data.data;
    },
  });
}
