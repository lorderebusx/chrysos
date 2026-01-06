export interface Company {
  rank: number;
  name: string;
  ticker: string;
  industry: string;
  revenue: number; // We keep this
  // profit: number; <--- DELETED
  marketCap: number;
  employees: number;
  website: string;
  change: number;
}