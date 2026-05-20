import { useState, FormEvent } from 'react';
import { Lead, LeadStatus, LeadSource } from '../types';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

interface LeadFormProps {
  initial?: Lead;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
}

const validate = (data: LeadFormData): Partial<Record<keyof LeadFormData, string>> => {
  const errors: Partial<Record<keyof LeadFormData, string>> = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Invalid email';
  if (!data.source) errors.source = 'Source is required';
  return errors;
};

export const LeadForm = ({ initial, onSubmit, onCancel }: LeadFormProps) => {
  const [form, setForm] = useState<LeadFormData>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    status: initial?.status ?? 'New',
    source: initial?.source ?? 'Website',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="John Doe" />
      <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="john@example.com" />
      <Select
        label="Status"
        value={form.status}
        onChange={(e) => set('status', e.target.value as LeadStatus)}
        options={[
          { value: 'New', label: 'New' },
          { value: 'Contacted', label: 'Contacted' },
          { value: 'Qualified', label: 'Qualified' },
          { value: 'Lost', label: 'Lost' },
        ]}
      />
      <Select
        label="Source"
        value={form.source}
        onChange={(e) => set('source', e.target.value as LeadSource)}
        options={[
          { value: 'Website', label: 'Website' },
          { value: 'Instagram', label: 'Instagram' },
          { value: 'Referral', label: 'Referral' },
        ]}
      />
      {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting} className="flex-1">
          {initial ? 'Update Lead' : 'Create Lead'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
