import api from './axios';
import { ApiResponse, Lead, LeadFilters } from '../types';

export interface CreateLeadDto {
  name: string;
  email: string;
  status?: string;
  source: string;
}

export const leadsApi = {
  getAll: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page) params.set('page', String(filters.page));
    params.set('limit', '10');
    return api.get<ApiResponse<Lead[]>>(`/leads?${params}`);
  },

  getOne: (id: string) => api.get<ApiResponse<Lead>>(`/leads/${id}`),

  create: (data: CreateLeadDto) => api.post<ApiResponse<Lead>>('/leads', data),

  update: (id: string, data: Partial<CreateLeadDto>) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/leads/${id}`),

  exportCSV: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    return api.get(`/leads/export/csv?${params}`, { responseType: 'blob' });
  },
};
