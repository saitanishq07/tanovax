import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from '../components/common/BrandLogo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Lock, Mail, Loader2, AlertCircle, Info } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@tanovax.com');
  const [password, setPassword] = useState('adminpassword');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email.trim(), password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <BrandLogo size="lg" />
          <h1 className="text-2xl font-bold text-slate-100 pt-4">Admin Authentication</h1>
          <p className="text-slate-400 text-xs">
            Sign in to access the TanovaX management dashboard
          </p>
        </div>

        <Card hoverEffect={false} className="p-8 border-brand-500/30">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm outline-none"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm outline-none"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              disabled={loading}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            >
              {loading ? 'Authenticating...' : 'Log In to Admin Dashboard'}
            </Button>
          </form>

          {/* Quick Demo Credentials Info Callout */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-start gap-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Demo Login Access:</span> Email: <code className="text-brand-300">admin@tanovax.com</code> | Password: <code className="text-brand-300">adminpassword</code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
