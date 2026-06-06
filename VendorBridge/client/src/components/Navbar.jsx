import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, ShieldAlert, Check, RefreshCw } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchRoleSim, notifications, markAllNotificationsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  if (!currentUser) return null;

  // Breadcrumbs title helper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/vendors') return 'Vendors';
    if (path === '/rfqs') return 'RFQs';
    if (path === '/quotations') return 'Quotations';
    if (path === '/approvals') return 'Approvals';
    if (path === '/purchase-orders') return 'Purchase Orders';
    if (path === '/invoices') return 'Invoices';
    if (path === '/reports') return 'Reports';
    return 'VendorBridge';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList = [
    "Procurement Officer",
    "Vendor",
    "Manager / Approver",
    "Admin"
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-violet-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Title / Breadcrumbs */}
      <div>
        <h1 className="text-sm font-semibold text-slate-800 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleSelector(!showRoleSelector);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50 text-xs text-violet-700 hover:bg-violet-100 transition-colors cursor-pointer font-medium"
          >
            <RefreshCw size={12} />
            {currentUser.role}
          </button>
          
          {showRoleSelector && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-violet-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 border-b border-violet-100 text-[10px] font-semibold text-violet-600 uppercase tracking-wide">
                Switch Role
              </div>
              {rolesList.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    switchRoleSim(role);
                    setShowRoleSelector(false);
                    navigate('/');
                  }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-violet-50 flex items-center justify-between cursor-pointer transition-colors ${
                    currentUser.role === role ? 'text-violet-700 font-semibold bg-violet-50/60' : 'text-slate-600'
                  }`}
                >
                  <span>{role}</span>
                  {currentUser.role === role && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSelector(false);
            }}
            className="p-2 rounded-lg border border-violet-200 bg-violet-50 text-violet-600 hover:text-violet-700 cursor-pointer relative hover:bg-violet-100 transition-colors"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-violet-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-violet-200 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-violet-100 bg-violet-50">
                <span className="text-xs font-semibold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-semibold text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="divide-y divide-violet-100 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs transition-colors hover:bg-violet-50/60 ${
                        notif.read ? 'opacity-60' : 'bg-violet-50/10'
                      }`}
                    >
                      <div className="flex gap-2.5 items-start">
                        <span className={`p-1 rounded bg-violet-100 ${notif.read ? 'text-violet-600' : 'text-violet-700'}`}>
                          <ShieldAlert size={12} />
                        </span>
                        <div>
                          <p className={`text-slate-800 ${!notif.read ? 'font-medium' : ''}`}>{notif.text}</p>
                          <p className="text-[9px] text-slate-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
