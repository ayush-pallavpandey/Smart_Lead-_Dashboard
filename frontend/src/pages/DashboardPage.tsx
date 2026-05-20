import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { leadsApi } from '../api/leads';
import { Lead } from '../types';
import { Navbar } from '../components/Navbar';
import { FilterBar } from '../components/FilterBar';
import { LeadTable } from '../components/LeadTable';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { LeadForm } from '../components/LeadForm';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import axios from 'axios';

export const DashboardPage = () => {
  const { leads, pagination, loading, error, filters, updateFilter, resetFilters, refetch } = useLeads();
  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [actionError, setActionError] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleCreate = async (data: { name: string; email: string; status: string; source: string }) => {
    await leadsApi.create(data);
    setCreateOpen(false);
    void refetch();
  };

  const handleEdit = async (data: { name: string; email: string; status: string; source: string }) => {
    if (!editLead) return;
    await leadsApi.update(editLead._id, data);
    setEditLead(null);
    void refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await leadsApi.delete(deleteTarget._id);
      setDeleteTarget(null);
      void refetch();
    } catch (err) {
      if (axios.isAxiosError(err)) setActionError(err.response?.data?.message ?? 'Delete failed');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await leadsApi.exportCSV(filters);
      const url = URL.createObjectURL(new Blob([res.data as BlobPart]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            {pagination && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {pagination.total} total leads
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleExport} loading={exporting}>
              Export CSV
            </Button>
            <Button onClick={() => setCreateOpen(true)}>+ Add Lead</Button>
          </div>
        </div>

        <FilterBar filters={filters} onChange={updateFilter} onReset={resetFilters} />

        <div className="mt-4">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
              {error}
              <button onClick={refetch} className="ml-2 underline">Retry</button>
            </div>
          ) : leads.length === 0 ? (
            <EmptyState
              title="No leads found"
              description="Try adjusting your filters or add a new lead."
              action={{ label: '+ Add Lead', onClick: () => setCreateOpen(true) }}
            />
          ) : (
            <>
              <LeadTable
                leads={leads}
                onView={setViewLead}
                onEdit={setEditLead}
                onDelete={setDeleteTarget}
              />
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  meta={pagination}
                  onPageChange={(p) => updateFilter('page', p)}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Modal open={createOpen} title="Add New Lead" onClose={() => setCreateOpen(false)}>
        <LeadForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editLead} title="Edit Lead" onClose={() => setEditLead(null)}>
        {editLead && (
          <LeadForm initial={editLead} onSubmit={handleEdit} onCancel={() => setEditLead(null)} />
        )}
      </Modal>

      <Modal open={!!viewLead} title="Lead Details" onClose={() => setViewLead(null)}>
        {viewLead && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewLead.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewLead.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</p>
                <div className="mt-1"><Badge type="status" value={viewLead.status} /></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Source</p>
                <div className="mt-1"><Badge type="source" value={viewLead.source} /></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created By</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{viewLead.createdBy?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created At</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {new Date(viewLead.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setViewLead(null)}>Close</Button>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteTarget} title="Delete Lead" onClose={() => setDeleteTarget(null)}>
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.
          </p>
          {actionError && <p className="text-sm text-red-500">{actionError}</p>}
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
            <Button variant="secondary" onClick={() => { setDeleteTarget(null); setActionError(''); }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
