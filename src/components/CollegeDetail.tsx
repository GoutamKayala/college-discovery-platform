import React, { useState } from 'react';
import { College } from '../types';
import { Landmark, MapPin, Calendar, Star, DollarSign, Sparkles, BookOpen, UserCheck, MessageSquare, Plus, ArrowLeft, Loader, AlertCircle } from 'lucide-react';

interface CollegeDetailProps {
  college: College;
  onBack: () => void;
  onAddReview: (rating: number, comment: string) => Promise<void>;
  loadingReview: boolean;
}

export default function CollegeDetail({
  college,
  onBack,
  onAddReview,
  loadingReview,
}: CollegeDetailProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    
    if (comment.trim().length < 5) {
      setReviewError('Review comment must be at least 5 characters long.');
      return;
    }

    try {
      await onAddReview(rating, comment);
      setReviewSuccess('Your review has been published successfully.');
      setComment('');
      setRating(5);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden subtle-shadow max-w-4xl mx-auto">
      
      {/* Detail Header Cover */}
      <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-900 text-white">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grid</span>
        </button>

        {/* Head Titles */}
        <div className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold text-blue-100 uppercase bg-blue-600 rounded">
              Est. {college.establishedYear}
            </span>
            {college.type && (
              <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded border ${
                college.type === 'Government' 
                  ? 'bg-indigo-650 border-indigo-400 text-indigo-100'
                  : college.type === 'Autonomous'
                    ? 'bg-orange-700 border-orange-450 text-orange-100'
                    : 'bg-purple-650 border-purple-400 text-purple-100'
              }`}>
                {college.type}
              </span>
            )}
            <div className="flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 rounded">
              <Star className="w-3 h-3 fill-current" />
              <span>{college.rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-slate-300 font-semibold">{college.reviews.length} reviews submitted</span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-display text-white">
            {college.name}
          </h2>
          
          <p className="flex items-center gap-1 text-slate-300 text-sm mt-1">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{college.location}</span>
          </p>
        </div>
      </div>

      {/* Detail Tabs Bar */}
      <div className="flex border-b border-slate-100 p-2 overflow-x-auto gap-1 bg-slate-50/50">
        {[
          { id: 'overview', label: 'About Overview', icon: Landmark },
          { id: 'courses', label: 'Courses & Fees', icon: BookOpen },
          { id: 'placements', label: 'Placements Index', icon: UserCheck },
          { id: 'reviews', label: `Reviews (${college.reviews.length})`, icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setReviewError('');
                setReviewSuccess('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl shrink-0 transition-colors ${
                isActive
                  ? 'text-blue-600 bg-white subtle-shadow border border-slate-100'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content dynamic panel */}
      <div className="p-6">
        
        {/* SUBTAB 1: OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Institute Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                {college.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Year Founded</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5">{college.establishedYear}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide font-sans">Rating</span>
                <span className="text-sm font-bold text-amber-600 mt-0.5 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {college.rating.toFixed(1)} / 5
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Annual Cost</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 mono-font">₹{college.fees.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Placements</span>
                <span className="text-sm font-bold text-emerald-600 mt-0.5">{college.placementPercentage}% Track</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Entrance Cutoff Standard Exams</h3>
              <div className="flex flex-wrap gap-2">
                {college.predictorData.map((pd, index) => (
                  <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{pd.exam}: Rank Cutoff indices ({pd.minRank} - {pd.maxRank})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: COURSES */}
        {activeSubTab === 'courses' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Available Curriculums & Pricing</h3>
            <p className="text-xs text-slate-500 mb-4">List of formal engineering and management courses offered at {college.name}.</p>
            
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden subtitle-shadow bg-white">
              <table className="w-full text-left trade-collapse font-sans text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                    <th className="p-4 w-[60%]">Course Specialization Name</th>
                    <th className="p-4 w-[20%]">Duration</th>
                    <th className="p-4 w-[20%]">Annual Fees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {college.courses.map((crs) => (
                    <tr key={crs.id} className="hover:bg-slate-50/20 text-slate-700">
                      <td className="p-4 font-semibold text-slate-900">{crs.name}</td>
                      <td className="p-4">{crs.duration}</td>
                      <td className="p-4 font-bold text-slate-800 mono-font">₹{crs.fees.toLocaleString()}/yr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: PLACEMENTS */}
        {activeSubTab === 'placements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4.5 rounded-2xl brand-gradient text-white shadow-lg shadow-blue-900/10">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-blue-200">Annual Placement Success Rate</h4>
                <div className="text-3xl font-extrabold font-display mt-1">{college.placementPercentage}%</div>
                <p className="text-xs text-blue-100 mt-1 max-w-sm">Over 9 out of 10 students successfully recruited across premium multinational corporations during campus placement drives.</p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-blue-200">Average Starting Salary package</h4>
                <div className="text-3xl font-extrabold font-display text-amber-300 mt-1">{college.averagePackage} LPA</div>
                <p className="text-xs text-blue-100 mt-1">Lakhs Per Annum (Highly competitive inside India tier listings)</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Key Hiring Sectors & Corporates</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Graduates from {college.name} enjoy tremendous reputability across global markets and domestic start-up ecosystems. Main industrial sectors recruiting candidates include Software Development, Artificial Intelligence development, quantitative analyst circles, Core Engineering divisions, and management consultancy.
              </p>
            </div>
          </div>
        )}

        {/* SUBTAB 4: REVIEWS */}
        {activeSubTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Reviews list */}
            <div className="space-y-4 lg:col-span-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Dynamic Alumni Review Feed</h3>
              
              {college.reviews.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No student reviews published yet. Be the first to write a feedback review!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {college.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/55 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review forms */}
            <div className="lg:col-span-2">
              <div className="p-5 border border-slate-200/90 rounded-2xl subtle-shadow bg-slate-50/30">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Submit Evaluation</h4>
                
                {reviewSuccess && (
                  <div className="p-3 mb-4 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg">
                    {reviewSuccess}
                  </div>
                )}

                {reviewError && (
                  <div className="flex items-start gap-1.5 p-3 mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{reviewError}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 font-sans"
                    >
                      <option value="5">Excellent (5 Stars)</option>
                      <option value="4">Good (4 Stars)</option>
                      <option value="3">Average (3 Stars)</option>
                      <option value="2">Poor (2 Stars)</option>
                      <option value="1">Terrible (1 Star)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comment Feedback</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your academic or campus placement experience at this college..."
                      rows={4}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingReview}
                    className="flex items-center justify-center w-full py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-lg"
                  >
                    {loadingReview ? (
                      <>
                        <Loader className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Evaluation'
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
