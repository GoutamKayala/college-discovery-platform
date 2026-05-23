import React, { useState } from 'react';
import { api } from '../services/api';
import { PredictionResult } from '../types';
import { Landmark, Search, HelpCircle, ArrowRight, ShieldCheck, Star, Sparkles, Loader, AlertCircle } from 'lucide-react';

export default function PredictorTool() {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [error, setError] = useState('');
  const [performed, setPerformed] = useState(false);

  const examOptions = [
    { value: 'JEE Main', desc: 'Predict NITs, IIITs & prestigious state colleges cutoff ranks (Regular)' },
    { value: 'JEE Advanced', desc: 'Find matching IITs and department opening-closing tags' },
    { value: 'EMCET', desc: 'AP & Telangana EMCET cutoff rank predictions (Regular B.Tech)' },
    { value: 'ECET', desc: 'AP & Telangana Lateral Entry for Diploma holders (B.Tech 2nd Year)' },
    { value: 'MHT-CET', desc: 'Maharashtra Common Entrance Test placement cutoffs' },
    { value: 'WBJEE', desc: 'West Bengal Joint Entrance Cutoffs (Regular entry)' },
    { value: 'JELET', desc: 'West Bengal Lateral Entry cutoff rank predictions for Diploma/B.Sc' },
    { value: 'KCET', desc: 'Karnataka Common Entrance Test engineering cutoffs' },
    { value: 'BITSAT', desc: 'Predict B.E branches inside BITS Pilani campuses' },
    { value: 'GATE', desc: 'Predict M.Tech tracks inside premier colleges' },
  ];

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setResults([]);
    setPerformed(false);

    const rankNum = Number(rank);
    if (!rank || isNaN(rankNum) || rankNum <= 0) {
      setError('Please provide a valid active positive rank placement.');
      return;
    }

    setLoading(true);
    try {
      const resp = await api.predictColleges(exam, rankNum);
      // Sort results by probability (High -> Medium -> Low)
      const order = { 'High': 3, 'Medium': 2, 'Low': 1 };
      resp.sort((a, b) => order[b.probability] - order[a.probability]);
      setResults(resp);
      setPerformed(true);
    } catch (err: any) {
      setError(err.message || 'Cutoff Predictor calculation failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Platform Hero Info */}
      <div className="text-center bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 mx-auto mb-2.5">
          <Landmark className="w-5 h-5 animate-bounce" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">A.I Admission Predictor Engine</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Unlock standard cutoff predictions modeled against real historical opening & closing ranks for IITs, NITs, and premier private universities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Entrance fields */}
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider pl-0.5">Configuration</h3>

            {error && (
              <div className="flex items-start gap-1.5 p-2 text-[10px] text-red-650 bg-red-50 border border-red-100 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePredict} className="space-y-3.5">
              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">Select Examination</label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
                >
                  {examOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.value}</option>
                  ))}
                </select>
                <span className="text-[9px] text-slate-400 font-bold block mt-1 leading-tight pl-0.5">
                  {examOptions.find(o => o.value === exam)?.desc}
                </span>
              </div>

              <div>
                <label className="block mb-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">Your Entrance Rank</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="e.g. 500, 1500, 4200"
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-205 rounded-lg shadow-xs transition-colors"
              >
                {loading ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Chances Evaluation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Predict Matching Colleges
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Prediction Results column */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-xs h-full min-h-[300px]">
              <Loader className="w-6 h-6 text-blue-600 animate-spin mb-2" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Crunching historic databases...</p>
            </div>
          ) : performed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-0.5">
                <h3 className="text-[11px] font-bold text-slate-950 uppercase tracking-wider">
                  Matched Listings ({results.length})
                </h3>
                <span className="text-[10px] font-medium text-slate-400">Match for '{exam}' rank {Number(rank).toLocaleString()}</span>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-10 px-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 font-display">No matching cutoff scores found criteria</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                    Try targeting a larger numeric cutoff threshold rank or change examinations to locate potential colleges.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {results.map(({ college, cutoffMin, cutoffMax, probability }) => {
                    const probabilityColors = {
                      High: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      Medium: 'bg-amber-50 text-amber-700 border-amber-200',
                      Low: 'bg-sky-50 text-sky-700 border-sky-200'
                    };

                    return (
                      <div key={college.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors shadow-xs">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display">
                            {college.name}
                          </h4>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span>{college.location}</span>
                            <span className="text-slate-200">•</span>
                            <span className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3 h-3 fill-current mr-0.5" />
                              {college.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500 block font-semibold font-mono">
                            Historic Cutoffs: [{cutoffMin.toLocaleString()} - {cutoffMax.toLocaleString()}] closing bounds
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-0.5 text-[9px] font-black rounded-md border uppercase tracking-wider ${probabilityColors[probability]}`}>
                            {probability} Match
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl h-full shadow-xs text-center min-h-[300px]">
              <Landmark className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Admissions Probability</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                Provide your examination parameters and rank score position to estimate prospective educational admissions chances.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
