# Skooly ERP: Single-School Module Architecture

This document defines the complete module catalog for **Skooly**, an all-in-one School ERP designed specifically for a single school. Multi-tenant SaaS layers and redundant external platforms have been refocused into staff, teacher, student, and parent workflows.

---

## Architecture Principles for Single-School ERP

1. **Single Institution Focus:** No cross-tenant routing or multi-school switching overhead. Database and schemas are scoped directly to the school's academic sessions, sections, departments, and staff.
2. **Role-Based Access Control (RBAC):** Granular permissions for 5 core personas:
   - **Administrator:** Full administrative and financial oversight.
   - **Front Office / Registrar:** Admissions, inquiries, visitor logs, certificates.
   - **Teacher / Academic Staff:** Attendance, grading, assignments, lesson planning.
   - **Accountant / Bursar:** Fee collection, payroll, ledger, expenses.
   - **Support Staff (Librarian, Transport, Hostel, Warden):** Specialized operational tools.
3. **Integrated Data Pipeline:** Student records link seamlessly into Attendance, Academics, Fee Invoices, Library cards, Bus routes, and Health profiles.

---

## 1. Core Setup & Administration

The institutional backbone configuring academic calendars, permissions, system data, and official documents.

| Module / Feature | Description | Key Persona |
|---|---|---|
| **School Profile & Academic Sessions** | School metadata, affiliation details, academic years, terms, semesters, working days, and holidays. | Administrator |
| **Class & Section Setup** | Definition of grades, divisions/sections, class teachers, and student capacities. | Administrator |
| **Role & Permission Management (RBAC)** | Role definitions with explicit read/write/delete permissions across all modules. | Administrator |
| **Admissions & Enrollment Pipeline** | Inquiry tracking, online application submission, document upload verification, and enrollment approval. | Registrar / Front Desk |
| **Student Promotion & Transfer** | End-of-term bulk promotion to next grade, retention logic, section reassignments, and transfer tracking. | Registrar / Admin |
| **Certificate Generator** | Templated generation of Bonafide, Transfer (TC), Character, and Leaving Certificates with unique QR verification. | Front Office |
| **Front Office & Visitor Logs** | Admission inquiries, visitor pass generation, postal dispatch/receive registers, and phone call logs. | Front Office |
| **Disciplinary Incident Records** | Behavioral incidents, disciplinary action logs, parent notifications, and resolution tracking. | Admin / Class Teacher |
| **Bulk Data Import & Export** | Safe CSV/Excel bulk onboarding for students, parents, staff, and historical data with Zod validation. | Administrator |
| **Alumni Network Registry** | Graduate registry, graduation batch tracking, alumni directory, and reunion/event history. | Administrator |

---

## 2. Student Information System (SIS) & Demographics

The single source of truth for all student data across their entire school lifecycle.

| Feature | Description | Key Persona |
|---|---|---|
| **Comprehensive Student Profiles** | Enrollment number, admission date, photo, date of birth, blood group, address, emergency contacts. | Registrar / Staff |
| **Parent & Guardian Directory** | Family relationship mapping, sibling linking (enabling family fee discounts), primary contact designations. | Registrar / Accounts |
| **Document Vault** | Secure storage for birth certificates, transfer certificates, immunization charts, and prior mark sheets. | Registrar |
| **Student Health & Medical Records** | Allergy notes, ongoing medications, emergency doctor contacts, routine physical checkup logs. | School Nurse / Admin |
| **Student Timeline & History** | Unified historical ledger of achievements, incident reports, attendance rate, and fee standing. | Admin / Counselor |

---

## 3. Attendance Management

Robust attendance tracking with multiple capture mechanisms for students and staff.

| Feature | Description | Key Persona |
|---|---|---|
| **Daily Period / Classroom Attendance** | Fast, mobile-responsive class attendance register with Present, Absent, Late, and Half-day statuses. | Class Teacher |
| **Biometric & RFID Sync** | Integration agent for on-premise biometric fingerprint or RFID turnstiles (e.g., ZKTeco sync). | Administrator |
| **QR Code / App-Based Attendance** | Rapid check-in using student/staff ID cards scanned via mobile camera. | Staff / Gatekeeper |
| **Absence Alerts & Workflow** | Automatic SMS/WhatsApp notification dispatch to parents upon unexcused morning absence. | System / Admin |
| **Attendance Analytics & Chronic Absence** | Trend reporting, low-attendance threshold warnings (<75% eligibility alert for exams). | Academic Head |

---

## 4. Academic Management & Examination

Curriculum execution, scheduling, examination lifecycle, and student assessment.

| Feature | Description | Key Persona |
|---|---|---|
| **Timetable & Scheduling Engine** | Class schedule grid, teacher assignment, room allocation, and automated conflict detection. | Academic Head |
| **Teacher Substitution Management** | One-click substitute teacher allocation when staff are marked on leave. | Vice Principal |
| **Lesson Planning & Syllabus Tracker** | Syllabus milestones, chapter-wise daily lesson plans, and curriculum pacing trackers. | Teachers / HOD |
| **Homework & Assignment Hub** | Assignment posting, file attachments, submission tracking, and grading feedback. | Teachers / Students |
| **Exam Schedule & Hall Tickets** | Exam calendar definition, room seating arrangement, and printable student hall tickets. | Exam Controller |
| **Assessment & Grading Engine** | Term exams, unit tests, continuous assessments, custom grading scales (GPA, percentages, letter grades). | Teachers / Exam Controller |
| **Report Card Generator** | Configurable printable report cards with institutional crest, teacher remarks, and grade breakdowns. | Exam Controller |
| **Question Bank Management** | Reusable repository of questions categorized by subject, grade level, topic, and difficulty. | Teachers |

---

## 5. Fees & Financial Accounting

Single-school fee structure, collections, invoice generation, discount rules, and operational expenses.

| Feature | Description | Key Persona |
|---|---|---|
| **Fee Structure Configuration** | Academic, tuition, laboratory, transport, library, and extracurricular fee heads per grade. | Accountant |
| **Installments & Term Schedules** | Term-wise due dates, penalty/late-fee rules, and installment breakdowns. | Accountant |
| **Scholarships, Concessions & Waivers** | Merit scholarships, staff-child fee concessions, and sibling discount rules. | Admin / Accountant |
| **Fee Collection & Cash Counter** | Offline counter fee collection with instant printed thermal/PDF receipts and payment mode tracking. | Cashier / Accountant |
| **Online Payment Gateway** | Parent self-service fee payments via UPI, NetBanking, Credit/Debit cards with auto-reconciliation. | Parents / Accountant |
| **Automated Defaulter Management** | Overdue balance aging reports, automated payment reminder notices via SMS/WhatsApp. | Accountant |
| **Expense & Vendor Ledger** | School operational expenditure categorisation, petty cash ledger, and vendor invoice settlement. | Accountant |
| **Financial Summaries & Day-Book** | Daily counter reconciliation, cash-in-hand reports, fee collection ledger, and audit exports. | Administrator |

---

## 6. Staff & Human Resources

End-to-end staff lifecycle management for teaching and non-teaching personnel.

| Feature | Description | Key Persona |
|---|---|---|
| **Staff Directory & Profiles** | Employee records, educational qualifications, background check documents, and contracts. | HR / Admin |
| **Staff Attendance & Biometric Log** | Punch-in/punch-out tracking, biometric integration, and overtime/loss-of-pay calculation. | HR / Admin |
| **Leave Management Workflow** | Leave categories (casual, sick, earned), self-service leave requests, and approval workflow. | HR / Staff |
| **Payroll & Salary Generation** | Monthly payroll computation, allowances (HRA, DA), deductions (PF, Tax, LOP), and payslips. | Accountant / HR |
| **ID Card Printing** | Bulk generation and printing of barcode/QR-enabled staff and student identity cards. | Administrator |
| **Performance & Appraisal Notes** | Internal evaluation records, classroom observation notes, and training logs. | Principal |

---

## 7. Transport & Fleet Management

Safety, route management, and vehicle allocation for the school's transport network.

| Feature | Description | Key Persona |
|---|---|---|
| **Vehicle & Driver Registry** | Bus inventory, fitness certificate validity, insurance dates, and driver/helper documentation. | Transport Manager |
| **Route & Stop Management** | Defined route paths, morning/evening stop schedules, and pickup/drop timings. | Transport Manager |
| **Student Route Allocation** | Assigning students to specific routes and stops, linking automatically to transport fee billing. | Transport Manager |
| **Live Vehicle Tracking (GPS)** | Real-time map view of active school buses during transit with geofence arrival alerts. | Admin / Transport Desk |
| **Driver Trip Interface** | Simple driver app/interface for attendance verification at stops and trip departure logging. | Driver / Conductor |

---

## 8. Library Management

Circulation and digital cataloging of physical and electronic educational resources.

| Feature | Description | Key Persona |
|---|---|---|
| **Book Catalog & Barcoding** | Title, author, ISBN, accession number, genre categorization, and barcode label generation. | Librarian |
| **Circulation (Issue & Return)** | Fast issue and return scanning using student/staff barcode or enrollment number. | Librarian |
| **Overdue & Fine Calculation** | Automated fine tracking for late returns with payment receipt generation. | Librarian |
| **Digital Resources & E-Books** | Repository of downloadable digital notes, curriculum PDFs, and reference papers. | Students / Teachers |

---

## 9. Inventory, Assets & Facilities

Tracking school supplies, stationery, laboratory equipment, and physical infrastructure.

| Feature | Description | Key Persona |
|---|---|---|
| **Asset & Equipment Register** | Classrooms, lab equipment, computers, projectors, sports equipment with serial numbers. | Operations Admin |
| **Consumable Stock & Inventory** | Uniforms, textbooks, stationery, cleaning supplies, and threshold replenishment alerts. | Store Keeper |
| **Item Requisition & Issue Tracking** | Departmental requests for materials, approval by admin, and issue logs. | Department Heads |
| **Facility Maintenance Requests** | Electrical, plumbing, and IT tickets raised by staff with resolution status tracking. | Maintenance Staff |

---

## 10. Hostel & Dormitory Management (Optional / Residential)

For residential and boarding schools managing living quarters and resident students.

| Feature | Description | Key Persona |
|---|---|---|
| **Hostel Blocks & Rooms** | Building blocks, floors, room capacities, and bed assignment matrix. | Warden |
| **Resident Student Allocation** | Student room assignments, room change history, and hostel fee linkage. | Warden |
| **Hostel Attendance & Night Roll-Call** | Evening roll call verification and curfew compliance monitoring. | Warden |
| **Gate Pass & Leave Permissions** | Parent-approved outing and home-leave requests with digital security checkout. | Warden / Security |

---

## 11. Communication & Community Notice Board

Unified institutional broadcast and notification hub.

| Feature | Description | Key Persona |
|---|---|---|
| **Digital Notice Board** | Categorized announcements (Academic, General, Emergency, Sports) pinned to portal dashboards. | Admin / Principal |
| **Omnichannel Alerts (WhatsApp, SMS, Email)** | Transactional alerts (Fees due, emergency closure, exam schedules) sent via verified gateways. | Administrator |
| **School Calendar & Events** | Term dates, sports meets, parent-teacher conferences, and cultural events calendar. | Whole School |
| **Parent Query Helpdesk** | Inbound parent inquiries, support ticketing, and designated staff responses. | Front Office / Teachers |

---

## 12. Smart Operational Utilities (Clean AI & Analytics)

Pragmatic, deterministic data analytics that assist staff without marketing buzzwords.

| Feature | Description | Practical Utility |
|---|---|---|
| **Fee Defaulter Risk Analyzer** | Identifies patterns of delayed installments to notify accounts staff before term end. | Reduces bad debts and improves cash flow. |
| **Attendance Anomaly Detection** | Flags consecutive absent days or declining weekly attendance trends for counseling intervention. | Prevents student dropouts. |
| **Timetable Conflict Validator** | Verifies zero double-booking for shared teachers, labs, and sports grounds during schedule compilation. | Saves days of manual schedule adjustments. |
| **Executive Management Summary** | High-density administrative dashboard showing admissions pipeline, collection vs target, and staff attendance. | Daily morning brief for Principal & Director. |

---

## 13. System Infrastructure & Security

Underlying engineering utilities supporting the single-school deployment.

| Feature | Purpose |
|---|---|
| **Audit Logs & Activity Trail** | Immutable audit records of critical operations (fee cancellations, mark alterations, profile edits). |
| **Automated Database Backups** | Scheduled automated PostgreSQL backups with point-in-time recovery verification. |
| **Hardware Biometric Agent** | Lightweight local service syncing physical attendance machines to the central NestJS API. |
| **Role-Restricted Views** | Dynamic frontend view filtering ensuring teachers, accountants, and staff only see authorized sections. |
