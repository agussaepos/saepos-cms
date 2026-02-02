import { useAuthStore } from "@/store/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DataTableParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  storeId?: number;
}

export interface DataTableResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

function buildQueryString(params?: DataTableParams): string {
  if (!params) return '';
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);
  if (params.search) query.append('search', params.search);
  if (params.storeId) query.append('storeId', params.storeId.toString());
  const str = query.toString();
  return str ? `?${str}` : '';
}

// --- Custom Fetcher with Interceptor ---

const originalFetch = global.fetch;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, user, setAuth, logout } = useAuthStore.getState();
  if (!refreshToken || !user) return null;

  try {
    const res = await originalFetch(`${API_BASE_URL}/api/v1/cms/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, refreshToken }),
    });

    if (!res.ok) throw new Error('Refresh failed');
    
    const json = await res.json();
    const newTokens = json.data; 

    setAuth({
      user,
      token: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });

    return newTokens.accessToken;
  } catch (error) {
    logout();
    return null;
  }
}

const customFetch = async (url: string, options: RequestInit = {}) => {
  let res = await originalFetch(url, options);

  if (res.status === 401) {
    // Attempt refresh
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry with new token
      const newHeaders = new Headers(options.headers);
      newHeaders.set('Authorization', `Bearer ${newToken}`);
      
      res = await originalFetch(url, { ...options, headers: newHeaders });
    }
  }
  return res;
};

// --- API Methods ---

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return (await res.json()).data;
  },

  // Admin endpoints
  getDashboard: async (token: string) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return (await res.json()).data;
  },

  getPartners: async (token: string, params?: DataTableParams) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/users/partners${buildQueryString(params)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch partners');
    return (await res.json()).data;
  },

  getStores: async (token: string, params?: DataTableParams) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/stores${buildQueryString(params)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch stores');
    return (await res.json()).data;
  },

  getEmployees: async (token: string) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/users/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch employees');
    return (await res.json()).data;
  },

  getAdmins: async (token: string) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/users/admins`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch admins');
    return (await res.json()).data;
  },

  logout: async (token: string, userId?: number) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/auth/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to logout');
    return (await res.json()).data;
  },

  // Partners (Owners) CRUD
  createPartner: async (
    token: string,
    data: { email: string; name: string; phone?: string; password: string },
  ) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/users/owners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create partner');
    return (await res.json()).data;
  },

  updatePartner: async (
    token: string,
    id: number,
    data: { name?: string; email?: string; phone?: string },
  ) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update partner');
    return (await res.json()).data;
  },

  getPartner: async (token: string, id: number) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/users/partners/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch partner');
    return (await res.json()).data;
  },

  getPartnerStores: async (token: string, partnerId: number) => {
    const res = await customFetch(
      `${API_BASE_URL}/api/v1/cms/users/partners/${partnerId}/stores`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!res.ok) throw new Error('Failed to fetch partner stores');
    return (await res.json()).data;
  },

  deletePartner: async (token: string, id: number) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete partner');
    return (await res.json()).data;
  },

  getProducts: async (token: string, params?: DataTableParams) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/products${buildQueryString(params)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return (await res.json()).data;
  },

  getCategories: async (token: string, params?: DataTableParams) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/categories${buildQueryString(params)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return (await res.json()).data;
  },

  getTransactions: async (token: string, params?: DataTableParams) => {
    const res = await customFetch(`${API_BASE_URL}/api/v1/cms/transactions${buildQueryString(params)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return (await res.json()).data;
  },
};
