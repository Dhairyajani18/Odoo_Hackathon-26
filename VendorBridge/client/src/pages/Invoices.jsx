import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { Receipt, Calendar, CreditCard, Mail, Printer, X, CheckCircle2 } from 'lucide-react';

const Invoices = () => {
  const { invoices, payInvoice, currentUser } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  // Filter based on role
  const displayData = currentUser?.role === 'Vendor'
    ? invoices.filter(i => i.vendorId === currentUser.vendorId)
    : invoices;

  const handleOpenDetail = (inv) => {
    setSelectedInvoice(inv);
    setEmailSent(false);
  };

  const handlePay = (id) => {
    payInvoice(id);
    // Refresh selected invoice view
    setSelectedInvoice(prev => prev && prev.id === id ? { ...prev, status: 'Paid' } : prev);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const columns = [
    {
      label: "Invoice ID",
      key: "id",
      render: (row) => <span className="font-mono text-violet-700 font-semibold">{row.id}</span>
    },
    {
      label: "PO Reference",
      key: "poId",
      render: (row) => <span className="font-mono text-slate-405 text-xs">{row.poId}</span>
    },
    {
      label: "Supplier Billed By",
      key: "vendorName",
      render: (row) => <span className="font-semibold text-slate-800">{row.vendorName}</span>
    },
    {
      label: "Due Date",
      key: "dueDate",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-semibold">
          <Calendar size={12} className="text-slate-400" />
          <span>{row.dueDate}</span>
        </div>
      )
    },
    {
      label: "Amount Owed ($)",
      key: "total",
      render: (row) => <span className="font-mono font-bold text-emerald-600">${row.total.toLocaleString()}</span>
    },
    {
      label: "Status",
      key: "status",
      render: (row) => {
        let badgeColor = 'bg-rose-50 text-rose-600 border border-rose-200/50';
        if (row.status === 'Paid') badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${badgeColor}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      label: "Document",
      key: "actions",
      render: (row) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="text-violet-600 hover:text-violet-750 font-mono text-xs font-bold hover:underline cursor-pointer"
        >
          View Invoice
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Invoices</h2>
        <p className="text-xs text-slate-400">Manage billing records and process payments.</p>
      </div>

      <DataTable
        columns={columns}
        data={displayData}
        searchKey="id"
        searchPlaceholder="Search invoice ID..."
        itemsPerPage={5}
      />

      {/* INVOICE DETAILS MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            
            {/* Header controls */}
            <div className="flex justify-between items-center p-5 border-b border-slate-150 bg-slate-50/30">
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Receipt size={16} className="text-violet-600" /> Invoice Details
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSendEmail}
                  title="Mock email PDF"
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-550 hover:text-slate-700 cursor-pointer relative"
                >
                  <Mail size={16} />
                  {emailSent && (
                    <span className="absolute bottom-full mb-1 right-0 bg-emerald-600 text-white text-[8px] font-mono font-bold px-1 py-0.5 rounded shadow-sm whitespace-nowrap">
                      Sent!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-550 hover:text-slate-700 cursor-pointer"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-550 hover:text-slate-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-750 font-sans space-y-6" id="invoice-print-area">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-bold text-base text-violet-700 font-mono uppercase">{selectedInvoice.vendorName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-semibold">Supplier ID: {selectedInvoice.vendorId}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-lg font-bold font-mono text-slate-800 uppercase tracking-wide">Invoice</h4>
                  <p className="text-sm text-violet-700 font-mono font-bold mt-0.5">{selectedInvoice.id}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-semibold">PO: {selectedInvoice.poId}</p>
                </div>
              </div>

              {/* Bil/Ship Info */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-450 uppercase block font-semibold">Billing Organization:</span>
                  <p className="font-semibold text-slate-800 mt-1">VendorBridge Tech HQ</p>
                  <p className="text-slate-550">101 Innovation Blvd, CA</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-450 uppercase block font-semibold">Payment Schedule:</span>
                  <p className="text-slate-800 mt-1">Due Date: <span className="text-violet-700 font-semibold">{selectedInvoice.dueDate}</span></p>
                  <p className="text-slate-500 font-semibold">Status: <span className={`font-bold ${selectedInvoice.status === 'Paid' ? 'text-emerald-650' : 'text-rose-600'}`}>{selectedInvoice.status}</span></p>
                </div>
              </div>

              {/* Item details */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase">
                      <th className="p-3">Item Name</th>
                      <th className="p-3 text-center">QTY</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-mono">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="text-slate-700">
                        <td className="p-3 font-sans">{item.name}</td>
                        <td className="p-3 text-center">{item.qty}</td>
                        <td className="p-3 text-right">${item.price.toLocaleString()}</td>
                        <td className="p-3 text-right">${(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary calculations */}
              <div className="flex justify-end text-xs font-mono">
                <div className="w-64 space-y-1 border-t border-slate-200 pt-2 text-right">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">SUBTOTAL:</span>
                    <span className="text-slate-700">${selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">GST (18%):</span>
                    <span className="text-slate-700">${selectedInvoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm">
                    <span className="text-violet-700 font-bold">GRAND TOTAL:</span>
                    <span className="text-emerald-600 font-bold">${selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50/30 border-t border-slate-200 flex justify-between items-center">
              <div>
                {selectedInvoice.status === 'Paid' && (
                  <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600">
                    <CheckCircle2 size={16} /> Payment Cleared
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="btn-secondary py-2 text-xs"
                >
                  Close
                </button>
                {selectedInvoice.status === 'Unpaid' && (currentUser?.role !== 'Vendor') && (
                  <button
                    onClick={() => handlePay(selectedInvoice.id)}
                    className="btn-primary py-2 text-xs flex items-center gap-1.5 font-semibold"
                  >
                    <CreditCard size={14} /> Authorize Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
