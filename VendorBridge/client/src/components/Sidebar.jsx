import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  FileCode,
  FileSpreadsheet,
  CheckSquare,
  FileCheck,
  Receipt,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Boxes
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) return null;

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Procurement Officer', 'Manager / Approver', 'Vendor'] },
    { path: '/vendors', label: 'Vendors CRM', icon: Users, roles: ['Admin', 'Procurement Officer', 'Manager / Approver'] },
    { path: '/rfqs', label: 'RFQs Engine', icon: FileCode, roles: ['Admin', 'Procurement Officer', 'Manager / Approver', 'Vendor'] },
    { path: '/quotations', label: 'Quotations', icon: FileSpreadsheet, roles: ['Admin', 'Procurement Officer', 'Manager / Approver', 'Vendor'] },
    { path: '/approvals', label: 'Approvals Queue', icon: CheckSquare, roles: ['Admin', 'Procurement Officer', 'Manager / Approver'] },
    { path: '/purchase-orders', label: 'Purchase Orders', icon: FileCheck, roles: ['Admin', 'Procurement Officer', 'Manager / Approver', 'Vendor'] },
    { path: '/invoices', label: 'Invoices Hub', icon: Receipt, roles: ['Admin', 'Procurement Officer', 'Manager / Approver', 'Vendor'] },
    { path: '/reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['Admin', 'Procurement Officer', 'Manager / Approver'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div
      className={`bg-white border-r border-violet-200 flex flex-col justify-between transition-all duration-300 min-h-screen sticky top-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Toggle */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-violet-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg shadow-sm text-white">
              <Boxes size={20} />
            </div>
            {!collapsed && (
              <span className="font-bold text-base tracking-tight text-slate-800">
                VendorBridge
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg border border-violet-200 hover:bg-violet-50 text-violet-600 hover:text-violet-700 cursor-pointer transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {filteredMenu.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 border border-violet-200/80 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/60 border border-transparent'
                  }`
                }
              >
                <Icon size={18} className="shrink-0 transition-transform group-hover:scale-105" />
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer User Panel */}
      <div className="p-3 border-t border-violet-200 bg-slate-50/40">
        <div className="flex items-center justify-between gap-2">
          {!collapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center font-semibold text-violet-700">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-violet-600 truncate font-semibold uppercase">{currentUser.role}</p>
              </div>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center font-semibold text-violet-700 mx-auto cursor-help group relative">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 pointer-events-none whitespace-nowrap text-left">
                <p className="font-semibold text-slate-100">{currentUser.name}</p>
                <p className="text-violet-300 text-[10px] uppercase font-bold">{currentUser.role}</p>
              </div>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-violet-600 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
