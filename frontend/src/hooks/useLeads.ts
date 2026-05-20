import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '../api/leads';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { useDebounce } from './useDebounce';

const DEFAULT_FILTERS: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
};

export const useLeads = () => {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 350);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadsApi.getAll({ ...filters, search: debouncedSearch });
      setLeads(res.data.data ?? []);
      setPagination(res.data.pagination ?? null);
    } catch {
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const updateFilter = <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : prev.page }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return { leads, pagination, loading, error, filters, updateFilter, resetFilters, refetch: fetchLeads };
};
