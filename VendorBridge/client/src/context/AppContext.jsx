import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  initialVendors,
  initialRFQs,
  initialQuotations,
  initialPOs,
  initialInvoices,
  initialLogs
} from '../services/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Session Role Simulator
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vb_user');
    return saved ? JSON.parse(saved) : {
      name: "Sarah Connor",
      email: "sarah@vendorbridge.com",
      role: "Procurement Officer",
      vendorId: null
    };
  });

  // ERP Database States
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('vb_vendors');
    return saved ? JSON.parse(saved) : initialVendors;
  });

  const [rfqs, setRfqs] = useState(() => {
    const saved = localStorage.getItem('vb_rfqs');
    return saved ? JSON.parse(saved) : initialRFQs;
  });

  const [quotations, setQuotations] = useState(() => {
    const saved = localStorage.getItem('vb_quotations');
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('vb_pos');
    return saved ? JSON.parse(saved) : initialPOs;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('vb_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('vb_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New RFQ Published: RFQ-2026-003 is open.", read: false, time: "1 hr ago" },
    { id: 2, text: "Quotation received from Cyberdyne Systems.", read: false, time: "2 hrs ago" },
    { id: 3, text: "PO-2026-001 has been sent to vendor.", read: true, time: "1 day ago" }
  ]);

  // Synchronize with LocalStorage
  useEffect(() => {
    localStorage.setItem('vb_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vb_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('vb_rfqs', JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem('vb_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('vb_pos', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('vb_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('vb_logs', JSON.stringify(logs));
  }, [logs]);

  // Actions
  const addLog = (actionText) => {
    const newLog = {
      id: Date.now(),
      user: currentUser ? currentUser.name : "System",
      role: currentUser ? currentUser.role : "System",
      action: actionText,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const login = (email, password, role) => {
    let name = "Sarah Connor";
    let vendorId = null;

    if (role === "Vendor") {
      name = "Dr. Miles Dyson";
      vendorId = "VND-001"; // Link to Cyberdyne
    } else if (role === "Manager / Approver") {
      name = "Tony Stark";
    } else if (role === "Admin") {
      name = "Jarvis Admin";
    }

    const userObj = { name, email, role, vendorId };
    setCurrentUser(userObj);
    addLog(`Logged in as ${role}`);
    return true;
  };

  const signup = (name, email, password, role) => {
    const userObj = {
      name,
      email,
      role,
      vendorId: role === "Vendor" ? "VND-001" : null
    };
    setCurrentUser(userObj);
    addLog(`Registered and logged in as ${role}`);
    return true;
  };

  const logout = () => {
    addLog(`Logged out`);
    setCurrentUser(null);
  };

  // Switch role simulator (helper for dashboard previewing)
  const switchRoleSim = (role) => {
    let name = "Sarah Connor";
    let vendorId = null;
    if (role === "Vendor") {
      name = "Dr. Miles Dyson";
      vendorId = "VND-001";
    } else if (role === "Manager / Approver") {
      name = "Tony Stark";
    } else if (role === "Admin") {
      name = "Jarvis Admin";
    }
    const userObj = { name, email: `${name.toLowerCase().replace(" ", "")}@vendorbridge.com`, role, vendorId };
    setCurrentUser(userObj);
    addLog(`Switched simulation role to ${role}`);
  };

  const addVendor = (vendor) => {
    const newVendor = {
      ...vendor,
      id: `VND-${String(vendors.length + 1).padStart(3, '0')}`,
      rating: 5.0,
      status: "Active"
    };
    setVendors(prev => [...prev, newVendor]);
    addLog(`Registered vendor ${newVendor.name}`);
    
    // Add Notification
    setNotifications(prev => [
      { id: Date.now(), text: `New vendor registered: ${newVendor.name}`, read: false, time: "Just now" },
      ...prev
    ]);
  };

  const addRFQ = (rfq) => {
    const newRFQ = {
      ...rfq,
      id: `RFQ-2026-${String(rfqs.length + 1).padStart(3, '0')}`,
      status: "Published",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRfqs(prev => [newRFQ, ...prev]);
    addLog(`Created new RFQ: ${newRFQ.title}`);

    // Notify appropriate vendors
    setNotifications(prev => [
      { id: Date.now(), text: `New RFQ Published: ${newRFQ.title}`, read: false, time: "Just now" },
      ...prev
    ]);
  };

  const addQuotation = (quote) => {
    const newQuote = {
      ...quote,
      id: `QTN-2026-${String(quotations.length + 1).padStart(3, '0')}`,
      status: "Submitted",
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setQuotations(prev => [newQuote, ...prev]);

    // Update RFQ status to indicate bids have been received
    setRfqs(prev => prev.map(r => r.id === quote.rfqId ? { ...r, status: "Bids Received" } : r));
    addLog(`Vendor ${quote.vendorName} submitted quotation for ${quote.rfqId}`);

    // Notify Procurement Officers
    setNotifications(prev => [
      { id: Date.now(), text: `Quotation received from ${quote.vendorName} for ${quote.rfqId}`, read: false, time: "Just now" },
      ...prev
    ]);
  };

  const approveQuotation = (quoteId, remarks) => {
    // 1. Mark Quote as Approved
    let approvedQuote = null;
    setQuotations(prev => prev.map(q => {
      if (q.id === quoteId) {
        approvedQuote = { ...q, status: "Approved" };
        return approvedQuote;
      }
      // Reject other quotes for the same RFQ
      const matchingQuote = prev.find(x => x.id === quoteId);
      if (matchingQuote && q.rfqId === matchingQuote.rfqId) {
        return { ...q, status: "Rejected" };
      }
      return q;
    }));

    if (!approvedQuote) return;

    // 2. Update RFQ status to Completed
    setRfqs(prev => prev.map(r => r.id === approvedQuote.rfqId ? { ...r, status: "Completed" } : r));

    // 3. Auto-generate Purchase Order
    const matchingRFQ = rfqs.find(r => r.id === approvedQuote.rfqId);
    const poItems = matchingRFQ ? matchingRFQ.items.map(item => ({
      name: item.name,
      qty: item.qty,
      unit: matchingRFQ.unit || "units",
      price: approvedQuote.pricePerUnit
    })) : [];

    const newPO = {
      id: `PO-2026-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      rfqId: approvedQuote.rfqId,
      quotationId: approvedQuote.id,
      vendorId: approvedQuote.vendorId,
      vendorName: approvedQuote.vendorName,
      items: poItems,
      subtotal: approvedQuote.totalPrice,
      tax: Math.round(approvedQuote.totalPrice * 0.18), // 18% GST
      total: Math.round(approvedQuote.totalPrice * 1.18),
      status: "Sent",
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPurchaseOrders(prev => [...prev, newPO]);
    addLog(`Approved Quotation ${quoteId} (RFQ: ${approvedQuote.rfqId}) - Generated ${newPO.id}`);

    // 4. Generate Invoice (Mock status: Unpaid)
    const newInvoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      poId: newPO.id,
      vendorId: newPO.vendorId,
      vendorName: newPO.vendorName,
      items: newPO.items,
      subtotal: newPO.subtotal,
      tax: newPO.tax,
      total: newPO.total,
      status: "Unpaid",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days due
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInvoices(prev => [...prev, newInvoice]);
    addLog(`Auto-generated Invoice ${newInvoice.id} for ${newPO.id}`);

    setNotifications(prev => [
      { id: Date.now(), text: `Quotation Approved! ${newPO.id} & ${newInvoice.id} created.`, read: false, time: "Just now" },
      ...prev
    ]);
  };

  const rejectQuotation = (quoteId, remarks) => {
    setQuotations(prev => prev.map(q => q.id === quoteId ? { ...q, status: "Rejected" } : q));
    addLog(`Rejected Quotation ${quoteId}. Remarks: ${remarks}`);
    
    setNotifications(prev => [
      { id: Date.now(), text: `Quotation ${quoteId} was rejected by Manager.`, read: false, time: "Just now" },
      ...prev
    ]);
  };

  const payInvoice = (invoiceId) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        // Find PO and update status to Completed
        setPurchaseOrders(pos => pos.map(po => po.id === inv.poId ? { ...po, status: "Completed" } : po));
        addLog(`Paid Invoice ${invoiceId}`);
        return { ...inv, status: "Paid" };
      }
      return inv;
    }));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      vendors,
      rfqs,
      quotations,
      purchaseOrders,
      invoices,
      logs,
      notifications,
      login,
      signup,
      logout,
      switchRoleSim,
      addVendor,
      addRFQ,
      addQuotation,
      approveQuotation,
      rejectQuotation,
      payInvoice,
      markAllNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
