import React from 'react';
import { QueryFilters } from '../types';
import { Search, MapPin, GraduationCap, DollarSign, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  filters: QueryFilters;
  setFilters: (filters: QueryFilters | ((prev: QueryFilters) => QueryFilters)) => void;
  onReset: () => void;
  statesList: string[];
  coursesList: string[];
}

export default function FilterSidebar({
  filters,
  setFilters,
  onReset,
  statesList,
  coursesList,
}: FilterSidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
      
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider truncate">Filters & Controls</h2>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors"
            title="Reset all search parameters"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Collapsible container for filters on mobile */}
      <div className={`${isExpanded ? 'block animate-fade-in' : 'hidden lg:block'} space-y-4`}>

      {/* 1. Keyword search */}
      <div>
        <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">Search Keyword</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={filters.q}
            onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
            placeholder="Search name, course, state..."
            className="w-full py-1.5 pl-8 pr-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
          />
        </div>
      </div>

      {/* 1.5. Entrance Examination Filter */}
      <div>
        <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">Entrance Examination</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none font-medium">
            🚩
          </span>
          <select
            value={filters.exam || 'All'}
            onChange={(e) => setFilters(prev => ({ ...prev, exam: e.target.value }))}
            className="w-full py-1.5 pl-8 pr-8 text-xs bg-slate-55 border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans appearance-none"
          >
            <option value="All">All Exams (JEE & State tests)</option>
            <option value="JEE Main">JEE Main (NITs, IIITs)</option>
            <option value="JEE Advanced">JEE Advanced (IITs)</option>
            <option value="EMCET">EMCET (AP & TS Regular)</option>
            <option value="ECET">ECET (AP & TS Lateral)</option>
            <option value="MHT-CET">MHT-CET (Maharashtra)</option>
            <option value="WBJEE">WBJEE (West Bengal Regular)</option>
            <option value="JELET">JELET (West Bengal Lateral)</option>
            <option value="KCET">KCET (Karnataka)</option>
            <option value="BITSAT">BITSAT (BITS Campuses)</option>
            <option value="GATE">GATE (M.Tech Programs)</option>
          </select>
        </div>
      </div>

      {/* 2. States Locations */}
      <div>
        <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">State / Region</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none">
            <MapPin className="w-3.5 h-3.5" />
          </span>
          <select
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full py-1.5 pl-8 pr-8 text-xs bg-slate-55 border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans appearance-none"
          >
            <option value="All">All States (India)</option>
            {statesList.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Specialized Course Selection */}
      <div>
        <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">Specialization</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none">
            <GraduationCap className="w-3.5 h-3.5" />
          </span>
          <select
            value={filters.course}
            onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
            className="w-full py-1.5 pl-8 pr-8 text-xs bg-slate-55 border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans appearance-none"
          >
            <option value="All">All Departments</option>
            {coursesList.map(cr => (
              <option key={cr} value={cr}>{cr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3.5. College Type Filter */}
      <div>
        <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">Institution Type</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 pointer-events-none">
            <GraduationCap className="w-3.5 h-3.5 rotate-180" />
          </span>
          <select
            value={filters.collegeType || 'All'}
            onChange={(e) => setFilters(prev => ({ ...prev, collegeType: e.target.value }))}
            className="w-full py-1.5 pl-8 pr-8 text-xs bg-slate-55 border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans appearance-none"
          >
            <option value="All">All Types (Govt / Pvt / Auto)</option>
            <option value="Government">Government / State Funded</option>
            <option value="Private">Private / Elite Universities</option>
            <option value="Autonomous">Autonomous Colleges</option>
          </select>
        </div>
      </div>

      {/* 4. Annually Tuition range slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Max Fees / Year</label>
          <span className="text-xs font-bold text-blue-600 font-mono">
            {filters.maxFees >= 600000 ? 'No Limit' : `₹${filters.maxFees.toLocaleString()}`}
          </span>
        </div>
        <div className="relative pt-1">
          <input
            type="range"
            min="1000"
            max="600000"
            step="10000"
            value={filters.maxFees}
            onChange={(e) => setFilters(prev => ({ ...prev, maxFees: Number(e.target.value) }))}
            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-semibold font-mono mt-1">
            <span>₹1K</span>
            <span>₹3L</span>
            <span>₹6L+</span>
          </div>
        </div>
      </div>

      {/* 5. Target sorting */}
      <div>
        <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">Sort Columns</label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setFilters(prev => ({ ...prev, sortBy: 'rating', sortOrder: 'desc' }))}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
              filters.sortBy === 'rating'
                ? 'text-blue-600 bg-blue-50 border-blue-200'
                : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Top Rating
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, sortBy: 'fees', sortOrder: 'asc' }))}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
              filters.sortBy === 'fees'
                ? 'text-blue-600 bg-blue-50 border-blue-200'
                : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Lowest Fees
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, sortBy: 'placements', sortOrder: 'desc' }))}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
              filters.sortBy === 'placements'
                ? 'text-blue-600 bg-blue-50 border-blue-200'
                : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Placements %
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, sortBy: 'established', sortOrder: 'asc' }))}
            className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border text-center transition-all ${
              filters.sortBy === 'established'
                ? 'text-blue-600 bg-blue-50 border-blue-200'
                : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            Age (Oldest)
          </button>
        </div>
      </div>

      {/* End of collapsible wrapper */}
      </div>

    </div>
  );
}
