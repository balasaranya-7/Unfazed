# Unfazed — Original UI + Backend

The frontend in this package is copied from the newly uploaded `unfazed-frontend.zip`. **Its frontend source is preserved as-is**. No UI redesign, color change, layout change, feature removal, or frontend logic rewrite was done for this backend build.

The sibling backend combines the previously built Unfazed backend with the backend requirements from the project PDF: auth, therapist profile, clients/intake/consent, scheduling, packages/payments, Razorpay test flow + webhook, GST invoice PDF, private/shared notes, Socket.IO chat foundation, notifications, entitlements, analytics, leads, and a storage adapter.

## Start backend
```powershell
cd unfazed-backend
npm.cmd install
copy .env.example .env
# edit .env: MONGO_URI and JWT_SECRET are required
npm.cmd run dev
```

## Start frontend
```powershell
cd unfazed-frontend
npm.cmd install
npm.cmd run dev
```
