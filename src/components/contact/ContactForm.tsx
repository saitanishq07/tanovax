import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactForm } from '../../firebase/services';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const ContactForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    service: preselectedService || 'Business Website',
    budget: '₹25,000 – ₹50,000',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const serviceOptions = [
    'Business Website',
    'Company Website',
    'Portfolio Website',
    'Real Estate Website',
    'Restaurant / Hotel Website',
    'CRM',
    'Billing',
    'Inventory',
    'Employee Management',
    'Dashboard',
    'Customer Portal',
    'Other'
  ];

  const budgetOptions = [
    'Below ₹10,000',
    '₹10,000 – ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000 – ₹1,00,000',
    '₹1,00,000+',
    'Not sure yet'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const res = await submitContactForm({
        name: formData.name.trim(),
        companyName: formData.companyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        budget: formData.budget,
        message: formData.message.trim()
      });

      if (res.success) {
        setStatus('success');
        setFormData({
          name: '',
          companyName: '',
          email: '',
          phone: '',
          service: 'Business Website',
          budget: '₹25,000 – ₹50,000',
          message: ''
        });
      } else {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hoverEffect={false} className="p-8 border-brand-500/30">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Your Full Name <span className="text-brand-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Apex Enterprises"
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address <span className="text-brand-400">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. rahul@company.com"
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Phone Number <span className="text-brand-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Service Required */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Service Required <span className="text-brand-400">*</span>
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm outline-none transition-all"
            >
              {serviceOptions.map((opt, idx) => (
                <option key={idx} value={opt} className="bg-slate-900 text-slate-200">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Budget Range <span className="text-brand-400">*</span>
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm outline-none transition-all"
            >
              {budgetOptions.map((b, idx) => (
                <option key={idx} value={b} className="bg-slate-900 text-slate-200">
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Project Description <span className="text-brand-400">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your business, the problem you are solving, key features needed, or timeline requirements..."
            className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all resize-none"
          />
        </div>

        {/* Form Feedback Messages */}
        {status === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-start gap-3 text-emerald-200 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Thank you.</span> Your project enquiry has been received. We'll get back to you soon.
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>{errorMessage || 'Something went wrong. Please try again.'}</div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        >
          {loading ? 'Submitting Enquiry...' : 'Send Project Enquiry'}
        </Button>
      </form>
    </Card>
  );
};
