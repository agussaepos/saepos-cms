import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { DataTableParams } from '@/lib/api';

export function useTransactions(params?: DataTableParams) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/transactions', { params });
      return data.data;
    },
  });
}
