// useApi.ts
import { useState, useEffect } from 'react';
import { refreshToken } from './api';

const useApi = (apiFunction: () => Promise<any>) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiFunction();
      setData(response.data);
    } catch (error: any) {
      if (error.response.status === 401) {
        try {
          await refreshToken();
          // Fetch data again with the new token
          const response = await apiFunction();
          setData(response.data);
        } catch (error: any) {
          setError(error);
        }
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, error, loading };
};

export default useApi;