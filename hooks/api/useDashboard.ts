import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/cms/dashboard');
      return data.data; // Expecting { totalPartners, totalRevenue, etc... }
    },
  });
}
