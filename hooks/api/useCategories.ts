import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { DataTableParams } from '@/lib/api';

export function useCategories(params?: DataTableParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/categories', { params });
      return data.data;
    },
  });
}
