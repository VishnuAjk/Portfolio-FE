import { useMemo } from 'react';
import { usePortfolioContext } from '../contexts/PortfolioContext.jsx';

export const usePortfolioData = () => {
  const context = usePortfolioContext();

  return useMemo(
    () => ({
      data: context.portfolio,
      loading: context.loading,
      error: context.error,
      reload: context.reload,
      updateSection: context.updateSection,
    }),
    [context],
  );
};
