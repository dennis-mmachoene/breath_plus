export interface AdminOverview {
  totalUsers: number;
  verifiedUsers: number;
  recentSignups: number; // last 7 days
  totalBreaths: number;
  breathsToday: number;
  activePaidSubs: number;
  mrrCents: number;
  planCounts: { planId: string; name: string; count: number }[];
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  planName: string;
  status: string;
  createdAt: string; // ISO
}
