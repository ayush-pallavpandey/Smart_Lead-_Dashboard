import { ILead } from '../types';

export const leadsToCSV = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    `"${lead.name}"`,
    `"${lead.email}"`,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toISOString(),
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
