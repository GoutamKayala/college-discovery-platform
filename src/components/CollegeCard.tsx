import React from 'react';
import { College } from '../types';
import { Star, MapPin, Landmark, Calendar, Trash2, Bookmark, GitCompare, ArrowRight, ShieldCheck } from 'lucide-react';

interface CollegeCardProps {
  key?: any;
  college: College;
  isSaved: boolean;
  onSaveToggle: (id: string) => void;
  isComparing: boolean;
  onCompareToggle: (college: College) => void;
  onSelect: (id: string) => void;
  showRemove?: boolean;
  onRemove?: () => void;
}

export default function CollegeCard({
  college,
  isSaved,
  onSaveToggle,
  isComparing,
  onCompareToggle,
  onSelect,
  showRemove = false,
  onRemove,
}: CollegeCardProps) {
  return (
    <div className="group relative flex flex-col bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all duration-200">
      
      {/* Horizontal Top row (avatar / title / rating) */}
      <div className="flex gap-4 items-start">
        {/* Thumb logo / image */}
        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-150 relative">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=150";
            }}
          />
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onSelect(college.id)}
              className="font-bold text-slate-900 leading-tight text-sm tracking-tight hover:text-blue-600 cursor-pointer line-clamp-2 transition-colors"
            >
              {college.name}
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0 flex items-center gap-0.5">
              <span>{college.rating.toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600 inline pb-0.5" />
            </span>
          </div>
          
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{college.location}</span>
            <span>•</span>
            <span className="shrink-0">Est. {college.establishedYear}</span>
          </p>
        </div>
      </div>

      {/* Description text snippet */}
      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-2.5 mb-2.5">
        {college.description}
      </p>

      {/* Tightly aligned comparative and performance metrics */}
      <div className="grid grid-cols-2 gap-2 p-2 mb-3 rounded-lg bg-slate-50 border border-slate-100">
        <div className="bg-white p-1.5 rounded-md border border-slate-100/60 flex flex-col justify-between">
          <p className="text-[9px] uppercase text-slate-400 font-bold tracking-tight">Average Fees</p>
          <p className="text-xs font-bold text-slate-700 tracking-tighter">₹{college.fees.toLocaleString()} / Year</p>
        </div>
        <div className="bg-white p-1.5 rounded-md border border-slate-100/60 flex flex-col justify-between">
          <p className="text-[9px] uppercase text-slate-400 font-bold tracking-tight">Avg Placements</p>
          <p className="text-xs font-bold text-slate-700 tracking-tighter">{college.averagePackage} LPA ({college.placementPercentage}%)</p>
        </div>
      </div>

      {/* Bottom Border and compact actions row */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50/70 rounded-md border border-blue-100 animate-pulse-subtle">
            <ShieldCheck className="w-2.5 h-2.5" />
            Approved
          </span>
          {college.type && (
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-md border ${
              college.type === 'Government'
                ? 'text-indigo-600 bg-indigo-50 border-indigo-150'
                : college.type === 'Autonomous'
                  ? 'text-orange-700 bg-orange-50 border-orange-150'
                  : 'text-purple-600 bg-purple-50 border-purple-150'
            }`}>
              <Landmark className="w-2.5 h-2.5" />
              {college.type}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {showRemove ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) onRemove();
              }}
              className="flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-100 rounded-md transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          ) : (
            <>
              {/* Compare Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompareToggle(college);
                }}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md border transition-all ${
                  isComparing
                    ? 'text-blue-600 bg-blue-100/80 border-blue-400 font-bold'
                    : 'text-slate-600 bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title={isComparing ? "Remove comparison" : "Compare"}
              >
                <span>{isComparing ? 'Compared' : 'Compare'}</span>
              </button>

              {/* Bookmark save toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveToggle(college.id);
                }}
                className={`p-1.5 rounded-md border transition-colors ${
                  isSaved
                    ? 'text-amber-500 bg-amber-50 border-amber-200 hover:bg-amber-100'
                    : 'text-slate-400 bg-white border-slate-200 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title={isSaved ? "Saved" : "Save"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {/* Access detail view */}
              <button
                onClick={() => onSelect(college.id)}
                className="px-3 py-1.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
              >
                <span>Select</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
