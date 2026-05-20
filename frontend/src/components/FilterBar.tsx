import { LeadFilters } from '../types';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

interface FilterBarProps {
  filters: LeadFilters;
  onChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
}

export const FilterBar = ({ filters, onChange, onReset }: FilterBarProps) => {
  const hasActive =
    filters.status !== '' || filters.source !== '' || filters.search !== '' || filters.sort !== 'latest';

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </div>
      <Select
        value={filters.status}
        onChange={(e) => onChange('status', e.target.value as LeadFilters['status'])}
        options={[
          { value: '', label: 'All Statuses' },
          { value: 'New', label: 'New' },
          { value: 'Contacted', label: 'Contacted' },
          { value: 'Qualified', label: 'Qualified' },
          { value: 'Lost', label: 'Lost' },
        ]}
      />
      <Select
        value={filters.source}
        onChange={(e) => onChange('source', e.target.value as LeadFilters['source'])}
        options={[
          { value: '', label: 'All Sources' },
          { value: 'Website', label: 'Website' },
          { value: 'Instagram', label: 'Instagram' },
          { value: 'Referral', label: 'Referral' },
        ]}
      />
      <Select
        value={filters.sort}
        onChange={(e) => onChange('sort', e.target.value as LeadFilters['sort'])}
        options={[
          { value: 'latest', label: 'Latest First' },
          { value: 'oldest', label: 'Oldest First' },
        ]}
      />
      {hasActive && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear
        </Button>
      )}
    </div>
  );
};
