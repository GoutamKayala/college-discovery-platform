import React, { useState, useEffect } from 'react';
import { api, getActiveUser, getActiveToken, clearCredentials } from './services/api';
import { College, User, SavedComparison, QueryFilters } from './types';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import FilterSidebar from './components/FilterSidebar';
import CollegeCard from './components/CollegeCard';
import ComparisonTable from './components/ComparisonTable';
import CollegeDetail from './components/CollegeDetail';
import PredictorTool from './components/PredictorTool';
import AICounselor from './components/AICounselor';
import { MapPin, Sparkles, Star, GraduationCap, GitCompare, Landmark, Bookmark, ChevronRight, HelpCircle, Loader, Info, X, Check, Search, Calendar, Landmark as Bank } from 'lucide-react';

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState('listing');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCounselorOpen, setIsCounselorOpen] = useState(false);

  // Authentication session
  const [currentUser, setCurrentUser] = useState<User | null>(getActiveUser());

  // Database lists
  const [colleges, setColleges] = useState<College[]>([]);
  const [savedColleges, setSavedColleges] = useState<College[]>(() => {
    const saved = localStorage.getItem('edupath_saved_colleges');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>(() => {
    const saved = localStorage.getItem('edupath_saved_comparisons');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareBasket, setCompareBasket] = useState<College[]>(() => {
    const saved = localStorage.getItem('edupath_compare_basket');
    return saved ? JSON.parse(saved) : [];
  });

  // Selection modal inside comparison page
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalColleges, setModalColleges] = useState<College[]>([]);
  const [modalCollegesLoading, setModalCollegesLoading] = useState(false);

  // Filtering states in search explore page
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<QueryFilters>({
    q: '',
    location: 'All',
    course: 'All',
    minFees: 0,
    maxFees: 600000,
    sortBy: 'rating',
    sortOrder: 'desc',
    collegeType: 'All',
    exam: 'All',
  });

  // UI Status controls
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [savesLoading, setSavesLoading] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  // 1. Core Lists: Derived categories lists for filtering
  const statesList = [
    "Telangana", "Andhra Pradesh", "Maharashtra", "Tamil Nadu", "Delhi", "Karnataka", "West Bengal", "Uttar Pradesh", "Assam", "Gujarat", "Rajasthan", "Punjab", "Haryana"
  ];

  const coursesList = [
    "Computer Science", "Electrical Engineering", "Mechanical", "Information Technology", "AI", "Biotechnology", "Aerospace"
  ];

  // 2. Debouncing Keyword Search Parameter Changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, q: searchTerm }));
    }, 300); // 300ms standard debouncing
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Effect: Retrieve all colleges without dashboard active filters when user requests to "Select Colleges to Add"
  useEffect(() => {
    if (isCompareModalOpen) {
      setModalCollegesLoading(true);
      api.getColleges() // Fetch unrestricted set of top colleges
        .then(data => {
          setModalColleges(data);
        })
        .catch(err => {
          console.error("Failed to load modal colleges list:", err);
        })
        .finally(() => {
          setModalCollegesLoading(false);
        });
    } else {
      setModalSearch('');
    }
  }, [isCompareModalOpen]);

  // 3. Effect: Verify current session token on load
  useEffect(() => {
    if (getActiveToken()) {
      api.verifyMe()
        .then(user => {
          setCurrentUser(user);
          loadUserData();
        })
        .catch(() => {
          clearCredentials();
          setCurrentUser(null);
        });
    }
  }, []);

  // 4. Effect: Retrieve colleges whenever filters change
  useEffect(() => {
    fetchColleges();
  }, [filters.q, filters.location, filters.course, filters.maxFees, filters.sortBy, filters.collegeType, filters.exam]);

  // 5. Effect: Dynamic updates on tab switching or auth variations
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [activeTab, currentUser]);

  async function fetchColleges() {
    setCollegesLoading(true);
    setErrorBanner('');
    try {
      const data = await api.getColleges({
        q: filters.q,
        location: filters.location,
        course: filters.course,
        maxFees: filters.maxFees,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        collegeType: filters.collegeType,
        exam: filters.exam,
      });
      setColleges(data);
    } catch (err: any) {
      setErrorBanner(err.message || 'Failed to fetch colleges.');
    } finally {
      setCollegesLoading(false);
    }
  }

  async function loadUserData() {
    if (!getActiveToken()) return;
    setSavesLoading(true);
    try {
      const [saved, comps] = await Promise.all([
        api.getSavedColleges(),
        api.getSavedComparisons()
      ]);
      setSavedColleges(saved);
      setSavedComparisons(comps);
    } catch (err: any) {
      console.error('Failed to load user statistics', err);
    } finally {
      setSavesLoading(false);
    }
  }

  // Handle college bookmark save/unsave toggling
  async function handleBookmarkToggle(collegeId: string) {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    const isCurrentlySaved = savedColleges.some(sc => sc.id === collegeId);
    let newSavedList: College[];

    try {
      if (isCurrentlySaved) {
        newSavedList = savedColleges.filter(c => c.id !== collegeId);
        setSavedColleges(newSavedList);
        // Backup save to server (might fail on Vercel, which is why we use local persistence)
        api.toggleSaveCollege(collegeId, true).catch(() => { });
      } else {
        const found = colleges.find(c => c.id === collegeId) || await api.getCollegeById(collegeId);
        if (found) {
          newSavedList = [...savedColleges, found];
          setSavedColleges(newSavedList);
        } else {
          newSavedList = savedColleges;
        }
        api.toggleSaveCollege(collegeId, false).catch(() => { });
      }

      // Persist to local storage
      localStorage.setItem('edupath_saved_colleges', JSON.stringify(newSavedList));
    } catch (err: any) {
      console.error('Error toggling college pin', err);
    }
  }

  // Handle basket additions for comparison side-by-side
  function handleCompareBasketToggle(college: College) {
    const index = compareBasket.findIndex(c => c.id === college.id);
    let newBasket: College[];

    if (index > -1) {
      newBasket = compareBasket.filter(c => c.id !== college.id);
    } else {
      if (compareBasket.length >= 3) {
        alert('You can compare a maximum of 3 colleges simultaneously.');
        return;
      }
      newBasket = [...compareBasket, college];
    }

    setCompareBasket(newBasket);
    localStorage.setItem('edupath_compare_basket', JSON.stringify(newBasket));
  }

  // Save current compare basket to cloud DB
  async function handleSaveComparison() {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    if (compareBasket.length < 2) {
      alert('Add at least 2 colleges to submit a comparison record.');
      return;
    }

    setSavingComparison(true);
    try {
      // Mocked comparison record for local persistence
      const newComp: SavedComparison = {
        id: `comp-${Date.now()}`,
        collegeIds: compareBasket.map(c => c.id),
        colleges: [...compareBasket],
        savedAt: new Date().toISOString()
      };

      const newCompList = [newComp, ...savedComparisons];
      setSavedComparisons(newCompList);
      localStorage.setItem('edupath_saved_comparisons', JSON.stringify(newCompList));

      // Backup save to server
      api.saveComparison(compareBasket.map(c => c.id)).catch(() => { });

      alert('Comparison saved successfully inside your user center!');
      loadUserData();
    } catch (err: any) {
      alert(err.message || 'Failed to preserve comparison attributes.');
    } finally {
      setSavingComparison(false);
    }
  }

  // Delete saved comparison lists
  async function handleDeleteComparison(compId: string) {
    try {
      const newCompList = savedComparisons.filter(c => c.id !== compId);
      setSavedComparisons(newCompList);
      localStorage.setItem('edupath_saved_comparisons', JSON.stringify(newCompList));

      api.deleteComparison(compId).catch(() => { });
      loadUserData();
    } catch (err: any) {
      console.error('Failed to remove saved comparison item', err);
    }
  }

  // Submit college feedback reviews
  async function handleAddReview(rating: number, comment: string) {
    if (!selectedCollegeId) return;

    // Dynamic human author tags
    const authorName = currentUser ? currentUser.name : 'Anonymous Student';

    setSubmittingReview(true);
    try {
      await api.submitReview(selectedCollegeId, authorName, rating, comment);
      // reload single college detail
      const updated = await api.getCollegeById(selectedCollegeId);
      setColleges(prev => prev.map(c => c.id === selectedCollegeId ? updated : c));
    } finally {
      setSubmittingReview(false);
    }
  }



  function handleResetFilters() {
    setSearchTerm('');
    setFilters({
      q: '',
      location: 'All',
      course: 'All',
      minFees: 0,
      maxFees: 600000,
      sortBy: 'rating',
      sortOrder: 'desc',
      collegeType: 'All',
      exam: 'All',
    });
  }

  const activeCollege = colleges.find(c => c.id === selectedCollegeId) || savedColleges.find(c => c.id === selectedCollegeId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans mb-16 md:mb-0">

      {/* Sticky Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          setSelectedCollegeId(null);
        }}
        onAuthTrigger={() => setIsAuthOpen(true)}
        onLogout={() => {
          clearCredentials();
          setCurrentUser(null);
          setSavedColleges([]);
          setSavedComparisons([]);
          setActiveTab('listing');
        }}
        saveCount={savedColleges.length}
        onCounselorTrigger={() => setIsCounselorOpen(true)}
      />

      {/* Main Framework Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Error banner notification */}
        {errorBanner && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2">
            <X className="w-5 h-5 cursor-pointer" onClick={() => setErrorBanner('')} />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Dynamic Route: Detail page has precedence */}
        {selectedCollegeId && activeCollege ? (
          <CollegeDetail
            college={activeCollege}
            onBack={() => setSelectedCollegeId(null)}
            onAddReview={handleAddReview}
            loadingReview={submittingReview}
          />
        ) : (
          <>
            {/* 1. Explore & Listing Route */}
            {activeTab === 'listing' && (
              <div className="space-y-8">

                {/* Premium Banner Hero section */}
                <div className="relative rounded-3xl overflow-hidden brand-gradient p-8 sm:p-12 text-white shadow-xl shadow-blue-900/10 mb-2">
                  <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-200 uppercase bg-white/15 backdrop-blur-md rounded-full">
                      <Sparkles className="w-3.5 h-3.5" />
                      Admission season 2026-27 is LIVE
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display leading-tight">
                      Find your perfect college, plan your career pathway
                    </h1>
                    <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-sans font-medium">
                      Navigate over 50 seeded Indian Institutes of Technology, NITs, IIITs, and premier universities using historic rank estimators and on-demand counselling.
                    </p>

                    {/* Integrated Quick-search widget */}
                    <div className="pt-2">
                      <div className="relative max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Search className="w-5 h-5" />
                        </span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search colleges, state regions, or engineering streams..."
                          className="w-full py-3.5 pl-11 pr-4 text-xs bg-white text-slate-900 rounded-2xl shadow-sm outline-hidden focus:ring-2 focus:ring-blue-500 transition-all font-sans font-medium"
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rounded-md p-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Backdrop subtle vector lines */}
                  <div className="absolute right-[-10%] bottom-[-20%] opacity-10 pointer-events-none w-[500px] h-[500px] brand-gradient blur-3xl rounded-full" />
                </div>

                {/* College directory columns */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                  {/* Left filter sidebar */}
                  <div className="lg:col-span-1 lg:sticky lg:top-20 z-10">
                    <FilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      onReset={handleResetFilters}
                      statesList={statesList}
                      coursesList={coursesList}
                    />
                  </div>

                  {/* Right search list column */}
                  <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-display uppercase">
                        Colleges Found ({colleges.length})
                      </h2>
                      <span className="text-xs text-slate-400 font-semibold font-sans tracking-tight">Updating in real-time</span>
                    </div>

                    {collegesLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="bg-white border border-slate-100 rounded-2xl h-80 p-4 space-y-4 animate-pulse subtle-shadow">
                            <div className="w-full h-36 bg-slate-100 rounded-xl" />
                            <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
                            <div className="h-3 bg-slate-50 rounded-lg w-1/2" />
                            <div className="h-10 bg-slate-50 rounded-xl" />
                          </div>
                        ))}
                      </div>
                    ) : colleges.length === 0 ? (
                      <div className="text-center py-24 px-4 bg-white border border-slate-200/90 rounded-2xl subtle-shadow">
                        <ChevronRight className="w-12 h-12 text-slate-300 mx-auto mb-4 rotate-90" />
                        <h3 className="text-lg font-bold text-slate-900 font-display">No matching colleges found</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                          None of our 51+ colleges match your search tags. Try adjusting the maximum annual tuition, state regions, or specialized streams.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="mt-6 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition-colors"
                        >
                          Reset Filters & Reload
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {colleges.map((college) => {
                          const isSaved = savedColleges.some(sc => sc.id === college.id);
                          const isComparing = compareBasket.some(cb => cb.id === college.id);
                          return (
                            <CollegeCard
                              key={college.id}
                              college={college}
                              isSaved={isSaved}
                              onSaveToggle={handleBookmarkToggle}
                              isComparing={isComparing}
                              onCompareToggle={handleCompareBasketToggle}
                              onSelect={setSelectedCollegeId}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* 2. Compare Colleges Page Route */}
            {activeTab === 'compare' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-950 font-display">Institution Comparison Engine</h2>
                  <p className="text-sm text-slate-500 mt-1 max-w-xl font-sans">
                    Contrast colleges academically, financially, and placement-wise. Select up to 3 colleges to inspect comparative metrics instantly.
                  </p>
                </div>

                <ComparisonTable
                  colleges={compareBasket}
                  onRemoveCollege={(id) => setCompareBasket(prev => prev.filter(c => c.id !== id))}
                  onSaveComparison={handleSaveComparison}
                  saving={savingComparison}
                  isLoggedIn={!!currentUser}
                  onSelectCollegeModal={() => setIsCompareModalOpen(true)}
                />
              </div>
            )}

            {/* 3. Dropdown Predictor Route */}
            {activeTab === 'predictor' && <PredictorTool />}

            {/* 4. Bookmark lists Dashboard */}
            {activeTab === 'saved' && (
              <div className="space-y-8">

                {/* Bookmarks Section */}
                <div>
                  <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-950 font-display">My Bookmarked Colleges</h2>
                      <p className="text-xs text-slate-500 font-medium">Bookmarks are synchronized to your active profile.</p>
                    </div>
                    <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-slate-700">{savedColleges.length} Saved</span>
                  </div>

                  {savedColleges.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white border border-slate-200/90 rounded-2xl subtle-shadow mt-4">
                      <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">Your bookmark lists are currently empty. Explore the college directory and bookmark your choices!</p>
                      <button
                        onClick={() => setActiveTab('listing')}
                        className="mt-4 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                      >
                        Find Colleges
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {savedColleges.map((college) => (
                        <CollegeCard
                          key={college.id}
                          college={college}
                          isSaved={true}
                          onSaveToggle={handleBookmarkToggle}
                          isComparing={compareBasket.some(cb => cb.id === college.id)}
                          onCompareToggle={handleCompareBasketToggle}
                          onSelect={setSelectedCollegeId}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved comparisons list */}
                <div>
                  <div className="pb-3 border-b border-slate-222 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-950 font-display">Saved Comparisons</h2>
                      <p className="text-xs text-slate-500 font-medium font-sans">Quick-recall comparison slots saved side-by-side.</p>
                    </div>
                    <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-slate-700">{savedComparisons.length} Saved</span>
                  </div>

                  {savedComparisons.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white border border-slate-200/90 rounded-2xl mt-4 subtle-shadow">
                      <GitCompare className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-spin-reverse" />
                      <p className="text-xs text-slate-500 font-sans">No saved comparison grids. Load some colleges inside the comparison matrix and save!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 font-sans text-sm">
                      {savedComparisons.map((comp) => (
                        <div key={comp.id} className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4 subtle-shadow relative hover:border-slate-300 transition-colors">
                          <button
                            onClick={() => handleDeleteComparison(comp.id)}
                            className="absolute p-1 top-4 right-4 text-slate-400 hover:text-red-500"
                            title="Delete Saved Comparison slot"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-blue-600 block mb-1">Grid comparison record</span>
                            <div className="flex flex-col gap-1 pr-[30px]">
                              {comp.colleges.map((col, index) => (
                                <span key={col.id} className="font-bold text-slate-800 flex items-center gap-1.5 font-display text-xs">
                                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                  <span>{col.name}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setCompareBasket(comp.colleges);
                              setActiveTab('compare');
                            }}
                            className="flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-bold w-full justify-center text-slate-700 transition-colors"
                          >
                            <span>Load Comparative Grid</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}

      </main>

      {/* Floating sliding A.I counselor drawer pane */}
      <AICounselor isOpen={isCounselorOpen} onClose={() => setIsCounselorOpen(false)} />

      {/* Standard security authenticated modal popup dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          loadUserData();
        }}
      />

      {/* College Selection Choice Modal inside comparison list builder */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100">
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 right-4 top-4"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-base font-bold font-display text-slate-900">Select Colleges to Add</h3>
              <p className="text-xs text-slate-400 mt-1">Pick a collegiate institution to append inside your active comparison matrix.</p>

              {/* Quick filter input */}
              <div className="relative mt-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Filter by name, location state, keyword..."
                  className="w-full py-2 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-sans"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
              {modalCollegesLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                  <span className="text-2xl animate-bounce">🏫</span>
                  <span className="text-xs font-medium">Loading comprehensive list...</span>
                </div>
              ) : (
                (() => {
                  const query = modalSearch.toLowerCase().trim();
                  const filtered = modalColleges.filter(col => {
                    if (!query) return true;
                    return (
                      col.name.toLowerCase().includes(query) ||
                      col.location.toLowerCase().includes(query) ||
                      col.state.toLowerCase().includes(query) ||
                      col.type.toLowerCase().includes(query) ||
                      col.courses.some(c => c.name.toLowerCase().includes(query)) ||
                      col.predictorData.some(p => p.exam.toLowerCase().includes(query))
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                        <span className="text-2xl">🔍</span>
                        <p className="text-xs font-medium mt-2 animate-pulse">No colleges match your search query.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Try entering a different keyword, state, course name, or entrance exam.</p>
                      </div>
                    );
                  }

                  return filtered.map((college) => {
                    const alreadyChosen = compareBasket.some(cb => cb.id === college.id);
                    return (
                      <div
                        key={college.id}
                        onClick={() => {
                          handleCompareBasketToggle(college);
                          setIsCompareModalOpen(false);
                        }}
                        className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/20 hover:bg-blue-50/25 rounded-xl cursor-pointer hover:border-blue-200 group transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 font-display transition-colors">
                              {college.name}
                            </h4>
                            <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-semibold uppercase tracking-wider scale-95 origin-left">
                              {college.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center mt-0.5 font-medium">
                            📍 {college.location} ({college.state})
                          </span>
                        </div>
                        <div className="shrink-0 pl-16">
                          {alreadyChosen ? (
                            <span className="text-[9px] uppercase font-bold text-blue-600 flex items-center gap-0.5">
                              <Check className="w-3.5 h-3.5" />
                              <span>Comparing</span>
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-blue-600 transition-colors">Add +</span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
