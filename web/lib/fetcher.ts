const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Default fetcher for SWR
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

/**
 * Authenticated fetcher - includes access token
 */
export const authFetcher = async <T>(
  url: string,
  accessToken: string | null,
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};

/**
 * API client for mutations (POST, PUT, DELETE)
 */
export const apiClient = {
  async post<T>(url: string, data: unknown, accessToken?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  },

  async put<T>(url: string, data: unknown, accessToken?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  },

  async delete<T>(url: string, accessToken?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  },
};
