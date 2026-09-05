import React from 'react';
import { Quotation } from '../../types';
import { formatINR } from '../../firebase/services';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../ui/Button';
import { X, Printer, FileText } from 'lucide-react';

interface QuotationPreviewModalProps {
  quotation: Quotation;
  onClose: () => void;
}

export const QuotationPreviewModal: React.FC<QuotationPreviewModalProps> = ({ quotation, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:w-full print:bg-white print:text-black">
        {/* Modal Toolbar (hidden during print) */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <FileText className="w-5 h-5 text-brand-400" />
            <span>Quotation Preview — {quotation.quotationNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrint}
              variant="primary"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
            >
              Print / Download PDF
            </Button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="quotation-print-area" className="p-8 sm:p-12 overflow-y-auto space-y-8 print:p-0 print:overflow-visible text-slate-100 print:text-slate-900 bg-slate-900 print:bg-white">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800 print:border-slate-300 pb-6">
            <div>
              <BrandLogo size="lg" />
              <p className="text-xs text-brand-400 font-bold tracking-widest mt-1 uppercase">
                WEB • APPS • AUTOMATION
              </p>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                https://tanovax.com | contact@tanovax.com
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 print:text-slate-900">
                QUOTATION / PROPOSAL
              </h2>
              <p className="text-xs font-mono font-bold text-brand-400 print:text-slate-700">
                {quotation.quotationNumber}
              </p>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Date: <strong className="text-slate-200 print:text-slate-800">{quotation.date}</strong>
              </p>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Valid Until: <strong className="text-slate-200 print:text-slate-800">{quotation.validUntil}</strong>
              </p>
              <div className="pt-1">
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-brand-500/20 text-brand-400 print:bg-slate-200 print:text-slate-800 border border-brand-500/30 print:border-slate-300 uppercase">
                  Status: {quotation.status}
                </span>
              </div>
            </div>
          </div>

          {/* Client & Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/50 print:bg-slate-50 p-6 rounded-xl border border-slate-800/80 print:border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 print:text-slate-600 uppercase tracking-wider block mb-1">
                PREPARED FOR (CLIENT)
              </span>
              <h3 className="font-bold text-base text-slate-100 print:text-slate-900">{quotation.clientName}</h3>
              {quotation.companyName && (
                <p className="text-xs font-medium text-slate-300 print:text-slate-700">{quotation.companyName}</p>
              )}
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">{quotation.email}</p>
              <p className="text-xs text-slate-400 print:text-slate-600">{quotation.phone}</p>
              {quotation.clientAddress && (
                <p className="text-xs text-slate-400 print:text-slate-600 mt-1 whitespace-pre-line">{quotation.clientAddress}</p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 print:text-slate-600 uppercase tracking-wider block mb-1">
                PROJECT DETAILS
              </span>
              <h3 className="font-bold text-base text-slate-100 print:text-slate-900">{quotation.projectName}</h3>
              {quotation.projectDescription && (
                <p className="text-xs text-slate-300 print:text-slate-700 mt-1 leading-relaxed">{quotation.projectDescription}</p>
              )}
              <div className="mt-3 pt-2 border-t border-slate-800 print:border-slate-300 text-xs">
                <span className="text-slate-400 print:text-slate-600">Estimated Timeline: </span>
                <strong className="text-slate-200 print:text-slate-800">{quotation.deliveryTimeline}</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 bg-slate-950 print:bg-slate-100 text-slate-400 print:text-slate-700 uppercase font-semibold">
                  <th className="p-3">#</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Discount</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-slate-200 print:text-slate-800">
                {quotation.lineItems.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-medium text-slate-100 print:text-slate-900 whitespace-pre-line">{item.description}</td>
                    <td className="p-3 text-center font-mono">{item.quantity}</td>
                    <td className="p-3 text-right font-mono">{formatINR(item.unitPrice)}</td>
                    <td className="p-3 text-right font-mono text-emerald-400 print:text-emerald-700">
                      {item.discount > 0 ? `-${formatINR(item.discount)}` : '—'}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">{formatINR(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-800 print:border-slate-300">
            <div className="space-y-3 max-w-md text-xs text-slate-400 print:text-slate-600">
              <div>
                <strong className="text-slate-200 print:text-slate-800 uppercase block mb-1">Payment Terms</strong>
                <p className="whitespace-pre-line leading-relaxed">{quotation.paymentTerms}</p>
              </div>

              {quotation.termsAndConditions && (
                <div className="pt-2 border-t border-slate-800/60 print:border-slate-200">
                  <strong className="text-slate-200 print:text-slate-800 uppercase block mb-1">Terms & Conditions</strong>
                  <p className="whitespace-pre-line leading-relaxed text-[11px]">{quotation.termsAndConditions}</p>
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 bg-slate-950 print:bg-slate-100 p-5 rounded-xl border border-slate-800 print:border-slate-300 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200 print:text-slate-800">{formatINR(quotation.subtotal)}</span>
              </div>

              {quotation.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                  <span>Total Discount:</span>
                  <span className="font-mono">-{formatINR(quotation.totalDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>GST / Tax ({quotation.taxRate}%):</span>
                <span className="font-mono text-slate-200 print:text-slate-800">{formatINR(quotation.taxAmount)}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 print:border-slate-300 flex justify-between items-center text-sm font-bold text-brand-400 print:text-slate-900">
                <span>Grand Total:</span>
                <span className="text-lg font-mono">{formatINR(quotation.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Contact Note */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 text-center text-xs text-slate-500 print:text-slate-600 space-y-1">
            <p className="font-semibold text-slate-300 print:text-slate-700">
              TanovaX — Web, Applications & Business Solutions
            </p>
            <p>Thank you for your business. For questions regarding this proposal, please contact us at contact@tanovax.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
