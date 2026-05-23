import React, { useState } from 'react';
import { College } from '../types';
import { Check, X, Star, Calendar, Landmark, MapPin, Sparkles, MessageSquare, Plus, GitCompare, Bookmark, Save, Loader } from 'lucide-react';

interface ComparisonTableProps {
  colleges: College[];
  onRemoveCollege: (id: string) => void;
  onSaveComparison: () => void;
  saving: boolean;
  isLoggedIn: boolean;
  onSelectCollegeModal: () => void;
}

export default function ComparisonTable({
  colleges,
  onRemoveCollege,
  onSaveComparison,
  saving,
  isLoggedIn,
  onSelectCollegeModal,
}: ComparisonTableProps) {
  
  if (colleges.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-xl">
        <GitCompare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900 font-display">No colleges added to comparison</h3>
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
          Add colleges from the Explore catalog, or pick up to 3 colleges here to compare tuition fees, departments, and placement packages.
        </p>
        <button
          onClick={onSelectCollegeModal}
          className="mt-5 flex items-center justify-center gap-1.5 px-3 py-2 mx-auto text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Select Colleges to Compare</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      
      {/* Comparison table controls bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 border-b border-slate-200">
        <div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-display uppercase tracking-wide">
            <GitCompare className="w-4 h-4 text-blue-600" />
            <span>Comparing {colleges.length} {colleges.length === 1 ? 'College' : 'Colleges'}</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Maximum of 3 colleges can be compared side-by-side.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {colleges.length < 3 && (
            <button
              onClick={onSelectCollegeModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Add College</span>
            </button>
          )}

          <button
            onClick={onSaveComparison}
            disabled={saving || colleges.length < 2}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
          >
            {saving ? (
              <Loader className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            <span>{isLoggedIn ? 'Save' : 'Log In to Save'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side grid table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
          <thead>
            <tr className="bg-slate-50/20">
              <th className="w-44 p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-r border-b border-slate-100 bg-white sticky left-0 z-10">
                Attributes
              </th>
              {colleges.map(college => (
                <th key={college.id} className="p-3 border-b border-slate-100 align-top relative">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => onRemoveCollege(college.id)}
                      className="absolute p-1 top-2 right-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove from comparison list"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="text-[9px] uppercase font-mono font-bold text-blue-500">Est. {college.establishedYear}</span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight line-clamp-1 max-w-[80%] font-display">
                      {college.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span className="truncate">{college.location}</span>
                    </p>
                  </div>
                </th>
              ))}
              {/* Fill remaining slots if user is only comparing 1 or 2 colleges */}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <th key={`empty-header-${i}`} className="p-3 border-b border-slate-101 bg-slate-50/20 text-center align-middle">
                  <button
                    onClick={onSelectCollegeModal}
                    className="inline-flex flex-col items-center justify-center gap-1 p-3 w-full h-full border border-dashed border-slate-200 hover:border-blue-400 rounded-lg hover:bg-blue-50/20 group transition-all"
                  >
                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">Choose College</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* 1. Performance rating */}
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-3 font-bold text-[10px] text-slate-600 border-r border-slate-100 bg-white sticky left-0 z-10 uppercase tracking-wide">
                Rating
              </td>
              {colleges.map(college => (
                <td key={college.id} className="p-3 text-xs text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{college.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">({college.reviews.length} reviews)</span>
                  </div>
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-rating-${i}`} className="p-3 bg-slate-50/10" />
              ))}
            </tr>

            {/* 2. Fees comparison */}
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-3 font-bold text-[10px] text-slate-600 border-r border-slate-100 bg-white sticky left-0 z-10 uppercase tracking-wide">
                Annual Fees
              </td>
              {colleges.map(college => (
                <td key={college.id} className="p-3">
                  <span className="text-xs font-bold text-slate-900 mono-font">
                    ₹{college.fees.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Approx. tuition costs</span>
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-fees-${i}`} className="p-3 bg-slate-50/10" />
              ))}
            </tr>

            {/* 3. Placement percentage */}
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-3 font-bold text-[10px] text-slate-600 border-r border-slate-100 bg-white sticky left-0 z-10 uppercase tracking-wide">
                Placement Success
              </td>
              {colleges.map(college => (
                <td key={college.id} className="p-3 text-xs text-slate-800">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-[120px] mb-1">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${college.placementPercentage}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-none">{college.placementPercentage}% Placement</span>
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-place-${i}`} className="p-3 bg-slate-50/10" />
              ))}
            </tr>

            {/* 4. Average Package */}
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-3 font-bold text-[10px] text-slate-600 border-r border-slate-100 bg-white sticky left-0 z-10 uppercase tracking-wide">
                Avg Package
              </td>
              {colleges.map(college => (
                <td key={college.id} className="p-3 text-xs text-slate-800">
                  <div className="text-xs font-bold text-emerald-600 mono-font">
                    {college.averagePackage} LPA
                  </div>
                  <span className="text-[9px] text-slate-400 block">Lakhs Per Annum</span>
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-sal-${i}`} className="p-3 bg-slate-50/10" />
              ))}
            </tr>

            {/* 5. Key courses offered */}
            <tr className="hover:bg-slate-50/30 transition-colors">
              <td className="p-3 font-bold text-[10px] text-slate-600 border-r border-slate-100 bg-white sticky left-0 z-10 uppercase tracking-wide">
                Curriculums
              </td>
              {colleges.map(college => (
                <td key={college.id} className="p-3 text-xs text-slate-800 align-top">
                  <div className="flex flex-wrap gap-1">
                    {college.courses.map((crs) => (
                      <span
                        key={crs.id}
                        className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                      >
                        {crs.name.replace('B.Tech ', '')}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
              {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-crs-${i}`} className="p-3 bg-slate-50/10" />
              ))}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
}
