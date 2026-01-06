import React from 'react';
import { TrendingUp } from 'lucide-react';
import DashboardClient from '../components/DashboardClient';
import { Company } from '../types';
import { FORTUNE_100_SEED } from '../data/fortune100';
import yahooFinance from 'yahoo-finance2'; 

async function getFinancialData(): Promise<Company[]> {
  const tickers = FORTUNE_100_SEED.map(c => c.ticker!);
  
  try {
    // @ts-ignore
    const yf = new yahooFinance();
    const results = await yf.quote(tickers);

    // Merge Live Data with Seed (including Revenue)
    const cleanData: Company[] = FORTUNE_100_SEED.map((seed, i) => {
      const live = results.find((r: any) => r.symbol === seed.ticker);
      const marketCap = live?.marketCap || 0;
      const change = live?.regularMarketChangePercent || 0;

      return {
        rank: i + 1, // Keeps original Fortune Rank
        name: seed.name!, 
        ticker: seed.ticker!,
        industry: seed.industry!, 
        revenue: seed.revenue || 0, // Reads from fortune100.ts
        marketCap: marketCap,
        employees: seed.employees!, 
        website: seed.website!,
        change: change,
      };
    });

    return cleanData;

  } catch (error) {
    console.error("❌ Yahoo Finance Error:", error);
    // Fallback
    return FORTUNE_100_SEED.map((seed, i) => ({
      rank: i + 1,
      name: seed.name!,
      ticker: seed.ticker!,
      industry: seed.industry!,
      revenue: seed.revenue || 0,
      marketCap: 0,
      employees: seed.employees!,
      website: seed.website!,
      change: 0,
    }));
  }
}

export default async function Page() {
  const data = await getFinancialData();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-400 mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Chrysos</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors">Documentation</button>
             <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
          </div>
        </div>
      </nav>

      <DashboardClient initialData={data} />
    </div>
  );
}