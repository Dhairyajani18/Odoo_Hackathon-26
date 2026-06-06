-- VendorBridge - Test Data Setup
-- Run this in your PostgreSQL client to populate test data

-- Add test vendors
INSERT INTO vendors (company_name, contact_person, email, phone, gst_number, address, category, status) VALUES
('Acme Corp', 'John Smith', 'john@acme.com', '9876543210', '18AABCT1234H1Z5', '123 Business St, NYC', 'Electronics', 'active'),
('Tech Solutions', 'Sarah Wilson', 'sarah@techsol.com', '8765432109', '27AABCT5678H2Z0', '456 Tech Park, Bangalore', 'Software', 'active'),
('Global Supplies', 'Mike Johnson', 'mike@globalsupplies.com', '7654321098', '36AABCT9012H3Z4', '789 Supply Lane, Delhi', 'Hardware', 'active'),
('Quality Parts', 'Emma Brown', 'emma@qualityparts.com', '6543210987', '09AABCT3456H4Z9', '321 Parts Ave, Mumbai', 'Parts', 'active'),
('Innovation Labs', 'David Chen', 'david@innovlabs.com', '5432109876', '33AABCT7890H5Z1', '654 Lab Road, Hyderabad', 'Research', 'active');

-- Verify insertion
SELECT * FROM vendors;
