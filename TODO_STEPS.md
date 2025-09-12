# Admin Dashboard Update Steps

## 1. Update mockAPI.ts

- [x] Add restoreUser function to mockAPI.ts

## 2. Update AdminDashboard.jsx

- [ ] Import Recharts components (LineChart, BarChart, etc.)
- [ ] Add state variables for new entities (aircrafts, airports, payments, flightStats, userActivity, revenueReports)
- [ ] Update useEffect to load all new data
- [ ] Add restore user functionality in users section (button for suspended users)
- [ ] Add new sidebar navigation items (Aircraft, Airports, Payments)
- [ ] Add Aircraft Management section (table, add/edit/delete modals)
- [ ] Add Airport Management section (table, add/edit/delete modals)
- [ ] Add Payment Management section (table, resolve/refund actions)
- [ ] Enhance Reports & Analytics section with charts (flight stats, user activity, revenue)
- [ ] Update summary cards with new metrics (aircraft count, airport count, payment totals)

## 3. Update APIS NEEDED.md

- [ ] Add Aircraft Management endpoints (CRUD)
- [ ] Add Airport Management endpoints (CRUD)
- [ ] Add Reports & Analytics endpoints (flight stats, user activity, revenue)
- [ ] Add Payment Management endpoints (view, resolve, refund)
- [ ] Add Restore user endpoint

## 4. Testing

- [ ] Test UI functionality (all new sections work)
- [ ] Verify responsive design
- [ ] Check toast notifications for all actions
