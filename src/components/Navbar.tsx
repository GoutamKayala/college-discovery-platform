import React, { useState } from 'react';
import { User } from '../types';
import { Compass, GitCompare, Landmark, Bookmark, Sparkles, User as UserIcon, LogOut, MessageSquare, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAuthTrigger: () => void;
  onLogout: () => void;
  saveCount: number;
  onCounselorTrigger: () => void;
}

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  onAuthTrigger,
  onLogout,
  saveCount,
  onCounselorTrigger,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'listing', label: 'Explore Colleges', icon: Compass },
    { id: 'compare', label: 'College Comparison', icon: GitCompare },
    { id: 'predictor', label: 'Cutoff Predictor', icon: Landmark },
    { id: 'saved', label: 'Saved Center', icon: Bookmark, badge: saveCount },
  ];

  return (
    <header className="sticky top-0 z-45 bg-white border-b border-slate-200 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo Brand in High Density Theme */}
          <button
            onClick={() => setActiveTab('listing')}
            className="flex items-center gap-2 group outline-hidden"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-xs"></div>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight font-display">EduPath</span>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'saved' && !currentUser) {
                      onAuthTrigger();
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all relative ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 border border-blue-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white leading-none">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Utility Options */}
          <div className="flex items-center gap-3.5">
            
            {/* AI Advisor Bubble */}
            <button
              onClick={onCounselorTrigger}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all text-neutral-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200 fill-blue-200/20" />
              <span className="hidden sm:inline">Ask AI Counselor</span>
              <span className="sm:hidden">AI Chat</span>
            </button>

            {/* Profile trigger */}
            {currentUser ? (
              <div className="flex items-center gap-2 pr-1 pl-2 border-l border-slate-200">
                <div className="hidden lg:block text-right">
                  <span className="block text-[11px] font-bold text-slate-800 leading-tight">{currentUser.name}</span>
                  <span className="text-[9px] text-slate-400 font-sans tracking-tight">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold font-display text-xs">
                    {currentUser.name[0].toUpperCase()}
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1 px-1.5 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthTrigger}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Log In / Sign Up</span>
                <span className="sm:hidden">Log In</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-50 active:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors inline-flex items-center justify-center focus:outline-hidden"
              aria-label="Toggle navigation menu"
              title={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 shrink-0" />
              ) : (
                <Menu className="w-5 h-5 shrink-0" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg flex flex-col px-4 py-3 space-y-1.5 absolute left-0 right-0 top-14 z-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (tab.id === 'saved' && !currentUser) {
                    onAuthTrigger();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="uppercase tracking-wider text-[10px]">{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
