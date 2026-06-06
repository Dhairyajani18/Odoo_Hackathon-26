import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { FileCode, Calendar, Users, List, Plus, X, Upload, Send, AlertTriangle } from 'lucide-react';

const RFQs = () => {
  const { currentUser, rfqs, vendors, addRFQ, addQuotation } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState(null);

  // New RFQ Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [deadline, setDeadline] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);
  
  // Line items state
  const [items, setItems] = useState([{ name: '', qty: 1 }]);
  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState('');

  // Bid form state (for Vendor submitting quotation)
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [notes, setNotes] = useState('');
  const [bidError, setBidError] = useState('');

  const handleAddItem = () => {
    setItems([...items, { name: '', qty: 1 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updated);
  };

  const handleToggleVendor = (vendorId) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  const handleCreateRFQ = (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !deadline || selectedVendors.length === 0) {
      setError('Ensure title, description, deadline, and invitees are populated.');
      return;
    }

    if (items.some(item => !item.name || item.qty <= 0)) {
      setError('All specification items require a name and valid quantity.');
      return;
    }

    addRFQ({
      title,
      description,
      category,
      deadline,
      invitedVendors: selectedVendors,
      items: items.map(i => ({ name: i.name, qty: Number(i.qty) })),
      quantity: items.reduce((sum, i) => sum + Number(i.qty), 0),
      unit: "items"
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setDeadline('');
    setCategory('Hardware');
    setSelectedVendors([]);
    setItems([{ name: '', qty: 1 }]);
    setAttachment(null);
    setShowCreateModal(false);
  };

  const handleOpenBidModal = (rfq) => {
    setSelectedRFQ(rfq);
    setPricePerUnit('');
    setDeliveryDays('');
    setNotes('');
    setBidError('');
    setShowBidModal(true);
  };

  const handleSendQuotation = (e) => {
    e.preventDefault();
    setBidError('');

    if (!pricePerUnit || !deliveryDays) {
      setBidError('Populate unit price and delivery duration.');
      return;
    }

    const price = Number(pricePerUnit);
    const days = Number(deliveryDays);

    if (price <= 0 || days <= 0) {
      setBidError('Numeric rates must be greater than zero.');
      return;
    }

    addQuotation({
      rfqId: selectedRFQ.id,
      vendorId: currentUser.vendorId,
      vendorName: currentUser.name,
      pricePerUnit: price,
      totalPrice: price * selectedRFQ.items.reduce((sum, i) => sum + i.qty, 0),
      deliveryDays: days,
      notes
    });

    setShowBidModal(false);
  };

  // Filter RFQs for display based on role
  const displayData = currentUser?.role === 'Vendor'
    ? rfqs.filter(r => r.invitedVendors.includes(currentUser.vendorId))
    : rfqs;

  const categoryVendors = vendors.filter(v => v.category === category && v.status === 'Active');

  const columns = [
    {
      label: "RFQ ID",
      key: "id",
      render: (row) => <span className="font-mono text-violet-700 font-semibold">{row.id}</span>
    },
    {
      label: "Target Specifications",
      key: "title",
      render: (row) => (
        <div className="max-w-md">
          <p className="font-semibold text-slate-800">{row.title}</p>
          <p className="text-xs text-slate-450 truncate mt-0.5">{row.description}</p>
        </div>
      )
    },
    {
      label: "Invited Nodes",
      key: "invitedVendors",
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
          <Users size={12} className="text-slate-400" />
          <span className="font-mono">{row.invitedVendors.length} vendors</span>
        </div>
      )
    },
    {
      label: "Response Target",
      key: "deadline",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <Calendar size={12} className="text-slate-400" />
          <span className="font-mono">{row.deadline}</span>
        </div>
      )
    },
    {
      label: "Status Code",
      key: "status",
      render: (row) => {
        let color = 'bg-blue-500 text-blue-700 bg-opacity-10 border border-blue-200/50';
        if (row.status === 'Bids Received') color = 'bg-purple-500 text-purple-700 bg-opacity-10 border border-purple-200/50';
        if (row.status === 'Under Review') color = 'bg-violet-500 text-violet-700 bg-opacity-10 border border-violet-200/50';
        if (row.status === 'Completed') color = 'bg-emerald-50 text-emerald-700 bg-opacity-10 border border-emerald-200/50';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${color}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      label: "Actions",
      key: "actions",
      render: (row) => {
        if (currentUser?.role === 'Vendor' && row.status === 'Published') {
          return (
            <button
              onClick={() => handleOpenBidModal(row)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1 rounded text-xs font-semibold hover:shadow-sm transition-all cursor-pointer"
            >
              Submit Bid
            </button>
          );
        }
        return <span className="text-xs font-mono text-slate-400">View Detail</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-slate-800">RFQs</h2>
          <p className="text-xs text-slate-400">Create specifications and manage quotation requests.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayData}
        searchKey="title"
        searchPlaceholder="Search active RFQs..."
        itemsPerPage={5}
        actions={
          currentUser?.role !== 'Vendor' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-xs py-2 font-semibold"
            >
              <Plus size={14} /> New RFQ
            </button>
          )
        }
      />

      {/* CREATE RFQ MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-150 bg-slate-50/30">
              <div>
                <h3 className="text-sm font-semibold text-slate-850">Create RFQ</h3>
                <p className="text-[9px] text-slate-400">Initiate procurement workflow</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs">
                  {error}
                </div>
              )}

              {/* Title & Desc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">RFQ Title</label>
                  <input
                    type="text"
                    className="input-field w-full bg-white"
                    placeholder="Sourcing High-Performance Servers"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input-field w-full bg-white"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSelectedVendors([]);
                    }}
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Raw Materials">Raw Materials</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input-field w-full h-16 resize-none text-xs bg-white"
                  placeholder="Operational requirements details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Items Section */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/20 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <span className="label flex items-center gap-1 mb-0"><List size={12} /> Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[10px] text-violet-600 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Plus size={10} /> Add Item
                  </button>
                </div>
                
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input-field flex-1 text-xs py-1.5 bg-white"
                      placeholder="Item name / specs model"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-field w-20 text-xs py-1.5 font-mono text-center bg-white"
                      placeholder="Qty"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Vendors & Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deadline */}
                <div>
                  <label className="label">Bidding Deadline</label>
                  <input
                    type="date"
                    className="input-field w-full font-mono text-xs bg-white"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                {/* File Upload mock */}
                <div>
                  <label className="label">Attachments</label>
                  <div className="border border-dashed border-slate-200 bg-slate-50/40 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:border-violet-600/40 transition-colors">
                    <Upload size={16} className="text-slate-400" />
                    <span className="text-[9px] text-slate-500 mt-1 font-semibold">Drag and drop files</span>
                  </div>
                </div>
              </div>

              {/* Vendor checkbox selectors */}
              <div>
                <label className="label">Target Vendors ({category})</label>
                {categoryVendors.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto pr-1">
                    {categoryVendors.map((vendor) => (
                      <label
                        key={vendor.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer font-semibold ${
                          selectedVendors.includes(vendor.id)
                            ? 'border-violet-500/40 bg-violet-50/20 text-violet-700'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedVendors.includes(vendor.id)}
                          onChange={() => handleToggleVendor(vendor.id)}
                          className="sr-only"
                        />
                        <span className="truncate">{vendor.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border border-violet-250/20 bg-violet-50/10 text-violet-700/80 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle size={14} /> No active suppliers found in this category.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50/30 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary py-2 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateRFQ}
                className="btn-primary py-2 text-xs font-semibold"
              >
                Publish RFQ <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR PROPOSAL SUBMIT MODAL */}
      {showBidModal && selectedRFQ && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-150 bg-slate-50/30">
              <div>
                <h3 className="text-sm font-semibold text-slate-850">Submit Quotation</h3>
                <p className="text-[9px] text-slate-400">Bidding on: {selectedRFQ.id}</p>
              </div>
              <button onClick={() => setShowBidModal(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendQuotation} className="p-6 space-y-4">
              {bidError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs">
                  {bidError}
                </div>
              )}

              {/* Static Specs details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-slate-700 uppercase">{selectedRFQ.title}</p>
                <div className="text-[10px] text-slate-500 space-y-0.5 mt-1">
                  {selectedRFQ.items.map((item, idx) => (
                    <p key={idx}>• {item.name} (QTY: {item.qty})</p>
                  ))}
                </div>
              </div>

              {/* Price unit & delivery */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Price Per Unit ($)</label>
                  <input
                    type="number"
                    className="input-field w-full font-mono text-xs bg-white"
                    placeholder="25000"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Delivery Timeline (Days)</label>
                  <input
                    type="number"
                    className="input-field w-full font-mono text-xs bg-white"
                    placeholder="10"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="label">Notes</label>
                <textarea
                  className="input-field w-full h-20 resize-none text-xs bg-white"
                  placeholder="Specify warranty coverage, shipping methods, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="btn-secondary py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 text-xs font-semibold"
                >
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQs;
