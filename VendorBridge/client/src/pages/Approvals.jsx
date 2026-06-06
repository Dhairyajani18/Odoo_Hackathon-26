import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldAlert, CheckCircle2, XCircle, ArrowRightLeft, DollarSign, Clock, MessageSquare, AlertCircle } from 'lucide-react';

const Approvals = () => {
  const { rfqs, quotations, vendors, approveQuotation, rejectQuotation, currentUser } = useApp();
  const [selectedRFQId, setSelectedRFQId] = useState(() => {
    // Select first RFQ with bids received if available
    const active = rfqs.find(r => r.status === 'Bids Received' || r.status === 'Under Review');
    return active ? active.id : (rfqs[0]?.id || '');
  });
  const [remarks, setRemarks] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'approve'|'reject', quoteId }

  const activeRFQs = rfqs.filter(r => r.status === 'Bids Received' || r.status === 'Under Review' || r.status === 'Published');
  const currentRFQ = rfqs.find(r => r.id === selectedRFQId);
  const currentQuotes = quotations.filter(q => q.rfq_id === selectedRFQId);

  // Find lowest price and fastest delivery to highlight them
  const lowestPrice = currentQuotes.length > 0 
    ? Math.min(...currentQuotes.map(q => q.total_price)) 
    : 0;

  const fastestDelivery = currentQuotes.length > 0 
    ? Math.min(...currentQuotes.map(q => q.delivery_days)) 
    : 0;

  const handleActionClick = (type, quoteId) => {
    setConfirmModal({ type, quoteId });
  };

  const handleConfirmAction = () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'approve') {
      approveQuotation(confirmModal.quoteId, remarks);
    } else {
      rejectQuotation(confirmModal.quoteId, remarks);
    }

    setRemarks('');
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          Approvals
        </h2>
        <p className="text-xs text-slate-400">Review and approve vendor quotations.</p>
      </div>

      {/* Selector and RFQ Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Selector */}
        <div className="card p-5 space-y-4">
          <label className="label">Select RFQ</label>
          <select
            value={selectedRFQId}
            onChange={(e) => setSelectedRFQId(e.target.value)}
            className="input-field w-full font-mono text-xs bg-white"
          >
            {rfqs.map(rfq => (
              <option key={rfq.id} value={rfq.id}>
                {rfq.id} - {rfq.title.substring(0, 30)}...
              </option>
            ))}
          </select>

          {currentRFQ && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">RFQ Title</span>
                <p className="font-semibold text-slate-700">{currentRFQ.title}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Category</span>
                <p className="text-violet-700 font-semibold">{currentRFQ.category}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Line Items</span>
                <ul className="text-[10px] text-slate-500 mt-1 space-y-1">
                  {currentRFQ.items.map((it, idx) => (
                    <li key={idx}>• {it.name} (QTY: {it.qty})</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-[10px]">
                <span className="text-slate-450 font-semibold">STATUS:</span>
                <span className="text-violet-700 font-bold">{currentRFQ.status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Comparison grid / Side-by-side */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2.5 uppercase">
            <ArrowRightLeft size={16} className="text-violet-600" /> Bid Comparison
          </h3>

          {currentQuotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentQuotes.map((quote) => {
                const isLowest = quote.total_price === lowestPrice;
                const isFastest = quote.delivery_days === fastestDelivery;
                const vendorObj = vendors.find(v => v.id === quote.vendor_id);
                
                return (
                  <div
                    key={quote.id}
                    className={`card p-5 relative overflow-hidden ${
                      isLowest 
                        ? 'border-emerald-500 bg-emerald-50/5' 
                        : ''
                    }`}
                  >
                    {/* Highlight tag for lowest price */}
                    {isLowest && (
                      <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-mono font-bold px-2 py-0.5 uppercase rounded-bl">
                        Lowest Bid
                      </span>
                    )}

                    {/* Header */}
                    <div className="border-b border-slate-100 pb-3 mb-3.5">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{quote.vendor_name}</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-mono font-bold">
                        <span>{quote.id}</span>
                        {vendorObj && (
                          <div className="flex items-center gap-0.5 text-emerald-500">
                            <ShieldCheck size={10} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats Matrix */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <span className="text-[9px] text-slate-400 font-semibold block">Total Bid Price</span>
                        <span className={`text-sm font-bold flex items-center gap-0.5 mt-0.5 ${isLowest ? 'text-emerald-600' : 'text-slate-700'}`}>
                          <DollarSign size={14} /> {quote.total_price.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <span className="text-[9px] text-slate-400 font-semibold block">Delivery SLA</span>
                        <span className={`text-sm font-bold flex items-center gap-1 mt-0.5 ${isFastest ? 'text-indigo-600' : 'text-slate-700'}`}>
                          <Clock size={14} /> {quote.delivery_days} Days
                        </span>
                      </div>
                    </div>

                    {/* Remarks/Notes */}
                    <div className="text-[11px] text-slate-650 bg-slate-50/50 p-2.5 rounded border border-slate-200 mb-5 leading-normal max-h-16 overflow-y-auto">
                      <span className="text-[9px] text-slate-400 block font-mono font-bold">NOTE:</span>
                      {quote.notes || "No proposal notes attached."}
                    </div>

                    {/* Actions if still under review and user has auth */}
                    {quote.status === 'Submitted' || quote.status === 'Under Review' ? (
                      currentUser?.role === 'Manager / Approver' || currentUser?.role === 'Admin' ? (
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <button
                            onClick={() => handleActionClick('reject', quote.id)}
                            className="bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-600 rounded py-2 cursor-pointer transition-colors font-semibold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleActionClick('approve', quote.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded py-2 cursor-pointer shadow-sm transition-all"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <div className="text-center p-2 border border-slate-200 bg-slate-50 rounded text-[10px] text-slate-400 font-mono font-semibold uppercase">
                          Awaiting Manager Decision
                        </div>
                      )
                    ) : (
                      <div className="flex justify-center border border-slate-200 bg-slate-50/50 p-2.5 rounded">
                        <span
                          className={`text-xs font-mono font-bold uppercase tracking-wider ${
                            quote.status === 'Approved' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {quote.status}
                        </span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
              <ShieldAlert className="mx-auto text-slate-350" size={32} />
              <p className="text-sm font-mono text-slate-500 font-bold uppercase">No Bids Yet</p>
              <p className="text-xs text-slate-450">Waiting for vendor bids. Comparison will unlock when bids are received.</p>
            </div>
          )}
        </div>

      </div>

      {/* CONFIRMATION ACTION MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-150 bg-slate-50/30">
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <AlertCircle size={16} className={confirmModal.type === 'approve' ? 'text-emerald-600' : 'text-rose-600'} />
                Confirm Action
              </span>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Confirm updating Quotation <span className="font-mono text-violet-700 font-semibold">{confirmModal.quoteId}</span> to state{' '}
                <span className={`font-mono font-bold uppercase ${confirmModal.type === 'approve' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {confirmModal.type === 'approve' ? 'APPROVED' : 'REJECTED'}
                </span>
                . This action will generate subsequent documents.
              </p>

              <div>
                <label className="label">Remarks (Optional)</label>
                <div className="relative mt-1">
                  <span className="absolute top-3 left-3 text-slate-400">
                    <MessageSquare size={14} />
                  </span>
                  <textarea
                    className="input-field w-full pl-9 h-20 resize-none text-xs bg-white"
                    placeholder="Enter review notes..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 text-xs font-bold rounded cursor-pointer ${
                    confirmModal.type === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
