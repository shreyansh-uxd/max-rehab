import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Car,
  Dumbbell,
  LineChart,
  MessageSquare,
  Bot,
  FileText,
  CreditCard,
  Hospital,
  Building2,
  type LucideIcon,
  BookOpen,
  Sliders,
  Activity,
  ClipboardList,
  ShieldCheck,
  FolderHeart,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  group?: string;
  children?: { label: string; to: string; icon: LucideIcon }[];
}

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Operations",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Patients", to: "/patients", icon: Users, badge: "42" },
      { label: "Therapists", to: "/therapists", icon: Stethoscope },
      { label: "Appointments", to: "/appointments", icon: CalendarDays, badge: "12" },
      { label: "Home Visits", to: "/home-visits", icon: Car },
    ],
  },
  {
    label: "EMR",
    items: [
      { label: "EMR Dashboard", to: "/emr", icon: FolderHeart },
      { label: "Patient Records", to: "/emr/records", icon: ClipboardList },
      { label: "Consent Forms", to: "/emr/consent", icon: ShieldCheck },
      { label: "Consent Templates", to: "/emr/templates", icon: FileText },
    ],
  },
  {
    label: "Care",
    items: [
      { label: "Recovery Programmes", to: "/programmes", icon: Dumbbell },
      { label: "Recovery Progress", to: "/progress", icon: LineChart },
      { label: "Messages", to: "/messages", icon: MessageSquare, badge: "3" },
    ],
  },
  {
    label: "AI",
    items: [
      { label: "AI Dashboard", to: "/ai", icon: Bot },
      { label: "AI Logs", to: "/ai/logs", icon: Activity },
      { label: "Knowledge Base", to: "/ai/knowledge", icon: BookOpen },
      { label: "AI Configuration", to: "/ai/config", icon: Sliders },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Documents", to: "/documents", icon: FileText },
      { label: "Billing", to: "/billing", icon: CreditCard },
      { label: "Services", to: "/services", icon: Hospital },
      { label: "Clinic Locations", to: "/locations", icon: Building2 },
    ],
  },
];

export const flatNav = navGroups.flatMap((g) => g.items);
