# Plan: Enterprise EMR + Booking + Detail Pages

Extend the existing Max Rehab admin (same design system: Poppins, #1F5FFF primary, glassmorphism, framer-motion, shadcn) with a full EMR module, digital consent, an admin booking wizard, and full detail pages for every module.

## 1. Mock data expansion (`src/lib/mock.ts`)
Add richly typed generators for:
- Medical records (diagnoses, allergies, meds, surgeries, family history, lifestyle)
- Clinical notes (SOAP / progress / assessment / discharge with versions + authors)
- Assessments (ROM, pain, strength, mobility) with history for comparison charts
- Treatment plans with goals & milestones
- Medical documents grouped by folder (Prescriptions, MRI, CT, X-Ray, Lab, Referral, Insurance, Invoices, Discharge, Assessments, Notes, Images) with version history
- Consent forms (signed / pending / expired / rejected) + signature audit trail
- Home visit logs, invoices/payments/insurance, activity timeline per patient
- Booking catalog: services, rooms, therapist availability slots

## 2. New EMR module
Routes under `/emr`:
- `_app.emr.tsx` — layout `<Outlet />`
- `_app.emr.index.tsx` — EMR Dashboard (stat cards, quick search, recent activity)
- `_app.emr.records.tsx` — searchable/filterable records table
- `_app.emr.$id.tsx` — **Patient Medical Record** page with sticky header (photo, ID, age, diagnosis, therapist, stage, status), quick-action bar, and tabs:
  Overview · Medical History · Clinical Notes · Assessments · Treatment Plan · Appointments · Home Visits · Exercise Plans · Documents · Consent · Billing · Activity
- `_app.emr.consent.tsx` — consent management hub (Signed/Pending/Expired/Rejected tabs)
- `_app.emr.consent.$id.tsx` — consent detail w/ preview, signature viewer, audit trail
- `_app.emr.templates.tsx` — consent templates & assignment flow

Add EMR group to sidebar `nav-items.ts`.

## 3. Appointment booking wizard
- `_app.appointments.new.tsx` — 9-step wizard (Patient → Service → Therapist → Clinic/Room → Date → Time → Details → Review → Confirmation) using framer-motion step transitions, sticky progress bar, and a success animation. "Book appointment" CTAs across the app deep-link here (pre-fills patient when navigated from EMR / patient detail).
- `_app.appointments.$id.tsx` — appointment detail page (timeline, patient, therapist, notes, consent status, billing, documents, follow-up, history).

## 4. Detail pages for every module
Create/expand:
- `_app.home-visits.$id.tsx`
- `_app.programmes.$id.tsx`
- `_app.progress.$id.tsx` (patient recovery progress detail)
- `_app.messages.$id.tsx` (conversation detail w/ AI summary)
- `_app.ai.logs.$id.tsx` (AI conversation detail)
- `_app.documents.$id.tsx`
- `_app.billing.$id.tsx` (invoice detail)
- `_app.services.$id.tsx`
- `_app.locations.$id.tsx`
- Enhance existing `_app.therapists.$id.tsx` if thin.

Each uses shared shell: sticky `PageHeader` with breadcrumbs + persistent action bar, tabbed sections, right-side context card w/ cross-links to Patient · EMR · Appointments · Consent · Documents · Billing.

## 5. Shared building blocks (`src/components/emr/` + `shared/`)
- `SignatureCard` — SVG signature block w/ metadata + verification badge
- `ConsentStatusBadge`
- `TimelineList` — reusable chronological activity list
- `FolderGrid` — document folder grid with counts and OCR indicator
- `WizardStepper` — animated step indicator used by booking wizard
- `SlideOver` — drawer wrapper over shadcn Sheet for quick previews
- `RecordTabsShell` — sticky header + tab strip layout used by EMR and detail pages

## 6. Cross-linking
- Patient profile → "Open EMR" button → `/emr/$id`
- EMR appointment row → `/appointments/$id`
- Appointment detail → patient, therapist, consent, invoice
- Consent detail → linked appointment + patient
- Document detail → linked patient + appointment
- Global Command Palette gets EMR + Consent entries.

## 7. Housekeeping
- Fix the SSR hydration mismatch on `_app.index.tsx` (month labels derived from `new Date()` at render — freeze to a stable reference date in mock data).
- Keep all colors via design tokens; no hardcoded hex outside `styles.css`.
- All new tables reuse `DataTable`; all pages reuse `PageHeader` + `StatCard` + `SectionCard`.

## Technical notes
- Pure frontend; mock data only. No backend/schema changes.
- Route filenames follow existing flat `_app.*.tsx` convention.
- Animations via framer-motion presets already in use (`initial/animate/exit`, `AnimatePresence`) — no new deps.
- Wizard state kept in local `useReducer`, persisted to `sessionStorage` for autosave.
- All new routes wired with `head()` meta (title + description).
