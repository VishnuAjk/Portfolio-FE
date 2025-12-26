import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { portfolioService } from '../services/portfolioService.js';
import { SECTION_KEYS, defaultPortfolioShape } from '../utils/sectionConfig.js';
import { useRealtimeSync } from '../hooks/useRealtimeSync.js';

const PortfolioContext = createContext(null);

const getInitialState = () => JSON.parse(JSON.stringify(defaultPortfolioShape));

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(getInitialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await portfolioService.fetchPortfolio();
      const base = getInitialState();
      const merged = Object.keys(base).reduce((acc, key) => {
        const incoming = data?.[key] ?? {};
        acc[key] = { ...base[key], ...incoming };
        return acc;
      }, {});
      setPortfolio(merged);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const handleRealtimeUpdate = useCallback((payload) => {
    setPortfolio((prev) => ({ ...prev, ...payload }));
  }, []);

  useRealtimeSync({
    onPortfolioUpdate: handleRealtimeUpdate,
  });

  const updateSection = useCallback(async (sectionKey, payload) => {
    if (!Object.values(SECTION_KEYS).includes(sectionKey)) {
      throw new Error(`Unknown section: ${sectionKey}`);
    }

    const nextData = await portfolioService.updateSection(sectionKey, payload);
    let mergedResult = null;
    setPortfolio((prev) => {
      const current = prev[sectionKey] ?? {};
      const merged =
        typeof nextData === 'object' && nextData !== null
          ? { ...current, ...payload, ...nextData }
          : { ...current, ...payload };
      mergedResult = merged;
      return { ...prev, [sectionKey]: merged };
    });
    return mergedResult ?? payload;
  }, []);

  const value = useMemo(
    () => ({ portfolio, loading, error, reload: loadPortfolio, updateSection }),
    [portfolio, loading, error, loadPortfolio, updateSection],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

PortfolioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext must be used inside PortfolioProvider');
  }
  return context;
};
