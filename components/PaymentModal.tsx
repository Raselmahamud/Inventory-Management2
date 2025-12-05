import React, { useState, useEffect } from 'react';
import { X, DollarSign, User, Calendar, CreditCard, FileText, CheckCircle } from 'lucide-react';
import { PayrollRecord } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recordId: string, paymentDetails: any) => void;
  record: PayrollRecord | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, record }) => {
  const [method, setMethod] = useState('Bank Transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMethod('Bank Transfer');
      setReference('');
      setNotes('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      onConfirm(record.id, { method, reference, notes });
      onClose();
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="text-indigo-600" size={24} /> Process Payment
            </h2>
            <p className="text-sm text-gray-500 mt-1">Review details and confirm transaction.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Summary Card */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/50">
             <div className="flex justify-between items-start mb-4 pb-4 border-b border-indigo-100 dark:border-indigo-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                        {record.staffName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{record.staffName}</h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-300">{record.role}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment For</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1 justify-end">
                        <Calendar size={12} /> {record.month}
                    </p>
                </div>
             </div>

             <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Base Salary</span>
                    <span>${record.baseSalary.toLocaleString()}</span>
                </div>
                {record.bonus > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Bonus / Overtime</span>
                        <span>+${record.bonus.toLocaleString()}</span>
                    </div>
                )}
                {record.deductions > 0 && (
                    <div className="flex justify-between text-red-500 dark:text-red-400">
                        <span>Deductions (Tax/Leave)</span>
                        <span>-${record.deductions.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-indigo-200 dark:border-indigo-800/50 mt-2 text-lg">
                    <span>Net Payable</span>
                    <span>${record.netPay.toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Payment Method</label>
                <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                >
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                    <option>Wise / PayPal</option>
                </select>
             </div>

             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Transaction Reference ID (Optional)</label>
                <input 
                    type="text" 
                    placeholder="e.g. TXN-8829102"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>

             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea 
                    rows={2}
                    placeholder="Any internal notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
                ></textarea>
             </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit"
                disabled={isProcessing}
                className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <CheckCircle size={18} /> Confirm Payment
                    </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;