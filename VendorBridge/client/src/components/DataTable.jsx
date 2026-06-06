import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  itemsPerPage = 5,
  actions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filter
  const filteredData = data.filter(item => {
    if (!searchTerm || !searchKey) return true;
    const val = item[searchKey];
    if (val === undefined || val === null) return false;
    return String(val).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Table Header controls */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 border-b border-slate-250/80 bg-slate-50/50">
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            className="input-field w-full pl-9 py-2 text-sm bg-white"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
        </div>
        {actions && (
          <div className="w-full md:w-auto flex justify-end">
            {actions}
          </div>
        )}
      </div>

      {/* Actual Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 text-xs font-mono uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="p-4 font-semibold">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 text-sm">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr key={row.id || rIdx} className="hover:bg-slate-50/40 transition-colors duration-150">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="p-4 text-slate-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-400 font-mono">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/30 text-xs text-slate-500 font-mono">
          <div>
            Showing <span className="text-slate-700 font-bold">{startIndex + 1}</span> to{" "}
            <span className="text-slate-700 font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
            <span className="text-slate-700 font-bold">{totalItems}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 cursor-pointer`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded text-violet-700 font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 cursor-pointer`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
