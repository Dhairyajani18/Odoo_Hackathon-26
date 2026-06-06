import React from 'react';
import { useApp } from '../context/AppContext';
import DataTable from '../components/DataTable';
import { FileSpreadsheet, Clock } from 'lucide-react';

const Quotations = () => {
  const { currentUser, quotations } = useApp();

  // Filter based on role
  const displayData = currentUser?.role === 'Vendor'
    ? quotations.filter(q => q.vendorId === currentUser.vendorId)
    : quotations;

  const columns = [
    {
      label: "Quotation ID",
      key: "id",
      render: (row) => <span className="font-mono text-amber-700 font-semibold">{row.id}</span>
    },
    {
      label: "RFQ Reference",
      key: "rfqId",
      render: (row) => <span className="font-mono text-zinc-400 text-xs">{row.rfqId}</span>
    },
    {
      label: "Supplier Name",
      key: "vendorName",
      render: (row) => <span className="font-sans font-semibold text-zinc-800">{row.vendorName}</span>
    },
    {
      label: "Bid Offer ($)",
      key: "totalPrice",
      render: (row) => (
        <div>
          <p className="font-mono text-xs text-emerald-600 font-bold">${row.totalPrice.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-400 font-mono">Unit: ${row.pricePerUnit.toLocaleString()}</p>
        </div>
      )
    },
    {
      label: "Delivery SLA",
      key: "deliveryDays",
      render: (row) => (
        <div className="flex items-center gap-1 text-xs font-mono text-zinc-650 font-semibold">
          <Clock size={12} className="text-zinc-400" />
          <span>{row.deliveryDays} Days</span>
        </div>
      )
    },
    {
      label: "Proposal Remarks",
      key: "notes",
      render: (row) => <p className="text-xs text-zinc-500 max-w-xs truncate">{row.notes || 'N/A'}</p>
    },
    {
      label: "Status Code",
      key: "status",
      render: (row) => {
        let badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200/50';
        if (row.status === 'Approved') badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
        if (row.status === 'Rejected') badgeColor = 'bg-rose-50 text-rose-600 border border-rose-200/50';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${badgeColor}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold font-mono text-zinc-800 uppercase">QUOTATION_SUBMISSIONS_BOARD</h2>
        <p className="text-xs text-zinc-400 font-mono">Monitor vendor bid sheets pricing breakdowns and status details.</p>
      </div>

      <DataTable
        columns={columns}
        data={displayData}
        searchKey="vendorName"
        searchPlaceholder="Search supplier quotes..."
        itemsPerPage={5}
      />
    </div>
  );
};

export default Quotations;
