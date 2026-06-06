import React, { createContext, useState, useEffect, useContext } from 'react';
import { vendorAPI, rfqAPI, quotationAPI, poAPI, invoiceAPI } from '../api/api';
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

  // ERP Database States (using API)
  const [vendors, setVendors] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('vb_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New RFQ Published: RFQ-2026-003 is open.", read: false, time: "1 hr ago" },
    { id: 2, text: "Quotation received from Cyberdyne Systems.", read: false, time: "2 hrs ago" },
    { id: 3, text: "PO-2026-001 has been sent to vendor.", read: true, time: "1 day ago" }
  ]);

  // Fetch all data from APIs on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [vendorsRes, rfqsRes, quotationsRes, posRes, invoicesRes] = await Promise.all([
          vendorAPI.getAll().catch(err => ({ data: [] })),
          rfqAPI.getAll().catch(err => ({ data: [] })),
          quotationAPI.getAll().catch(err => ({ data: [] })),
          poAPI.getAll().catch(err => ({ data: [] })),
          invoiceAPI.getAll().catch(err => ({ data: [] }))
        ]);

        setVendors(vendorsRes.data || []);
        setRfqs(rfqsRes.data || []);
        setQuotations(quotationsRes.data || []);
        setPurchaseOrders(posRes.data || []);
        setInvoices(invoicesRes.data || []);
      } catch (err) {
        setError("Failed to load data from backend");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

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

  const addVendor = async (vendor) => {
    try {
      const payload = {
        company_name: vendor.name,
        contact_person: vendor.contactPerson,
        email: vendor.email,
        phone: vendor.phone,
        gst_number: vendor.gst,
        address: vendor.address || "N/A",
        category: vendor.category,
        status: "active"
      };

      const response = await vendorAPI.create(payload);
      const newVendor = response.data;
      
      setVendors(prev => [...prev, newVendor]);
      addLog(`Registered vendor ${newVendor.company_name}`);
      
      setNotifications(prev => [
        { id: Date.now(), text: `New vendor registered: ${newVendor.company_name}`, read: false, time: "Just now" },
        ...prev
      ]);
    } catch (err) {
      console.error("Error adding vendor:", err);
      addLog(`Failed to register vendor: ${err.message}`);
    }
  };

  const addRFQ = async (rfq) => {
    try {
      const payload = {
        ...rfq,
        status: "Published",
        created_at: new Date().toISOString()
      };

      const response = await rfqAPI.create(payload);
      const newRFQ = response.data;
      
      setRfqs(prev => [newRFQ, ...prev]);
      addLog(`Created new RFQ: ${newRFQ.title}`);

      setNotifications(prev => [
        { id: Date.now(), text: `New RFQ Published: ${newRFQ.title}`, read: false, time: "Just now" },
        ...prev
      ]);
    } catch (err) {
      console.error("Error adding RFQ:", err);
      addLog(`Failed to create RFQ: ${err.message}`);
    }
  };

  const addQuotation = async (quote) => {
    try {
      const payload = {
        ...quote,
        status: "Submitted",
        submitted_at: new Date().toISOString()
      };

      const response = await quotationAPI.create(payload);
      const newQuote = response.data;

      setQuotations(prev => [newQuote, ...prev]);

      // Update RFQ status to indicate bids have been received
      try {
        await rfqAPI.update(quote.rfqId, { status: "Bids Received" });
        setRfqs(prev => prev.map(r => r.id === quote.rfqId ? { ...r, status: "Bids Received" } : r));
      } catch (err) {
        console.error("Error updating RFQ status:", err);
      }

      addLog(`Vendor ${quote.vendorName} submitted quotation for ${quote.rfqId}`);

      setNotifications(prev => [
        { id: Date.now(), text: `Quotation received from ${quote.vendorName} for ${quote.rfqId}`, read: false, time: "Just now" },
        ...prev
      ]);
    } catch (err) {
      console.error("Error adding quotation:", err);
      addLog(`Failed to submit quotation: ${err.message}`);
    }
  };

  const approveQuotation = async (quoteId, remarks) => {
    try {
      // 1. Mark Quote as Approved
      let approvedQuote = quotations.find(q => q.id === quoteId);
      if (!approvedQuote) return;

      await quotationAPI.update(quoteId, { status: "Approved" });
      setQuotations(prev => prev.map(q => {
        if (q.id === quoteId) {
          return { ...q, status: "Approved" };
        }
        // Reject other quotes for the same RFQ
        if (q.rfq_id === approvedQuote.rfq_id && q.id !== quoteId) {
          quotationAPI.update(q.id, { status: "Rejected" }).catch(err => console.error(err));
          return { ...q, status: "Rejected" };
        }
        return q;
      }));

      // 2. Update RFQ status to Completed
      await rfqAPI.update(approvedQuote.rfq_id, { status: "Completed" });
      setRfqs(prev => prev.map(r => r.id === approvedQuote.rfq_id ? { ...r, status: "Completed" } : r));

      // 3. Auto-generate Purchase Order
      const newPO = {
        rfq_id: approvedQuote.rfq_id,
        quotation_id: approvedQuote.id,
        vendor_id: approvedQuote.vendor_id,
        vendor_name: approvedQuote.vendor_name,
        items: approvedQuote.items || [],
        subtotal: approvedQuote.total_price,
        tax: Math.round(approvedQuote.total_price * 0.18),
        total: Math.round(approvedQuote.total_price * 1.18),
        status: "Sent",
        created_at: new Date().toISOString()
      };

      const poResponse = await poAPI.create(newPO);
      setPurchaseOrders(prev => [...prev, poResponse.data]);

      addLog(`Approved Quotation ${quoteId} (RFQ: ${approvedQuote.rfq_id}) - Generated PO`);

      // 4. Generate Invoice
      const newInvoice = {
        po_id: poResponse.data.id,
        vendor_id: poResponse.data.vendor_id,
        vendor_name: poResponse.data.vendor_name,
        items: poResponse.data.items,
        subtotal: poResponse.data.subtotal,
        tax: poResponse.data.tax,
        total: poResponse.data.total,
        status: "Unpaid",
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };

      const invResponse = await invoiceAPI.create(newInvoice);
      setInvoices(prev => [...prev, invResponse.data]);

      addLog(`Auto-generated Invoice for ${poResponse.data.id}`);

      setNotifications(prev => [
        { id: Date.now(), text: `Quotation Approved! PO & Invoice created.`, read: false, time: "Just now" },
        ...prev
      ]);
    } catch (err) {
      console.error("Error approving quotation:", err);
      addLog(`Failed to approve quotation: ${err.message}`);
    }
  };

  const rejectQuotation = async (quoteId, remarks) => {
    try {
      await quotationAPI.update(quoteId, { status: "Rejected" });
      setQuotations(prev => prev.map(q => q.id === quoteId ? { ...q, status: "Rejected" } : q));
      addLog(`Rejected Quotation ${quoteId}. Remarks: ${remarks}`);
      
      setNotifications(prev => [
        { id: Date.now(), text: `Quotation ${quoteId} was rejected by Manager.`, read: false, time: "Just now" },
        ...prev
      ]);
    } catch (err) {
      console.error("Error rejecting quotation:", err);
      addLog(`Failed to reject quotation: ${err.message}`);
    }
  };

  const payInvoice = async (invoiceId) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) return;

      await invoiceAPI.update(invoiceId, { status: "Paid" });
      setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
          return { ...inv, status: "Paid" };
        }
        return inv;
      }));

      // Find and update PO status to Completed
      if (invoice.po_id) {
        await poAPI.update(invoice.po_id, { status: "Completed" });
        setPurchaseOrders(pos => pos.map(po => po.id === invoice.po_id ? { ...po, status: "Completed" } : po));
      }

      addLog(`Paid Invoice ${invoiceId}`);
      setNotifications(prev => [
        { id: Date.now(), text: `Invoice ${invoiceId} has been paid.`, read: false, time: "Just now" },
        ...prev
      ]);
    } catch (err) {
      console.error("Error paying invoice:", err);
      addLog(`Failed to pay invoice: ${err.message}`);
    }
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
      loading,
      error,
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
