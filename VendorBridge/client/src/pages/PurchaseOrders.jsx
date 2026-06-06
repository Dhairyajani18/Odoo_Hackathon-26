import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { FileCheck, Printer, Calendar, DollarSign, X } from 'lucide-react';

const PurchaseOrders = () => {
  const { purchaseOrders, currentUser } = useApp();
  const [selectedPO, setSelectedPO] = useState(null);

  // Filter POs based on role
  const displayData = currentUser?.role === 'Vendor'
    ? purchaseOrders.filter(po => po.vendorId === currentUser.vendorId)
    : purchaseOrders;

  const handleOpenDetail = (po) => {
    setSelectedPO(po);
  };

  const columns = [
    {
      label: "PO Number",
      key: "id",
      render: (row) => <span className="font-mono text-violet-700 font-semibold">{row.id}</span>
    },
    {
      label: "RFQ Reference",
      key: "rfqId",
      render: (row) => <span className="font-mono text-slate-405 text-xs">{row.rfqId}</span>
    },
    {
      label: "Supplier Name",
      key: "vendorName",
      render: (row) => <span className="font-semibold text-slate-800">{row.vendorName}</span>
    },
    {
      label: "Net Capital ($)",
      key: "total",
      render: (row) => <span className="font-mono font-bold text-emerald-600">${row.total.toLocaleString()}</span>
    },
    {
      label: "Release Date",
      key: "createdAt",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <Calendar size={12} className="text-slate-400" />
          <span className="font-mono">{row.createdAt}</span>
        </div>
      )
    },
    {
      label: "Delivery Status",
      key: "status",
      render: (row) => {
        let badgeColor = 'bg-blue-50 text-blue-750 border border-blue-200/50';
        if (row.status === 'Completed') badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
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
          View Document
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Purchase Orders</h2>
        <p className="text-xs text-slate-400">Monitor purchase orders and track delivery progress.</p>
      </div>

      <DataTable
        columns={columns}
        data={displayData}
        searchKey="id"
        searchPlaceholder="Search PO number..."
        itemsPerPage={5}
      />

      {/* PO DETAIL DOCUMENT MODAL */}
      {selectedPO && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            {/* Modal Controls */}
            <div className="flex justify-between items-center p-5 border-b border-slate-150 bg-slate-50/30">
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <FileCheck size={16} className="text-violet-600" /> Purchase Order Document
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-550 hover:text-slate-700 cursor-pointer"
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedPO(null)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-550 hover:text-slate-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-750 font-sans space-y-8" id="po-print-area">
              {/* Document Header Logo & Title */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <h3 className="font-bold text-lg tracking-wider text-violet-700 font-mono uppercase">VendorBridge</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-semibold">Procurement Management</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">101 Innovation Blvd, CA</p>
                </div>
                <div className="text-right">
                  <h4 className="text-xl font-bold font-mono text-slate-800 uppercase tracking-wide">Purchase Order</h4>
                  <p className="text-sm text-violet-700 font-mono font-bold mt-1">{selectedPO.id}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-semibold">DATE: {selectedPO.createdAt}</p>
                </div>
              </div>

              {/* Bil/Ship Info */}
              <div className="grid grid-cols-2 gap-6 text-xs leading-relaxed">
                <div>
                  <span className="label text-[9px] text-slate-400 font-bold border-b border-slate-100 pb-1 mb-2 block">Bill & Ship To:</span>
                  <p className="font-semibold text-slate-800">Sarah Connor (Procurement Org)</p>
                  <p className="text-slate-550 mt-1">VendorBridge Tech HQ</p>
                  <p className="text-slate-550">Sunnyvale, Silicon Valley, CA</p>
                </div>
                <div>
                  <span className="label text-[9px] text-slate-400 font-bold border-b border-slate-100 pb-1 mb-2 block">Supplier Info:</span>
                  <p className="font-semibold text-slate-800">{selectedPO.vendorName}</p>
                  <p className="text-slate-550 mt-1">Contractor ID: {selectedPO.vendorId}</p>
                  <p className="text-slate-550">Corporate Registered Head Office</p>
                </div>
              </div>

              {/* Item details */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase">
                      <th className="p-3">Item Name</th>
                      <th className="p-3 text-center">QTY</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-mono">
                    {selectedPO.items.map((item, idx) => (
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
                <div className="w-64 space-y-1.5 border-t border-slate-200 pt-3 text-right">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">SUBTOTAL:</span>
                    <span className="text-slate-700">${selectedPO.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-semibold">GST TAX (18%):</span>
                    <span className="text-slate-700">${selectedPO.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                    <span className="text-violet-700 font-bold">TOTAL:</span>
                    <span className="text-emerald-600 font-bold">${selectedPO.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Trackers */}
              <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/40">
                <span className="label text-[9px] mb-3">Order Delivery Status</span>
                
                <div className="flex justify-between items-center relative mt-4">
                  {/* Progress Line bar */}
                  <div className="absolute left-0 right-0 h-0.5 bg-slate-200 z-0"></div>
                  
                  {/* Status Steps */}
                  {['Sent', 'Accepted', 'Shipped', 'Delivered'].map((step, idx) => {
                    const isPassed = ['Sent', 'Accepted', 'Shipped', 'Delivered', 'Completed'].indexOf(selectedPO.status) >= idx;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center z-10 relative">
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center font-mono text-[9px] font-bold ${
                            isPassed 
                              ? 'bg-violet-600 border-violet-600 text-white shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          {isPassed ? "✓" : idx + 1}
                        </div>
                        <span className={`text-[9px] font-mono mt-1.5 ${isPassed ? 'text-violet-750 font-bold' : 'text-slate-400 font-semibold'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50/30 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPO(null)}
                className="btn-secondary py-2 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
