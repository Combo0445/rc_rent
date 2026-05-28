Bug & Fix Report

Summary
- Performed static review and refactor on the Cars listing UI.
- Fixed UX bug where disabled "Rent" buttons were wrapped by `<Link>` making links clickable even when unavailable.
- Added defensive guards to avoid runtime errors when API returns missing values.
- Refactored `Cars` to use `CarList` and `CarCard` to remove duplicated markup.

Files changed
- src/Pages/Cars.jsx - normalized numeric fields, guarded brand access, replaced inline card markup with `CarList`.
- src/components/CarCard.jsx - normalize `available` / `price`, added `children` slot and avoided linking when unavailable.
- src/components/CarList.jsx - render admin buttons as children and use i18n for labels.

Verification
1. Started frontend dev server: `npm run dev` (Vite at http://localhost:5173/).
2. Started backend: `cd car-rental-backend && npm run start` (Express at http://localhost:5000/).
3. Opened `/cars` and verified vehicles load and "Rent" buttons are links only when available; disabled buttons are not wrapped by links.
4. Confirmed console no longer showed fetch-connection errors after backend start.

Remaining recommendations
- Clean up `src/i18n.jsx`: remove duplicate keys (e.g., `rentalCancelled` duplicated) and standardize status keys (e.g., `status.available`, `status.unavailable`).
- Add unit tests for `CarCard` (rendering available/unavailable and `onRent` behavior) using React Testing Library + Vitest/Jest.
- Add end-to-end tests (Cypress) for critical flows: rent flow, admin add/edit/delete.
- Add input sanitization on backend for car payloads and return normalized types (ensure numbers for `pricePerDay` and `available`).

How to run locally
- Frontend

```bash
npm install
npm run dev
```

- Backend

```bash
cd car-rental-backend
npm install
npm run start
```

If you want, I can now:
- Create unit tests scaffold and one test for `CarCard` (requires adding testing deps), or
- Open a PR with these changes, or
- Continue cleaning up `i18n.jsx` and other translations.
