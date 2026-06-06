import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { Star, ShieldCheck, Mail, Phone, Plus, X, User } from 'lucide-react';

const Vendors = () => {
  const { vendors, addVendor } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);

  // New Vendor Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gst, setGst] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleCreateVendor = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !contactPerson || !email || !phone || !gst) {
      setError('Please populate all mandatory registry nodes.');
      return;
    }

    addVendor({
      name,
      category,
      contactPerson,
      email,
      phone,
      gst,
      address: address || "N/A"
    });

    // Reset Form
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setGst('');
    setAddress('');
    setShowDrawer(false);
  };

  const columns = [
    {
      label: "Vendor Name",
      key: "name",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800">{row.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono font-semibold">
            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{row.category}</span>
            <span>{row.id}</span>
          </div>
        </div>
      )
    },
    {
      label: "Contact Person",
      key: "contactPerson",
      render: (row) => (
        <div>
          <p className="text-slate-700 font-medium">{row.contactPerson}</p>
          <p className="text-xs text-slate-450">{row.email}</p>
        </div>
      )
    },
    {
      label: "GST Registry",
      key: "gst",
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-violet-700 font-semibold">{row.gst}</span>
          <ShieldCheck size={12} className="text-emerald-600" title="Verified GST" />
        </div>
      )
    },
    {
      label: "Score Rating",
      key: "rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-violet-500 text-violet-500" />
          <span className="font-mono font-bold text-slate-700">{row.rating.toFixed(1)}</span>
        </div>
      )
    },
    {
      label: "System Status",
      key: "status",
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            row.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 bg-opacity-10 border border-emerald-200/50'
              : 'bg-violet-500 text-violet-700 bg-opacity-10 border border-violet-200/50'
          }`}
        >
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            Vendors
          </h2>
          <p className="text-xs text-slate-400">Manage vendor registration and performance ratings.</p>
        </div>
      </div>

      {/* Reusable Data Table */}
      <DataTable
        columns={columns}
        data={vendors}
        searchKey="name"
        searchPlaceholder="Search vendor registry..."
        itemsPerPage={5}
        actions={
          <button
            onClick={() => setShowDrawer(true)}
            className="btn-primary text-xs py-2 font-semibold"
          >
            <Plus size={14} /> Add Vendor
          </button>
        }
      />

      {/* Onboarding Drawer Overlay */}
      {showDrawer && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end">
          {/* Drawer Body */}
          <div className="w-full max-w-md bg-white border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto shadow-xl">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Add New Vendor</h3>
                  <p className="text-[10px] text-slate-400">Register new supplier</p>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateVendor} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    placeholder="Cyberdyne Systems"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input-field w-full"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Raw Materials">Raw Materials</option>
                  </select>
                </div>

                {/* Contact Person */}
                <div>
                  <label className="label">Contact Person</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      className="input-field w-full pl-9"
                      placeholder="Dr. Miles Dyson"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        className="input-field w-full pl-9 text-xs"
                        placeholder="sales@cyberdyne.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Phone size={14} />
                      </span>
                      <input
                        type="text"
                        className="input-field w-full pl-9 text-xs"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* GST registry */}
                <div>
                  <label className="label">GSTIN</label>
                  <input
                    type="text"
                    className="input-field w-full font-mono text-violet-700"
                    placeholder="27AAACD1111A1Z1"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="label">Address</label>
                  <textarea
                    className="input-field w-full text-xs h-16 resize-none"
                    placeholder="Sunnyvale, Silicon Valley, CA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {/* Create */}
                <button type="submit" className="btn-primary w-full text-xs py-2.5 font-semibold">
                  Register Vendor
                </button>
              </form>
            </div>
            
            <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-4 mt-6">
              Secure registration
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
