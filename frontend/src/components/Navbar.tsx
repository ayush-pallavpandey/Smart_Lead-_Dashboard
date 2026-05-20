import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import { Button } from './Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useDarkMode();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">SL</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-lg">Smart Leads</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
