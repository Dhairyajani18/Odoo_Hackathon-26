# How to Add Test Data to Vendors

## Option 1: Using pgAdmin (Easiest GUI)

1. Open pgAdmin (usually at `http://localhost:5050`)
2. Navigate to: `Servers > PostgreSQL > vendorbridge > Schemas > public > Tables > vendors`
3. Right-click on `vendors` → **View/Edit Data**
4. Click the **+** button to add new rows:

   | company_name | contact_person | email | phone | gst_number | address | category | status |
   |---|---|---|---|---|---|---|---|
   | Acme Corp | John Smith | john@acme.com | 9876543210 | 18AABCT1234H1Z5 | 123 Business St | Electronics | active |
   | Tech Solutions | Sarah Wilson | sarah@techsol.com | 8765432109 | 27AABCT5678H2Z0 | 456 Tech Park | Software | active |
   | Global Supplies | Mike Johnson | mike@globalsupplies.com | 7654321098 | 36AABCT9012H3Z4 | 789 Supply Lane | Hardware | active |

5. Save and refresh `http://localhost:5173/vendors`

## Option 2: Using SQL Query

1. Open pgAdmin or your PostgreSQL client
2. Go to `Tools > Query Tool`
3. Paste this SQL:

```sql
INSERT INTO vendors (company_name, contact_person, email, phone, gst_number, address, category, status) VALUES
('Acme Corp', 'John Smith', 'john@acme.com', '9876543210', '18AABCT1234H1Z5', '123 Business St, NYC', 'Electronics', 'active'),
('Tech Solutions', 'Sarah Wilson', 'sarah@techsol.com', '8765432109', '27AABCT5678H2Z0', '456 Tech Park, Bangalore', 'Software', 'active'),
('Global Supplies', 'Mike Johnson', 'mike@globalsupplies.com', '7654321098', '36AABCT9012H3Z4', '789 Supply Lane, Delhi', 'Hardware', 'active'),
('Quality Parts', 'Emma Brown', 'emma@qualityparts.com', '6543210987', '09AABCT3456H4Z9', '321 Parts Ave, Mumbai', 'Parts', 'active'),
('Innovation Labs', 'David Chen', 'david@innovlabs.com', '5432109876', '33AABCT7890H5Z1', '654 Lab Road, Hyderabad', 'Research', 'active');
```

4. Press `F5` or click **Execute**
5. Refresh `http://localhost:5173/vendors`

## Option 3: Using psql Command Line

```bash
psql -U postgres -d vendorbridge -f D:\oddo\VendorBridge\backend\insert_test_data.sql
```

---

After adding data, **refresh your browser** and vendors should appear! ✅
