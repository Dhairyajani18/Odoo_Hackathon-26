import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, Download, Star, ShieldCheck } from 'lucide-react';

const Reports = () => {
  const { purchaseOrders, vendors, rfqs } = useApp();

  // Spend calculations
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
  
  // Spend by Category
  const categorySpend = purchaseOrders.reduce((acc, po) => {
    // Find matching RFQ to get category
    const rfq = rfqs.find(r => r.id === po.rfqId);
    const cat = rfq ? rfq.category : "Hardware"; // Fallback default
    acc[cat] = (acc[cat] || 0) + po.total;
    return acc;
  }, {});

  const maxCatSpend = Math.max(...Object.values(categorySpend), 1);

  // Leaderboard sorting
  const topVendors = [...vendors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Mock download CSV function
  const handleExportCSV = () => {
    const headers = "Purchase Order ID,RFQ Ref,Vendor,Date,Subtotal,Tax,Total,Status\n";
    const rows = purchaseOrders.map(po => (
      `"${po.id}","${po.rfqId}","${po.vendorName}","${po.createdAt}",${po.subtotal},${po.tax},${po.total},"${po.status}"`
    )).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `VendorBridge_Spend_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-900/30 border border-slate-800 rounded-xl gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            Reports
          </h2>
          <p className="text-xs text-slate-400">Evaluate procurement performance and spending analytics.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-primary text-xs py-2 flex items-center gap-1.5"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Categories Spend */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2 mb-6 flex items-center gap-1.5">
              <BarChart3 size={16} className="text-cyan-400" /> Spending by Category
            </h3>
            
            {/* Visual Bars list */}
            <div className="space-y-5">
              {['Hardware', 'Software', 'Logistics', 'Raw Materials'].map((cat) => {
                const spend = categorySpend[cat] || 0;
                const pct = (spend / maxCatSpend) * 100;
                
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-semibold">{cat.toUpperCase()}</span>
                      <span className="text-emerald-400 font-bold">${spend.toLocaleString()}</span>
                    </div>
                    {/* Visual Bar line */}
                    <div className="h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-slate-800 pt-4 text-right">
              <p className="text-xs font-mono text-slate-500">
                AGGREGATE CAPITAL EXPENDITURE:{' '}
                <span className="text-emerald-400 font-bold text-sm font-mono ml-1.5">${totalSpend.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Top Vendors Leaderboard */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-300 border-b border-slate-800 pb-2 mb-4 flex items-center gap-1.5">
              <Star size={16} className="text-cyan-400" /> Top Vendors
            </h3>
            
            <div className="space-y-4">
              {topVendors.map((vendor, idx) => (
                <div key={vendor.id} className="flex justify-between items-center p-2.5 bg-slate-950/20 rounded border border-slate-800">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-xs font-mono font-bold text-cyan-400/80 bg-cyan-950/30 px-2 py-0.5 border border-cyan-500/25 rounded">
                      #{idx + 1}
                    </span>
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-semibold text-slate-200 truncate">{vendor.name}</p>
                      <span className="text-[9px] font-mono text-slate-500 uppercase">{vendor.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-200">{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
