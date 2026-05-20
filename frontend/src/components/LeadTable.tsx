import { Lead } from '../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable = ({ leads, onView, onEdit, onDelete }: LeadTableProps) => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{lead.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
              <td className="px-4 py-3">
                <Badge type="status" value={lead.status} />
              </td>
              <td className="px-4 py-3">
                <Badge type="source" value={lead.source} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(lead)}>View</Button>
                  <Button variant="secondary" size="sm" onClick={() => onEdit(lead)}>Edit</Button>
                  {user?.role === 'admin' && (
                    <Button variant="danger" size="sm" onClick={() => onDelete(lead)}>Del</Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
