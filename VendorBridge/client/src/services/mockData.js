export const initialVendors = [
  {
    id: "VND-001",
    name: "Cyberdyne Systems",
    category: "Hardware",
    email: "sales@cyberdyne.io",
    phone: "+1 (555) 109-2831",
    gst: "27AAACD1111A1Z1",
    rating: 4.8,
    status: "Active",
    contactPerson: "Dr. Miles Dyson",
    address: "Sunnyvale, Silicon Valley, CA"
  },
  {
    id: "VND-002",
    name: "Aperture Science Corp",
    category: "Software",
    email: "portal@aperture.com",
    phone: "+1 (555) 246-8091",
    gst: "27AAACA2222B2Z2",
    rating: 4.5,
    status: "Active",
    contactPerson: "Cave Johnson",
    address: "Upper Peninsula, MI"
  },
  {
    id: "VND-003",
    name: "Weyland-Yutani Logistics",
    category: "Logistics",
    email: "cargo@weyland.co",
    phone: "+44 20 7946 0958",
    gst: "27AAACW3333C3Z3",
    rating: 3.9,
    status: "Active",
    contactPerson: "Carter Burke",
    address: "London, UK"
  },
  {
    id: "VND-004",
    name: "Tyrell Bio-Materials",
    category: "Raw Materials",
    email: "nexus@tyrell.corp",
    phone: "+1 (555) 432-1090",
    gst: "27AAACT4444D4Z4",
    rating: 4.9,
    status: "Pending",
    contactPerson: "Eldon Tyrell",
    address: "Los Angeles, CA"
  },
  {
    id: "VND-05",
    name: "Stark Industries Tech",
    category: "Hardware",
    email: "contracts@stark.com",
    phone: "+1 (555) 987-6543",
    gst: "27AAACS5555E5Z5",
    rating: 4.7,
    status: "Active",
    contactPerson: "Pepper Potts",
    address: "Malibu, CA"
  }
];

export const initialRFQs = [
  {
    id: "RFQ-2026-001",
    title: "High-performance GPU Servers Sourcing",
    description: "Sourcing of 10 units of Nvidia H100 PCIe GPU servers with dual-processor boards and 2TB DDR5 ECC memory.",
    category: "Hardware",
    quantity: 10,
    unit: "units",
    deadline: "2026-06-25",
    status: "Bids Received",
    invitedVendors: ["VND-001", "VND-05"],
    items: [
      { name: "Nvidia H100 PCIe Server (8-GPU)", qty: 10, specs: "Dual Intel Xeon 8480+, 2TB DDR5, 8x H100, Quad 100GbE" }
    ],
    createdAt: "2026-06-01"
  },
  {
    id: "RFQ-2026-002",
    title: "Enterprise Database Clustering Software",
    description: "Multi-node database clustering engine licenses with 24/7 priority support and failover systems.",
    category: "Software",
    quantity: 5,
    unit: "licenses",
    deadline: "2026-07-10",
    status: "Published",
    invitedVendors: ["VND-002"],
    items: [
      { name: "Aperture Grid SQL Cluster Core License", qty: 5, specs: "Unlimited CPU cores, multi-region replication" }
    ],
    createdAt: "2026-06-03"
  },
  {
    id: "RFQ-2026-003",
    title: "Eco-Friendly Synthetic Polymer Resins",
    description: "Bulk shipment of premium polymer resins for industrial outer shell housing casing manufacture.",
    category: "Raw Materials",
    quantity: 50,
    unit: "barrels",
    deadline: "2026-06-15",
    status: "Under Review",
    invitedVendors: ["VND-004"],
    items: [
      { name: "Bio-Polymer Compound Resins (Class A)", qty: 50, specs: "Heat resistant, certified biodegradable" }
    ],
    createdAt: "2026-06-04"
  }
];

export const initialQuotations = [
  {
    id: "QTN-2026-001",
    rfqId: "RFQ-2026-001",
    vendorId: "VND-001",
    vendorName: "Cyberdyne Systems",
    pricePerUnit: 29500,
    totalPrice: 295000,
    deliveryDays: 12,
    notes: "Direct factory pricing. Includes global warranty and dedicated support engineer.",
    status: "Under Review",
    submittedAt: "2026-06-04"
  },
  {
    id: "QTN-2026-002",
    rfqId: "RFQ-2026-001",
    vendorId: "VND-05",
    vendorName: "Stark Industries Tech",
    pricePerUnit: 31000,
    totalPrice: 310000,
    deliveryDays: 8,
    notes: "Slightly higher unit cost but offers expedited courier transport and Arc-stabilized circuits.",
    status: "Under Review",
    submittedAt: "2026-06-05"
  },
  {
    id: "QTN-2026-003",
    rfqId: "RFQ-2026-003",
    vendorId: "VND-004",
    vendorName: "Tyrell Bio-Materials",
    pricePerUnit: 1200,
    totalPrice: 60000,
    deliveryDays: 20,
    notes: "High quality Nexus-grade synthetic compounds.",
    status: "Submitted",
    submittedAt: "2026-06-05"
  }
];

export const initialPOs = [
  {
    id: "PO-2026-001",
    rfqId: "RFQ-2026-001",
    quotationId: "QTN-2026-001",
    vendorId: "VND-001",
    vendorName: "Cyberdyne Systems",
    items: [
      { name: "Nvidia H100 PCIe Server (8-GPU)", qty: 10, unit: "units", price: 29500 }
    ],
    subtotal: 295000,
    tax: 53100, // 18% GST
    total: 348100,
    status: "Sent",
    createdAt: "2026-06-05"
  }
];

export const initialInvoices = [
  {
    id: "INV-2026-001",
    poId: "PO-2026-001",
    vendorId: "VND-001",
    vendorName: "Cyberdyne Systems",
    items: [
      { name: "Nvidia H100 PCIe Server (8-GPU)", qty: 10, unit: "units", price: 29500 }
    ],
    subtotal: 295000,
    tax: 53100,
    total: 348100,
    status: "Unpaid",
    dueDate: "2026-07-05",
    createdAt: "2026-06-06"
  }
];

export const initialLogs = [
  {
    id: 1,
    user: "Jarvis Admin",
    role: "Admin",
    action: "System Initialization and database seed",
    timestamp: "2026-06-06T07:00:00Z"
  },
  {
    id: 2,
    user: "Sarah Connor",
    role: "Procurement Officer",
    action: "Published RFQ-2026-001 for GPU Servers",
    timestamp: "2026-06-06T08:12:00Z"
  },
  {
    id: 3,
    user: "Miles Dyson",
    role: "Vendor",
    action: "Submitted QTN-2026-001 for RFQ-2026-001",
    timestamp: "2026-06-06T09:45:00Z"
  }
];
