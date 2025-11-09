import { useEffect } from 'react';
import { getSocketClient } from '../services/socketClient.js';

export const useRealtimeSync = ({ onPortfolioUpdate, enabled = true } = {}) => {
  useEffect(() => {
    if (!enabled) return undefined;
    const socket = getSocketClient();
    if (!socket.connected) {
      socket.connect();
    }

    if (onPortfolioUpdate) {
      socket.on('portfolio:update', onPortfolioUpdate);
    }

    return () => {
      if (onPortfolioUpdate) {
        socket.off('portfolio:update', onPortfolioUpdate);
      }
    };
  }, [enabled, onPortfolioUpdate]);
};
