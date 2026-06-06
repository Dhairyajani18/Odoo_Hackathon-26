import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  FileCode,
  CheckSquare,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Activity,
  PlusCircle,
  Users,
  Receipt,
  FileCheck
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser, rfqs, quotations, purchaseOrders, invoices, logs } = useApp();
  const navigate = useNavigate();

  // Helper values
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
  const activeRFQs = rfqs.filter(r => r.status !== 'Completed').length;
  const pendingApprovals = quotations.filter(q => q.status === 'Submitted' || q.status === 'Under Review').length;
  const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid').length;

  // Vendor role custom calculations
  const vendorRFQsCount = rfqs.filter(r => r.invitedVendors.includes(currentUser?.vendorId)).length;
  const vendorQuotesCount = quotations.filter(q => q.vendorId === currentUser?.vendorId).length;
  const vendorPOsCount = purchaseOrders.filter(p => p.vendorId === currentUser?.vendorId).length;
  const vendorInvoicesCount = invoices.filter(i => i.vendorId === currentUser?.vendorId && i.status === 'Unpaid').length;

  const renderKPIs = () => {
    if (currentUser?.role === 'Vendor') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="label text-amber-600">Assigned RFQs</p>
                <p className="text-2xl font-bold mt-1 text-amber-900">{vendorRFQsCount}</p>
              </div>
              <span className="p-3 bg-amber-100 rounded-lg text-amber-600">
                <FileCode size={20} />
              </span>
            </div>
            <div className="mt-3 text-[10px] text-amber-600/80 font-semibold uppercase">RFQ invitations</div>
          </div>

          <div className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="label text-amber-600">Submitted Quotes</p>
                <p className="text-2xl font-bold mt-1 text-amber-900">{vendorQuotesCount}</p>
              </div>
              <span className="p-3 bg-orange-100 rounded-lg text-orange-600">
                <CheckSquare size={20} />
              </span>
            </div>
            <div className="mt-3 text-[10px] text-orange-600/80 font-semibold uppercase">Proposals sent</div>
          </div>

          <div className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="label text-amber-600">Active POs</p>
                <p className="text-2xl font-bold mt-1 text-amber-900">{vendorPOsCount}</p>
              </div>
              <span className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                <FileCheck size={20} />
              </span>
            </div>
            <div className="mt-3 text-[10px] text-emerald-600/80 font-semibold uppercase">Purchase Orders</div>
          </div>

          <div className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="label text-amber-600">Unpaid Invoices</p>
                <p className="text-2xl font-bold mt-1 text-amber-900">{vendorInvoicesCount}</p>
              </div>
              <span className="p-3 bg-teal-100 rounded-lg text-teal-600">
                <Receipt size={20} />
              </span>
            </div>
            <div className="mt-3 text-[10px] text-teal-600/80 font-semibold uppercase">Pending payments</div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="label text-amber-600">Active RFQs</p>
              <p className="text-2xl font-bold mt-1 text-amber-900">{activeRFQs}</p>
            </div>
            <span className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <FileCode size={20} />
            </span>
          </div>
          <div className="mt-3 text-[10px] text-amber-700/70 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} className="text-amber-600" />
            <span className="text-amber-600">12% increase</span> vs last month
          </div>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="label text-amber-600">Pending Approvals</p>
              <p className="text-2xl font-bold mt-1 text-amber-900">{pendingApprovals}</p>
            </div>
            <span className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <CheckSquare size={20} />
            </span>
          </div>
          <div className="mt-3 text-[10px] text-amber-700/70 flex items-center gap-1 font-semibold">
            <AlertCircle size={12} className="text-orange-600" />
            Bids requiring verification
          </div>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="label text-amber-600">Total Spent POs</p>
              <p className="text-xl font-bold mt-1.5 text-amber-900">
                ${totalSpend.toLocaleString()}
              </p>
            </div>
            <span className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <DollarSign size={20} />
            </span>
          </div>
          <div className="mt-3 text-[10px] text-amber-700/70 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} className="text-emerald-600" />
            Within target budget
          </div>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="label text-amber-600">Unpaid Invoices</p>
              <p className="text-2xl font-bold mt-1 text-amber-900">{unpaidInvoices}</p>
            </div>
            <span className="p-3 bg-teal-100 rounded-lg text-teal-600">
              <Receipt size={20} />
            </span>
          </div>
          <div className="mt-3 text-[10px] text-amber-700/70 flex items-center gap-1 font-semibold">
            <AlertCircle size={12} className="text-teal-600" />
            Awaiting clearance
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white border border-violet-200 rounded-xl gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Welcome back, {currentUser?.name}</h2>
          <p className="text-xs text-violet-600 mt-1">
            Role:{' '}
            <span className="text-violet-700 bg-violet-100 px-2 py-0.5 rounded border border-violet-300 font-semibold">
              {currentUser?.role}
            </span>
          </p>
        </div>
        <div className="text-right text-[10px] text-violet-600 font-semibold">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Analytics KPIs Row */}
      {renderKPIs()}

      {/* Charts & Actions split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - SVG Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h3 className="text-xs font-semibold text-slate-800 border-b border-violet-200 pb-2.5 mb-4 flex items-center gap-1.5 uppercase">
              <TrendingUp size={15} className="text-violet-600" /> Spending Overview Trends
            </h3>
            
            {/* SVG line chart */}
            <div className="h-64 flex flex-col justify-between relative pt-2">
              <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 150">
                {/* Clean soft grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#e9d5ff" strokeWidth="1.5" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#e9d5ff" strokeWidth="1.5" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="#e9d5ff" strokeWidth="1.5" />
                
                {/* Professional cool gradient line */}
                <polyline
                  fill="none"
                  stroke="url(#cool-glow-gradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,120 100,105 180,60 260,110 340,40 420,70 500,20"
                />

                {/* Dots on line */}
                <circle cx="20" cy="120" r="4" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="100" cy="105" r="4" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="180" cy="60" r="4" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="260" cy="110" r="4" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="340" cy="40" r="4" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="420" cy="70" r="4" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="500" cy="20" r="4" fill="#7C3AED" stroke="#ffffff" strokeWidth="1.5" />

                {/* Area under polyline */}
                <path
                  d="M20,120 L100,105 L180,60 L260,110 L340,40 L420,70 L500,20 L500,150 L20,150 Z"
                  fill="url(#cool-area-gradient)"
                  opacity="0.06"
                />

                {/* Definitions */}
                <defs>
                  <linearGradient id="cool-glow-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="60%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#5B21B6" />
                  </linearGradient>
                  <linearGradient id="cool-area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              {/* X axis labels */}
              <div className="flex justify-between text-[9px] text-violet-600/70 border-t border-violet-200 pt-2 px-1 font-semibold">
                <span>DEC'25</span>
                <span>JAN'26</span>
                <span>FEB'26</span>
                <span>MAR'26</span>
                <span>APR'26</span>
                <span>MAY'26</span>
                <span>JUN'26</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Audit logs */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="text-xs font-semibold text-slate-800 border-b border-violet-200 pb-2.5 mb-4 uppercase">
              Quick Actions
            </h3>
            
            <div className="flex flex-col gap-2">
              {currentUser?.role !== 'Vendor' ? (
                <>
                  <button
                    onClick={() => navigate('/rfqs')}
                    className="btn-primary text-xs py-2.5 justify-start font-semibold"
                  >
                    <PlusCircle size={14} /> Create New RFQ
                  </button>
                  <button
                    onClick={() => navigate('/vendors')}
                    className="btn-secondary text-xs py-2.5 justify-start border-violet-300 hover:border-violet-400"
                  >
                    <Users size={14} /> Add New Vendor
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/quotations')}
                    className="btn-primary text-xs py-2.5 justify-start font-semibold"
                  >
                    <PlusCircle size={14} /> Submit New Quotation
                  </button>
                  <button
                    onClick={() => navigate('/purchase-orders')}
                    className="btn-secondary text-xs py-2.5 justify-start border-violet-300 hover:border-violet-400"
                  >
                    <FileCheck size={14} /> View Active Orders
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="card p-5">
            <h3 className="text-xs font-semibold text-slate-800 border-b border-violet-200 pb-2.5 mb-4 flex items-center gap-1.5 uppercase">
              <Activity size={15} className="text-violet-600" /> Recent Activity
            </h3>
            <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
              {logs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-[11px] border-l-2 border-violet-200 pl-2.5 py-0.5 space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-semibold truncate max-w-[120px]">{log.user} ({log.role})</span>
                    <span className="text-[9px] text-violet-600/70 font-semibold">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-tight">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
