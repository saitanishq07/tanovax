import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout title="404 - Page Not Found">
      <div className="py-32 max-w-xl mx-auto text-center space-y-6 px-4">
        <div className="text-6xl font-extrabold text-brand-400 font-mono">404</div>
        <h1 className="text-3xl font-bold text-slate-100">Page Not Found</h1>
        <p className="text-slate-400 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <div>
          <Button to="/" variant="primary" icon={<Home className="w-4 h-4" />}>
            Back to Homepage
          </Button>
        </div>
      </div>
    </Layout>
  );
};
