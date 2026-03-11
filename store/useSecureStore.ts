import { useState, useCallback } from 'react';
import {
  saveToSecureStore,
  getFromSecureStore,
  deleteFromSecureStore,
} from '../lib/securestore';

interface UseSecureStoreReturn {
  value: string | null;
  isLoading: boolean;
  error: string | null;
  save: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  delete: (key: string) => Promise<void>;
}

export function useSecureStore(): UseSecureStoreReturn {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async (key: string, val: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await saveToSecureStore(key, val);
      setValue(val);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const get = useCallback(async (key: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFromSecureStore(key);
      setValue(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (key: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteFromSecureStore(key);
      setValue(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { value, isLoading, error, save, get, delete: deleteItem };
}
