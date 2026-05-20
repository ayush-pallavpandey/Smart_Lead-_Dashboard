import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import axios from 'axios';

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { token, user } = res.data.data!;
      login(token, user);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">SL</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Start managing your leads</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" required value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
            <Input label="Email" type="email" required value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
            <Input label="Password" type="password" required value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" />
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              options={[
                { value: 'sales', label: 'Sales User' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
