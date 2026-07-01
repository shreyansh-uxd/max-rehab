import { addDays, addHours, formatISO, subDays, subHours, subMinutes } from "date-fns";

// Stable "now" so SSR and client hydration produce identical strings.
export const NOW = new Date("2026-06-30T09:00:00.000Z");
function nowClone() { return new Date(NOW); }

export type PatientStatus = "Active" | "Onboarding" | "Discharged" | "On Hold";
export type AppointmentStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "No Show";
export type Tag = "Post-Op" | "Sports" | "Chronic" | "Geriatric" | "Pediatric" | "Neuro" | "Cardiac";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  condition: string;
  status: PatientStatus;
  therapist: string;
  therapistId: string;
  lastVisit: string;
  nextVisit: string;
  adherence: number;
  pain: number;
  tags: Tag[];
  avatar?: string;
  insurance: string;
  address: string;
  joined: string;
}

export interface Therapist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  email: string;
  phone: string;
  rating: number;
  patients: number;
  availability: "Available" | "Busy" | "Off";
  workload: number; // 0-100
  location: string;
  experience: number;
  avatar?: string;
}

export interface Appointment {
  id: string;
  patient: string;
  patientId: string;
  therapist: string;
  therapistId: string;
  service: string;
  start: string;
  duration: number;
  status: AppointmentStatus;
  location: string;
  type: "In-Clinic" | "Home Visit" | "Telehealth";
  payment: "Paid" | "Pending" | "Insurance";
}

const firstNames = ["Aarav","Sophia","Liam","Olivia","Noah","Emma","Ethan","Ava","Mia","Lucas","Isla","Aria","Kabir","Zara","Maya","Rohan","Anika","Diego","Hannah","Ivan","Jasmin","Kenji","Leo","Nadia","Omar","Priya","Quinn","Ravi","Sasha","Tariq"];
const lastNames = ["Patel","Garcia","Smith","Khan","Nguyen","Müller","Johnson","Romano","Park","Singh","Hassan","Brown","Yamamoto","Silva","Cohen","Hughes","Ng","Ahmed","Larsen","Costa"];
const conditions = ["ACL Reconstruction","Rotator Cuff Tear","Lower Back Pain","Sciatica","Post-Stroke","Knee Replacement","Frozen Shoulder","Plantar Fasciitis","Tennis Elbow","Hip Replacement","Whiplash","Spinal Stenosis"];
const services = ["Manual Therapy","Sports Rehab","Neuro Rehab","Hydrotherapy","Dry Needling","Post-Op Rehab","Pediatric Therapy","Geriatric Care","Cardiac Rehab","Pelvic Floor"];
const titles = ["DPT","MSc PT","BPT","Sports PT","Neuro PT"];
const specialties = ["Sports Rehab","Manual Therapy","Neuro Rehab","Pediatric","Geriatric","Post-Op","Pelvic Floor"];
const locations = ["Downtown Clinic","Westside Branch","Northgate Center","Home Visit"];
const tagsList: Tag[] = ["Post-Op","Sports","Chronic","Geriatric","Pediatric","Neuro","Cardiac"];

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }
function seedFloat(i: number) { return ((Math.sin(i * 9301 + 49297) + 1) / 2); }
function pickTags(i: number): Tag[] {
  const count = 1 + Math.floor(seedFloat(i) * 2.5);
  const set = new Set<Tag>();
  for (let k = 0; k < count; k++) set.add(rand(tagsList, i + k * 3));
  return [...set];
}

export const therapists: Therapist[] = Array.from({ length: 14 }).map((_, i) => {
  const fn = rand(firstNames, i * 3 + 1);
  const ln = rand(lastNames, i * 7 + 2);
  return {
    id: `t_${1000 + i}`,
    name: `${fn} ${ln}`,
    title: rand(titles, i),
    specialty: rand(specialties, i + 2),
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@maxrehab.co`,
    phone: `+1 (415) 555-0${100 + i}`,
    rating: 4.2 + seedFloat(i) * 0.8,
    patients: 8 + Math.floor(seedFloat(i + 5) * 24),
    availability: (["Available","Busy","Off"] as const)[i % 3],
    workload: 40 + Math.floor(seedFloat(i + 9) * 55),
    location: rand(locations, i),
    experience: 3 + Math.floor(seedFloat(i + 11) * 18),
  };
});

export const patients: Patient[] = Array.from({ length: 42 }).map((_, i) => {
  const fn = rand(firstNames, i * 5);
  const ln = rand(lastNames, i * 3 + 4);
  const t = therapists[i % therapists.length];
  const statuses: PatientStatus[] = ["Active","Onboarding","Active","Active","On Hold","Discharged"];
  return {
    id: `p_${2000 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
    phone: `+1 (628) 555-${200 + i}`,
    age: 18 + Math.floor(seedFloat(i) * 65),
    gender: (["Male","Female","Other"] as const)[i % 3],
    condition: rand(conditions, i),
    status: statuses[i % statuses.length],
    therapist: t.name,
    therapistId: t.id,
  lastVisit: formatISO(subDays(nowClone(), Math.floor(seedFloat(i) * 30))),
    nextVisit: formatISO(addDays(nowClone(), 1 + Math.floor(seedFloat(i + 7) * 14))),
    adherence: 50 + Math.floor(seedFloat(i + 13) * 50),
    pain: 1 + Math.floor(seedFloat(i + 17) * 9),
    tags: pickTags(i),
    insurance: ["BlueCross","Aetna","United","Self-Pay","Cigna"][i % 5],
    address: `${100 + i} Market St, San Francisco, CA`,
    joined: formatISO(subDays(nowClone(), 30 + Math.floor(seedFloat(i + 23) * 400))),
  };
});

export const appointments: Appointment[] = Array.from({ length: 38 }).map((_, i) => {
  const p = patients[i % patients.length];
  const t = therapists[i % therapists.length];
  const dayOffset = (i % 14) - 6;
  const start = addHours(addDays(nowClone(), dayOffset), 8 + (i % 9));
  const statuses: AppointmentStatus[] = ["Scheduled","Completed","Scheduled","In Progress","Completed","Cancelled","Scheduled","No Show","Completed"];
  return {
    id: `a_${3000 + i}`,
    patient: p.name,
    patientId: p.id,
    therapist: t.name,
    therapistId: t.id,
    service: rand(services, i),
    start: formatISO(start),
    duration: [30, 45, 60][i % 3],
    status: statuses[i % statuses.length],
    location: rand(locations, i),
    type: (["In-Clinic","Home Visit","Telehealth"] as const)[i % 3],
    payment: (["Paid","Pending","Insurance"] as const)[i % 3],
  };
});

export interface Programme {
  id: string;
  name: string;
  category: string;
  exercises: number;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Hard";
  assigned: number;
  completion: number;
}

export const programmes: Programme[] = [
  { id: "pg_1", name: "Post-ACL Recovery (8 wk)", category: "Knee", exercises: 14, duration: "8 weeks", difficulty: "Moderate", assigned: 23, completion: 78 },
  { id: "pg_2", name: "Shoulder Mobility Restore", category: "Shoulder", exercises: 9, duration: "4 weeks", difficulty: "Easy", assigned: 17, completion: 84 },
  { id: "pg_3", name: "Lower Back Strengthening", category: "Spine", exercises: 12, duration: "6 weeks", difficulty: "Moderate", assigned: 31, completion: 71 },
  { id: "pg_4", name: "Post-Stroke Gait Training", category: "Neuro", exercises: 16, duration: "12 weeks", difficulty: "Hard", assigned: 11, completion: 62 },
  { id: "pg_5", name: "Hip Replacement Rehab", category: "Hip", exercises: 11, duration: "10 weeks", difficulty: "Moderate", assigned: 14, completion: 81 },
  { id: "pg_6", name: "Pediatric Coordination", category: "Pediatric", exercises: 8, duration: "Ongoing", difficulty: "Easy", assigned: 9, completion: 88 },
  { id: "pg_7", name: "Cardiac Phase II", category: "Cardiac", exercises: 10, duration: "6 weeks", difficulty: "Moderate", assigned: 7, completion: 74 },
  { id: "pg_8", name: "Plantar Fasciitis Relief", category: "Foot", exercises: 6, duration: "3 weeks", difficulty: "Easy", assigned: 19, completion: 90 },
];

export const aiConversations = Array.from({ length: 22 }).map((_, i) => ({
  id: `c_${4000 + i}`,
  patient: patients[i % patients.length].name,
  patientId: patients[i % patients.length].id,
  topic: ["Pain management","Exercise help","Appointment booking","Medication query","Recovery tips","Insurance question"][i % 6],
  messages: 4 + (i % 18),
  confidence: 0.6 + seedFloat(i) * 0.39,
  status: (["Resolved","Escalated","Open","Resolved","Resolved"] as const)[i % 5],
  satisfaction: i % 7 === 0 ? null : 3 + Math.floor(seedFloat(i) * 3),
  startedAt: formatISO(subDays(nowClone(), Math.floor(seedFloat(i) * 14))),
}));

export const services_list = [
  { id: "s_1", name: "Initial Assessment", category: "Evaluation", price: 120, duration: 60, therapists: 8, status: "Active" },
  { id: "s_2", name: "Manual Therapy", category: "Therapy", price: 95, duration: 45, therapists: 11, status: "Active" },
  { id: "s_3", name: "Sports Rehab Session", category: "Rehab", price: 110, duration: 60, therapists: 6, status: "Active" },
  { id: "s_4", name: "Home Visit – Standard", category: "Home Visit", price: 180, duration: 60, therapists: 5, status: "Active" },
  { id: "s_5", name: "Hydrotherapy", category: "Therapy", price: 130, duration: 45, therapists: 4, status: "Active" },
  { id: "s_6", name: "Pediatric Therapy", category: "Specialty", price: 105, duration: 45, therapists: 3, status: "Active" },
  { id: "s_7", name: "Telehealth Follow-up", category: "Virtual", price: 60, duration: 30, therapists: 9, status: "Active" },
  { id: "s_8", name: "Group Recovery Class", category: "Group", price: 45, duration: 60, therapists: 2, status: "Paused" },
];

export const locations_list = [
  { id: "l_1", name: "Downtown Clinic", address: "200 Market St, San Francisco", rooms: 8, staff: 14, hours: "Mon–Sat, 7:00–20:00", phone: "+1 (415) 555-0100", status: "Open" },
  { id: "l_2", name: "Westside Branch", address: "1200 Sunset Blvd, San Francisco", rooms: 5, staff: 9, hours: "Mon–Fri, 8:00–19:00", phone: "+1 (415) 555-0110", status: "Open" },
  { id: "l_3", name: "Northgate Center", address: "55 Northgate Plaza, San Rafael", rooms: 6, staff: 11, hours: "Mon–Sat, 7:30–19:30", phone: "+1 (415) 555-0120", status: "Open" },
  { id: "l_4", name: "Eastbay Studio", address: "812 Broadway, Oakland", rooms: 4, staff: 7, hours: "Tue–Sat, 9:00–18:00", phone: "+1 (510) 555-0130", status: "Renovation" },
];

export const invoices = Array.from({ length: 18 }).map((_, i) => {
  const p = patients[i % patients.length];
  const amounts = [120, 180, 95, 240, 60, 305, 145, 410];
  return {
    id: `INV-${10240 + i}`,
    patient: p.name,
    patientId: p.id,
    amount: amounts[i % amounts.length],
    status: (["Paid","Pending","Overdue","Paid","Insurance","Paid"] as const)[i % 6],
    issued: formatISO(subDays(nowClone(), i * 2)),
    due: formatISO(addDays(nowClone(), 14 - i)),
    method: (["Card","Insurance","Bank","Card"] as const)[i % 4],
  };
});

export const documents = Array.from({ length: 16 }).map((_, i) => ({
  id: `d_${5000 + i}`,
  name: ["Consent Form.pdf","MRI Report.pdf","Treatment Plan.docx","Invoice.pdf","Insurance Claim.pdf","Exercise Sheet.pdf"][i % 6],
  patient: patients[i % patients.length].name,
  patientId: patients[i % patients.length].id,
  type: ["Consent","Report","Plan","Invoice","Insurance","Exercise"][i % 6],
  size: `${(0.3 + seedFloat(i) * 4).toFixed(1)} MB`,
  uploaded: formatISO(subDays(nowClone(), Math.floor(seedFloat(i) * 30))),
  uploadedBy: therapists[i % therapists.length].name,
}));

export function statusTone(status: string): "primary" | "success" | "warning" | "info" | "destructive" | "muted" {
  const s = status.toLowerCase();
  if (["active","completed","paid","resolved","open","available","signed","verified"].includes(s)) return "success";
  if (["scheduled","in progress","insurance","onboarding","pending","sent","draft"].includes(s)) return "info";
  if (["on hold","busy","escalated","paused","renovation","expired","review"].includes(s)) return "warning";
  if (["cancelled","no show","overdue","discharged","off","rejected","void"].includes(s)) return "destructive";
  return "muted";
}

// ================== EMR / MEDICAL RECORDS ==================

export type RecoveryStage = "Assessment" | "Acute" | "Sub-Acute" | "Strengthening" | "Return-to-Sport" | "Maintenance";

export interface MedicalRecord {
  patientId: string;
  mrn: string;
  dob: string;
  bloodType: string;
  height: string;
  weight: string;
  bmi: number;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  recoveryStage: RecoveryStage;
  recoveryScore: number;
  allergies: string[];
  medications: { name: string; dose: string; freq: string; since: string }[];
  surgeries: { name: string; date: string; surgeon: string; hospital: string }[];
  chronicConditions: string[];
  familyHistory: string[];
  lifestyle: { smoking: string; alcohol: string; activity: string; occupation: string };
  emergency: { name: string; relation: string; phone: string };
  lastUpdated: string;
}

const stages: RecoveryStage[] = ["Assessment","Acute","Sub-Acute","Strengthening","Return-to-Sport","Maintenance"];
const bloods = ["O+","A+","B+","AB+","O-","A-"];
const meds = [
  { name: "Ibuprofen", dose: "400mg", freq: "TID PRN" },
  { name: "Naproxen", dose: "500mg", freq: "BID" },
  { name: "Acetaminophen", dose: "650mg", freq: "QID PRN" },
  { name: "Cyclobenzaprine", dose: "10mg", freq: "HS" },
  { name: "Gabapentin", dose: "300mg", freq: "TID" },
];
const allergyPool = ["Penicillin","Latex","Peanuts","Sulfa","NSAIDs","Contrast dye","None known"];
const chronicPool = ["Hypertension","Type 2 Diabetes","Asthma","Hypothyroidism","Osteoarthritis","GERD"];

export const medicalRecords: Record<string, MedicalRecord> = Object.fromEntries(
  patients.map((p, i) => {
    const stage = stages[i % stages.length];
    const height = 155 + Math.floor(seedFloat(i) * 40);
    const weight = 55 + Math.floor(seedFloat(i + 3) * 45);
    return [p.id, {
      patientId: p.id,
      mrn: `MRN-${100000 + i}`,
      dob: formatISO(subDays(nowClone(), p.age * 365 + Math.floor(seedFloat(i) * 300))),
      bloodType: bloods[i % bloods.length],
      height: `${height} cm`,
      weight: `${weight} kg`,
      bmi: +(weight / ((height / 100) ** 2)).toFixed(1),
      primaryDiagnosis: p.condition,
      secondaryDiagnoses: i % 3 === 0 ? [conditions[(i + 3) % conditions.length]] : [],
      recoveryStage: stage,
      recoveryScore: 40 + Math.floor(seedFloat(i + 4) * 55),
      allergies: [allergyPool[i % allergyPool.length]],
      medications: meds.slice(0, 1 + (i % 3)).map((m, k) => ({
        ...m,
        since: formatISO(subDays(nowClone(), 30 + k * 60)),
      })),
      surgeries: i % 2 === 0 ? [{
        name: p.condition.includes("Reconstruction") || p.condition.includes("Replacement") ? p.condition : "Arthroscopic repair",
        date: formatISO(subDays(nowClone(), 60 + Math.floor(seedFloat(i) * 200))),
        surgeon: `Dr. ${rand(lastNames, i + 2)}`,
        hospital: "SF General",
      }] : [],
      chronicConditions: i % 4 === 0 ? [chronicPool[i % chronicPool.length]] : [],
      familyHistory: ["Cardiovascular disease","Osteoporosis"].slice(0, (i % 2) + 1),
      lifestyle: {
        smoking: i % 5 === 0 ? "Former" : "Never",
        alcohol: ["Occasional","Social","None"][i % 3],
        activity: ["Sedentary","Light","Moderate","Active"][i % 4],
        occupation: ["Software Engineer","Teacher","Retired","Athlete","Nurse","Designer"][i % 6],
      },
      emergency: {
        name: `${rand(firstNames, i + 9)} ${rand(lastNames, i + 11)}`,
        relation: ["Spouse","Parent","Sibling","Child"][i % 4],
        phone: `+1 (628) 555-${400 + i}`,
      },
      lastUpdated: formatISO(subDays(nowClone(), Math.floor(seedFloat(i) * 12))),
    }];
  }),
);

// ================== CLINICAL NOTES ==================
export type NoteType = "SOAP" | "Progress" | "Assessment" | "Discharge";
export interface ClinicalNote {
  id: string;
  patientId: string;
  type: NoteType;
  title: string;
  author: string;
  date: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  body?: string;
  attachments: number;
  version: number;
}

export const clinicalNotes: ClinicalNote[] = patients.flatMap((p, pi) =>
  Array.from({ length: 3 + (pi % 3) }).map((_, i) => {
    const types: NoteType[] = ["SOAP","Progress","Assessment","Discharge"];
    const type = types[(pi + i) % types.length];
    return {
      id: `n_${pi * 10 + i}`,
      patientId: p.id,
      type,
      title: `${type} note – Session ${i + 1}`,
      author: therapists[(pi + i) % therapists.length].name,
      date: formatISO(subDays(nowClone(), i * 5 + (pi % 4))),
      subjective: type === "SOAP" ? "Patient reports 3/10 pain, improved sleep. Denies numbness." : undefined,
      objective: type === "SOAP" ? "AROM shoulder flexion 145°. Strength 4/5 deltoid. Palpable tenderness AC joint." : undefined,
      assessment: type === "SOAP" ? "Continued progress. Consistent with expected 6-week recovery timeline." : undefined,
      plan: type === "SOAP" ? "Progress resistance band exercises. Add scapular stabilization. Next session Thursday." : undefined,
      body: type !== "SOAP" ? "Patient tolerated session well. Continued adherence to home programme observed via app logs." : undefined,
      attachments: i % 3,
      version: 1 + (i % 3),
    };
  }),
);

// ================== ASSESSMENTS ==================
export interface AssessmentEntry {
  id: string;
  patientId: string;
  date: string;
  pain: number;
  romShoulder: number;
  romKnee: number;
  strength: number;
  mobility: number;
  balance: number;
  outcomeScore: number;
  notes: string;
}

export const assessments: AssessmentEntry[] = patients.flatMap((p, pi) =>
  Array.from({ length: 8 }).map((_, i) => ({
    id: `as_${pi}_${i}`,
    patientId: p.id,
    date: formatISO(subDays(nowClone(), (7 - i) * 7)),
    pain: Math.max(1, 8 - i - (pi % 2)),
    romShoulder: 90 + i * 8 + (pi % 10),
    romKnee: 80 + i * 10 + (pi % 8),
    strength: 2 + Math.min(3, Math.floor(i / 2)),
    mobility: 40 + i * 7,
    balance: 45 + i * 6,
    outcomeScore: 40 + i * 6 + (pi % 6),
    notes: i === 7 ? "Latest re-assessment. Ready to progress phase." : "Interim measure.",
  })),
);

// ================== TREATMENT PLAN ==================
export interface TreatmentPlan {
  patientId: string;
  programme: string;
  startDate: string;
  reviewDate: string;
  goals: { text: string; target: string; progress: number }[];
  milestones: { label: string; due: string; done: boolean }[];
}

export const treatmentPlans: Record<string, TreatmentPlan> = Object.fromEntries(
  patients.map((p, i) => [p.id, {
    patientId: p.id,
    programme: programmes[i % programmes.length].name,
    startDate: formatISO(subDays(nowClone(), 20 + (i % 40))),
    reviewDate: formatISO(addDays(nowClone(), 14 - (i % 10))),
    goals: [
      { text: "Restore full range of motion", target: "150°", progress: 60 + (i % 30) },
      { text: "Return to sport-specific movements", target: "8 weeks", progress: 40 + (i % 40) },
      { text: "Reduce pain during ADLs", target: "≤ 2/10", progress: 55 + (i % 30) },
    ],
    milestones: [
      { label: "Initial assessment", due: formatISO(subDays(nowClone(), 20)), done: true },
      { label: "Phase 1: Pain & Swelling", due: formatISO(subDays(nowClone(), 10)), done: true },
      { label: "Phase 2: Mobility", due: formatISO(addDays(nowClone(), 4)), done: (i % 2) === 0 },
      { label: "Phase 3: Strength", due: formatISO(addDays(nowClone(), 20)), done: false },
      { label: "Phase 4: Return to activity", due: formatISO(addDays(nowClone(), 45)), done: false },
    ],
  }]),
);

// ================== EMR DOCUMENTS ==================
export const documentFolders = [
  "Prescriptions","MRI","CT Scan","X-Ray","Lab Reports","Referral Letters",
  "Insurance","Invoices","Discharge Summary","Assessments","Therapist Notes","Images",
] as const;
export type DocumentFolder = typeof documentFolders[number];

export interface MedicalDocument {
  id: string;
  patientId: string;
  folder: DocumentFolder;
  name: string;
  size: string;
  uploaded: string;
  uploadedBy: string;
  version: number;
  ocr: boolean;
  mime: "pdf" | "image" | "doc";
}

export const medicalDocuments: MedicalDocument[] = patients.flatMap((p, pi) =>
  documentFolders.flatMap((folder, fi) =>
    Array.from({ length: (pi + fi) % 3 === 0 ? 2 : 1 }).map((_, i) => ({
      id: `md_${pi}_${fi}_${i}`,
      patientId: p.id,
      folder,
      name: `${folder} ${i + 1}.pdf`,
      size: `${(0.3 + seedFloat(pi + fi + i) * 4.2).toFixed(1)} MB`,
      uploaded: formatISO(subDays(nowClone(), Math.floor(seedFloat(pi + fi + i) * 60))),
      uploadedBy: therapists[(pi + fi) % therapists.length].name,
      version: 1 + ((pi + i) % 3),
      ocr: (pi + fi + i) % 3 !== 0,
      mime: (["pdf","image","doc"] as const)[(pi + fi + i) % 3],
    })),
  ),
);

// ================== CONSENT FORMS ==================
export type ConsentStatus = "Signed" | "Pending" | "Expired" | "Rejected";

export interface ConsentForm {
  id: string;
  patientId: string;
  patient: string;
  template: string;
  status: ConsentStatus;
  sentAt: string;
  signedAt: string | null;
  expiresAt: string;
  version: string;
  witness: string;
  representative: string;
  ipAddress: string;
  device: string;
  location: string;
  appointmentId?: string;
}

const consentTemplates = [
  "General Treatment Consent",
  "Home Visit Authorization",
  "Photography & Media Release",
  "Telehealth Consent",
  "Data Sharing – Insurance",
  "Manual Therapy Consent",
  "Minor Treatment Consent",
];

export const consentForms: ConsentForm[] = patients.flatMap((p, pi) =>
  Array.from({ length: 2 + (pi % 3) }).map((_, i) => {
    const statuses: ConsentStatus[] = ["Signed","Pending","Signed","Expired","Signed","Rejected"];
    const status = statuses[(pi + i) % statuses.length];
    const sent = subDays(nowClone(), 3 + i * 4 + (pi % 20));
    return {
      id: `cf_${pi}_${i}`,
      patientId: p.id,
      patient: p.name,
      template: consentTemplates[(pi + i) % consentTemplates.length],
      status,
      sentAt: formatISO(sent),
      signedAt: status === "Signed" ? formatISO(addHours(sent, 2 + i)) : null,
      expiresAt: formatISO(addDays(sent, 180)),
      version: `v${1 + (i % 3)}.${(pi + i) % 10}`,
      witness: therapists[(pi + i + 1) % therapists.length].name,
      representative: therapists[(pi + i) % therapists.length].name,
      ipAddress: `10.0.${(pi % 255)}.${(i * 17) % 255}`,
      device: (["iPhone 15 · iOS 18","Pixel 8 · Android 14","iPad Pro","Samsung S24"] as const)[(pi + i) % 4],
      location: ["San Francisco, CA","Oakland, CA","Berkeley, CA","San Rafael, CA"][(pi + i) % 4],
      appointmentId: appointments[(pi + i) % appointments.length].id,
    };
  }),
);

// ================== HOME VISITS ==================
export interface HomeVisit {
  id: string;
  patientId: string;
  patient: string;
  therapistId: string;
  therapist: string;
  address: string;
  date: string;
  duration: number;
  status: "Scheduled" | "Completed" | "Cancelled" | "En Route";
  treatment: string;
  notes: string;
  followUp: string;
}

export const homeVisits: HomeVisit[] = Array.from({ length: 24 }).map((_, i) => {
  const p = patients[i % patients.length];
  const t = therapists[i % therapists.length];
  const statuses = ["Scheduled","Completed","En Route","Completed","Cancelled","Completed"] as const;
  return {
    id: `hv_${6000 + i}`,
    patientId: p.id,
    patient: p.name,
    therapistId: t.id,
    therapist: t.name,
    address: p.address,
    date: formatISO(addHours(addDays(nowClone(), (i % 14) - 4), 9 + (i % 8))),
    duration: [45, 60, 90][i % 3],
    status: statuses[i % statuses.length],
    treatment: services[i % services.length],
    notes: "Patient tolerated session. Continued home exercise programme reviewed.",
    followUp: formatISO(addDays(nowClone(), 7 + (i % 5))),
  };
});

// ================== ACTIVITY TIMELINE ==================
export type ActivityKind = "appointment" | "message" | "document" | "assessment" | "ai" | "note" | "consent";
export interface ActivityEvent {
  id: string;
  patientId: string;
  kind: ActivityKind;
  title: string;
  description: string;
  actor: string;
  at: string;
}

export const activityFeed: ActivityEvent[] = patients.flatMap((p, pi) => {
  const kinds: ActivityKind[] = ["appointment","message","document","assessment","ai","note","consent"];
  return kinds.map((kind, i) => ({
    id: `ev_${pi}_${i}`,
    patientId: p.id,
    kind,
    title: {
      appointment: "Attended appointment",
      message: "Sent message",
      document: "Uploaded document",
      assessment: "Completed assessment",
      ai: "AI Copilot conversation",
      note: "Clinical note added",
      consent: "Signed consent form",
    }[kind],
    description: {
      appointment: `${services[(pi + i) % services.length]} with ${therapists[pi % therapists.length].name}`,
      message: "Discussed home exercise progression",
      document: `${documentFolders[i % documentFolders.length]} · 1.2 MB`,
      assessment: "ROM +12° · Pain 3/10",
      ai: "Care Copilot summarised recent progress",
      note: "SOAP note by treating therapist",
      consent: consentTemplates[(pi + i) % consentTemplates.length],
    }[kind],
    actor: therapists[(pi + i) % therapists.length].name,
    at: formatISO(subHours(nowClone(), i * 6 + pi)),
  }));
});

// ================== BOOKING / SCHEDULING ==================
export interface Clinic { id: string; name: string; rooms: string[]; }

export const clinics: Clinic[] = locations_list.map((l) => ({
  id: l.id,
  name: l.name,
  rooms: Array.from({ length: l.rooms }).map((_, r) => `Room ${r + 1}`),
}));

export const bookableServices = [
  { id: "bs_1", name: "Physical Therapy", duration: 45, price: 110, icon: "activity" },
  { id: "bs_2", name: "Occupational Therapy", duration: 45, price: 115, icon: "hand" },
  { id: "bs_3", name: "Speech Therapy", duration: 45, price: 120, icon: "message" },
  { id: "bs_4", name: "Neurological Rehabilitation", duration: 60, price: 160, icon: "brain" },
  { id: "bs_5", name: "Sports Rehabilitation", duration: 60, price: 140, icon: "dumbbell" },
  { id: "bs_6", name: "Home Visit", duration: 60, price: 180, icon: "car" },
  { id: "bs_7", name: "Telehealth", duration: 30, price: 60, icon: "video" },
];

export function slotsForDate(dateISO: string): { period: "Morning" | "Afternoon" | "Evening"; slots: string[] }[] {
  const base = new Date(dateISO);
  const mk = (h: number, m: number) => {
    const d = new Date(base); d.setHours(h, m, 0, 0);
    return formatISO(d).slice(11, 16);
  };
  return [
    { period: "Morning", slots: [mk(8,0), mk(8,45), mk(9,30), mk(10,15), mk(11,0), mk(11,45)] },
    { period: "Afternoon", slots: [mk(13,0), mk(13,45), mk(14,30), mk(15,15), mk(16,0)] },
    { period: "Evening", slots: [mk(17,0), mk(17,45), mk(18,30)] },
  ];
}

// ================== MESSAGE THREADS ==================
export interface MessageThread {
  id: string;
  patientId: string;
  patient: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  channel: "In-App" | "SMS" | "Email";
  messages: { id: string; from: "patient" | "clinic" | "ai"; text: string; at: string }[];
}

export const messageThreads: MessageThread[] = patients.slice(0, 18).map((p, i) => ({
  id: `mt_${7000 + i}`,
  patientId: p.id,
  patient: p.name,
  channel: (["In-App","SMS","Email"] as const)[i % 3],
  lastMessage: [
    "Thanks, I'll try the new exercise tonight!",
    "Can we reschedule Thursday's appointment?",
    "Feeling much better after last session.",
    "Uploaded my latest MRI report.",
  ][i % 4],
  lastAt: formatISO(subMinutes(nowClone(), i * 27 + 3)),
  unread: i < 3 ? (i + 1) : 0,
  messages: Array.from({ length: 6 }).map((_, k) => ({
    id: `msg_${i}_${k}`,
    from: (["patient","clinic","patient","clinic","ai","clinic"] as const)[k],
    text: [
      "Hi, I have a question about my new exercise plan.",
      "Of course — which exercise are you unsure about?",
      "The single-leg balance one, I'm not sure about form.",
      "Great question. Keep your knee stacked over your toes and engage your core.",
      "Summary: Patient asked for clarification on single-leg balance. Guidance provided.",
      "Let me know how it feels tomorrow.",
    ][k],
    at: formatISO(subMinutes(nowClone(), (6 - k) * 12 + i * 30)),
  })),
}));

// ================== HELPERS ==================
export function getPatient(id: string) { return patients.find((p) => p.id === id); }
export function getMedicalRecord(id: string) { return medicalRecords[id]; }
export function getTreatmentPlan(id: string) { return treatmentPlans[id]; }
export function notesFor(id: string) { return clinicalNotes.filter((n) => n.patientId === id); }
export function assessmentsFor(id: string) { return assessments.filter((a) => a.patientId === id); }
export function documentsFor(id: string) { return medicalDocuments.filter((d) => d.patientId === id); }
export function consentsFor(id: string) { return consentForms.filter((c) => c.patientId === id); }
export function appointmentsFor(id: string) { return appointments.filter((a) => a.patientId === id); }
export function homeVisitsFor(id: string) { return homeVisits.filter((h) => h.patientId === id); }
export function activityFor(id: string) { return activityFeed.filter((e) => e.patientId === id); }
export function invoicesFor(id: string) { return invoices.filter((i) => i.patientId === id); }