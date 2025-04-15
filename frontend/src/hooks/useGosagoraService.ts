import { useEffect, useState } from 'react';

import gosagoraService from '../services/gosagoraService';
import { ApplicationError } from '../errors/applicationError';

const useGosagoraService = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchServiceStatus = async () => {
    setLoading(true);

    try {
      const gosaGoraStatus = await gosagoraService.getHealth();
      setStatus(gosaGoraStatus);
      setError('');
    } catch (e: unknown) {
      setStatus('');
      if (e instanceof ApplicationError) {
        setError(e.message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchServiceStatus();
  }, []);

  return {
    status, loading, error
  };
};

export default useGosagoraService;
