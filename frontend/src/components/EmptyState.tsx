import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <div>
      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
    {action && <Button onClick={action.onClick}>{action.label}</Button>}
  </div>
);
