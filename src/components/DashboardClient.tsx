"use client";

import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Search, TrendingUp, 
  DollarSign, Users, ChevronDown, ChevronUp, ArrowUpDown 
} from 'lucide-react';
import { Company } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1,
  }).format(amount);
};
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
};
const formatChange = (num: number) => {
    const n = Number(num);
    return (n > 0 ? "+" : "") + n.toFixed(2) + "%";
};

interface DashboardProps {
  initialData: Company[];
}

export default function DashboardClient({ initialData }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof Company) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...initialData];
    if (searchTerm) {
      sortableItems = sortableItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // @ts-ignore
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        // @ts-ignore
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [initialData, searchTerm, sortConfig]);

  const getSortIcon = (key: keyof Company) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return <ArrowUpDown size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />;
  };

  return (
    <main className="max-w-400 mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Market Overview</h1>
          <p className="text-slate-400">Real-time financial analysis of the top 500 global enterprises.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search ticker, company or industry..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Market Cap" value="$42.8T" icon={<DollarSign size={20} className="text-emerald-400"/>} trend="+1.2%" isPositive={true} />
        <Card title="Avg. Employee Count" value="145K" icon={<Users size={20} className="text-blue-400"/>} trend="+0.8%" isPositive={true} />
        <Card title="Tech Sector Growth" value="+12.4%" icon={<TrendingUp size={20} className="text-purple-400"/>} trend="-0.4%" isPositive={false} />
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-8 py-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-semibold text-white text-lg">Top Performers</h3>
        </div>
        
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <table className="w-full text-left text-base text-slate-400 whitespace-nowrap">
            <thead className="bg-slate-900/50 text-xs uppercase font-medium text-slate-500">
              <tr>
                <SortHeader label="Rank" sKey="rank" handleSort={handleSort} getSortIcon={getSortIcon} />
                <SortHeader label="Company" sKey="name" handleSort={handleSort} getSortIcon={getSortIcon} />
                <SortHeader label="Industry" sKey="industry" handleSort={handleSort} getSortIcon={getSortIcon} />
                <SortHeader label="Revenue" sKey="revenue" handleSort={handleSort} getSortIcon={getSortIcon} />
                <SortHeader label="Market Cap" sKey="marketCap" handleSort={handleSort} getSortIcon={getSortIcon} />
                <SortHeader label="Employees" sKey="employees" handleSort={handleSort} getSortIcon={getSortIcon} align="right" />
                <SortHeader label="Change" sKey="change" handleSort={handleSort} getSortIcon={getSortIcon} align="right" />
                <th className="px-8 py-6 text-right">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedData.map((company) => (
                <tr key={company.ticker} className="hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <td className="px-8 py-6 font-medium text-slate-500">#{company.rank}</td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors text-lg">{company.name}</p>
                      <p className="text-sm font-mono text-slate-500">{company.ticker}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-400">{company.industry}</td>
                  <td className="px-8 py-6 text-slate-300">{formatCurrency(company.revenue)}</td>
                  <td className="px-8 py-6 font-mono text-emerald-400 text-lg">{formatCurrency(company.marketCap)}</td>
                  <td className="px-8 py-6 text-right text-slate-400">{formatNumber(company.employees)}</td>
                  
                  <td className="px-8 py-6 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        company.change > 0
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {formatChange(company.change)}
                      </span>
                  </td>
                  
                  <td className="px-8 py-6 text-right">
                      <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline text-sm" onClick={(e) => e.stopPropagation()}>{company.website}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedData.length === 0 && <div className="p-12 text-center text-slate-500">No companies found.</div>}
        </div>
      </div>
    </main>
  );
}

function SortHeader({ label, sKey, handleSort, getSortIcon, align = "left" }: any) {
  return (
    <th onClick={() => handleSort(sKey)} className={`px-8 py-6 cursor-pointer hover:text-slate-300 group select-none ${align === 'right' ? 'text-right' : ''}`}>
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>{label} {getSortIcon(sKey)}</div>
    </th>
  );
}

function Card({ title, value, icon, trend, isPositive }: any) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    </div>
  )
}