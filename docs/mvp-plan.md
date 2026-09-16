# Skooly ERP: Phased MVP & Product Roadmap

This document outlines the phased rollout strategy for **Skooly**, focusing first on the foundational operational needs of the school (MVP), followed by progressive operational modules.

---

## Roadmap at a Glance

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 1: MVP Core (Foundations & Operations)                           │
│ - Auth & RBAC (Admin, Teacher, Accountant, Office)                     │
│ - Student Information System (Profiles, Documents, Sibling Linking)    │
│ - Class & Section Setup + Academic Calendar                             │
│ - Daily Classroom Attendance Register                                  │
│ - Counter Fee Collection & Receipt Printing                            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Academic Engine & Financial Operations                         │
│ - Examination & Grading Engine (Term Marks, Report Cards)              │
│ - Homework & Assignment Posting                                        │
│ - Fee Structure, Installments, Discounts & Defaulter Aging             │
│ - Expense Tracking & School Day-Book                                    │
│ - Certificate Generator (TC, Bonafide, Character)                      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 3: School Logistics & Omnichannel Communications                  │
│ - Staff Profiles, Leave Management & Basic Payroll                     │
│ - Transport Management (Vehicles, Routes, Stop Assignments)            │
│ - Library Management (Accession Catalog, Book Issue/Return)            │
│ - Digital Notice Board & WhatsApp/SMS Gateway Integration              │
│ - Front Office Visitor & Inquiry Desk                                  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 4: Advanced Infrastructure & Intelligence                         │
│ - Biometric Turnstile Hardware Sync Agent (ZKTeco ADMS)                │
│ - Hostel & Dormitory Room Allocation                                    │
│ - Online Payment Gateway Integration (UPI / Razorpay / Cashfree)       │
│ - Pragmatic Analytics (Fee Defaulter Predictor, Dropout Risk Alerts)   │
│ - Parent Self-Service Web Portal                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: The Operational MVP (Essential Baseline)

The objective of Phase 1 is to replace spreadsheets and physical registers on Day 1 of the school term.

### 1. Scope & Deliverables
1. **Authentication & Role-Based Shell:**
   - Secure login supporting Admin, Registrar, Teacher, and Accountant.
   - Dynamic sidebar loading permitted module links only.
2. **Setup & Master Configuration:**
   - Current Academic Year definition (e.g. 2026-2027).
   - Grade levels (Pre-K to 12) and Sections (A, B, C).
   - Subject catalog per grade.
3. **Student Information System (SIS):**
   - Active Student Directory with fast search, grade/section filters, and status tabs.
   - New Student Admission form with document upload (birth certificate, photo).
   - Detailed Student Profile view (demographics, family contacts, enrollment status).
   - Bulk student CSV import utility.
4. **Daily Classroom Attendance:**
   - Teacher attendance entry grid: one-click "Mark All Present", quick toggles for Absent/Late.
   - Real-time morning summary for the Principal/Front Office.
5. **Counter Fee Collection:**
   - Student fee balance lookup.
   - Cash / Cheque / Bank Transfer receipt recording.
   - Instant printable thermal/A4 fee receipt with school header.

### 2. User Journeys (Phase 1)
- **Journey 1: Onboarding a Student**
  *Registrar enters new admission $\rightarrow$ System generates unique Admission Number $\rightarrow$ Assigns Class 5-B $\rightarrow$ Generates student profile.*
- **Journey 2: Morning Attendance**
  *Grade 5 Teacher logs in at 8:30 AM $\rightarrow$ Opens Attendance tab $\rightarrow$ 28 students marked Present, 2 marked Absent $\rightarrow$ Submits $\rightarrow$ Absent list sent to Office.*
- **Journey 3: Over-the-Counter Fee Payment**
  *Parent arrives at accounting window $\rightarrow$ Accountant enters student Admission No $\rightarrow$ Views pending Q2 tuition fee $\rightarrow$ Records cash payment $\rightarrow$ Prints official receipt.*

### 3. Phase 1 Definition of Done & Acceptance Criteria
- [ ] Role-based route guards prevent unauthorized access (e.g., teachers cannot view fee collections).
- [ ] Student list handles 2,000+ records with zero UI lag via TanStack Query and server pagination.
- [ ] Search input debounced to 300ms, filter state maintained in URL.
- [ ] Printable fee receipt matches standard school stationery requirements.
- [ ] `npm run check` passes 100% clean (typecheck, lint, formatting, test suites, production build).

---

## Phase 2: Academic Assessment & Extended Financials

The objective of Phase 2 is to handle mid-term and annual exams, report cards, complex fee structures, and official student certificates.

### Key Deliverables
1. **Examination & Report Cards:**
   - Examination creation (Mid-term, Final, Unit Tests).
   - Teacher mark-entry sheet with validation against maximum marks.
   - Automated grade calculation (A+, A, B, etc.) and overall rank calculation.
   - PDF Report Card generator featuring school insignia and teacher remarks.
2. **Advanced Fee Rules & Discounts:**
   - Multi-installment schedules with automated late fee calculation.
   - Sibling discount rules and staff-child concession application.
   - Fee Defaulter aging report (30 / 60 / 90 days overdue).
3. **Official Certificate Generation:**
   - Transfer Certificate (TC) generator with serial number tracking.
   - Bonafide student certificate and Character certificate generation.
4. **Homework & Curriculum Tracking:**
   - Daily homework assignment posting with submission deadlines.
   - Lesson planning checklist per subject teacher.

---

## Phase 3: Logistics, Staff Management & Communications

The objective of Phase 3 is to manage staff operations, school transport, physical library circulation, and omnichannel notifications.

### Key Deliverables
1. **Staff & Basic Payroll:**
   - Staff directory with qualifications, assigned classes, and contract terms.
   - Staff leave request and approval workflow.
   - Monthly salary payslip generation with basic allowances and deductions.
2. **Transport & Bus Routes:**
   - Vehicle and driver documentation tracking.
   - Route and stop schedule management.
   - Student bus allocation linked to transport fee schedules.
3. **Library Catalog & Circulation:**
   - Book cataloging with ISBN and accession barcode numbers.
   - Issue, return, and overdue fine calculation.
4. **Omnichannel Communication:**
   - Digital Notice Board pinned on staff and student dashboards.
   - Automated WhatsApp / SMS triggers for attendance absence and fee balance reminders.
   - Front office inquiry ticket tracking.

---

## Phase 4: Hardware Integration, Portals & Intelligence

The objective of Phase 4 is to automate hardware sync, launch self-service portals for parents, and deliver actionable data intelligence.

### Key Deliverables
1. **Hardware Biometric Synchronization:**
   - Windows/Linux agent syncing physical ZKTeco biometric fingerprint/face turnstiles to attendance API.
2. **Self-Service Parent Portal:**
   - Secure parent login view: student attendance history, published report cards, homework feed.
   - Integrated online fee payment (Razorpay / Cashfree / Stripe).
3. **Pragmatic Analytics:**
   - Fee Defaulter Risk Analyzer based on past payment behavior.
   - Chronic Absenteeism Early-Warning System (flagging students dropping below 75% attendance).
   - Timetable conflict validation engine.
4. **Hostel / Dormitory Module (if applicable):**
   - Room and bed allocations, night attendance roll-call, and security gate passes.

---

## Risk Assessment & Mitigation

| Potential Risk | Severity | Mitigation Strategy |
|---|---|---|
| **Data Migration Errors from Spreadsheets** | High | Build dedicated CSV validation tool with preview, error highlighting, and dry-run import mode. |
| **Teacher Resistance to Digital Systems** | Medium | Keep daily attendance and mark entry to under 3 clicks with large, touch-friendly tap targets. |
| **Unreliable Internet Connectivity** | Medium | Offline warning banner (`useOnlineStatus`), client caching via TanStack Query, and resilient local storage. |
| **Hardware Biometric Sync Failures** | Medium | Decoupled queue architecture: local agent caches punches offline and retries syncing once network restores. |
