import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string; // Ensure backend returns this!
}

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: any) => {
      const { data } = await axiosInstance.post<any>('/cms/auth/login', credentials);
      // The API returns standard response structure { data: { ... }, meta: ... }
      return data.data as LoginResponse;
    },
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken,
      });
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout, token, user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (token && user?.id) {
        await axiosInstance.post('/cms/auth/logout', { userId: user.id });
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      router.push('/');
    },
  });
}
