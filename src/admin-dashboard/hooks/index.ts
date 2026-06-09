// Custom Hooks for API Calls and State Management
import { useState, useCallback, useEffect } from 'react';
import { ApiResponse } from '../types';

/**
 * Generic fetch hook
 */
export const useFetch = <T,>(
  fetchFn: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export const useMutation = <T,>(mutationFn: (payload: any) => Promise<ApiResponse<T>>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(
    async (payload: any) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await mutationFn(payload);
        if (response.success && response.data) {
          setData(response.data);
          setSuccess(true);
          return response.data;
        } else {
          const errorMsg = response.error || 'An error occurred';
          setError(errorMsg);
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setSuccess(false);
  }, []);

  return { data, loading, error, success, mutate, reset };
};

/**
 * Hook for paginated data
 */
export const usePagination = <T,>(
  fetchFn: (page: number, pageSize: number, filters?: any) => Promise<ApiResponse<any>>,
  pageSize: number = 10
) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});

  const fetch = useCallback(async (p: number = 1, f?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn(p, pageSize, f);
      if (response.success && response.data) {
        setItems(response.data.data || []);
        setTotal(response.data.total || 0);
        setPage(p);
        setFilters(f || {});
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [pageSize, fetchFn]);

  useEffect(() => {
    fetch(page, filters);
  }, []);

  const goToPage = (p: number) => fetch(p, filters);
  const applyFilters = (f: any) => fetch(1, f);

  return {
    items,
    page,
    total,
    pageSize,
    loading,
    error,
    totalPages: Math.ceil(total / pageSize),
    goToPage,
    applyFilters,
    refetch: () => fetch(page, filters),
  };
};

/**
 * Hook for local storage
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};

/**
 * Hook for session storage
 */
export const useSessionStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};

/**
 * Hook for previous value
 */
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = React.useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * Hook for toggle state
 */
export const useToggle = (initialState: boolean = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((s) => !s), []);
  return [state, toggle] as const;
};

// Import React for usePrevious
import React from 'react';
