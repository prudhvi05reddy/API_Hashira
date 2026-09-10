import React from 'react';
import { Trophy, CheckCircle, Award, ArrowUpRight, Users, Sparkles, UserCheck } from 'lucide-react';
import { CandidateRank, AlignmentLevel } from '../types';

interface RankingTableProps {
  ranking: CandidateRank[];
  shortlistRecommendation: {
    recommendedCandidateNames: string[];
    explanation: string;
  };
  onSelectCandidate?: (candidateName: string) => void;
  onViewTips?: () => void;
}

export const RankingTable: React.FC<RankingTableProps> = ({
  ranking,
  shortlistRecommendation,
  onSelectCandidate,
  onViewTips,
}) => {
  const getAlignmentBadge = (alignment: AlignmentLevel) => {
    switch (alignment) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Strong':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Weak':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div id="section-final-ranking" className="space-y-6">
      {/* Shortlist Recommendation Box */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-800/60">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-indigo-300" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Official Recommendation
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <UserCheck className="h-3.5 w-3.5" />
                {shortlistRecommendation.recommendedCandidateNames.length} Shortlisted
              </span>
            </div>
            <h3 className="text-xl font-black tracking-tight">
              Shortlist Recommendation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {shortlistRecommendation.explanation}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Priority Candidates:</span>
                {shortlistRecommendation.recommendedCandidateNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    {name}
                  </span>
                ))}
              </div>

              {onViewTips && (
                <button
                  onClick={onViewTips}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Tips to Gain More ATS Score</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FINAL RANKING TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Final Candidate Ranking
            </h3>
            <p className="text-xs text-slate-500">
              Ranked objectively from strongest to weakest based on ATS Compatibility criteria
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            Total Evaluated: {ranking.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">ATS Score</th>
                <th className="py-3 px-4">Skill Match</th>
                <th className="py-3 px-4">Alignment</th>
                <th className="py-3 px-4">Key Strengths</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranking.map((row) => {
                const isShortlisted = shortlistRecommendation.recommendedCandidateNames.some(
                  (n) => n.toLowerCase().includes(row.candidateName.toLowerCase()) || row.candidateName.toLowerCase().includes(n.toLowerCase())
                );

                return (
                  <tr
                    key={row.rank}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isShortlisted ? 'bg-indigo-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            row.rank === 1
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : row.rank === 2
                              ? 'bg-slate-200 text-slate-800'
                              : row.rank === 3
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{row.rank}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{row.candidateName}</span>
                        {isShortlisted && (
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Shortlisted
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md font-bold border ${getScoreColor(
                          row.atsScore
                        )}`}
                      >
                        {row.atsScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {row.skillMatch}%
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getAlignmentBadge(
                          row.alignment
                        )}`}
                      >
                        {row.alignment}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {row.keyStrengths}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {onSelectCandidate && (
                        <button
                          onClick={() => onSelectCandidate(row.candidateName)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-900"
                        >
                          <span>Review</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
